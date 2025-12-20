export type PromptType = "realistic" | "marketing" | "stylized";

/**
 * Prompt d'analyse ultra-détaillé pour Gemini Vision
 */
export function getAnalysisPrompt(): string {
  return `Analyze this image in EXTREME DETAIL to enable identical reconstruction after cleaning.

## 1. CAMERA & PERSPECTIVE

- Camera angle (eye level / high angle / low angle / bird's eye)
- Distance from subject (close-up / medium / wide shot)
- Lens characteristics and field of view
- Depth of field (what's in focus, what's blurred)
- Composition (rule of thirds, symmetry, leading lines)
- Vanishing points and perspective lines

## 2. ARCHITECTURAL STRUCTURE

- Room dimensions (estimated measurements)
- Ceiling height and type (flat / vaulted / exposed beams)
- Wall positions, angles, and relationships
- Windows: exact positions, sizes, types (sliding / casement / fixed)
- Doors: locations, sizes, types, opening directions
- Floor plan layout (describe spatial relationships)
- Built-in features (moldings, baseboards, crown molding)
- Structural elements (columns, beams, arches)

## 3. SURFACES & MATERIALS

- Floor: material type (tile / wood / carpet / concrete / terrazzo)
- Floor pattern details (size of tiles, grout width, pattern layout, colors)
- Wall materials and textures (paint / wallpaper / tile / brick)
- Wall colors (specific shades, undertones)
- Ceiling material and finish
- Any decorative elements or textures

## 4. FURNITURE & PERMANENT OBJECTS

For EACH piece of furniture/object, describe:

- Exact position (distance from walls, relationships to other items)
- Size (width, height, depth estimates)
- Style (modern / traditional / industrial / rustic)
- Material (wood / metal / fabric / leather / glass)
- Color (be very specific with shade names)
- Orientation (which way it faces)
- Condition (new / worn / damaged)

## 5. LIGHTING ANALYSIS

- Natural light: direction, intensity, color temperature
- Window light: which windows provide light, how much
- Artificial light: types (ceiling / floor lamps / strips)
- Light fixture positions and styles
- Shadows: direction, length, softness/hardness
- Overall lighting mood (bright / dim / warm / cool)
- Reflections and highlights on surfaces

## 6. COLOR PALETTE

- Dominant colors (largest areas)
- Secondary colors
- Accent colors
- Color relationships and harmony
- Warm vs cool tones balance
- Saturation levels (vibrant / muted / neutral)

## 7. CLUTTER & MESS (TO BE REMOVED)

List ALL items that make the space messy:

- Dirty dishes and their exact locations
- Scattered clothes and where they are
- Trash, debris, and waste items
- Stains on surfaces (location, type, severity)
- Disorganized items (papers, tools, etc.)
- Dirt, dust, grime accumulation
- Water marks, mold, or mildew
- Any broken or damaged elements

## 8. ELEMENTS TO PRESERVE

List items that should STAY exactly as they are:

- Permanent fixtures (pipes, drains, vents)
- Decorative items in their proper place
- Tools or equipment that belong in the space
- Any hoses, cords, or functional items
- Architectural details

## 9. ATMOSPHERE & STYLE

- Overall design style (minimalist / maximalist / rustic / modern / traditional)
- Era or time period feel
- Mood and ambiance
- Cultural or regional characteristics
- Quality level (luxury / standard / budget)

Be EXTREMELY precise with spatial relationships, measurements, colors, and positions. The goal is to describe this space so accurately that it can be recreated identically, just cleaned.`;
}

/**
 * Prompts de génération améliorés pour préserver la structure
 */
