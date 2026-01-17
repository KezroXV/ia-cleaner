import { v2 as cloudinary } from "cloudinary";
import type { CloudinaryUploadResult } from "@/types";

// Configuration lazy - validation au moment de l'utilisation
function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Configuration Cloudinary manquante. Vérifiez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local"
    );
  }

  // Validation du format du cloud_name (ne doit pas contenir d'espaces, caractères spéciaux)
  if (cloudName.includes(" ") || cloudName.length < 3) {
    throw new Error(
      `Cloudinary cloud_name invalide: "${cloudName}". Le cloud_name doit être un identifiant valide (ex: "dxyz1234", "my-cloud-name")`
    );
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  };
}

// Configuration initiale (sera réinitialisée si nécessaire)
let isConfigured = false;

function ensureCloudinaryConfigured() {
  if (!isConfigured) {
    const config = getCloudinaryConfig();
    cloudinary.config(config);
    isConfigured = true;
  }
}

/**
 * Upload une image (Buffer) vers Cloudinary
 */
export async function uploadToCloudinary(
  imageBuffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: any[];
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    // Vérifier et configurer Cloudinary
    ensureCloudinaryConfigured();
    
    console.log("☁️ Upload vers Cloudinary...");

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "clear-ai",
          public_id: options.publicId,
          resource_type: "image",
          format: "jpg",
          quality: "auto:good",
          fetch_format: "auto",
          transformation: options.transformation || [
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("❌ Erreur upload Cloudinary:", error);
            reject(error);
          } else if (result) {
            console.log("✅ Upload réussi:", result.secure_url);
            resolve(result as CloudinaryUploadResult);
          } else {
            reject(new Error("Aucun résultat de l'upload"));
          }
        }
      );

      uploadStream.end(imageBuffer);
    });
  } catch (error) {
    console.error("❌ Erreur Cloudinary:", error);
    throw new Error(`Échec de l'upload: ${error}`);
  }
}

/**
 * Génère une URL Cloudinary optimisée pour l'affichage
 * Utilise la résolution réelle de l'image si width est fourni, sinon retourne l'URL originale
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    quality?: "auto" | "auto:good" | "auto:best" | number;
    format?: "auto" | "webp" | "avif" | "jpg";
  } = {}
): string {
  if (!originalUrl || !originalUrl.includes("res.cloudinary.com")) {
    return originalUrl;
  }

  const {
    width,
    quality = "auto:best",
    format = "auto",
  } = options;

  // Si l'URL contient déjà des transformations, on les préserve et on ajoute les nôtres
  if (originalUrl.includes("/image/upload/")) {
    const parts = originalUrl.split("/image/upload/");
    if (parts.length === 2) {
      const [base, rest] = parts;
      
      // Construire les transformations
      const transformations: string[] = [];
      
      // Ajouter la largeur seulement si elle est spécifiée (résolution réelle)
      if (width !== undefined) {
        transformations.push(`w_${width}`);
        transformations.push(`c_limit`); // Limite la taille sans recadrer
      }
      
      // Ajouter qualité et format pour optimisation
      transformations.push(`q_${quality}`);
      transformations.push(`f_${format}`);

      // Si on a des transformations, les appliquer
      if (transformations.length > 0) {
        return `${base}/image/upload/${transformations.join(",")}/${rest}`;
      }
    }
  }

  return originalUrl;
}

/**
 * Supprime une image de Cloudinary (cleanup)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    ensureCloudinaryConfigured();
    await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Image supprimée:", publicId);
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
  }
}

