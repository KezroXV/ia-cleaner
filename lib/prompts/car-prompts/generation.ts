import type { CarSpaceType, CarRenderMode } from '../../types/car-types';

/**
 * Génère le prompt de nettoyage pour le mode Perfect Clean (92% fidélité)
 */
export function getCarPerfectCleanPrompt(
  analysis: string,
  spaceType: CarSpaceType
): string {
  return `YOU ARE EDITING A CAR INTERIOR IMAGE - PERFECT CLEAN MODE (75% FIDELITY - SHOWROOM STANDARD)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this EXACT SAME car interior into its SHOWROOM-PERFECT version - 
as if it's a brand new Mercedes displayed in a luxury dealership.

**REFERENCE STANDARD**: Think of a pristine Mercedes-Benz showroom interior where:
- Every surface is immaculate and gleaming
- Floor mats are ABSOLUTELY spotless (not a single speck)
- Leather seats are perfectly clean and slightly glossy
- Dashboard is pristine with no dust
- Everything looks like it's never been used
- Professional photography lighting quality

⚠️ CRITICAL CONSTRAINTS (75% FIDELITY - SHOWROOM STANDARD):
- Structure: 100% IDENTICAL (no changes to layout, positions, seats)
- Perspective: 100% IDENTICAL (same camera angle, composition)
- Materials: 100% IDENTICAL (same materials, textures, finishes)
- BUT: You have 25% freedom for achieving SHOWROOM PERFECTION cleanliness

## WHAT IS 75% FIDELITY (SHOWROOM STANDARD)?

This means:
✓ Everything structural must stay EXACTLY the same
✓ MAXIMUM CLEANING FREEDOM to achieve showroom perfection
✓ Colors can be enhanced to look fresh and new (like factory-fresh condition)
✓ Contrast and brightness optimized for luxury showroom appearance
✓ Surfaces can look slightly more polished/glossy (showroom finish)
✓ Floor mats must be ABSOLUTELY PRISTINE (zero tolerance for dirt)
✗ CANNOT change structure, layout, positioning, or fundamental car identity

## ABSOLUTE RULES:

1. STRUCTURE: Keep 100% identical
   - Same steering wheel angle and position
   - Same seat positions and recline angles
   - Same dashboard layout and fixtures
   - Same door panels and interior trim positions
   - Same window tint level and exterior view

2. MATERIALS: Keep 100% identical
   - Same seat fabric/leather type and color
   - Same dashboard material and finish
   - Same floor mat material and pattern
   - Same headliner material and color
   - Same steering wheel material and grip
   - NO material type changes whatsoever

3. POSITIONING: Keep 100% identical
   - All elements in exact same positions
   - No moving, removing, or adding items
   - No rearranging of objects

4. CLEANLINESS: Improve dramatically
   - Remove ALL visible dirt, dust, particles (every crumb, miette, speck)
   - Remove all stains, spills, dried marks
   - Remove pet hair completely
   - Clean all surfaces until they look fresh
   - Remove all debris between seats and in crevices
   - Clean windows inside (remove condensation, dust, smudges)
   - Clean dashboard until pristine
   - Clean steering wheel until immaculate
   
   **⚠️⚠️⚠️ FLOOR MATS - ULTRA-CRITICAL CLEANING REQUIREMENT ⚠️⚠️⚠️**
   
   Floor mats and carpets MUST be ABSOLUTELY PERFECT - SHOWROOM BLACK:
   
   **ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:**
   - Remove EVERY SINGLE crumb, miette, particle (NOT ONE can remain)
   - Remove EVERY grain of sand, pebble, debris, speck
   - Remove ALL dust from between the grooves and ridges of rubber mats
   - Remove ALL dirt embedded in textile mat fibers
   - Remove ALL stains and discoloration from mats
   - Remove ALL mud, water marks, dried spills from mats
   - Clean the edges and corners of mats where dirt accumulates
   - Clean the area UNDER the mats if visible (carpet underneath)
   
   **COLOR CORRECTION FOR FLOOR MATS - CRITICAL:**
   - Make floor mats DARKER and more saturated (deep black/dark gray)
   - Increase contrast to make mats look DEEP and CLEAN
   - If mats are black/dark: make them RICH, DEEP BLACK (like new)
   - If mats are gray: make them DARKER, more saturated gray
   - Remove any lightening or fading from dirt (restore dark color)
   - Floor mats should look DARK and PRISTINE (showroom-black)
   
   **ZERO TOLERANCE - MIETTES/CRUMBS:**
   ⚠️ NOT A SINGLE MIETTE OR CRUMB can be visible on floor mats
   ⚠️ Scan every millimeter of the mat surface
   ⚠️ Remove even the tiniest white/light particles
   ⚠️ Floor mats must be UNIFORMLY DARK with ZERO light specks
   
   Floor cleaning verification:
   ✓ ZERO particles visible on mat surface (count: 0)
   ✓ ZERO crumbs or miettes (not even tiny ones)
   ✓ No dirt in mat grooves or ridges
   ✓ No embedded dirt in fibers
   ✓ No stains or discoloration
   ✓ Mats are DARK and DEEP in color (black/dark gray)
   ✓ Mats look factory-fresh and PRISTINE
   
Think: "These floor mats are SHOWROOM-PERFECT like in a luxury Mercedes dealership. 
They look BRAND NEW, factory-fresh, DEEP BLACK/DARK, as if just unpackaged. 
NOT A SINGLE MIETTE, CRUMB, or particle is visible. They are ABSOLUTELY 
IMMACULATE with a pristine, professional finish. The kind of perfection you see 
in luxury car advertisements."

**VISUAL REFERENCE**: Imagine Mercedes-AMG showroom quality - THAT level of perfection.
- Floor mats: DEEP BLACK/DARK, PRISTINE, ZERO miettes, ZERO particles, ZERO dust
- Floor mats: DARKER color saturation (rich, deep black or dark gray)
- All surfaces: Gleaming, spotless, showroom-ready
- Overall impression: "This car has never been driven"

**FLOOR MAT PERFECTION STANDARD:**
🔲 Deep, dark color (black/dark gray - not faded)
🔲 ZERO light specks or particles visible
🔲 ZERO crumbs or miettes (not even tiny ones)
🔲 Uniformly clean surface
🔲 Showroom-black finish

5. COLORS: Enhancement allowed for cleanliness
   - Black surfaces (especially floor mats): Make DEEPER and RICHER
   - Floor mats: Make DARKER, more saturated (deep black/dark gray)
   - Other colors: Can become more vibrant (restore what dirt was hiding)
   - NO hue changes (blue stays blue, gray stays gray)
   - Floor mats should look PRISTINE and DARK (showroom-black)
   - Warm/cool tone balance stays identical
   
   **SPECIAL ATTENTION - FLOOR MAT COLORS:**
   - If black mats: Make them DEEP BLACK (not gray-ish)
   - If dark gray mats: Make them DARKER, richer gray
   - Remove any lightening effect from dirt/dust
   - Mats should be uniformly DARK with no light patches

6. LIGHTING: Keep 100% identical
   - Same sunlight direction and intensity
   - Same shadows (positions, softness, direction)
   - Same overall brightness
   - NO artificial lighting changes
   - NO glare or hotspot changes

## RESULT CHARACTERISTICS:

- SHOWROOM PERFECTION: Like a brand new luxury car in a Mercedes dealership
- ABSOLUTE CLEANLINESS: Not a single speck of dust, dirt, or particle anywhere
- PRISTINE SURFACES: Every surface gleaming and immaculate
- LUXURY STANDARD: Mercedes-Benz/AMG level of perfection
- FLOOR MATS PERFECTION: Absolutely spotless, factory-fresh appearance
- LEATHER GLEAM: Seats slightly glossy, perfectly clean (if leather)
- PHOTOREALISTIC: Looks like professional dealership photography
- AUTHENTIC: Still recognizably the SAME car, just showroom-perfect

## BEFORE FINALIZING - VERIFY:

✓ Structure 100% identical (layout, positions, angles)
✓ All dirt/dust/particles completely removed
✓ All stains removed
✓ All pet hair removed
✓ **FLOOR MATS ABSOLUTELY SPOTLESS - ZERO miettes/crumbs/particles**
✓ **Floor mats are DARK and DEEP in color (black/dark gray)**
✓ **NO light specks or particles visible on mats**
✓ **Floor mat grooves/ridges completely clean - NO dirt**
✓ **No embedded dirt in mat fibers - 100% clean**
✓ **Floor mat edges and corners pristine**
✓ **Mats look UNIFORMLY DARK and PRISTINE**
✓ Colors slightly accentuated but same hues
✓ Lighting 100% identical
✓ Materials 100% identical
✓ Result is recognizably the SAME car interior, just pristinely clean
✓ Would pass a "before/after" comparison perfectly

Think: "This is the SAME car interior, but now it looks like a brand new Mercedes-Benz 
in a luxury showroom. SHOWROOM PERFECTION - the kind of cleanliness you see in 
high-end car dealerships where every detail is immaculate. Floor mats are PRISTINE 
(zero dust), leather gleams, surfaces sparkle. The 'never been driven' level of clean."`;
}

