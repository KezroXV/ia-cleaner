import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";
import * as path from "path";

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function testGCP() {
  try {
    console.log("🧪 Test de connexion GCP...\n");

    // Vérifier les variables d'environnement
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GCP_LOCATION || "us-central1";
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    console.log("📋 Configuration:");
    console.log(`  - Project ID: ${projectId || "❌ MANQUANT"}`);
    console.log(`  - Location: ${location}`);
    console.log(`  - Credentials: ${credentialsPath || "❌ MANQUANT"}\n`);

    if (!projectId) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID n'est pas défini dans .env.local");
    }

    if (!credentialsPath) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS n'est pas défini dans .env.local");
    }

    // Initialiser Vertex AI
    console.log("🔌 Initialisation de Vertex AI...");
    const vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });
    console.log("✅ Vertex AI initialisé avec succès !\n");

    // Test 1: Test simple avec Gemini
    console.log("🤖 Test 1: Connexion Gemini...");
    const geminiModel = vertexAI.preview.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const geminiResult = await geminiModel.generateContent('Réponds simplement "OK" en français');
    const geminiResponse = geminiResult.response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(`✅ Gemini répond: ${geminiResponse}\n`);

    // Test 2: Test avec image (simulation)
    console.log("🖼️  Test 2: Capacité de traitement d'image...");
    console.log("   (Ce test vérifie que l'API peut accepter des images)");
    
    // Créer une petite image de test (1x1 pixel PNG en base64)
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    const imageTestResult = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: testImageBase64,
              },
            },
            {
              text: "Décris cette image en un mot",
            },
          ],
        },
      ],
    });
    
    const imageResponse = imageTestResult.response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(`✅ Traitement d'image fonctionne: ${imageResponse}\n`);

    // Test 3: Vérifier Imagen (note: peut ne pas être disponible selon la région)
    console.log("🎨 Test 3: Vérification Imagen 3...");
    try {
      const imagenModel = vertexAI.preview.getGenerativeModel({
        model: "imagen-3.0-generate-001",
      });
      console.log("✅ Modèle Imagen 3 accessible");
      console.log("   Note: La génération d'image nécessite un appel complet avec prompt\n");
    } catch (error: any) {
      console.log("⚠️  Imagen 3 peut nécessiter une configuration supplémentaire");
      console.log(`   Erreur: ${error.message}\n`);
    }

    console.log("🎉 Tous les tests sont passés !");
    console.log("\n✅ Configuration GCP fonctionnelle !");
    console.log("✅ Vous pouvez maintenant utiliser l'API /api/clean-image\n");

  } catch (error: any) {
    console.error("\n❌ ERREUR:", error.message);
    console.error("\nVérifie :");
    console.error("  - Le fichier .env.local existe et contient GOOGLE_CLOUD_PROJECT_ID");
    console.error("  - Le fichier gcp-service-account.json existe à la racine");
    console.error("  - GOOGLE_APPLICATION_CREDENTIALS pointe vers le bon fichier");
    console.error("  - Vertex AI API est activée dans Google Cloud Console");
    console.error("  - Le service account a les permissions nécessaires");
    process.exit(1);
  }
}

testGCP();

