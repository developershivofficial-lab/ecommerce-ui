/**
 * Helper to generate and parse product URL slugs
 * Supports /product-{slug} structure as requested by user
 */

export function slugifyProduct(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductUrl(product: { name: string; id?: string }): string {
  const slug = slugifyProduct(product.name);
  return `/product/${slug}`;
}

export function matchProductBySlugOrId<T extends { id: string; name: string }>(
  products: T[],
  identifier: string | undefined
): T | undefined {
  if (!identifier) return undefined;

  // Clean identifier if starts with product-
  const clean = identifier.startsWith('product-') ? identifier.slice(8) : identifier;

  // First direct ID match
  const byId = products.find((p) => p.id === identifier || p.id === clean);
  if (byId) return byId;

  // Next match by slugified name
  const bySlug = products.find((p) => {
    const slug = slugifyProduct(p.name);
    return slug === clean || slug === identifier;
  });
  if (bySlug) return bySlug;

  // Fuzzy partial match if spaces replaced by hyphens
  const byNormalized = products.find(
    (p) =>
      p.name.toLowerCase().replace(/\s+/g, '-') === clean.toLowerCase() ||
      clean.toLowerCase().includes(p.name.toLowerCase().slice(0, 10))
  );

  return byNormalized;
}