/**
 * Génère le prompt de nettoyage pour le mode Enhanced Beauty (85% fidélité)
 */
export function getCarEnhancedBeautyPrompt(
  analysis: string,
  spaceType: CarSpaceType
): string {
  return `YOU ARE EDITING A CAR INTERIOR IMAGE - ENHANCED BEAUTY MODE (85% FIDELITY)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this car interior into LUXURY SHOWROOM PERFECTION - 
professional quality suitable for premium marketing/magazine photography.

**REFERENCE STANDARD**: Mercedes-Benz AMG showroom level - ABSOLUTE PERFECTION.
Every surface must be IMMACULATE, floor mats PRISTINE, lighting optimized for luxury appeal.

⚠️ CRITICAL CONSTRAINTS (85% FIDELITY):
- Structure: 100% IDENTICAL (no changes to fundamental layout)
- BUT: You have 15% freedom for enhancement, cosmetic improvements, and photography optimization

## WHAT IS 85% FIDELITY?

This means:
✓ Core structure stays IDENTICAL (steering wheel, seats, dashboard positions)
✓ Colors can be more vibrant and attractive (saturation +)
✓ Lighting can be optimized for beauty (brighter, warmer, more flattering)
✓ Contrast can be enhanced for visual appeal
✓ Minor composition improvements for photographic quality
✗ CANNOT fundamentally change structure, layout, or the car's identity

## ABSOLUTE RULES:

1. STRUCTURE: Keep 100% identical
   - Same steering wheel angle and position
   - Same seat positions and arrangement
   - Same dashboard layout
   - Same interior dimensions
   - Same window tint and exterior view

2. MATERIALS: Keep 100% identical
   - Same material types (leather, fabric, plastic)
   - Same material colors and patterns
   - NO material type changes

3. POSITIONING: Keep 100% identical
   - All elements in exact same positions
   - NO moving or removing items

4. CLEANLINESS: Perfect
   - Remove ALL dirt, dust, stains, debris, pet hair
   - Pristine, showroom-quality finish
   
   **⚠️⚠️⚠️ FLOOR MATS - ULTRA-CRITICAL CLEANING REQUIREMENT ⚠️⚠️⚠️**
   
   Floor mats and carpets MUST be ABSOLUTELY PERFECT - SHOWROOM BLACK:
   
   **ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:**
   - Remove EVERY SINGLE crumb, miette, particle (NOT ONE can remain)
   - Remove EVERY grain of sand, pebble, debris, speck
   - Remove ALL dust from between the grooves and ridges of rubber mats
   - Remove ALL dirt embedded in textile mat fibers
   - Remove ALL stains and discoloration from mats
   - Remove ALL mud, water marks, dried spills from mats
   - Clean the edges and corners of mats where dirt accumulates
   - Clean the area UNDER the mats if visible (carpet underneath)
   
   **COLOR CORRECTION FOR FLOOR MATS - CRITICAL:**
   - Make floor mats DARKER and more saturated (deep black/dark gray)
   - Increase contrast to make mats look DEEP and CLEAN
   - If mats are black/dark: make them RICH, DEEP BLACK (like new)
   - If mats are gray: make them DARKER, more saturated gray
   - Remove any lightening or fading from dirt (restore dark color)
   - Floor mats should look DARK and PRISTINE (showroom-black)
   
   **ZERO TOLERANCE - MIETTES/CRUMBS:**
   ⚠️ NOT A SINGLE MIETTE OR CRUMB can be visible on floor mats
   ⚠️ Scan every millimeter of the mat surface
   ⚠️ Remove even the tiniest white/light particles
   ⚠️ Floor mats must be UNIFORMLY DARK with ZERO light specks
   
   Floor cleaning verification:
   ✓ ZERO particles visible on mat surface (count: 0)
   ✓ ZERO crumbs or miettes (not even tiny ones)
   ✓ No dirt in mat grooves or ridges
   ✓ No embedded dirt in fibers
   ✓ No stains or discoloration
   ✓ Mats are DARK and DEEP in color (black/dark gray)
   ✓ Mats look factory-fresh and PRISTINE

5. COLORS: Significant enhancement allowed (ESPECIALLY FLOOR MATS)
   - Colors can be more saturated (+20-30% vibrancy)
   - Blacks can be deeper and richer
   - Grays can be more sophisticated
   - Browns can be warmer
   - Blues can be more vivid
   - BUT: Keep same color family (blue stays blue, not purple)
   - NO hue shifts

6. LIGHTING: Significant optimization allowed
   - Can increase overall brightness (+10-15%)
   - Can warm the color temperature (slight shift to warmer)
   - Can adjust shadows for more flattering appearance
   - Can optimize reflections for visual appeal
   - But keep recognizably from same light source

7. CONTRAST: Enhancement allowed
   - Can increase contrast for visual pop (+15-20%)
   - Shadows can be more defined
   - Highlights can be brighter
   - But maintain photographic authenticity

## RESULT CHARACTERISTICS:

- PREMIUM QUALITY: Magazine-worthy finish
- ENHANCED APPEAL: More attractive than real life (but authentically)
- PROFESSIONAL PHOTOGRAPHY: Well-composed, well-lit, well-edited
- STILL RECOGNIZABLE: Clearly the same car interior
- ASPIRING YET BELIEVABLE: "This could be real, just beautifully photographed"

## BEFORE FINALIZING - VERIFY:

✓ Structure 100% identical
✓ All dirt/particles/stains removed
✓ **FLOOR MATS ABSOLUTELY SPOTLESS - ZERO miettes/crumbs/particles**
✓ **Floor mats are DARK and DEEP in color (black/dark gray)**
✓ **NO light specks or particles visible on mats**
✓ **Floor mat grooves/ridges completely clean - NO dirt**
✓ **No embedded dirt in mat fibers - 100% clean**
✓ Colors more vibrant but same families
✓ Lighting optimized but still recognizable
✓ Contrast enhanced for visual appeal
✓ Professional photography quality
✓ Would work in marketing/magazine context

Think: "This is SHOWROOM PERFECTION - like a Mercedes-Benz in a luxury dealership, 
photographed for premium marketing. Floor mats are ABSOLUTELY SPOTLESS, leather gleams, 
surfaces sparkle. The 'magazine cover' level of perfection with enhanced colors and lighting."`;
}

