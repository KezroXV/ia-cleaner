/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import formidable from "formidable";
import { NextRequest } from "next/server";

// Import dynamique de Sharp pour éviter les problèmes de compilation
let sharp: any;
try {
  sharp = require("sharp");
} catch (error) {
  console.warn("⚠️ Sharp non disponible, utilisation d'une alternative");
  sharp = null;
}

const MAX_FILE_SIZE =
  parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024;

/**
 * Parse le FormData d'une requête Next.js
 */
export async function parseFormData(request: NextRequest): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  try {
    // Convertir NextRequest en Node Request
    const formData = await request.formData();

    // Utiliser Record pour créer des types mutables compatibles avec formidable
    const fields: Record<string, string[]> = {};
    const files: Record<string, formidable.File[]> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Convertir File en Buffer
        const buffer = await value.arrayBuffer();
        const tempFile = {
          filepath: "",
          originalFilename: value.name,
          mimetype: value.type,
          size: value.size,
          buffer: Buffer.from(buffer),
        };
        files[key] = [tempFile as any];
      } else {
        fields[key] = [value];
      }
    }

    // Convertir en types formidable pour le retour (compatible avec le type)
    const resultFields: formidable.Fields = fields as formidable.Fields;
    const resultFiles: formidable.Files = files as formidable.Files;
    return { fields: resultFields, files: resultFiles };
  } catch (error) {
    console.error("❌ Erreur parsing FormData:", error);
    throw new Error("Échec du parsing du formulaire");
  }
}

/**
 * Valide et optimise une image
 */
export async function processImage(fileBuffer: Buffer): Promise<Buffer> {
  try {
    // Validation de la taille
    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new Error(
        `Image trop volumineuse (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`
      );
    }

    // Si Sharp n'est pas disponible, retourner le buffer tel quel
    if (!sharp) {
      console.warn("⚠️ Sharp non disponible, utilisation du buffer original");
      return fileBuffer;
    }

    // Optimisation avec Sharp
    const processedBuffer = await sharp(fileBuffer)
      .rotate() // Auto-rotation basée sur EXIF
      .resize(2048, 2048, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log("✅ Image traitée:", {
      original: fileBuffer.length,
      processed: processedBuffer.length,
    });

    return processedBuffer;
  } catch (error: any) {
    console.error("❌ Erreur traitement image:", error);
    // Si Sharp échoue, retourner le buffer original
    if (error.message?.includes("sharp") || error.code === "MODULE_NOT_FOUND") {
      console.warn("⚠️ Sharp non disponible, utilisation du buffer original");
      return fileBuffer;
    }
    throw new Error(
      `Échec du traitement de l'image: ${error.message || error}`
    );
  }
}

/**
 * Valide le type MIME
 */
export function validateImageType(mimeType: string): boolean {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return allowedTypes.includes(mimeType.toLowerCase());
}
