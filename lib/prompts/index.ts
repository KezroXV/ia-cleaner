/**
 * Index principal des prompts pour tous les systèmes
 * 
 * Ce module exporte les prompts pour 3 systèmes indépendants:
 * 1. Système général (intérieurs, cuisines, etc.) - via lib/prompts.ts
 * 2. Système voiture (car-prompts)
 * 3. Système canapé (sofa-prompts)
 */

// Système voiture
export * from './car-prompts';

// Système canapé
export * from './sofa-prompts';