export function getGenerationPrompt(
  type: PromptType,
  analysis: string
): string {
  const prompts: Record<PromptType, string> = {
    realistic: `YOU ARE EDITING AN EXISTING IMAGE, NOT CREATING A NEW ONE.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into its clean version.

## ABSOLUTE REQUIREMENTS - MUST PRESERVE 100%:

### STRUCTURE (CANNOT CHANGE)

✓ Exact same camera angle and perspective
✓ Exact same room dimensions and layout
✓ Exact same walls, windows, doors (positions AND sizes)
✓ Exact same floor material and pattern (terrazzo, tile, wood, etc.)
✓ Exact same grout lines pattern and layout
✓ Exact same architectural features
✓ Exact same spatial relationships between all elements

### FURNITURE & OBJECTS (CANNOT CHANGE)

✓ Keep ALL furniture in EXACT same positions
✓ Keep same furniture styles, colors, and materials
✓ Keep same sizes and orientations
✓ Keep same built-in elements and fixtures
✓ Keep permanent decorative items
✓ Keep pipes, hoses, drains, vents exactly as they are

### LIGHTING & ATMOSPHERE (CANNOT CHANGE)

✓ Same natural light direction and intensity
✓ Same shadows and their directions
✓ Same color temperature of light
✓ Same overall brightness level
✓ Same photographic mood

## WHAT TO CHANGE (ONLY THIS - NOTHING ELSE):

### REMOVE ALL CLUTTER

✗ Remove all items from "CLUTTER & MESS" section
✗ Remove dirty dishes, scattered clothes, trash
✗ Remove stains, dirt, grime, mold, mildew
✗ Clear surfaces of disorganized items
✗ Remove any temporary mess

### CLEAN ALL SURFACES

→ Make floor spotlessly clean (same pattern, just pristine)
→ Clean all walls (same color, just fresh paint look)
→ Polish surfaces to look well-maintained
→ Clean grout lines (same width, just bright white/clean)
→ Remove water marks, stains, and discoloration
→ Make everything look freshly cleaned

### ORGANIZE PRESERVED ITEMS

→ Items from "ELEMENTS TO PRESERVE" stay but look organized
→ Coil hoses neatly if they must stay
→ Align items properly

## QUALITY REQUIREMENTS:

- Photorealistic quality (looks like a real photograph)
- Natural, believable result (not artificial or fake)
- Professional cleaning service standard
- Same photographic characteristics (grain, sharpness, exposure)
- No cartoon, illustration, or 3D render look

Think: "This is the SAME photograph, taken 2 hours after a professional cleaning crew finished."`,

    marketing: `YOU ARE ENHANCING AN EXISTING IMAGE FOR MARKETING.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into a magazine-worthy version.

## MUST PRESERVE (RECOGNIZABLE):

### CORE STRUCTURE (95% IDENTICAL)

✓ Same camera angle and perspective
✓ Same room layout and architecture
✓ Same windows, doors, walls positions
✓ Same floor material and general pattern
✓ Same spatial configuration

### MAIN ELEMENTS (KEEP RECOGNIZABLE)

✓ Same furniture pieces (styling can be enhanced)
✓ Same overall design aesthetic and style
✓ Same color scheme (can be enhanced/vibrant)
✓ Same architectural character

## WHAT TO ENHANCE:

### CLEANING (PERFECTION LEVEL)

✗ Remove ALL clutter and mess
✗ Spotlessly clean all surfaces (showroom quality)
✗ Perfect floor (gleaming, immaculate, like new)
✗ Fresh walls (perfect paint, no marks)
✗ Zero imperfections anywhere

### ENHANCEMENT (SUBTLE BUT NOTICEABLE)

→ Lighting: brighter, more inviting, warm
→ Colors: more vibrant (natural enhancement)
→ Contrast: improved for visual appeal
→ Surfaces: add subtle shine/polish
→ Add professional staging touches (magazines, flowers, towels)

### ATMOSPHERE

→ Make it aspirational yet believable
→ "After professional staging" feeling
→ Real estate / lifestyle magazine quality
→ Inviting, warm, and welcoming
→ The "dream version" of this space

## QUALITY:

- Professional lifestyle photography
- Editorial magazine standard
- Natural but enhanced
- Believable transformation
- High-end presentation

Think: "This is the same space, professionally staged and photographed for a luxury home magazine."`,

    stylized: `YOU ARE CREATING AN IDEALIZED VERSION OF AN EXISTING IMAGE.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into its Pinterest-perfect version.

## PRESERVE (MUST BE RECOGNIZABLE):

### CORE IDENTITY (90% SIMILAR)

✓ Same basic room layout
✓ Same general architectural features
✓ Same type of flooring (pattern can be perfected)
✓ Same window and door positions
✓ Same furniture types and general arrangement

## WHAT TO IDEALIZE:

### PERFECTION

✗ Remove ALL imperfections completely
✗ Spotlessly clean (beyond realistic)
✗ Perfect symmetry where appropriate
✗ Flawless surfaces (showroom new)
✗ Ideal lighting (bright, even, perfect)

### AESTHETIC ENHANCEMENT

→ Colors: vibrant, saturated, Instagram-worthy
→ Contrast: enhanced for visual pop
→ Composition: perfectly styled
→ Minimalist organization (only essentials)
→ Professional interior design quality

### IDEALIZATION

→ Make everything "perfect"
→ Slight enhancements for inspiration
→ Modern, aspirational aesthetic
→ Pinterest / Instagram quality
→ "Dream home" version of this space

## QUALITY:

- High-end interior design photography
- Idealized but still realistic
- Not cartoon-like or fake
- Professional designer portfolio quality
- Sharp, crisp, vibrant, inspiring

Think: "This is the same space transformed into its absolute dream version - perfectly styled, flawlessly clean, aspirational yet achievable."`,
  };

  return prompts[type];
}
