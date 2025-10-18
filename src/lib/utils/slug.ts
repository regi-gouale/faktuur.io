/**
 * Génère un slug à partir d'une chaîne de caractères
 * @param text - Le texte à transformer en slug
 * @returns Le slug généré (lowercase, sans accents, tirets pour espaces)
 */
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Remplace les caractères accentués
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Remplace les espaces et caractères spéciaux par des tirets
      .replace(/[^a-z0-9]+/g, "-")
      // Supprime les tirets multiples
      .replace(/-+/g, "-")
      // Supprime les tirets au début et à la fin
      .replace(/^-|-$/g, "")
  );
}
