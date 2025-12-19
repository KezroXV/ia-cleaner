// IMPORTANT: Charger les variables d'environnement AVANT d'importer vertex-ai
import * as dotenv from "dotenv";
import * as path from "path";

// Charger les variables d'environnement en premier
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Maintenant importer le module qui utilise les variables d'environnement
import { generateCleanImage } from "../lib/vertex-ai";
import * as fs from "fs/promises";

async function testImagen() {
  try {
    console.log("🧪 Test de génération d'image avec Imagen 3...\n");

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    if (!projectId) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID n'est pas défini");
    }

    // Test avec un prompt simple
    const testAnalysis = "A messy kitchen with dirty dishes on the counter, scattered utensils, and food containers. The room has natural lighting from a window and white cabinets.";

    console.log("📝 Prompt de test:");
    console.log(`   "${testAnalysis.substring(0, 80)}..."\n`);

    console.log("🎨 Génération de l'image...");
    console.log("   (Cela peut prendre 30-60 secondes)\n");

    const startTime = Date.now();
    const imageBuffer = await generateCleanImage(testAnalysis, "realistic");
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Image générée avec succès en ${duration}s !`);
    console.log(`   Taille: ${imageBuffer.length} bytes (${(imageBuffer.length / 1024).toFixed(2)} KB)\n`);

    // Sauvegarder l'image de test
    const outputPath = path.join(process.cwd(), "test-output.jpg");
    await fs.writeFile(outputPath, imageBuffer);
    console.log(`💾 Image sauvegardée: ${outputPath}\n`);

    console.log("🎉 Test réussi ! Imagen 3 fonctionne correctement.\n");

  } catch (error: any) {
    console.error("\n❌ ERREUR:", error.message);
    console.error("\nDétails:", error);
    console.error("\nVérifie :");
    console.error("  - Le modèle Imagen 3 est disponible dans votre région");
    console.error("  - Les permissions du service account sont correctes");
    console.error("  - L'API Vertex AI est activée");
    console.error("  - Le quota/limite n'est pas dépassé");
    process.exit(1);
  }
}

testImagen();

