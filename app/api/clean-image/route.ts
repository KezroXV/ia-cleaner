import { NextRequest, NextResponse } from "next/server";
import {
  parseFormData,
  processImage,
  validateImageType,
} from "@/utils/file-handler";
import { processImageTransformation } from "@/lib/gemini";
import { uploadToCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";
import type { CleanImageResponse } from "@/types";

// Configuration
export const runtime = "nodejs";
export const maxDuration = 60; // 60 secondes max pour Vercel Pro

/**
 * POST /api/clean-image
 * Endpoint principal pour la transformation d'image
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("🚀 Nouvelle requête clean-image");

  try {
    // 1. CORS Headers
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // 2. Parse FormData
    console.log("📦 Parsing FormData...");
    const { fields, files } = await parseFormData(request);

    const imageFile = files.image?.[0] as
      | { buffer: Buffer; mimetype?: string }
      | undefined;
    if (!imageFile || !imageFile.buffer) {
      return NextResponse.json(
        { success: false, error: "Aucune image fournie" } as CleanImageResponse,
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Validation
    console.log("✔️ Validation de l'image...");
    if (!validateImageType(imageFile.mimetype || "")) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'image non supporté (PNG, JPG uniquement)",
        } as CleanImageResponse,
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Traitement de l'image
    console.log("🔧 Optimisation de l'image...");
    const processedBuffer = await processImage(imageFile.buffer);

    // 5. Type de prompt
    const promptType =
      (fields.promptType?.[0] as "realistic" | "marketing" | "stylized") ||
      "realistic";
    console.log("🎨 Type de prompt:", promptType);

    // 6. Transformation IA (Analyse + Génération)
    console.log("🤖 Utilisation de Nano Banana (Gemini 2.5 Flash Image)");
    console.log("🎨 Mode: Image-to-Image Editing + Generation");
    console.log("📊 Type de transformation:", promptType);
    console.log("💰 Coût estimé: $0.039 par image");
    console.log("🤖 Démarrage de la transformation IA...");
    const { generatedImage, analysis } = await processImageTransformation(
      processedBuffer,
      promptType
    );
    console.log("✅ Transformation Gemini terminée");
    console.log("📏 Analyse:", analysis.substring(0, 100) + "...");
    console.log("🖼️ Image:", generatedImage.length, "bytes");

    // 7. Upload vers Cloudinary
    console.log("☁️ Upload du résultat...");
    const timestamp = Date.now();
    const uploadResult = await uploadToCloudinary(generatedImage, {
      folder: "clear-ai/generated",
      publicId: `clean_${timestamp}`,
    });

    // 8. Calcul du temps d'exécution
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Succès en ${duration}s`);

    // 9. Générer une URL avec la résolution réelle de l'image
    const optimizedUrl = getOptimizedImageUrl(uploadResult.secure_url, {
      width: uploadResult.width, // Utiliser la résolution réelle
      quality: "auto:best", // Meilleure qualité pour préserver les détails
      format: "auto", // WebP ou AVIF selon le navigateur
    });

    // 10. Réponse
    const response: CleanImageResponse = {
      success: true,
      generatedImageUrl: optimizedUrl, // URL optimisée pour un chargement plus rapide
      meta: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        analysisText: analysis.substring(0, 200), // Aperçu
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ ERREUR:", err);
    console.error("❌ Stack:", err.stack);

    // Détecter les erreurs de quota
    const isQuotaError = err?.message?.includes("Quota dépassé") || 
                         err?.message?.includes("429") ||
                         err?.message?.includes("quota");
    
    // S'assurer qu'on retourne toujours du JSON, jamais du HTML
    const errorMessage =
      err?.message || "Une erreur est survenue lors de la génération";
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? err?.stack || errorMessage
        : undefined;

    const response: CleanImageResponse = {
      success: false,
      error: errorMessage,
      details: errorDetails,
    };

    // Retourner 429 pour les erreurs de quota, 500 pour les autres
    const statusCode = isQuotaError ? 429 : 500;

    try {
      return NextResponse.json(response, {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (jsonError) {
      // Fallback si même NextResponse.json échoue
      console.error("❌ Impossible de créer la réponse JSON:", jsonError);
      return new NextResponse(JSON.stringify(response), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
}

/**
 * OPTIONS /api/clean-image
 * Gestion du preflight CORS
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
