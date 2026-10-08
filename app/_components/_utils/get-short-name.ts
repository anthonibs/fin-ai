const PREPOSITIONS = new Set(["de", "da", "do", "das", "dos", "e"]);

export function getShortName(fullName: string | null | undefined): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  const validNames: string[] = [];

  for (const part of parts) {
    if (validNames.length === 0) {
      validNames.push(part);
    } else {
      if (!PREPOSITIONS.has(part.toLowerCase())) {
        validNames.push(part);
        break;
      }
    }
  }

  return validNames.join(" ");
}
