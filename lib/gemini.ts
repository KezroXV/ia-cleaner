import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getAnalysisPrompt,
  getGenerationPrompt,
  getSpaceTypeDetectionPrompt,
  normalizeSpaceType,
  PromptType,
  SpaceType,
} from "./prompts";

// Configuration
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY!;

if (!API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY manquante dans .env.local");
}

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Détecte et parse les erreurs de quota Gemini API
 */
function parseQuotaError(error: unknown): {
  isQuotaError: boolean;
  retryAfter?: number;
  message: string;
} {
  const errorMessage = (error as { message?: string })?.message || "";
  const errorString = JSON.stringify(error);

  // Détecter erreur 429 (Too Many Requests)
  if (
    errorMessage.includes("429") ||
    errorMessage.includes("Too Many Requests") ||
    errorMessage.includes("quota")
  ) {
    // Extraire le délai de retry si disponible
    const retryMatch =
      errorMessage.match(/retry in ([\d.]+)s/i) ||
      errorString.match(/retryDelay["']:\s*["'](\d+)s/i);
    const retryAfter = retryMatch
      ? Math.ceil(parseFloat(retryMatch[1]))
      : undefined;

    // Détecter si c'est un quota à 0 (pas de quota disponible)
    const isZeroQuota =
      errorMessage.includes("limit: 0") || errorString.includes('limit":0');

    let message = "Quota Gemini API dépassé. ";

    if (isZeroQuota) {
      message += "Votre quota free tier est à 0. ";
      message +=
        "Vérifiez votre compte sur https://ai.dev/usage?tab=rate-limit ou upgradez votre plan.";
    } else if (retryAfter) {
      message += `Réessayez dans ${retryAfter} secondes.`;
    } else {
      message += "Vérifiez votre quota sur https://ai.dev/usage?tab=rate-limit";
    }

    return { isQuotaError: true, retryAfter, message };
  }

  return { isQuotaError: false, message: errorMessage };
}

/**
 * Retry avec backoff exponentiel
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const quotaInfo = parseQuotaError(error);

      if (quotaInfo.isQuotaError && quotaInfo.retryAfter) {
        // Si on a un délai spécifique, l'utiliser
        const delay = quotaInfo.retryAfter * 1000;
        if (attempt < maxRetries - 1) {
          console.log(
            `⏳ Attente de ${quotaInfo.retryAfter}s avant retry (tentative ${
              attempt + 1
            }/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      } else if (attempt < maxRetries - 1) {
        // Backoff exponentiel pour autres erreurs
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(
          `⏳ Retry dans ${delay}ms (tentative ${attempt + 1}/${maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Détecte le type d'espace dans l'image
 */
async function detectSpaceType(imageBuffer: Buffer): Promise<SpaceType> {
  try {
    console.log("🔎 Détection du type d'espace...");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const base64Image = imageBuffer.toString("base64");
    const detectionPrompt = getSpaceTypeDetectionPrompt();

    const result = await retryWithBackoff(async () => {
      return await model.generateContent([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: detectionPrompt,
        },
      ]);
    });

    const response = await result.response;
    const detectionText = response.text().trim();

    if (!detectionText) {
      console.log("⚠️ Aucune détection retournée, utilisation du mode auto");
      return "auto";
    }

    const spaceType = normalizeSpaceType(detectionText);
    console.log(`✅ Type d'espace détecté: ${spaceType}`);
    return spaceType;
  } catch (error: unknown) {
    console.error("⚠️ Erreur lors de la détection du type d'espace:", error);
    console.log("⚠️ Utilisation du mode auto par défaut");
    return "auto";
  }
}

/**
 * Analyse une image avec Gemini 2.5 Flash Image
 * Extrait tous les détails structurels pour permettre l'édition précise
 * Détecte automatiquement le type d'espace pour utiliser les prompts spécialisés
 */
export async function analyzeMessyRoom(imageBuffer: Buffer): Promise<string> {
  try {
    console.log("🔍 Analyse détaillée de l'image avec Gemini Vision...");

    // Étape 1: Détecter le type d'espace
    const spaceType = await detectSpaceType(imageBuffer);

    // Étape 2: Utiliser le prompt spécialisé pour ce type d'espace
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const base64Image = imageBuffer.toString("base64");
    const analysisPrompt = getAnalysisPrompt(spaceType);

    console.log(`📋 Utilisation du prompt spécialisé pour: ${spaceType}`);

    // Utiliser retry avec backoff pour les erreurs de quota
    const result = await retryWithBackoff(async () => {
      return await model.generateContent([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: analysisPrompt,
        },
      ]);
    });

    const response = await result.response;
    const analysisText = response.text();

    if (!analysisText) {
      throw new Error("Aucune analyse retournée par Gemini");
    }

    console.log("✅ Analyse complétée:", analysisText.length, "caractères");
    return analysisText;
  } catch (error: unknown) {
    console.error("❌ Erreur lors de l'analyse:", error);

    // Vérifier les erreurs spécifiques
    const errorMessage = (error as { message?: string })?.message || "";
    if (errorMessage.includes("API key") || errorMessage.includes("401")) {
      throw new Error(
        "Clé API Gemini invalide. Vérifie GOOGLE_GEMINI_API_KEY dans .env.local"
      );
    }

    // Vérifier les erreurs de quota
    const quotaInfo = parseQuotaError(error);
    if (quotaInfo.isQuotaError) {
      throw new Error(`Quota dépassé: ${quotaInfo.message}`);
    }

    throw new Error(`Échec de l'analyse: ${errorMessage || String(error)}`);
  }
}

