import type { SofaSpaceType, SofaRenderMode } from "../../types/sofa-types";

/**
 * Génère le prompt de nettoyage pour le mode Professional Clean (95% fidélité)
 */
export function getSofaProfessionalCleanPrompt(
  analysis: string,
  spaceType: SofaSpaceType,
): string {
  return `YOU ARE EDITING A SOFA IMAGE - PROFESSIONAL CLEAN MODE (95% FIDELITY)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this EXACT SAME sofa into its professionally cleaned version - 
as if a professional upholstery cleaning service just finished.

**🎯 PRIMARY GOAL - MAXIMUM CLEAN (NON-NEGOTIABLE):**
The before/after must be VISIBLY different. If stains, dark spots, rings, or dirt are still visible in the result, the output FAILS. The goal is to clean the MAXIMUM: every stain GONE, fabric UNIFORMLY clean and fresh. No "slightly improved"—the sofa must look CLEAN. Do NOT preserve stains for realism—REMOVE them completely.

⚠️ PARTIAL VIEW RULE: The image may show ONLY A PART of the sofa or room (e.g. one cushion, back+seat only). Clean and improve ONLY what is VISIBLE in the frame. Do NOT generate, complete, or invent any part that is outside the image or cut by the frame. Do NOT draw missing arms, cushions, or room elements. Preserve the exact same framing—only visible areas become clean.

⚠️ CRITICAL CONSTRAINTS (95% FIDELITY):
- Structure: 100% IDENTICAL (no changes to sofa position, shape, arrangement)
- Positioning: 100% IDENTICAL (pillows, blanket, all elements in same positions)
- Fabric: 100% IDENTICAL (same fabric type, color, pattern)
- BUT: You have 5% freedom for cleanliness and color restoration

## WHAT IS 95% FIDELITY?

This means:
✓ Everything structural must stay EXACTLY the same
✓ Colors can be restored/refreshed (remove dirt that was dulling them)
✓ Fabric can look fresher (like after professional cleaning)
✓ Natural vibrancy can be restored
✗ CANNOT change fabric type, color, pattern, or structure

## ABSOLUTE RULES:

1. STRUCTURE: Keep 100% identical
   - Same sofa position and orientation in room
   - Same arrangement of cushions
   - Same back cushion configuration
   - Same pillow placement and count
   - Same throw blanket position (if applicable)
   - Same sofa legs material and position

2. FABRIC: Keep 100% identical
   - Same fabric type (leather/microsuede/linen/velvet/etc.)
   - Same fabric color and pattern
   - Same texture and weave
   - Same stitching and seams
   - NO material type changes

3. DETAILS: Keep 100% identical
   - Same piping and trim colors
   - Same armrest design
   - Same legs style and material
   - Same any visible damage patterns (acceptable if not "dirty")

4. ROOM CONTEXT: Keep 100% identical (if visible)
   - Same room position
   - Same surrounding furniture
   - Same decor elements
   - Same lighting conditions

5. CLEANLINESS: MAXIMUM - visible transformation required
   - **REMOVE ALL STAINS COMPLETELY**—every dark spot, ring, auréole, discoloration must DISAPPEAR. Do NOT leave stains "slightly faded." They must be GONE.
   - Remove ALL dirt, dust, crumbs, and debris from fabric and between cushions
   - Remove ALL pet hair and visible particles
   - Remove ALL visible marks, spots, and wear patterns that look like dirt
   - Fabric must look UNIFORMLY clean—same shade across the whole surface, no patches or residual marks
   - Make fabric look FRESH and LIKE-NEW (as after a deep professional cleaning)
   - If the "after" looks almost the same as "before," the result is WRONG—push for maximum visible clean

6. COLORS: Restore and refresh (stains removed = cleaner color)
   - Restore natural color vibrancy (remove dulling dirt)
   - Colors can look slightly fresher/more vibrant
   - NO hue changes (blue stays blue, gray stays gray)
   - NO saturation explosion (natural restoration only)
   - Warm/cool tone balance stays identical

7. FABRIC APPEARANCE: Refresh only
   - Fabric can look fresher and softer
   - Pilling can be slightly reduced if present
   - Surface can appear cleaner and brighter
   - But maintain same texture and material appearance

## RESULT CHARACTERISTICS:

- PERFECT CLEANLINESS: Zero visible stains, dirt, debris
- FRESH APPEARANCE: Looks like sofa just had professional cleaning
- AUTHENTIC: Still recognizably the SAME sofa, just impossibly clean
- PROFESSIONAL: Like it just came from an upholstery cleaning service
- PHOTOREALISTIC: Looks like a real photograph, not AI-generated

## BEFORE FINALIZING - VERIFY:

✓ Structure 100% identical (position, arrangement, layout)
✓ **ALL stains GONE—no dark spots, rings, or discoloration remain**
✓ **Fabric is UNIFORMLY clean—visibly different from "before"**
✓ All dirt, dust, debris, pet hair removed
✓ Colors fresh and even (no stain shadows)
✓ Room context 100% identical (if applicable)
✓ **VISIBLE CLEAN CHECK: Would a human see an obvious before/after difference? If not, the result FAILS.**

Think: "This is the SAME photograph after a deep professional cleaning. Every stain is GONE, fabric is uniformly clean and fresh. The before/after difference is OBVIOUS."`;
}

