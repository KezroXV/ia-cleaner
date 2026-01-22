import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHash } from "crypto";
import type { CarSpaceType, CarRenderMode } from "../../types/car-types";
import { CAR_GENERATION_CONFIG } from "../../types/car-types";
import {
  getCarSpaceTypeDetectionPrompt,
  normalizeCarSpaceType,
  getCarAnalysisPrompt,
  getCarGenerationPrompt,
} from "../../prompts/car-prompts";

// Configuration
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY!;

if (!API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY manquante dans .env.local");
}

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Génère un seed déterministe à partir de l'image
 */
function generateSeedFromImage(imageBuffer: Buffer): number {
  const hash = createHash("sha256").update(imageBuffer).digest("hex");
  const seedString = hash.substring(0, 8);
  const seed = parseInt(seedString, 16) % 2147483647;
  return seed;
}

/**
 * Détecte le type d'espace automobile
 */
export async function detectCarSpaceType(
  imageBuffer: Buffer
): Promise<CarSpaceType> {
  try {
    console.log("🚗 Détection du type d'espace automobile...");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 0.1,
      },
    });

    const base64Image = imageBuffer.toString("base64");
    const detectionPrompt = getCarSpaceTypeDetectionPrompt();

    const result = await model.generateContent([
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

    const response = await result.response;
    const detectionText = response.text().trim();

    if (!detectionText) {
      console.log("⚠️ Aucune détection retournée, utilisation de car-interior-full par défaut");
      return "car-interior-full";
    }

    const spaceType = normalizeCarSpaceType(detectionText);
    console.log(`✅ Type d'espace automobile détecté: ${spaceType}`);
    return spaceType;
  } catch (error: unknown) {
    console.error("⚠️ Erreur lors de la détection du type d'espace automobile:", error);
    console.log("⚠️ Utilisation de car-interior-full par défaut");
    return "car-interior-full";
  }
}

/**
 * Analyse une image d'intérieur de voiture
 */
export async function analyzeCarInterior(
  imageBuffer: Buffer
): Promise<string> {
  try {
    console.log("🔍 Analyse détaillée de l'intérieur automobile...");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      generationConfig: {
        temperature: 0,
        topK: 40,
        topP: 0.95,
      },
    });

    const base64Image = imageBuffer.toString("base64");
    const analysisPrompt = getCarAnalysisPrompt();

    const result = await model.generateContent([
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

    const response = await result.response;
    const analysisText = response.text();

    if (!analysisText) {
      throw new Error("Aucune analyse retournée par Gemini");
    }

    console.log("✅ Analyse automobile complétée:", analysisText.length, "caractères");
    return analysisText;
  } catch (error: unknown) {
    console.error("❌ Erreur lors de l'analyse automobile:", error);
    const errorMessage = (error as { message?: string })?.message || "";
    throw new Error(`Échec de l'analyse automobile: ${errorMessage || String(error)}`);
  }
}

/**
 * Génère une image nettoyée d'intérieur de voiture
 */
export async function generateCleanCarImage(
  originalImageBuffer: Buffer,
  detailedAnalysis: string,
  mode: CarRenderMode,
  spaceType: CarSpaceType
): Promise<Buffer> {
  try {
    console.log(`🎨 Génération d'image automobile - Mode: ${mode}`);

    const seed = generateSeedFromImage(originalImageBuffer);
    const config = CAR_GENERATION_CONFIG[mode];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      generationConfig: {
        temperature: config.temperature,
        topK: config.topK,
        topP: config.topP,
      },
    });

    const base64Image = originalImageBuffer.toString("base64");
    const generationPrompt = getCarGenerationPrompt(mode, detailedAnalysis, spaceType);

    console.log("📝 Envoi de la requête à Gemini 2.5 Flash Image...");
    console.log("🎯 Mode:", mode);
    console.log("🚗 Type d'espace:", spaceType);
    console.log("🔢 Seed:", seed);
    console.log("🌡️ Temperature:", config.temperature);

    const enhancedPrompt = `${generationPrompt}\n\n[Seed: ${seed} - Utilise ce seed pour garantir la reproductibilité]`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: enhancedPrompt,
      },
    ]);

    const response = await result.response;

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Aucune image générée par Gemini");
    }

    const candidate = response.candidates[0];
    let imageData: string | null = null;

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          console.log("✅ Image automobile trouvée dans la réponse");
          break;
        }
      }
    }

    if (!imageData) {
      throw new Error("Gemini n'a pas retourné d'image automobile");
    }

    const generatedBuffer = Buffer.from(imageData, "base64");
    console.log("✅ Image automobile générée:", generatedBuffer.length, "bytes");

    return generatedBuffer;
  } catch (error: unknown) {
    console.error("❌ Erreur lors de la génération automobile:", error);
    const errorMessage = (error as { message?: string })?.message || "";
    throw new Error(`Échec de la génération automobile: ${errorMessage || String(error)}`);
  }
}

/**
 * Flux complet de transformation automobile
 */
export async function processCarImageTransformation(
  imageBuffer: Buffer,
  mode: CarRenderMode = "perfect-clean"
): Promise<{ generatedImage: Buffer; analysis: string; spaceType: CarSpaceType }> {
  console.log("🚗 Démarrage du flux de transformation automobile...");

  // Étape 1: Détection du type d'espace
  console.log("🔎 Étape 1/3: Détection du type d'espace automobile...");
  const spaceType = await detectCarSpaceType(imageBuffer);

  // Étape 2: Analyse détaillée
  console.log("📊 Étape 2/3: Analyse de l'intérieur automobile...");
  const analysis = await analyzeCarInterior(imageBuffer);

  // Étape 3: Génération
  console.log("🎨 Étape 3/3: Génération de l'image nettoyée...");
  const generatedImage = await generateCleanCarImage(
    imageBuffer,
    analysis,
    mode,
    spaceType
  );

  console.log("✅ Transformation automobile complétée");

  return { generatedImage, analysis, spaceType };
}
