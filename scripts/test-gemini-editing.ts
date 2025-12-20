// IMPORTANT: Charger les variables d'environnement AVANT d'importer gemini
import * as dotenv from "dotenv";
import * as path from "path";

// Charger les variables d'environnement en premier
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Maintenant importer le module qui utilise les variables d'environnement
import { processImageTransformation } from "../lib/gemini";
import { uploadToCloudinary } from "../lib/cloudinary";
import * as fs from "fs/promises";

async function testGeminiEditing() {
  try {
    console.log("🧪 Test du système Gemini image-to-image");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Charge une image de test
    const testImagePath = path.join(process.cwd(), "test-images", "messy-room.jpg");

    console.log("📂 Chargement de l'image de test...");
    const imageBuffer = await fs.readFile(testImagePath);
    console.log("✅ Image chargée:", (imageBuffer.length / 1024).toFixed(2), "KB\n");

    // Test Mode Realistic
    console.log("🎯 TEST 1: Mode Realistic (préservation maximale)");
    console.log("─────────────────────────────────────────");
    const start1 = Date.now();

    const { generatedImage: realistic, analysis } = await processImageTransformation(
      imageBuffer,
      "realistic"
    );

    const time1 = ((Date.now() - start1) / 1000).toFixed(2);
    console.log(`✅ Terminé en ${time1}s`);
    console.log("📊 Analyse générée:", analysis.length, "caractères");
    console.log("🖼️ Image générée:", (realistic.length / 1024).toFixed(2), "KB");

    // Upload pour visualiser
    const upload1 = await uploadToCloudinary(realistic, {
      folder: "clear-ai/tests-gemini",
      publicId: `test-realistic-${Date.now()}`,
    });
    console.log("🔗 Résultat:", upload1.secure_url);
    console.log();

    // Test Mode Marketing
    console.log("🎯 TEST 2: Mode Marketing (enhancement)");
    console.log("─────────────────────────────────────────");
    const start2 = Date.now();

    const { generatedImage: marketing } = await processImageTransformation(
      imageBuffer,
      "marketing"
    );

    const time2 = ((Date.now() - start2) / 1000).toFixed(2);
    console.log(`✅ Terminé en ${time2}s`);
    console.log("🖼️ Image générée:", (marketing.length / 1024).toFixed(2), "KB");

    const upload2 = await uploadToCloudinary(marketing, {
      folder: "clear-ai/tests-gemini",
      publicId: `test-marketing-${Date.now()}`,
    });
    console.log("🔗 Résultat:", upload2.secure_url);
    console.log();

    // Test Mode Stylized
    console.log("🎯 TEST 3: Mode Stylized (idealized)");
    console.log("─────────────────────────────────────────");
    const start3 = Date.now();

    const { generatedImage: stylized } = await processImageTransformation(
      imageBuffer,
      "stylized"
    );

    const time3 = ((Date.now() - start3) / 1000).toFixed(2);
    console.log(`✅ Terminé en ${time3}s`);
    console.log("🖼️ Image générée:", (stylized.length / 1024).toFixed(2), "KB");

    const upload3 = await uploadToCloudinary(stylized, {
      folder: "clear-ai/tests-gemini",
      publicId: `test-stylized-${Date.now()}`,
    });
    console.log("🔗 Résultat:", upload3.secure_url);
    console.log();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 TOUS LES TESTS RÉUSSIS !");
    console.log(`⏱️  Temps total: ${((Date.now() - start1) / 1000).toFixed(2)}s`);
  } catch (error: any) {
    console.error("\n❌ ERREUR LORS DU TEST:", error.message);
    console.error("\nDétails:", error);
    throw error;
  }
}

// Exécuter
testGeminiEditing()
  .then(() => {
    console.log("\n✅ Test terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test échoué");
    process.exit(1);
  });