/**
 * Génère le prompt de nettoyage pour le mode Stylized Luxury (70% fidélité)
 */
export function getCarStylizedLuxuryPrompt(
  analysis: string,
  spaceType: CarSpaceType
): string {
  return `YOU ARE EDITING A CAR INTERIOR IMAGE - STYLIZED LUXURY MODE (70% FIDELITY)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this car interior into ULTIMATE LUXURY PERFECTION - 
aspirational, beautiful, showroom-perfect (like premium Mercedes-AMG marketing photography).

**REFERENCE STANDARD**: The most pristine luxury car showroom you can imagine.
Absolutely IMMACULATE - floor mats PERFECT, every surface gleaming, zero imperfections.

⚠️ CRITICAL CONSTRAINTS (70% FIDELITY):
- Core identity: RECOGNIZABLE (must still be clearly this car)
- BUT: You have 30% freedom for creative transformation

## WHAT IS 70% FIDELITY?

This means:
✓ Core layout stays recognizable (steering wheel, seats, basic dashboard are the same)
✓ Colors can be completely reimagined (very saturated, very vibrant, very beautiful)
✓ Lighting can be cinematic and dramatic (think professional photo shoot)
✓ Overall aesthetic can be transformed to luxury lifestyle
✗ CANNOT lose core identity (if it's a 2020 sedan, it stays a 2020 sedan)

## CREATIVE FREEDOM AREAS:

1. COLORS: Maximum enhancement
   - Colors can be very saturated and vibrant
   - Can shift slightly warmer or cooler for mood
   - Can emphasize certain colors for aesthetic
   - Create cohesive, beautiful color palette
   - Think: Instagram-perfect, Pinterest-gorgeous

2. LIGHTING: Cinematic freedom
   - Can adjust brightness for drama/mood
   - Can warm or cool the light temperature significantly
   - Can add subtle atmospheric effects
   - Can optimize shadows for visual interest
   - Think: Professional product photography lighting

3. STYLING: Significant enhancement
   - Can optimize composition for visual impact
   - Can adjust minor positioning for better aesthetics (very subtle)
   - Can enhance reflections and highlights dramatically
   - Can add subtle luxury atmosphere

4. ATMOSPHERE: Create luxury lifestyle mood
   - Premium, aspirational, beautiful
   - Luxury brand photo shoot quality
   - Aspirational yet believable
   - Instagram/Pinterest aesthetic

## ABSOLUTE RULES (WHAT MUST STAY IDENTICAL):

✓ Core structure recognizable:
  - Same car type and generation
  - Steering wheel still in same general position
  - Seats still arranged the same way
  - Dashboard recognizably the same
  - Interior recognizably the same car

✓ CANNOT:
  - Add completely new elements
  - Remove fundamental structure
  - Change car into different model

## WHAT TO FOCUS ON (IN ORDER OF PRIORITY):

1. PERFECTION LEVEL: Absolutely spotless, impeccable cleanliness
   
   **⚠️⚠️⚠️ FLOOR MATS - ULTRA-CRITICAL CLEANING REQUIREMENT ⚠️⚠️⚠️**
   
   Floor mats and carpets MUST be ABSOLUTELY PERFECT - SHOWROOM BLACK:
   
   **ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:**
   - Remove EVERY SINGLE crumb, miette, particle (NOT ONE can remain)
   - Remove EVERY grain of sand, pebble, debris, speck
   - Remove ALL dust from between the grooves and ridges of rubber mats
   - Remove ALL dirt embedded in textile mat fibers
   - Remove ALL stains and discoloration from mats
   - Remove ALL mud, water marks, dried spills from mats
   - Clean the edges and corners of mats where dirt accumulates
   - Clean the area UNDER the mats if visible (carpet underneath)
   
   **COLOR CORRECTION FOR FLOOR MATS - CRITICAL:**
   - Make floor mats DARKER and more saturated (deep black/dark gray)
   - Increase contrast to make mats look DEEP and CLEAN
   - If mats are black/dark: make them RICH, DEEP BLACK (like new)
   - If mats are gray: make them DARKER, more saturated gray
   - Remove any lightening or fading from dirt (restore dark color)
   - Floor mats should look DARK and PRISTINE (showroom-black)
   
   **ZERO TOLERANCE - MIETTES/CRUMBS:**
   ⚠️ NOT A SINGLE MIETTE OR CRUMB can be visible on floor mats
   ⚠️ Scan every millimeter of the mat surface
   ⚠️ Remove even the tiniest white/light particles
   ⚠️ Floor mats must be UNIFORMLY DARK with ZERO light specks
   
   Floor cleaning verification:
   ✓ ZERO particles visible on mat surface (count: 0)
   ✓ ZERO crumbs or miettes (not even tiny ones)
   ✓ No dirt in mat grooves or ridges
   ✓ No embedded dirt in fibers
   ✓ No stains or discoloration
   ✓ Mats are DARK and DEEP in color (black/dark gray)
   ✓ Mats look factory-fresh and PRISTINE

2. COLOR BEAUTY: Make colors gorgeous and cohesive (floor mats MUST be DARK)
3. LIGHTING QUALITY: Professional photo shoot quality lighting
4. ATMOSPHERIC MOOD: Luxury, aspirational, beautiful
5. VISUAL IMPACT: Instagram/Pinterest worthy

## RESULT CHARACTERISTICS:

- ASPIRATIONAL: Makes viewer think "I want this"
- LUXURY LIFESTYLE: Feels premium and high-end
- PHOTOGRAPHIC PERFECTION: Impeccably shot and edited
- BEAUTIFUL: Colors, lighting, composition all optimized
- RECOGNIZABLE: Clearly this car, but idealized version

## BEFORE FINALIZING - VERIFY:

✓ Core structure recognizable (still same car)
✓ Absolutely pristine and spotless
✓ **FLOOR MATS ABSOLUTELY SPOTLESS - ZERO miettes/crumbs/particles**
✓ **Floor mats are DARK and DEEP in color (black/dark gray)**
✓ **NO light specks or particles visible on mats**
✓ **Floor mat grooves/ridges completely clean - NO dirt**
✓ **No embedded dirt in mat fibers - 100% clean**
✓ Colors gorgeous and vibrant
✓ Lighting professional and cinematic
✓ Atmosphere luxury lifestyle
✓ Would work well on Instagram/Pinterest
✓ Aspirational yet believable

Think: "This is SHOWROOM PERFECTION at its peak - the version you see in Mercedes-AMG 
marketing materials. ABSOLUTELY PRISTINE floor mats (zero dust), gleaming surfaces, 
luxury perfection. The 'dream car' visualization that makes you want to own it immediately."`;
}

/**
 * Dispatcher principal pour les prompts de génération voiture
 */
export function getCarGenerationPrompt(
  mode: CarRenderMode,
  analysis: string,
  spaceType: CarSpaceType
): string {
  switch (mode) {
    case "perfect-clean":
      return getCarPerfectCleanPrompt(analysis, spaceType);
    case "enhanced-beauty":
      return getCarEnhancedBeautyPrompt(analysis, spaceType);
    case "stylized-luxury":
      return getCarStylizedLuxuryPrompt(analysis, spaceType);
    default:
      throw new Error(`Mode de rendu voiture inconnu: ${mode}`);
  }
}
