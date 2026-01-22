/**
 * Types spécialisés pour le système de nettoyage automobile
 * Système INDÉPENDANT du système général
 */

// Types d'espaces automobiles
export type CarSpaceType = 
  | "car-interior-full"   // Habitacle complet
  | "car-seats"           // Sièges uniquement
  | "car-dashboard"       // Tableau de bord et volant
  | "car-trunk";          // Coffre

// Modes de rendu spécialisés pour voiture (NOMS SPÉCIALISÉS)
export type CarRenderMode = 
  | "perfect-clean"       // 75% fidelity - SHOWROOM PERFECTION (Mercedes-level clean)
  | "enhanced-beauty"     // 85% fidelity - Amélioration éclairage & composition
  | "stylized-luxury";    // 70% fidelity - Transformation créative luxe

// Cibles de fidélité pour voiture
export const CAR_FIDELITY_TARGETS: Record<CarRenderMode, number> = {
  "perfect-clean": 0.75,      // 75% - SHOWROOM STANDARD - Maximum cleaning freedom
  "enhanced-beauty": 0.85,    // 85% - Plus de liberté sur lumière/couleur
  "stylized-luxury": 0.70,    // 70% - Créativité maximale
} as const;

// Configuration de temperature pour Gemini selon le mode
export const CAR_GENERATION_CONFIG: Record<CarRenderMode, {
  temperature: number;
  topK: number;
  topP: number;
}> = {
  "perfect-clean": {
    temperature: 0.1,   // Très cohérent, fidèle
    topK: 20,           // Limiter les variations
    topP: 0.8,          // Probable modérée
  },
  "enhanced-beauty": {
    temperature: 0.2,   // Légère créativité
    topK: 25,           // Liberté modérée
    topP: 0.85,         // Probabilité moyenne
  },
  "stylized-luxury": {
    temperature: 0.4,   // Créativité maximale
    topK: 40,           // Beaucoup de choix
    topP: 0.95,         // Probabilité haute
  },
} as const;

// Messages explicatifs pour chaque mode
export const CAR_MODE_DESCRIPTIONS: Record<CarRenderMode, {
  name: string;
  description: string;
  useCase: string;
}> = {
  "perfect-clean": {
    name: "Perfect Clean - Showroom Standard",
    description: "SHOWROOM PERFECTION - Comme une Mercedes neuve dans un showroom de luxe. Tapis ABSOLUMENT immaculés, surfaces impeccables, zéro poussière. Niveau de propreté 'jamais utilisé'.",
    useCase: "Services de nettoyage premium, photos showroom, annonces haut de gamme",
  },
  "enhanced-beauty": {
    name: "Enhanced Beauty",
    description: "Amélioration premium : éclairage optimisé, couleurs vibrantes et attractives, composition professionnelle. Style magazine haute gamme.",
    useCase: "Marketing immobilier premium, brochures, catalogues, présentations",
  },
  "stylized-luxury": {
    name: "Stylized Luxury",
    description: "Transformation créative : version de rêve de la voiture avec couleurs saturées, éclairage cinématique, esthétique aspirationnelle et conceptuelle.",
    useCase: "Social media, Pinterest, inspiration design, portfolio, lifestyle",
  },
} as const;