/**
 * Édite/génère une image avec Gemini 2.5 Flash Image
 * IMPORTANT: Ce modèle génère des images directement !
 */
export async function editImageWithGemini(
  originalImageBuffer: Buffer,
  detailedAnalysis: string,
  promptType: PromptType = "realistic",
  spaceType: SpaceType = "auto"
): Promise<Buffer> {
  try {
    console.log("🎨 Génération d'image avec Gemini 2.5 Flash Image...");

    // Si le type d'espace n'est pas fourni, le détecter
    if (spaceType === "auto") {
      spaceType = await detectSpaceType(originalImageBuffer);
    }

    // UTILISER LE MODÈLE GEMINI 2.5 FLASH IMAGE (stable)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image", // Modèle stable pour la génération d'images
    });

    const base64Image = originalImageBuffer.toString("base64");
    const editingPrompt = getGenerationPrompt(
      promptType,
      detailedAnalysis,
      spaceType
    );

    console.log("📝 Envoi de la requête à Gemini 2.5 Flash Image...");
    console.log("🎯 Mode:", promptType);
    console.log("🏠 Type d'espace:", spaceType);

    // Envoyer l'image originale + le prompt d'édition
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: editingPrompt,
      },
    ]);

    const response = await result.response;

    // Gemini 2.5 Flash Image retourne l'image générée dans response.candidates
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Aucune image générée par Gemini 2.5 Flash Image");
    }

    const candidate = response.candidates[0];

    // Chercher la partie image dans la réponse
    let imageData: string | null = null;

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        // L'image est dans inline_data.data
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          console.log(
            "✅ Image trouvée dans la réponse Gemini 2.5 Flash Image"
          );
          break;
        }
      }
    }

    if (!imageData) {
      throw new Error(
        "Gemini 2.5 Flash Image n'a pas retourné d'image. Vérifiez que le billing est activé."
      );
    }

    const generatedBuffer = Buffer.from(imageData, "base64");
    console.log(
      "✅ Image générée avec succès:",
      generatedBuffer.length,
      "bytes"
    );

    return generatedBuffer;
  } catch (error: unknown) {
    console.error("❌ Erreur lors de la génération:", error);

    // Messages d'erreur plus clairs
    const errorMessage = (error as { message?: string })?.message || "";
    if (errorMessage.includes("billing")) {
      throw new Error(
        "Billing non activé. Va sur https://console.cloud.google.com et active le billing"
      );
    }

    if (errorMessage.includes("quota")) {
      throw new Error(
        "Quota Gemini 2.5 Flash Image dépassé. Attends quelques minutes ou upgrade ton plan"
      );
    }

    // Vérifier les erreurs de quota
    const quotaInfo = parseQuotaError(error);
    if (quotaInfo.isQuotaError) {
      throw new Error(`Quota dépassé: ${quotaInfo.message}`);
    }

    throw new Error(
      `Échec de la génération d'image: ${errorMessage || String(error)}`
    );
  }
}

/**
 * Flux complet : Analyse + Édition
 * Détecte automatiquement le type d'espace pour optimiser le traitement
 */
export async function processImageTransformation(
  imageBuffer: Buffer,
  promptType: PromptType = "realistic"
): Promise<{ generatedImage: Buffer; analysis: string }> {
  console.log("🔄 Démarrage du flux de transformation...");

  // Étape 0: Détecter le type d'espace une seule fois
  console.log("🔎 Étape 0/3: Détection du type d'espace...");
  const spaceType = await detectSpaceType(imageBuffer);

  // Étape 1: Analyse ultra-détaillée avec prompt spécialisé
  console.log("📊 Étape 1/3: Analyse de l'image originale...");
  const analysis = await analyzeMessyRoom(imageBuffer);

  // Étape 2: Édition avec l'image originale comme base et prompt spécialisé
  console.log(
    "🎨 Étape 2/3: Édition de l'image (préservation de structure)..."
  );
  const generatedImage = await editImageWithGemini(
    imageBuffer, // ← Image originale passée ici
    analysis,
    promptType,
    spaceType // ← Utiliser le type détecté
  );

  console.log("✅ Transformation complétée");

  return { generatedImage, analysis };
}
