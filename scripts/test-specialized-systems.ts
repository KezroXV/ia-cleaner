/**
 * Script de test pour les systèmes spécialisés voiture et canapé
 * 
 * Usage:
 *   npm run test:car -- <chemin-image> <mode>
 *   npm run test:sofa -- <chemin-image> <mode>
 * 
 * Exemples:
 *   npm run test:car -- ./test-images/car-interior.jpg perfect-clean
 *   npm run test:sofa -- ./test-images/sofa.jpg professional-clean
 */

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

interface TestConfig {
  system: 'car' | 'sofa';
  imagePath: string;
  renderMode: string;
}

/**
 * Parse les arguments de la ligne de commande
 */
function parseArgs(): TestConfig {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: npm run test:specialized <car|sofa> <image-path> <render-mode>');
    console.error('\nExemples:');
    console.error('  npm run test:specialized car ./test-images/car.jpg perfect-clean');
    console.error('  npm run test:specialized sofa ./test-images/sofa.jpg professional-clean');
    console.error('\nModes Voiture: perfect-clean, enhanced-beauty, stylized-luxury');
    console.error('Modes Canapé: professional-clean, magazine-worthy, designer-dream');
    process.exit(1);
  }

  const [system, imagePath, renderMode] = args;

  if (system !== 'car' && system !== 'sofa') {
    console.error('❌ Système invalide. Utilisez "car" ou "sofa"');
    process.exit(1);
  }

  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image introuvable: ${imagePath}`);
    process.exit(1);
  }

  return {
    system: system as 'car' | 'sofa',
    imagePath,
    renderMode
  };
}

/**
 * Valide le mode de rendu selon le système
 */
function validateRenderMode(system: 'car' | 'sofa', mode: string): boolean {
  const validModes = {
    car: ['perfect-clean', 'enhanced-beauty', 'stylized-luxury'],
    sofa: ['professional-clean', 'magazine-worthy', 'designer-dream']
  };

  if (!validModes[system].includes(mode)) {
    console.error(`❌ Mode de rendu invalide pour ${system}: ${mode}`);
    console.error(`Modes valides: ${validModes[system].join(', ')}`);
    return false;
  }

  return true;
}

/**
 * Test le système voiture
 */
async function testCarSystem(imagePath: string, renderMode: string): Promise<void> {
  console.log('🚗 TEST SYSTÈME VOITURE');
  console.log('='.repeat(50));
  console.log(`📁 Image: ${imagePath}`);
  console.log(`🎨 Mode: ${renderMode}`);
  console.log('='.repeat(50));

  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));
  formData.append('renderMode', renderMode);

  console.log('\n📤 Envoi de la requête...');
  const startTime = Date.now();

  const response = await fetch(`${API_BASE_URL}/api/clean-car`, {
    method: 'POST',
    body: formData as any,
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Erreur HTTP ${response.status}:`);
    console.error(errorText);
    process.exit(1);
  }

  const result = await response.json();

  console.log(`\n✅ Requête terminée en ${duration}s`);
  console.log('\n📊 RÉSULTATS:');
  console.log('='.repeat(50));
  
  if (result.success) {
    console.log('✅ Succès:', result.success);
    console.log('🖼️  Image générée:', result.generatedImageUrl);
    console.log('📏 Dimensions:', `${result.meta.width}x${result.meta.height}`);
    console.log('📝 Format:', result.meta.format);
    console.log('🚗 Type détecté:', result.meta.spaceType);
    console.log('🎨 Mode utilisé:', result.meta.renderMode);
    console.log('\n📄 Analyse (aperçu):');
    console.log(result.meta.analysisText);
  } else {
    console.log('❌ Échec:', result.error);
    if (result.details) {
      console.log('📝 Détails:', result.details);
    }
  }
  
  console.log('='.repeat(50));
}

/**
 * Test le système canapé
 */
async function testSofaSystem(imagePath: string, renderMode: string): Promise<void> {
  console.log('🛋️  TEST SYSTÈME CANAPÉ');
  console.log('='.repeat(50));
  console.log(`📁 Image: ${imagePath}`);
  console.log(`🎨 Mode: ${renderMode}`);
  console.log('='.repeat(50));

  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));
  formData.append('renderMode', renderMode);

  console.log('\n📤 Envoi de la requête...');
  const startTime = Date.now();

  const response = await fetch(`${API_BASE_URL}/api/clean-sofa`, {
    method: 'POST',
    body: formData as any,
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Erreur HTTP ${response.status}:`);
    console.error(errorText);
    process.exit(1);
  }

  const result = await response.json();

  console.log(`\n✅ Requête terminée en ${duration}s`);
  console.log('\n📊 RÉSULTATS:');
  console.log('='.repeat(50));
  
  if (result.success) {
    console.log('✅ Succès:', result.success);
    console.log('🖼️  Image générée:', result.generatedImageUrl);
    console.log('📏 Dimensions:', `${result.meta.width}x${result.meta.height}`);
    console.log('📝 Format:', result.meta.format);
    console.log('🛋️  Type détecté:', result.meta.spaceType);
    console.log('🎨 Mode utilisé:', result.meta.renderMode);
    console.log('\n📄 Analyse (aperçu):');
    console.log(result.meta.analysisText);
  } else {
    console.log('❌ Échec:', result.error);
    if (result.details) {
      console.log('📝 Détails:', result.details);
    }
  }
  
  console.log('='.repeat(50));
}

/**
 * Fonction principale
 */
async function main() {
  const config = parseArgs();

  if (!validateRenderMode(config.system, config.renderMode)) {
    process.exit(1);
  }

  try {
    if (config.system === 'car') {
      await testCarSystem(config.imagePath, config.renderMode);
    } else {
      await testSofaSystem(config.imagePath, config.renderMode);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter
main();