/**
 * Génère le prompt de nettoyage pour le mode Magazine Worthy (85% fidélité)
 */
export function getSofaMagazineWorthyPrompt(
  analysis: string,
  spaceType: SofaSpaceType,
): string {
  return `YOU ARE EDITING A SOFA IMAGE - MAGAZINE WORTHY MODE (85% FIDELITY)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this sofa into a magazine-worthy version - 
professional quality suitable for interior design magazine photography.

**🎯 PRIMARY GOAL - MAXIMUM CLEAN:** The before/after must be VISIBLY different. ALL stains, dark spots, and dirt must be GONE. Fabric must look UNIFORMLY clean. If the result looks almost the same as before, it FAILS.

⚠️ PARTIAL VIEW RULE: Clean and enhance ONLY what is visible in the frame. Do NOT complete or invent out-of-frame parts (e.g. do not add missing cushions or room). Same framing—only visible areas become magazine-worthy.

⚠️ CRITICAL CONSTRAINTS (85% FIDELITY):
- Core Structure: 100% IDENTICAL (sofa position, shape, fabric type)
- BUT: You have 15% freedom for enhancement, staging, and professional photography optimization

## WHAT IS 85% FIDELITY?

This means:
✓ Core structure stays IDENTICAL (sofa position, arrangement, fabric)
✓ Colors can be more vibrant and attractive (saturation +)
✓ Lighting can be optimized for beauty (brighter, warmer, more flattering)
✓ Contrast can be enhanced for visual appeal
✓ Styling can be professionally arranged for composition
✗ CANNOT fundamentally change structure, fabric type, or sofa's identity

## ABSOLUTE RULES:

1. STRUCTURE: Keep 100% identical
   - Same sofa position and orientation
   - Same fundamental arrangement
   - Same sofa type and configuration
   - Same fabric type (leather/microsuede/linen/etc.)

2. POSITIONING: Keep nearly identical
   - Pillows can be arranged artfully (but same positions/area)
   - Throw can be arranged beautifully (but same general placement)
   - Can optimize visual composition (subtle changes only)
   - Cannot move sofa or add/remove elements

3. CLEANLINESS: MAXIMUM - visible transformation
   - REMOVE ALL STAINS COMPLETELY—no dark spots, rings, or discoloration may remain
   - Fabric must look UNIFORMLY clean and fresh (no patches, no residual marks)
   - Remove ALL dirt, debris, pet hair; pristine showroom-quality
   - If "after" looks almost the same as "before," the result FAILS

4. COLORS: Significant enhancement allowed
   - Colors can be more saturated (+20-30% vibrancy)
   - Blacks can be deeper and richer
   - Grays can be more sophisticated
   - Neutrals can be warmer or cooler
   - BUT: Keep same color family
   - NO hue shifts

5. LIGHTING: Significant optimization allowed
   - Can increase overall brightness (+10-15%)
   - Can warm the color temperature (slight shift to warmer)
   - Can adjust shadows for more flattering appearance
   - Can optimize reflections for visual appeal
   - But keep recognizably from same light source

6. CONTRAST: Enhancement allowed
   - Can increase contrast for visual pop (+15-20%)
   - Shadows can be more defined
   - Highlights can be brighter
   - But maintain photographic authenticity

7. STYLING: Professional staging allowed
   - Can optimize throw pillow arrangement for composition
   - Can position throw blanket more artfully
   - Can enhance visual flow and balance
   - But keep all elements recognizably the same

## RESULT CHARACTERISTICS:

- PREMIUM QUALITY: Magazine-worthy finish
- ENHANCED APPEAL: More attractive than real life (but authentically)
- PROFESSIONAL PHOTOGRAPHY: Well-composed, well-lit, well-staged
- STILL RECOGNIZABLE: Clearly the same sofa
- ASPIRING YET BELIEVABLE: "This sofa in a design magazine"

## BEFORE FINALIZING - VERIFY:

✓ Structure 100% identical
✓ **ALL stains GONE—fabric uniformly clean, visibly different from "before"**
✓ All dirt/debris removed
✓ Colors more vibrant but same families
✓ Lighting optimized but still recognizable
✓ Contrast enhanced for visual appeal
✓ Staging professionally arranged
✓ Professional photography quality
✓ Would work in magazine context

Think: "This is the same sofa, professionally detailed and photographed by an interior 
design magazine photographer. Beautiful, aspirational, but undeniably authentic."`;
}

