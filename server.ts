import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

let appDir = process.cwd();
try {
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    const filename = fileURLToPath(import.meta.url);
    appDir = path.dirname(filename);
  }
} catch {
  // Fallback to process.cwd() in CommonJS bundle
}

const app = express();
const PORT = 3000;

// CORS & Preflight handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store for OTPs (with timestamp and attempts)
interface StoredOtp {
  code: string;
  name?: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

const otpStore = new Map<string, StoredOtp>();

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brevoConfigured: Boolean(process.env.BREVO_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Check Brevo status
app.get('/api/auth/brevo-status', (req: Request, res: Response) => {
  res.json({
    configured: Boolean(process.env.BREVO_API_KEY),
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'contact@gopalbags.com'
  });
});

// Send Verification Email via Brevo (brevo.com)
app.post(['/api/auth/send-verification-email', '/api/auth/send-verification-email/'], async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate a secure 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(normalizedEmail, {
      code,
      name: name || 'Valued Customer',
      createdAt: now,
      expiresAt,
      attempts: 0,
      verified: false
    });

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'auth@gopalbag.com';
    const recipientName = name ? name.trim() : 'Valued Customer';

    console.log(`[Auth] Dispatching verification OTP for ${normalizedEmail} using sender ${senderEmail}`);

    // If Brevo API Key is present, send actual transactional email via Brevo API
    if (brevoApiKey && brevoApiKey.trim() !== '' && !brevoApiKey.startsWith('MY_')) {
      try {
        const brevoPayload = {
          sender: {
            name: 'Gopal Bags',
            email: senderEmail
          },
          to: [
            {
              email: normalizedEmail,
              name: recipientName
            }
          ],
          subject: `${code} is your Gopal Bags Verification Code`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; color: #18181b; margin: 0; padding: 24px; }
                  .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #fef08a; padding: 36px; box-shadow: 0 4px 20px rgba(245, 158, 11, 0.08); }
                  .header { text-align: center; border-bottom: 2px solid #fef9c3; padding-bottom: 20px; margin-bottom: 24px; }
                  .logo { font-size: 26px; font-weight: 900; color: #18181b; letter-spacing: -0.5px; }
                  .logo span { color: #d97706; }
                  .title { font-size: 20px; font-weight: 800; color: #18181b; margin: 0 0 12px; }
                  .desc { font-size: 14px; color: #52525b; line-height: 1.6; margin: 0 0 24px; }
                  .otp-box { background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
                  .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #18181b; font-family: monospace; }
                  .otp-note { font-size: 12px; color: #b45309; margin-top: 8px; font-weight: 600; }
                  .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #f4f4f5; font-size: 11px; color: #a1a1aa; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">GOPAL <span>BAGS</span></div>
                    <div style="font-size: 11px; color: #71717a; margin-top: 4px; font-weight: 600;">HANDCRAFTED LUXURY & SIGNATURE COLLECTIONS</div>
                  </div>
                  <h2 class="title">Verify Your Email Address</h2>
                  <p class="desc">Hello ${recipientName}, thank you for registering with Gopal Bags. Please use the one-time verification code below to verify your email and complete your account setup.</p>
                  <div class="otp-box">
                    <div class="otp-code">${code}</div>
                    <div class="otp-note">Valid for 10 minutes • Do not share this code with anyone</div>
                  </div>
                  <p class="desc" style="font-size: 12px; color: #71717a;">If you did not request this verification code, please ignore this email or reach out to our customer care.</p>
                  <div class="footer">
                    © ${new Date().getFullYear()} Gopal Bags. Premium Handbags, Bridal Clutches & Accessories.<br/>
                    All rights reserved.
                  </div>
                </div>
              </body>
            </html>
          `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify(brevoPayload)
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          console.log(`[Brevo API] Email sent to ${normalizedEmail}, messageId:`, (data as any)?.messageId);
          return res.json({
            success: true,
            message: `Verification code sent to ${normalizedEmail}. Please check your email inbox (and spam/promotions folder).`,
            isLiveBrevo: true
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error('[Brevo API Error]', errData);
          return res.status(500).json({
            success: false,
            message: `Brevo email sending failed: ${(errData as any)?.message || 'Unable to deliver message'}.`
          });
        }
      } catch (brevoErr: any) {
        console.error('[Brevo Error]', brevoErr);
        return res.status(500).json({
          success: false,
          message: `Brevo connection error: ${brevoErr.message || 'Please try again later'}.`
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'BREVO_API_KEY is missing. Please configure your Brevo API key in the environment.'
      });
    }
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate verification code. Please try again.'
    });
  }
});

// Verify OTP
app.post(['/api/auth/verify-otp', '/api/auth/verify-otp/'], (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'No active verification code found for this email. Please request a new code.'
      });
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    // Check attempts
    if (stored.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new verification code.'
      });
    }

    // Validate code
    if (stored.code !== otp.trim()) {
      stored.attempts += 1;
      return res.status(400).json({
        success: false,
        message: `Incorrect verification code. ${5 - stored.attempts} attempts remaining.`
      });
    }

    // Mark verified
    stored.verified = true;
    return res.json({
      success: true,
      verified: true,
      message: 'Email verified successfully!'
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during verification.'
    });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gopal Bags server running on port ${PORT}`);
  });
}

startServer();
