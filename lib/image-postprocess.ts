/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Post-traitement pour supprimer les petites taches blanches / poussières (miettes)
 * que l'IA peut laisser sur les surfaces sombres (tapis, moquette, sièges).
 *
 * Utilise un filtre médian (Sharp) : remplace chaque pixel par la médiane de son
 * voisinage, ce qui élimine les points isolés clairs sur fond sombre.
 */

let sharp: any;
try {
  sharp = require("sharp");
} catch {
  sharp = null;
}

/** Taille du filtre médian (3 = 3x3, léger ; 5 = plus agressif) */
const MEDIAN_SIZE = 3;

/**
 * Supprime les petites taches blanches / particules sur l'image générée.
 * À appeler après la génération IA pour les intérieurs voiture.
 *
 * @param imageBuffer - Buffer de l'image (JPEG/PNG)
 * @returns Nouveau buffer avec filtre médian appliqué (réduit miettes/specks)
 */
export async function removeLightSpecks(imageBuffer: Buffer): Promise<Buffer> {
  if (!sharp) {
    console.warn(
      "⚠️ Sharp non disponible, image retournée sans post-traitement",
    );
    return imageBuffer;
  }

  try {
    const out = await sharp(imageBuffer)
      .median(MEDIAN_SIZE)
      .jpeg({ quality: 92 })
      .toBuffer();

    console.log(
      "✅ Post-traitement anti-miettes appliqué (filtre médian",
      MEDIAN_SIZE,
      "x",
      MEDIAN_SIZE,
      ")",
    );
    return out;
  } catch (error) {
    console.warn(
      "⚠️ Échec post-traitement anti-miettes:",
      (error as Error).message,
    );
    return imageBuffer;
  }
}
