// Normalizare text pentru Aitimp.ro

// Prima litera mare, restul mici (Sentence case)
export function sentenceCase(str: string): string {
  if (!str) return str;
  const s = str.trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// Fiecare cuvant cu prima litera mare (Title Case) - pt nume
export function titleCase(str: string): string {
  if (!str) return str;
  return str.trim().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Email intotdeauna lowercase
export function normalizeEmail(str: string): string {
  return str.trim().toLowerCase();
}

// Auto-detect tip si normalizeaza
export function autoFormat(value: string, type: "name" | "service" | "description" | "email" | "plain" = "plain"): string {
  if (!value) return value;
  switch (type) {
    case "name": return titleCase(value);
    case "service": return sentenceCase(value);
    case "description": return value.charAt(0).toUpperCase() + value.slice(1);
    case "email": return normalizeEmail(value);
    default: return sentenceCase(value);
  }
}

// Normalizeaza query de cautare
export function normalizeQuery(q: string): string {
  if (!q) return q;
  return q.trim().charAt(0).toUpperCase() + q.trim().slice(1).toLowerCase();
}