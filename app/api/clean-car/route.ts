import { NextRequest, NextResponse } from "next/server";
import {
  parseFormData,
  processImage,
  validateImageType,
} from "@/utils/file-handler";
import { processCarImageTransformation } from "@/lib/api/processors/car-processor";
import { uploadToCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";
import type { CleanImageResponse } from "@/types";
import type { CarRenderMode } from "@/lib/types/car-types";

// Configuration
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/clean-car
 * Endpoint spécialisé pour le nettoyage d'intérieurs de voiture
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("🚗 Nouvelle requête clean-car");

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

    // 5. Mode de rendu automobile
    const renderMode =
      (fields.renderMode?.[0] as CarRenderMode) || "perfect-clean";
    console.log("🎨 Mode de rendu automobile:", renderMode);

    // Valider le mode
    const validModes: CarRenderMode[] = ["perfect-clean", "enhanced-beauty", "stylized-luxury"];
    if (!validModes.includes(renderMode)) {
      return NextResponse.json(
        {
          success: false,
          error: `Mode de rendu invalide. Modes autorisés: ${validModes.join(", ")}`,
        } as CleanImageResponse,
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Transformation IA automobile
    console.log("🤖 Utilisation du système de nettoyage automobile");
    console.log("🎨 Mode:", renderMode);
    console.log("💰 Coût estimé: $0.039 par image");
    console.log("🤖 Démarrage de la transformation automobile...");
    const { generatedImage, analysis, spaceType } = await processCarImageTransformation(
      processedBuffer,
      renderMode
    );
    console.log("✅ Transformation automobile terminée");
    console.log("🚗 Type d'espace détecté:", spaceType);
    console.log("📏 Analyse:", analysis.substring(0, 100) + "...");
    console.log("🖼️ Image:", generatedImage.length, "bytes");

    // 7. Upload vers Cloudinary
    console.log("☁️ Upload du résultat...");
    const timestamp = Date.now();
    const uploadResult = await uploadToCloudinary(generatedImage, {
      folder: "clear-ai/car",
      publicId: `car_${renderMode}_${timestamp}`,
    });

    // 8. Calcul du temps d'exécution
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Succès en ${duration}s`);

    // 9. Générer une URL optimisée
    const optimizedUrl = getOptimizedImageUrl(uploadResult.secure_url, {
      width: uploadResult.width,
      quality: "auto:best",
      format: "auto",
    });

    // 10. Réponse
    const response: CleanImageResponse = {
      success: true,
      generatedImageUrl: optimizedUrl,
      meta: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        analysisText: analysis.substring(0, 200),
        spaceType,
        renderMode,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ ERREUR AUTOMOBILE:", err);
    console.error("❌ Stack:", err.stack);

    const isQuotaError = err?.message?.includes("Quota dépassé") || 
                         err?.message?.includes("429") ||
                         err?.message?.includes("quota");

    const errorMessage =
      err?.message || "Une erreur est survenue lors de la génération automobile";
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? err?.stack || errorMessage
        : undefined;

    const response: CleanImageResponse = {
      success: false,
      error: errorMessage,
      details: errorDetails,
    };

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
 * OPTIONS /api/clean-car
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
