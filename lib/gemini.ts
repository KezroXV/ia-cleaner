import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAnalysisPrompt, getGenerationPrompt, PromptType } from './prompts';

// Configuration
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY!;

if (!API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY manquante dans .env.local');
}

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Détecte et parse les erreurs de quota Gemini API
 */
function parseQuotaError(error: any): { isQuotaError: boolean; retryAfter?: number; message: string } {
  const errorMessage = error.message || '';
  const errorString = JSON.stringify(error);
  
  // Détecter erreur 429 (Too Many Requests)
  if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('quota')) {
    // Extraire le délai de retry si disponible
    const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i) || errorString.match(/retryDelay["']:\s*["'](\d+)s/i);
    const retryAfter = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : undefined;
    
    // Détecter si c'est un quota à 0 (pas de quota disponible)
    const isZeroQuota = errorMessage.includes('limit: 0') || errorString.includes('limit":0');
    
    let message = 'Quota Gemini API dépassé. ';
    
    if (isZeroQuota) {
      message += 'Votre quota free tier est à 0. ';
      message += 'Vérifiez votre compte sur https://ai.dev/usage?tab=rate-limit ou upgradez votre plan.';
    } else if (retryAfter) {
      message += `Réessayez dans ${retryAfter} secondes.`;
    } else {
      message += 'Vérifiez votre quota sur https://ai.dev/usage?tab=rate-limit';
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
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const quotaInfo = parseQuotaError(error);
      
      if (quotaInfo.isQuotaError && quotaInfo.retryAfter) {
        // Si on a un délai spécifique, l'utiliser
        const delay = quotaInfo.retryAfter * 1000;
        if (attempt < maxRetries - 1) {
          console.log(`⏳ Attente de ${quotaInfo.retryAfter}s avant retry (tentative ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      } else if (attempt < maxRetries - 1) {
        // Backoff exponentiel pour autres erreurs
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`⏳ Retry dans ${delay}ms (tentative ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Analyse une image avec Gemini 2.5 Flash Image (Nano Banana)
 * Extrait tous les détails structurels pour permettre l'édition précise
 */
export async function analyzeMessyRoom(imageBuffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Analyse détaillée de l\'image avec Gemini Vision...');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image-preview',
    });

    const base64Image = imageBuffer.toString('base64');
    const analysisPrompt = getAnalysisPrompt();

    // Utiliser retry avec backoff pour les erreurs de quota
    const result = await retryWithBackoff(async () => {
      return await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
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
      throw new Error('Aucune analyse retournée par Gemini');
    }

    console.log('✅ Analyse complétée:', analysisText.length, 'caractères');
    return analysisText;
    
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'analyse:', error);
    
    // Vérifier les erreurs spécifiques
    if (error.message?.includes('API key') || error.message?.includes('401')) {
      throw new Error('Clé API Gemini invalide. Vérifie GOOGLE_GEMINI_API_KEY dans .env.local');
    }
    
    // Vérifier les erreurs de quota
    const quotaInfo = parseQuotaError(error);
    if (quotaInfo.isQuotaError) {
      throw new Error(`Quota dépassé: ${quotaInfo.message}`);
    }
    
    throw new Error(`Échec de l'analyse: ${error.message || error}`);
  }
}

/**
 * Édite/génère une image avec Gemini 2.5 Flash Image (Nano Banana)
 * IMPORTANT: Ce modèle génère des images directement !
 */
export async function editImageWithGemini(
  originalImageBuffer: Buffer,
  detailedAnalysis: string,
  promptType: PromptType = 'realistic'
): Promise<Buffer> {
  try {
    console.log('🎨 Génération d\'image avec Nano Banana...');

    // UTILISER LE MODÈLE NANO BANANA
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image-preview', // ← C'EST NANO BANANA !
    });

    const base64Image = originalImageBuffer.toString('base64');
    const editingPrompt = getGenerationPrompt(promptType, detailedAnalysis);

    console.log('📝 Envoi de la requête à Nano Banana...');
    console.log('🎯 Mode:', promptType);

    // Envoyer l'image originale + le prompt d'édition
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
      {
        text: editingPrompt,
      },
    ]);

    const response = await result.response;
    
    // Nano Banana retourne l'image générée dans response.candidates
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('Aucune image générée par Nano Banana');
    }

    const candidate = response.candidates[0];
    
    // Chercher la partie image dans la réponse
    let imageData: string | null = null;
    
    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        // L'image est dans inline_data.data
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          console.log('✅ Image trouvée dans la réponse Nano Banana');
          break;
        }
      }
    }

    if (!imageData) {
      throw new Error('Nano Banana n\'a pas retourné d\'image. Vérifiez que le billing est activé.');
    }

    const generatedBuffer = Buffer.from(imageData, 'base64');
    console.log('✅ Image générée avec succès:', generatedBuffer.length, 'bytes');
    
    return generatedBuffer;
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la génération:', error);
    
    // Messages d'erreur plus clairs
    if (error.message?.includes('billing')) {
      throw new Error('Billing non activé. Va sur https://console.cloud.google.com et active le billing');
    }
    
    if (error.message?.includes('quota')) {
      throw new Error('Quota Nano Banana dépassé. Attends quelques minutes ou upgrade ton plan');
    }
    
    // Vérifier les erreurs de quota
    const quotaInfo = parseQuotaError(error);
    if (quotaInfo.isQuotaError) {
      throw new Error(`Quota dépassé: ${quotaInfo.message}`);
    }
    
    throw new Error(`Échec de la génération d'image: ${error.message || error}`);
  }
}


/**
 * Flux complet : Analyse + Édition
 */
export async function processImageTransformation(
  imageBuffer: Buffer,
  promptType: PromptType = 'realistic'
): Promise<{ generatedImage: Buffer; analysis: string }> {
  
  console.log('🔄 Démarrage du flux de transformation...');
  
  // Étape 1: Analyse ultra-détaillée
  console.log('📊 Étape 1/2: Analyse de l\'image originale...');
  const analysis = await analyzeMessyRoom(imageBuffer);
  
  // Étape 2: Édition avec l'image originale comme base
  console.log('🎨 Étape 2/2: Édition de l\'image (préservation de structure)...');
  const generatedImage = await editImageWithGemini(
    imageBuffer,  // ← Image originale passée ici
    analysis,
    promptType
  );
  
  console.log('✅ Transformation complétée');

  return { generatedImage, analysis };
}

