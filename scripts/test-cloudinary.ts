import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import * as path from "path";

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function testCloudinary() {
  try {
    console.log("🧪 Test de connexion Cloudinary...\n");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("📋 Configuration:");
    console.log(`  - Cloud Name: ${cloudName || "❌ MANQUANT"}`);
    console.log(`  - API Key: ${apiKey ? "✅ Configuré" : "❌ MANQUANT"}`);
    console.log(`  - API Secret: ${apiSecret ? "✅ Configuré" : "❌ MANQUANT"}\n`);

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Variables Cloudinary manquantes dans .env.local");
    }

    // Configuration
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    console.log("🔌 Test de connexion...");
    
    // Test simple : ping de l'API
    const result = await cloudinary.api.ping();
    console.log("✅ Connexion Cloudinary réussie !");
    console.log(`   Status: ${result.status}\n`);

    console.log("🎉 Configuration Cloudinary fonctionnelle !\n");

  } catch (error: any) {
    console.error("\n❌ ERREUR:", error.message);
    console.error("\nVérifie :");
    console.error("  - Le fichier .env.local contient CLOUDINARY_CLOUD_NAME");
    console.error("  - Le fichier .env.local contient CLOUDINARY_API_KEY");
    console.error("  - Le fichier .env.local contient CLOUDINARY_API_SECRET");
    console.error("  - Les credentials sont corrects dans Cloudinary Dashboard");
    process.exit(1);
  }
}

testCloudinary();

