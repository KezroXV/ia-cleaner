import { VertexAI } from "@google-cloud/vertexai";
import { GoogleAuth } from "google-auth-library";
import fetch from "node-fetch";
import { getAnalysisPrompt, getGenerationPrompt, PromptType } from "./prompts";

// Configuration - Lazy loading pour permettre le chargement des variables d'environnement
function getProjectId(): string {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!projectId) {
    throw new Error("GOOGLE_CLOUD_PROJECT_ID is required");
  }
  return projectId;
}

function getLocation(): string {
  return process.env.GCP_LOCATION || "us-central1";
}

// Initialiser Vertex AI (lazy)
let vertexAIInstance: VertexAI | null = null;
function getVertexAI(): VertexAI {
  if (!vertexAIInstance) {
    vertexAIInstance = new VertexAI({
      project: getProjectId(),
      location: getLocation(),
    });
  }
  return vertexAIInstance;
}

// Initialiser Google Auth pour l'API REST (lazy)
let authInstance: GoogleAuth | null = null;
function getAuth(): GoogleAuth {
  if (!authInstance) {
    authInstance = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  }
  return authInstance;
}

/**
 * Analyse une image avec Gemini Vision
 * Retourne une description détaillée de la pièce en désordre
 */
export async function analyzeMessyRoom(imageBuffer: Buffer): Promise<string> {
  try {
    console.log("🔍 Analyse de l'image avec Gemini Vision...");

    const vertexAI = getVertexAI();
    const model = vertexAI.preview.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const base64Image = imageBuffer.toString("base64");
    const prompt = getAnalysisPrompt();

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await model.generateContent(request);
    const analysisText =
      response.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!analysisText) {
      throw new Error("Aucune analyse retournée par Gemini");
    }

    console.log(
      "✅ Analyse complétée:",
      analysisText.substring(0, 100) + "..."
    );
    return analysisText;
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse:", error);
    throw new Error(`Échec de l'analyse de l'image: ${error}`);
  }
}

/**
 * Génère une image "nettoyée" avec Imagen 3 via l'API REST
 */
export async function generateCleanImage(
  analysis: string,
  promptType: PromptType = "realistic"
): Promise<Buffer> {
  try {
    console.log("🎨 Génération de l'image avec Imagen 3...");

    const generationPrompt = getGenerationPrompt(promptType, analysis);

    // URL de l'API Imagen 3
    const projectId = getProjectId();
    const location = getLocation();
    const model = "imagen-3.0-generate-002"; // Utiliser la version 002
    const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

    // Obtenir le token d'authentification
    const auth = getAuth();
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error("Impossible d'obtenir le token d'authentification");
    }

    // Préparer la requête
    const requestBody = {
      instances: [
        {
          prompt: generationPrompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1", // Options: '1:1', '16:9', '9:16', '4:3', '3:4'
        negativePrompt:
          "blurry, low quality, distorted, unrealistic, cartoonish, anime, drawing, painting, rendered, artificial, fake, oversaturated, overexposed",
        safetyFilterLevel: "block_some",
        personGeneration: "dont_allow",
      },
    };

    console.log("📤 Envoi de la requête à Imagen 3...");

    // Appel à l'API REST avec node-fetch
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = `Erreur HTTP ${response.status}`;
      }
      console.error("❌ Erreur API Imagen:", errorText);
      throw new Error(
        `Erreur API Imagen (${response.status}): ${errorText.substring(0, 200)}`
      );
    }

    let data: any;
    try {
      const responseText = await response.text();
      // Vérifier si c'est du JSON valide
      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        throw new Error("Réponse HTML reçue au lieu de JSON - l'API a probablement retourné une page d'erreur");
      }
      data = JSON.parse(responseText);
    } catch (parseError: any) {
      console.error("❌ Erreur parsing réponse Imagen:", parseError);
      throw new Error(`Erreur parsing réponse API: ${parseError.message}`);
    }

    // Vérifier la structure de la réponse
    if (
      !data.predictions ||
      !Array.isArray(data.predictions) ||
      data.predictions.length === 0
    ) {
      console.error("❌ Structure de réponse inattendue:", JSON.stringify(data));
      throw new Error("Aucune prédiction retournée par Imagen");
    }

    const prediction = data.predictions[0];

    // La réponse peut contenir bytesBase64Encoded ou une autre structure
    let imageBase64: string;

    if (prediction.bytesBase64Encoded) {
      imageBase64 = prediction.bytesBase64Encoded;
    } else if (prediction.image) {
      imageBase64 = prediction.image;
    } else if (typeof prediction === "string") {
      imageBase64 = prediction;
    } else {
      console.error("❌ Format de réponse inattendu:", prediction);
      throw new Error("Format d'image non reconnu dans la réponse");
    }

    // Convertir base64 en Buffer
    const imageBuffer = Buffer.from(imageBase64, "base64");

    if (imageBuffer.length === 0) {
      throw new Error("L'image générée est vide");
    }

    console.log(`✅ Image générée avec succès (${imageBuffer.length} bytes)`);
    return imageBuffer;
  } catch (error: any) {
    console.error("❌ Erreur lors de la génération:", error);
    throw new Error(`Échec de la génération d'image: ${error.message || error}`);
  }
}

/**
 * Flux complet: Analyse + Génération
 */
export async function processImageTransformation(
  imageBuffer: Buffer,
  promptType: PromptType = "realistic"
): Promise<{ generatedImage: Buffer; analysis: string }> {
  // Étape 1: Analyser l'image
  const analysis = await analyzeMessyRoom(imageBuffer);

  // Étape 2: Générer l'image nettoyée
  const generatedImage = await generateCleanImage(analysis, promptType);

  return { generatedImage, analysis };
}