/**
 * Génère le prompt de nettoyage pour le mode Designer Dream (70% fidélité)
 */
export function getSofaDesignerDreamPrompt(
  analysis: string,
  spaceType: SofaSpaceType,
): string {
  return `YOU ARE EDITING A SOFA IMAGE - DESIGNER DREAM MODE (70% FIDELITY)

ORIGINAL IMAGE DETAILED ANALYSIS:
${analysis}

YOUR TASK: Transform this sofa into a designer dream version - 
aspirational, beautiful, and conceptual (like luxury lifestyle photography on Pinterest).

**🎯 PRIMARY GOAL - MAXIMUM CLEAN:** ALL stains and dirt must be GONE. Fabric must look pristine and UNIFORMLY clean. The before/after difference must be OBVIOUS. No residual stains or patches.

⚠️ PARTIAL VIEW RULE: Clean and stylize ONLY what is visible in the frame. Do NOT complete or invent out-of-frame parts. Same framing—only visible areas become designer-dream quality.

⚠️ CRITICAL CONSTRAINTS (70% FIDELITY):
- Core identity: RECOGNIZABLE (must still be clearly this sofa)
- BUT: You have 30% freedom for creative transformation

## WHAT IS 70% FIDELITY?

This means:
✓ Core sofa is recognizable (same type, shape, general arrangement)
✓ Colors can be completely reimagined (very saturated, very vibrant, very beautiful)
✓ Lighting can be cinematic and dramatic (think professional styled shoot)
✓ Overall aesthetic can be transformed to aspirational lifestyle
✗ CANNOT lose core identity (if it's a gray sectional, it stays a sectional)

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
   - Think: Professional styled shoot lighting

3. STYLING & COMPOSITION: Significant enhancement
   - Can optimize pillow and throw arrangement for visual impact
   - Can adjust minor positioning for better aesthetics (very subtle)
   - Can enhance reflections and highlights dramatically
   - Can add subtle luxury atmosphere
   - Can optimize visual flow and balance

4. ATMOSPHERE: Create aspirational lifestyle mood
   - Premium, aspirational, beautiful
   - Luxury brand shoot quality
   - Aspirational yet believable
   - Instagram/Pinterest aesthetic

## ABSOLUTE RULES (WHAT MUST STAY IDENTICAL):

✓ Core structure recognizable:
  - Same sofa type (sectional/straight/curved)
  - Sofa positioned in same general area
  - Same fabric type (leather/fabric/suede)
  - Sofa clearly recognizable as this sofa

✓ CANNOT:
  - Add completely different elements
  - Remove fundamental structure
  - Change sofa into different type/style
  - Add new furniture (only style what's there)

## WHAT TO FOCUS ON (IN ORDER OF PRIORITY):

1. PERFECTION LEVEL: Absolutely spotless—ALL stains GONE, fabric UNIFORMLY clean (no dark spots, rings, or patches). Visible before/after difference required.
2. COLOR BEAUTY: Make colors gorgeous, saturated, and cohesive
3. LIGHTING QUALITY: Professional styled shoot quality lighting
4. ATMOSPHERIC MOOD: Luxury, aspirational, beautiful, dreamlike
5. VISUAL IMPACT: Pinterest-worthy, Instagram-worthy, aspirational

## RESULT CHARACTERISTICS:

- ASPIRATIONAL: Makes viewer think "I want this"
- LUXURY LIFESTYLE: Feels premium and high-end
- PHOTOGRAPHIC PERFECTION: Impeccably shot and edited
- BEAUTIFUL: Colors, lighting, composition all optimized
- RECOGNIZABLE: Clearly this sofa, but idealized version

## BEFORE FINALIZING - VERIFY:

✓ Core sofa recognizable (still same sofa)
✓ Absolutely pristine and spotless
✓ Colors gorgeous and vibrant
✓ Lighting professional and cinematic
✓ Atmosphere luxury lifestyle
✓ Styling beautiful and aspirational
✓ Would work well on Instagram/Pinterest
✓ Aspirational yet believable

Think: "This is the sofa's best possible self - the version that makes you dream about 
having it in your home. Aspirational, beautiful, luxury lifestyle, but unmistakably this sofa."`;
}

/**
 * Dispatcher principal pour les prompts de génération canapé
 */
export function getSofaGenerationPrompt(
  mode: SofaRenderMode,
  analysis: string,
  spaceType: SofaSpaceType,
): string {
  switch (mode) {
    case "professional-clean":
      return getSofaProfessionalCleanPrompt(analysis, spaceType);
    case "magazine-worthy":
      return getSofaMagazineWorthyPrompt(analysis, spaceType);
    case "designer-dream":
      return getSofaDesignerDreamPrompt(analysis, spaceType);
    default:
      throw new Error(`Mode de rendu canapé inconnu: ${mode}`);
  }
}
