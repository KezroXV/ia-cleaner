import type { SofaSpaceType } from "../../types/sofa-types";

/**
 * Prompt de détection du type d'espace canapé/salon
 */
export function getSofaSpaceTypeDetectionPrompt(): string {
  return `Analyze this sofa image and determine the TYPE OF SEATING SPACE shown.

⚠️ PARTIAL VIEWS: The image may show ONLY A PART of the sofa or room (e.g. one cushion, back+seat only, arm only, close-up of fabric, corner of room). Still choose the type that best fits what is visible. Do NOT require the full sofa or full room to be visible.

Respond with ONLY ONE of these exact values:

- "sofa" - Single sofa or couch (full OR partial: one cushion, back+seat, arm, close-up)
- "sofa-living-room" - Sofa as main element in a living room (can be partial view)
- "living-room-full" - Full living room with sofa, furniture, and decor
- "armchair" - Single armchair or accent chair (full or partial)

Respond with ONLY the type value, nothing else.`;
}

/**
 * Normalise la réponse de détection du type d'espace canapé
 */
export function normalizeSofaSpaceType(response: string): SofaSpaceType {
  const normalized = response.trim().toLowerCase();

  if (normalized.includes("full") && normalized.includes("room")) {
    return "living-room-full";
  }
  if (normalized.includes("living") && normalized.includes("room")) {
    return "sofa-living-room";
  }
  if (normalized.includes("armchair")) {
    return "armchair";
  }
  if (normalized.includes("sofa") || normalized.includes("couch")) {
    return "sofa";
  }

  // Par défaut, retourner sofa
  return "sofa";
}
