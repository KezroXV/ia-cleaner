import type { CarSpaceType } from "../../types/car-types";

/**
 * Prompt de détection du type d'espace automobile
 */
export function getCarSpaceTypeDetectionPrompt(): string {
  return `Analyze this car image and determine the TYPE OF CAR SPACE shown.

⚠️ PARTIAL VIEWS: The image may show ONLY A PART of the car (e.g. just the floor and mats, one seat base, door sill, seat rails). Still choose the type that best fits what is visible. Do NOT require the full cabin to be visible.

Respond with ONLY ONE of these exact values:

- "car-interior-full" - Full car interior/cabin view OR partial cabin (floor only, floor+seat, door panel, etc.)
- "car-seats" - Car seats (full or partial: one seat, seat base, seat back, rails)
- "car-dashboard" - Dashboard and steering wheel area (full or partial: wheel only, console only)
- "car-trunk" - Trunk or boot of the car

Respond with ONLY the type value, nothing else.`;
}

/**
 * Normalise la réponse de détection du type d'espace automobile
 */
export function normalizeCarSpaceType(response: string): CarSpaceType {
  const normalized = response.trim().toLowerCase();

  if (
    normalized.includes("interior") &&
    !normalized.includes("dash") &&
    !normalized.includes("seat") &&
    !normalized.includes("trunk")
  ) {
    return "car-interior-full";
  }
  if (normalized.includes("seat")) {
    return "car-seats";
  }
  if (normalized.includes("dash")) {
    return "car-dashboard";
  }
  if (normalized.includes("trunk") || normalized.includes("boot")) {
    return "car-trunk";
  }

  // Par défaut, retourner interior-full
  return "car-interior-full";
}
