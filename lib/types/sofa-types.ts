/**
 * Types spécialisés pour le système de nettoyage de canapés
 * Système INDÉPENDANT du système général
 */

// Types d'espaces de canapés
export type SofaSpaceType = 
  | "sofa"                // Canapé isolé
  | "sofa-living-room"    // Canapé dans salon
  | "living-room-full"    // Salon complet avec canapé
  | "armchair";           // Fauteuil

// Modes de rendu spécialisés pour canapé (NOMS SPÉCIALISÉS)
export type SofaRenderMode = 
  | "professional-clean"  // 95% fidelity - Nettoyage professionnel
  | "magazine-worthy"     // 85% fidelity - Magazine décoration intérieure
  | "designer-dream";     // 70% fidelity - Concept-dream Pinterest

// Cibles de fidélité pour canapé
export const SOFA_FIDELITY_TARGETS: Record<SofaRenderMode, number> = {
  "professional-clean": 0.95,   // 95% - Structure 100% identique, couleurs restaurées
  "magazine-worthy": 0.85,      // 85% - Staging + amélioration esthétique
  "designer-dream": 0.70,       // 70% - Créativité maximale
} as const;

// Configuration de temperature pour Gemini selon le mode
export const SOFA_GENERATION_CONFIG: Record<SofaRenderMode, {
  temperature: number;
  topK: number;
  topP: number;
}> = {
  "professional-clean": {
    temperature: 0.05,  // Ultra-cohérent, très fidèle
    topK: 15,           // Limiter les variations maximalement
    topP: 0.75,         // Probabilité basse
  },
  "magazine-worthy": {
    temperature: 0.15,  // Légère créativité
    topK: 30,           // Liberté modérée
    topP: 0.85,         // Probabilité moyenne
  },
  "designer-dream": {
    temperature: 0.35,  // Créativité élevée
    topK: 45,           // Beaucoup de choix
    topP: 0.95,         // Probabilité haute
  },
} as const;

// Messages explicatifs pour chaque mode
export const SOFA_MODE_DESCRIPTIONS: Record<SofaRenderMode, {
  name: string;
  description: string;
  useCase: string;
}> = {
  "professional-clean": {
    name: "Professional Clean",
    description: "Nettoyage professionnel : canapé impeccablement nettoyé avec couleurs restaurées comme à la sortie de l'usine. Aspect ultra-frais, naturel et authentique.",
    useCase: "Services de nettoyage, avant/après, annonces immobilières, location",
  },
  "magazine-worthy": {
    name: "Magazine Worthy",
    description: "Style magazine décoration : nettoyage complet + staging professionnel, couleurs vibrantes et attractives, éclairage optimisé, composition beautifully styled.",
    useCase: "Marketing immobilier premium, magazines décoration, catalogues, portfolios",
  },
  "designer-dream": {
    name: "Designer Dream",
    description: "Version rêve : transformation créative avec couleurs saturées et vibrantes, éclairage cinématique, style aspirationnel Pinterest-perfect pour l'inspiration.",
    useCase: "Social media, Instagram, Pinterest, inspiration design, portfolio lifestyle",
  },
} as const;
