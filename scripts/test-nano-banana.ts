// IMPORTANT: Charger les variables d'environnement AVANT d'importer gemini
import * as dotenv from "dotenv";
import * as path from "path";

// Charger les variables d'environnement en premier
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Maintenant importer le module qui utilise les variables d'environnement
import { processImageTransformation } from "../lib/gemini";
import { uploadToCloudinary } from "../lib/cloudinary";
import * as fs from "fs/promises";

async function testNanoBanana() {
  try {
    console.log("🍌 TEST NANO BANANA (Gemini 2.5 Flash Image)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Charge une image de test
    const testImagePath = path.join(process.cwd(), "test-images", "messy-room.jpg");

    console.log("📂 Chargement de l'image de test...");
    const imageBuffer = await fs.readFile(testImagePath);
    console.log("✅ Image chargée:", (imageBuffer.length / 1024).toFixed(2), "KB\n");

    // Test Mode Realistic
    console.log("🎯 TEST: Mode Realistic");
    console.log("─────────────────────────────────────────");
    const start = Date.now();

    const { generatedImage, analysis } = await processImageTransformation(
      imageBuffer,
      "realistic"
    );

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ Terminé en ${duration}s`);
    console.log("📊 Analyse:", analysis.length, "caractères");
    console.log("🖼️ Image générée:", (generatedImage.length / 1024).toFixed(2), "KB");

    // Upload pour visualiser
    const uploadResult = await uploadToCloudinary(generatedImage, {
      folder: "clear-ai/nano-banana-tests",
      publicId: `test-${Date.now()}`,
    });

    console.log("🔗 Résultat:", uploadResult.secure_url);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 TEST NANO BANANA RÉUSSI !");
    console.log("💰 Coût: ~$0.039");
  } catch (error: any) {
    console.error("\n❌ ERREUR:", error.message);

    if (error.message?.includes("billing")) {
      console.error("\n💡 SOLUTION: Active le billing sur Google Cloud Console");
      console.error("   👉 https://console.cloud.google.com/billing");
    }

    if (error.message?.includes("quota")) {
      console.error("\n💡 SOLUTION: Attends quelques minutes (quota par minute)");
    }

    if (error.message?.includes("API key")) {
      console.error("\n💡 SOLUTION: Vérifie ta clé API dans .env.local");
    }

    throw error;
  }
}

// Exécuter
testNanoBanana()
  .then(() => {
    console.log("\n✅ Test terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test échoué");
    process.exit(1);
  });

