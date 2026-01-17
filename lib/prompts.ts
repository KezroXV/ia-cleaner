/**
 * Système de prompts adaptatifs pour le nettoyage d'images
 *
 * Ce module fournit des prompts spécialisés pour différents types d'espaces:
 * - intérieur (salon, chambre, bureau)
 * - cuisine
 * - salle de bain
 * - extérieur (terrasse, jardin, patio)
 * - piscine
 * - balcon
 * - garage
 * - bureau
 * - chambre
 * - salon
 *
 * Utilisation:
 * 1. Détecter le type d'espace avec getSpaceTypeDetectionPrompt()
 * 2. Utiliser normalizeSpaceType() pour normaliser la réponse
 * 3. Appeler getAnalysisPrompt(spaceType) avec le type détecté
 * 4. Appeler getGenerationPrompt(type, analysis, spaceType) pour la génération
 *
 * Ou utiliser "auto" pour la détection automatique dans le prompt d'analyse
 */

export type PromptType = "realistic" | "marketing" | "stylized";

export type SpaceType =
  | "interior" // Intérieur (salon, chambre, bureau, etc.)
  | "kitchen" // Cuisine
  | "bathroom" // Salle de bain
  | "outdoor" // Extérieur (terrasse, jardin, patio)
  | "pool" // Piscine
  | "balcony" // Balcon
  | "garage" // Garage
  | "office" // Bureau
  | "bedroom" // Chambre
  | "living-room" // Salon
  | "auto"; // Détection automatique

/**
 * Prompt de détection du type d'espace
 */
export function getSpaceTypeDetectionPrompt(): string {
  return `Analyze this image and determine the TYPE OF SPACE shown. Respond with ONLY ONE of these exact values:

- "interior" - Indoor room (living room, bedroom, office, etc.)
- "kitchen" - Kitchen space
- "bathroom" - Bathroom or restroom
- "outdoor" - Outdoor space (terrace, patio, garden, yard)
- "pool" - Swimming pool area
- "balcony" - Balcony or veranda
- "garage" - Garage or storage space
- "office" - Office or workspace
- "bedroom" - Bedroom
- "living-room" - Living room or lounge

Respond with ONLY the type value, nothing else.`;
}

/**
 * Normalise la réponse de détection du type d'espace
 * Extrait le type d'espace depuis la réponse de l'IA
 */
export function normalizeSpaceType(detectionResponse: string): SpaceType {
  const normalized = detectionResponse.trim().toLowerCase();

  // Chercher les types exacts
  const exactMatches: Record<string, SpaceType> = {
    interior: "interior",
    kitchen: "kitchen",
    bathroom: "bathroom",
    outdoor: "outdoor",
    pool: "pool",
    balcony: "balcony",
    garage: "garage",
    office: "office",
    bedroom: "bedroom",
    "living-room": "living-room",
    "living room": "living-room",
    livingroom: "living-room",
  };

  // Vérifier les correspondances exactes
  if (exactMatches[normalized]) {
    return exactMatches[normalized];
  }

  // Chercher des mots-clés dans la réponse (priorité aux piscines)
  if (
    normalized.includes("pool") ||
    normalized.includes("swimming") ||
    normalized.includes("piscine") ||
    normalized.includes("bassin") ||
    normalized.includes("natation")
  ) {
    return "pool";
  }
  if (normalized.includes("kitchen") || normalized.includes("cuisine")) {
    return "kitchen";
  }
  if (
    normalized.includes("bathroom") ||
    normalized.includes("restroom") ||
    normalized.includes("toilet")
  ) {
    return "bathroom";
  }
  if (
    normalized.includes("outdoor") ||
    normalized.includes("terrace") ||
    normalized.includes("patio") ||
    normalized.includes("garden") ||
    normalized.includes("yard")
  ) {
    return "outdoor";
  }
  if (normalized.includes("balcony") || normalized.includes("veranda")) {
    return "balcony";
  }
  if (normalized.includes("garage")) {
    return "garage";
  }
  if (normalized.includes("office") || normalized.includes("workspace")) {
    return "office";
  }
  if (normalized.includes("bedroom") || normalized.includes("chambre")) {
    return "bedroom";
  }
  if (
    normalized.includes("living room") ||
    normalized.includes("salon") ||
    normalized.includes("lounge")
  ) {
    return "living-room";
  }
  if (
    normalized.includes("indoor") ||
    normalized.includes("room") ||
    normalized.includes("interior")
  ) {
    return "interior";
  }

  // Par défaut, retourner "auto" pour la détection automatique dans le prompt
  return "auto";
}

/**
 * Prompt d'analyse ultra-détaillé pour Gemini Vision
 * Adapté selon le type d'espace détecté
 */
export function getAnalysisPrompt(spaceType: SpaceType = "auto"): string {
  const basePrompt = `Analyze this image in EXTREME DETAIL to enable IDENTICAL reconstruction after cleaning.

⚠️ CRITICAL: Your analysis will be used to recreate this EXACT SAME space, just cleaned. Be EXTREMELY precise with ALL details.

⚠️ CONSISTENCY REQUIREMENT: For the same image, you MUST produce the SAME analysis every time. Be systematic and thorough. Follow the same structure and level of detail consistently.

## 1. CAMERA & PERSPECTIVE (CRITICAL FOR PRESERVATION)

- EXACT camera angle (eye level / high angle / low angle / bird's eye / tilted)
- EXACT distance from subject (close-up / medium / wide shot / extreme wide)
- Lens characteristics: field of view (wide / normal / telephoto), distortion
- Depth of field: what's in sharp focus, what's blurred, blur amount
- Composition: rule of thirds, symmetry, leading lines, focal points
- Vanishing points: where perspective lines converge
- Camera position relative to the space (centered / off-center / angled)
- Any camera tilt or rotation`;

  const spaceSpecificPrompts: Record<Exclude<SpaceType, "auto">, string> = {
    interior: `## 2. ARCHITECTURAL STRUCTURE

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
- Reflections and highlights on surfaces`,

    kitchen: `## 2. KITCHEN STRUCTURE

- Kitchen layout (L-shaped / U-shaped / galley / island / open)
- Cabinet positions, sizes, and styles (upper and lower)
- Countertop material, color, and edge details
- Backsplash: material, pattern, colors, tile size
- Appliances: exact positions, types, brands if visible (refrigerator, stove, oven, dishwasher, microwave)
- Sink: type, material, faucet style, position
- Island or peninsula: dimensions, materials, features
- Storage areas and pantry details
- Ventilation hood: style, position, material

## 3. SURFACES & MATERIALS

- Floor: material (tile / wood / vinyl / concrete), pattern, grout details
- Countertops: material (granite / quartz / marble / laminate), color, finish
- Cabinets: material (wood / MDF / metal), color, finish, hardware style
- Backsplash: material, pattern, colors, installation details
- Wall materials and colors
- Ceiling details

## 4. APPLIANCES & FIXTURES

For EACH appliance and fixture:

- Exact position and orientation
- Size and model characteristics
- Color and finish
- Condition and cleanliness
- Any visible controls or displays
- Connections (electrical, plumbing, gas)

## 5. LIGHTING ANALYSIS

- Natural light: windows, skylights, direction
- Task lighting: under-cabinet lights, positions
- Ambient lighting: ceiling fixtures, styles
- Light switches and controls positions
- Shadows and reflections on surfaces`,

    bathroom: `## 2. BATHROOM STRUCTURE

- Bathroom layout and dimensions
- Vanity: position, size, style, number of sinks
- Shower: type (enclosed / open / bathtub combo), dimensions, door type
- Bathtub: type (freestanding / built-in), size, material
- Toilet: position, type, style
- Storage: medicine cabinet, shelves, cabinets
- Mirror: size, style, position, lighting
- Tile layout: floor and wall patterns
- Fixtures: faucets, showerheads, towel bars, hooks

## 3. SURFACES & MATERIALS

- Floor: material (tile / vinyl / stone), pattern, grout
- Wall tiles: material, size, pattern, colors, grout lines
- Countertop: material, color, edge details
- Shower/tub surround: material, pattern
- Ceiling: material, finish, ventilation
- Fixtures: finishes (chrome / brushed / matte black / etc.)

## 4. FIXTURES & EQUIPMENT

- Sink: type (vessel / undermount / drop-in), material, size
- Faucets: style, finish, position
- Shower system: type, controls, showerhead style
- Toilet: style, color, position
- Storage: cabinets, shelves, medicine cabinet
- Accessories: towel bars, hooks, soap dispensers

## 5. LIGHTING & VENTILATION

- Natural light: windows, skylights
- Artificial light: vanity lights, ceiling lights, styles
- Ventilation: fan position, style
- Light switches and controls`,

    outdoor: `## 2. OUTDOOR STRUCTURE

- Space type (terrace / patio / deck / garden / yard)
- Boundaries: walls, fences, railings, hedges
- Flooring: material (wood decking / stone / concrete / tiles / grass / gravel)
- Flooring pattern and layout details
- Steps or level changes
- Built-in features (planters, benches, fire pits, pergolas)
- Structural elements (columns, beams, pergola structure)

## 3. SURFACES & MATERIALS

- Ground/floor surface: material, pattern, colors, condition
- Walls/fences: material, height, style, color
- Railings: material, style, height
- Any hardscaping (stone paths, retaining walls)
- Planters: materials, sizes, positions

## 4. FURNITURE & OUTDOOR ELEMENTS

For EACH item:

- Outdoor furniture: type (chairs, tables, sofas, loungers)
- Material (wood / metal / wicker / plastic / fabric)
- Cushions: colors, patterns, condition
- Umbrellas or shade structures
- Planters and plants: types, sizes, positions
- Decorative elements (lanterns, vases, sculptures)

## 5. LIGHTING & ENVIRONMENT

- Natural light: time of day, sun direction, shadows
- Artificial lighting: string lights, lanterns, spotlights, positions
- Surrounding environment: views, neighboring structures
- Weather elements visible (if any)
- Sky and atmosphere`,

    pool: `## 2. POOL AREA STRUCTURE

- Pool shape and EXACT dimensions (rectangular / oval / freeform / infinity / kidney / round)
- Pool depth: shallow end, deep end, any depth changes
- Pool edge details (coping material, style, color, width)
- Decking/patio: material (tile / stone / concrete / wood / composite), pattern, area size, exact layout
- Surrounding area layout and boundaries
- Pool features: steps (position, width, number), ledges, benches, fountains, jets, waterfalls
- Safety features: railings, fences, gates, pool covers
- Pool equipment visible: skimmers (positions), drains, lights (positions, types), ladders, diving boards

## 3. WATER CONDITION (CRITICAL FOR POOLS)

- Water color: current state (clear / cloudy / green / brown / black)
- Water visibility: can you see the bottom? How deep is visibility?
- Algae: type (green / black / yellow), location, coverage percentage
- Debris: leaves, branches, dirt, insects, floating objects (exact locations)
- Water level: is it full, low, or overflowing?
- Surface condition: foam, scum, oil slicks
- Bottom visibility: can you see tiles/liner? What color/pattern?

## 4. SURFACES & MATERIALS

- Pool interior: finish (tile / plaster / vinyl / fiberglass), color, pattern, tile size if tiled
- Pool bottom: visible tiles/liner pattern, colors, any designs
- Pool walls: visible tiles/liner, colors, patterns, any decorative elements
- Decking: material, pattern, grout lines (width, color), exact layout
- Coping: material (stone / tile / concrete), style, color, condition
- Surrounding surfaces: material, condition, any cracks or damage
- Any tile work: patterns, colors, sizes, grout details

## 5. POOL FEATURES & EQUIPMENT

- Water features: fountains (positions, styles), waterfalls, jets (positions, types)
- Pool lights: underwater lights (positions, colors, types), above-water lights
- Steps and entry points: positions, styles, materials, number of steps
- Pool furniture: loungers, chairs, tables, umbrellas (exact positions, styles, materials)
- Pool equipment: visible pumps, filters, heaters, cleaning equipment
- Safety equipment: life rings, poles, first aid kits, pool covers
- Pool accessories: floats, toys, cleaning tools (if visible)

## 6. LIGHTING & ENVIRONMENT

- Natural light: sun position, time of day, shadows on water and decking
- Pool lighting: underwater lights (positions, colors), above-water lights
- Surrounding lighting: landscape lights, string lights, positions
- Reflections on water surface: what's reflected? Sky? Surroundings?
- Surrounding landscape: trees, plants, buildings, views
- Sky and atmosphere: cloud cover, weather conditions visible`,

    balcony: `## 2. BALCONY STRUCTURE

- Balcony dimensions and shape
- Flooring: material (tile / wood / concrete), pattern, condition
- Railings: material (glass / metal / wood), style, height
- Ceiling/overhead: material, features
- Built-in features (planters, storage, benches)
- Connection to building: door, windows

## 3. SURFACES & MATERIALS

- Floor surface: material, pattern, colors, condition
- Railings: material, finish, style
- Walls: material, color, condition
- Ceiling: material, finish

## 4. FURNITURE & DECOR

- Furniture: type (chairs, tables, sofas), materials, sizes
- Cushions and textiles: colors, patterns, condition
- Planters and plants: types, sizes, positions
- Decorative elements
- Storage items if any

## 5. LIGHTING & VIEWS

- Natural light: direction, intensity
- Artificial lighting: types, positions
- Views: what's visible from balcony
- Surrounding environment
- Sky and atmosphere`,

    garage: `## 2. GARAGE STRUCTURE

- Garage dimensions and layout
- Door: type (roll-up / swing), position, material, condition
- Floor: material (concrete / epoxy / tiles), condition, pattern
- Walls: material, finish, condition
- Ceiling: height, material, features
- Storage areas: shelves, cabinets, workbenches
- Windows: positions, sizes, types

## 3. SURFACES & MATERIALS

- Floor: material, finish, condition, any coatings
- Walls: material, paint, condition
- Ceiling: material, finish
- Storage systems: materials, types, positions

## 4. EQUIPMENT & VEHICLES

- Vehicles: type, position, condition
- Tools: types, positions, organization
- Storage systems: shelves, cabinets, pegboards
- Workbenches: positions, sizes, materials
- Equipment: compressors, generators, etc.

## 5. LIGHTING & ELECTRICAL

- Lighting: types (overhead / task), positions, styles
- Electrical outlets: positions
- Natural light: windows, doors
- Overall brightness`,

    office: `## 2. OFFICE STRUCTURE

- Office layout and dimensions
- Desk: position, size, material, style
- Storage: filing cabinets, shelves, bookcases
- Workstations: number, positions, configurations
- Windows: positions, sizes, types
- Doors: positions, types
- Built-in features

## 3. SURFACES & MATERIALS

- Floor: material (carpet / wood / tile), pattern, condition
- Walls: material, color, finish
- Ceiling: material, finish, features
- Desk surfaces: material, color, condition

## 4. FURNITURE & EQUIPMENT

- Desk: type, size, material, style, position
- Chairs: type, material, color, condition
- Storage: filing cabinets, shelves, materials, colors
- Technology: computers, monitors, printers, positions
- Office supplies: organization, positions

## 5. LIGHTING ANALYSIS

- Natural light: windows, direction, intensity
- Task lighting: desk lamps, positions, styles
- Ambient lighting: ceiling lights, styles
- Overall brightness and mood`,

    bedroom: `## 2. BEDROOM STRUCTURE

- Room dimensions and layout
- Bed: position, size, type, style
- Windows: positions, sizes, types, treatments
- Doors: positions, types
- Closet: type, position, size
- Built-in features (shelves, nooks)

## 3. SURFACES & MATERIALS

- Floor: material (carpet / wood / tile), pattern, condition
- Walls: material, color, finish
- Ceiling: material, finish
- Window treatments: types, colors, styles

## 4. FURNITURE & DECOR

- Bed: type, size, style, material, bedding colors/patterns
- Nightstands: positions, sizes, styles, materials
- Dresser/wardrobe: positions, sizes, styles
- Seating: chairs, benches, materials, colors
- Decorative items: art, mirrors, plants

## 5. LIGHTING ANALYSIS

- Natural light: windows, direction, intensity
- Artificial light: ceiling lights, bedside lamps, styles
- Overall brightness and mood`,

    "living-room": `## 2. LIVING ROOM STRUCTURE

- Room dimensions and layout
- Seating arrangement: positions, configuration
- Windows: positions, sizes, types, treatments
- Doors: positions, types
- Fireplace: if present, type, material, position
- Built-in features (shelves, entertainment center)

## 3. SURFACES & MATERIALS

- Floor: material (carpet / wood / tile), pattern, condition
- Walls: material, color, finish
- Ceiling: material, finish
- Window treatments: types, colors, styles

## 4. FURNITURE & DECOR

- Seating: sofas, chairs, positions, sizes, materials, colors
- Tables: coffee table, side tables, positions, materials
- Entertainment: TV, speakers, positions
- Storage: shelves, cabinets, materials, styles
- Decorative items: art, plants, accessories

## 5. LIGHTING ANALYSIS

- Natural light: windows, direction, intensity
- Artificial light: ceiling lights, floor lamps, table lamps, styles
- Overall brightness and mood`,
  };

  const commonSections = `## 6. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

For EACH major surface and element, specify:

- Dominant colors (largest areas) - be SPECIFIC (e.g., "warm beige", "cool gray", "navy blue")
- Secondary colors - exact shades and where they appear
- Accent colors - exact shades and locations
- Color relationships and harmony (complementary, analogous, monochromatic)
- Warm vs cool tones balance (percentage warm vs cool)
- Saturation levels (vibrant / muted / neutral) - be specific
- Color temperature (warm / neutral / cool)
- Any color gradients or transitions

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 7. CLUTTER & MESS (TO BE REMOVED - BE THOROUGH)

List ALL items that make the space messy. For EACH item, specify:

- Item type and description
- EXACT location (which surface, position relative to other items)
- Size and quantity
- Condition (dirty, broken, scattered, etc.)
- Specific examples:
  * Dirty dishes and their exact locations
  * Scattered clothes and where they are
  * Trash, debris, and waste items (locations)
  * Stains on surfaces (location, type, severity, size)
  * Disorganized items (papers, tools, etc.) and their locations
  * Dirt, dust, grime accumulation (where, how much)
  * Water marks, mold, or mildew (locations, extent)
  * Any broken or damaged elements
  * Leaves, branches (for outdoor spaces - exact locations)
  * Algae (green / black / yellow), pool debris, floating objects (for pool areas - CRITICAL)
  * Cloudy/murky water, scum, foam on water surface (for pools - describe extent)
  * Dirt and debris on pool bottom and walls (for pools - locations and amount)
  * Stains on pool tiles, decking, coping (for pools - exact locations)

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 8. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:

- Item type and description
- EXACT position (distance from walls, relationships to other items)
- Size and orientation
- Why it should stay (permanent fixture, functional, decorative)
- Specific examples:
  * Permanent fixtures (pipes, drains, vents) - exact positions
  * Decorative items in their proper place - positions and styles
  * Tools or equipment that belong in the space - positions and types
  * Any hoses, cords, or functional items - positions and routing
  * Architectural details - exact locations and styles
  * Functional outdoor equipment - positions and types
  * Pool equipment and safety features - exact positions and types

⚠️ CRITICAL: These items must remain in EXACT same positions - only organization/cleanliness can change.

## 9. ATMOSPHERE & STYLE (PRESERVE MOOD)

- Overall design style (minimalist / maximalist / rustic / modern / traditional / industrial / etc.)
- Era or time period feel (contemporary / vintage / classic / etc.)
- Mood and ambiance (cozy / spacious / industrial / luxurious / etc.)
- Cultural or regional characteristics (if visible)
- Quality level (luxury / standard / budget)
- Overall aesthetic coherence

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.

## 10. FINAL VERIFICATION CHECKLIST

Before completing your analysis, verify you have described:

✓ EXACT camera angle and perspective
✓ EXACT spatial layout and dimensions
✓ EXACT positions of ALL furniture and objects
✓ EXACT materials, colors, and patterns for ALL surfaces
✓ EXACT lighting conditions and shadows
✓ EXACT color palette and relationships
✓ COMPLETE list of ALL clutter and mess to remove
✓ COMPLETE list of ALL elements to preserve
✓ EXACT atmosphere and style

⚠️ CRITICAL: Be EXTREMELY precise with spatial relationships, measurements, colors, and positions. The goal is to describe this space so accurately that it can be recreated IDENTICALLY, just cleaned. Every detail matters.

⚠️ CONSISTENCY: Use the same level of detail, same structure, and same precision every time you analyze this image. Your analysis should be deterministic and reproducible.`;

  if (spaceType === "auto") {
    // Utiliser le prompt générique pour la détection automatique
    return `${basePrompt}

## 2. SPACE TYPE IDENTIFICATION

First, identify the type of space:
- Is this an indoor room (living room, bedroom, office)?
- Is this a kitchen?
- Is this a bathroom?
- Is this an outdoor space (terrace, patio, garden)?
- Is this a pool area?
- Is this a balcony?
- Is this a garage?
- Specify the exact space type

## 3. ARCHITECTURAL STRUCTURE

- Room/space dimensions (estimated measurements)
- Ceiling height and type (if indoor: flat / vaulted / exposed beams)
- Wall positions, angles, and relationships (if applicable)
- Windows: exact positions, sizes, types (sliding / casement / fixed)
- Doors: locations, sizes, types, opening directions
- Floor plan layout (describe spatial relationships)
- Built-in features (moldings, baseboards, crown molding, planters, etc.)
- Structural elements (columns, beams, arches, railings, fences)

## 4. SURFACES & MATERIALS

- Floor/ground: material type (tile / wood / carpet / concrete / terrazzo / grass / stone)
- Floor pattern details (size of tiles, grout width, pattern layout, colors)
- Wall materials and textures (paint / wallpaper / tile / brick / siding)
- Wall colors (specific shades, undertones)
- Ceiling material and finish (if applicable)
- Any decorative elements or textures

## 5. FURNITURE & PERMANENT OBJECTS

For EACH piece of furniture/object, describe:

- Exact position (distance from walls, relationships to other items)
- Size (width, height, depth estimates)
- Style (modern / traditional / industrial / rustic)
- Material (wood / metal / fabric / leather / glass / wicker / plastic)
- Color (be very specific with shade names)
- Orientation (which way it faces)
- Condition (new / worn / damaged)

${commonSections}`;
  }

  const spaceSpecific = spaceSpecificPrompts[spaceType];
  return `${basePrompt}

${spaceSpecific}

${commonSections}`;
}

/**
 * Prompts de génération améliorés pour préserver la structure
 * Adaptés selon le type d'espace
 */
export function getGenerationPrompt(
  type: PromptType,
  analysis: string,
  spaceType: SpaceType = "auto"
): string {
  // Instructions spécifiques selon le type d'espace
  const spaceSpecificInstructions = (spaceType: SpaceType): string => {
    switch (spaceType) {
      case "kitchen":
        return `### KITCHEN-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same kitchen layout (L-shaped/U-shaped/galley/island/open)
✓ Keep ALL appliances in EXACT same positions, models, and orientations
✓ Keep EXACT same cabinet layout, sizes, styles, and hardware positions
✓ Keep EXACT same countertop material, color, pattern, and edge details
✓ Keep EXACT same backsplash pattern, colors, tile size, and layout
✓ Keep EXACT same sink type, material, position, and faucet style
✓ Keep EXACT same island/peninsula dimensions, position, and materials
✓ Keep EXACT same ventilation hood position and style
✓ DO NOT change any appliance positions or styles
✓ DO NOT change cabinet colors or styles (just clean them)`;
      case "bathroom":
        return `### BATHROOM-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same bathroom layout and dimensions
✓ Keep ALL fixtures in EXACT same positions (sink, toilet, shower, tub)
✓ Keep EXACT same tile patterns, layouts, grout lines, and colors
✓ Keep EXACT same vanity position, size, style, and number of sinks
✓ Keep EXACT same shower/tub configuration, dimensions, and door type
✓ Keep EXACT same mirror size, style, position, and lighting
✓ Keep EXACT same faucet styles, finishes, and positions
✓ Keep EXACT same storage (medicine cabinet, shelves) positions
✓ DO NOT change any fixture positions or styles`;
      case "outdoor":
        return `### OUTDOOR-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same outdoor space layout and boundaries
✓ Keep EXACT same flooring/decking material, pattern, and layout
✓ Keep EXACT same railing/fence style, material, height, and positions
✓ Keep EXACT same furniture positions, styles, and materials
✓ Keep EXACT same planters and permanent plants (positions and types)
✓ Keep EXACT same structural elements (pergolas, columns, etc.)
✓ Preserve EXACT same natural environment, views, and surroundings
✓ Keep EXACT same steps, level changes, and built-in features
✓ DO NOT change outdoor structure or boundaries`;
      case "pool":
        return `### POOL-SPECIFIC PRESERVATION (CRITICAL - MOST IMPORTANT)
✓ Keep EXACT same pool shape and dimensions (rectangular/oval/freeform/infinity/kidney/round)
✓ Keep EXACT same pool edge/coping style, material, color, and width
✓ Keep EXACT same decking material, pattern, layout, and grout lines
✓ Keep EXACT same pool features (steps positions/width/number, ledges, benches)
✓ Keep EXACT same water features (fountains, jets, waterfalls) positions and styles
✓ Keep EXACT same pool furniture positions, styles, and materials
✓ Keep EXACT same pool equipment positions (skimmers, drains, lights, ladders)
✓ Keep EXACT same pool bottom tile/liner pattern, colors, and design
✓ Keep EXACT same pool wall tile/liner pattern, colors, and design
✓ Preserve EXACT same water color tone (blue/turquoise) - just make it crystal clear
✓ Keep EXACT same reflections and lighting on water surface
✓ Keep EXACT same surrounding landscape, views, and environment
✓ DO NOT change pool shape, size, or any structural elements
✓ DO NOT change water color (just clarity)`;
      case "balcony":
        return `### BALCONY-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same balcony dimensions, shape, and layout
✓ Keep EXACT same railing style, material, height, and design
✓ Keep EXACT same flooring material, pattern, and condition
✓ Keep EXACT same furniture positions, styles, and materials
✓ Keep EXACT same planters and plants (positions and types)
✓ Preserve EXACT same views and surrounding environment
✓ Keep EXACT same connection to building (door, windows)
✓ DO NOT change balcony structure or boundaries`;
      case "garage":
        return `### GARAGE-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same garage dimensions and layout
✓ Keep EXACT same storage systems and positions (shelves, cabinets)
✓ Keep EXACT same workbench positions, sizes, and styles
✓ Keep EXACT same tools and equipment positions (if permanent)
✓ Keep EXACT same floor material, finish, and pattern
✓ Keep EXACT same door and window positions and types
✓ Keep EXACT same wall materials and colors
✓ DO NOT change storage layout or equipment positions`;
      case "office":
        return `### OFFICE-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same office layout and dimensions
✓ Keep EXACT same desk position, size, style, and material
✓ Keep EXACT same storage systems (filing cabinets, shelves) positions and styles
✓ Keep EXACT same technology equipment positions (computers, monitors, printers)
✓ Keep EXACT same chair and furniture styles, positions, and materials
✓ Keep EXACT same window and door positions
✓ DO NOT change desk or equipment positions`;
      case "bedroom":
        return `### BEDROOM-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same bedroom layout and dimensions
✓ Keep EXACT same bed position, size, type, and style
✓ Keep EXACT same furniture positions (nightstands, dresser, wardrobe)
✓ Keep EXACT same window treatments (curtains, blinds) styles and positions
✓ Keep EXACT same closet configuration and position
✓ Keep EXACT same decorative items positions
✓ DO NOT change bed or furniture positions`;
      case "living-room":
        return `### LIVING ROOM-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same living room layout and dimensions
✓ Keep EXACT same seating arrangement and positions (sofas, chairs)
✓ Keep EXACT same furniture styles, materials, and colors
✓ Keep EXACT same entertainment setup (TV, speakers) positions
✓ Keep EXACT same tables (coffee, side) positions and styles
✓ Keep EXACT same fireplace (if present) position, style, and materials
✓ Keep EXACT same storage (shelves, cabinets) positions
✓ DO NOT change seating arrangement or furniture positions`;
      case "interior":
        return `### INTERIOR-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same room dimensions and layout
✓ Keep EXACT same walls, windows, doors (positions AND sizes)
✓ Keep EXACT same floor material and pattern (terrazzo, tile, wood, carpet, etc.)
✓ Keep EXACT same grout lines pattern, width, and layout
✓ Keep EXACT same architectural features (moldings, baseboards, etc.)
✓ Keep EXACT same ceiling height and type
✓ Keep EXACT same spatial relationships between all elements
✓ DO NOT change any structural elements`;
      default:
        return `### STRUCTURE (CANNOT CHANGE - CRITICAL)
✓ EXACT same camera angle and perspective
✓ EXACT same room/space dimensions and layout
✓ EXACT same walls, windows, doors (positions AND sizes)
✓ EXACT same floor/ground material and pattern
✓ EXACT same grout lines pattern, width, and layout
✓ EXACT same architectural features and details
✓ EXACT same spatial relationships between all elements
✓ EXACT same built-in features and fixtures
✓ DO NOT change any structural elements`;
    }
  };

  const spaceSpecificCleaning = (spaceType: SpaceType): string => {
    switch (spaceType) {
      case "kitchen":
        return `→ Clean all countertops to spotless (PRESERVE same material, color, pattern - just pristine)
→ Clean all appliances (refrigerator, stove, oven, dishwasher) - PRESERVE same models, positions, colors - just clean
→ Clean all cabinets (PRESERVE same finish, color, hardware - just fresh and polished)
→ Clean backsplash (PRESERVE same pattern, colors, tile size - just immaculate)
→ Clean sink and faucet (PRESERVE same style, material, position - just polished)
→ Clean floor (PRESERVE same pattern, grout lines, material - just pristine)
→ Remove all food debris, grease, stains, water marks
→ Make all surfaces look professionally cleaned but PRESERVE all materials and colors`;
      case "bathroom":
        return `→ Clean all tiles to spotless (PRESERVE same pattern, colors, grout lines - just pristine)
→ Clean all fixtures (sink, faucet, shower, tub, toilet) - PRESERVE same styles, positions, finishes - just polished
→ Clean mirror (PRESERVE same size, style, position - just crystal clear)
→ Clean countertop (PRESERVE same material, color, edge details - just immaculate)
→ Clean floor (PRESERVE same pattern, grout, material - just pristine)
→ Remove all soap scum, water marks, mold, mildew, stains
→ Make all surfaces look professionally cleaned but PRESERVE all materials, colors, and patterns`;
      case "outdoor":
        return `→ Clean all surfaces (decking, tiles, stone) - PRESERVE same materials, patterns, colors - just pristine
→ Clean all furniture (PRESERVE same styles, positions, materials, colors - just fresh and clean)
→ Remove all leaves, branches, debris, dirt, trash
→ Clean planters (PRESERVE same positions, types, materials - just tidy)
→ Remove all stains, discoloration, water marks, mold
→ Make everything look freshly maintained but PRESERVE all materials and natural environment`;
      case "pool":
        return `→ Make pool water CRYSTAL CLEAR - remove ALL algae (green/black/yellow), debris, leaves, scum, foam
→ Water MUST be transparent and show the bottom tiles/liner clearly and distinctly
→ PRESERVE same water color tone (blue/turquoise) - just make it pristine and crystal clear
→ Clean pool bottom: remove ALL dirt, debris, algae from tiles/liner (PRESERVE pattern and colors)
→ Clean pool walls: remove ALL algae, stains, dirt from tiles/liner (PRESERVE pattern and colors)
→ Clean pool edges and coping (PRESERVE same material, style, color - just pristine, no stains)
→ Clean decking (PRESERVE same pattern, grout lines, material - just immaculate, no dirt or stains)
→ Remove ALL floating debris, leaves, branches, insects, trash from water
→ Remove ALL algae growth (green slime, black spots, yellow stains) completely
→ Clean pool furniture (PRESERVE same positions, styles, materials - just fresh and clean)
→ Clean pool equipment (PRESERVE same positions, types - just maintained and clean)
→ Remove any scum lines, water marks, or discoloration
→ Pool should look professionally maintained and ready to swim
→ CRITICAL: Water clarity is the most important - it must be crystal clear while preserving pool structure`;
      case "balcony":
        return `→ Clean floor (same material, just pristine)
→ Clean railings (same material, just polished)
→ Clean furniture (same styles, just fresh)
→ Remove all debris, dirt, stains
→ Clean planters (same positions, just tidy)`;
      case "garage":
        return `→ Clean floor (same material, just pristine)
→ Clean walls (same color, just fresh)
→ Organize tools and equipment (same items, just organized)
→ Remove all dirt, oil stains, debris
→ Clean storage systems (same positions, just tidy)`;
      case "interior":
        return `→ Clean all floors to spotless (PRESERVE same material, pattern, grout lines - just pristine)
→ Clean all walls (PRESERVE same color, texture, finish - just fresh and clean)
→ Polish all surfaces to look well-maintained (PRESERVE same materials and finishes)
→ Clean grout lines (PRESERVE same width, pattern - just bright and clean)
→ Remove all water marks, stains, discoloration, dirt, dust
→ Make everything look freshly cleaned but PRESERVE all materials, colors, and patterns`;
      default:
        return `→ Make floor spotlessly clean (PRESERVE same pattern, material, grout lines - just pristine)
→ Clean all walls (PRESERVE same color, texture - just fresh paint look)
→ Polish surfaces to look well-maintained (PRESERVE same materials and finishes)
→ Clean grout lines (PRESERVE same width, pattern - just bright white/clean)
→ Remove all water marks, stains, discoloration, dirt, dust
→ Make everything look freshly cleaned but PRESERVE all materials, colors, and patterns`;
    }
  };

  const prompts: Record<PromptType, string> = {
    realistic: `YOU ARE EDITING AN EXISTING IMAGE, NOT CREATING A NEW ONE.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into its clean version.

⚠️ CRITICAL: This is IMAGE EDITING, not image generation. You MUST preserve the EXACT structure, layout, and composition of the original image.

⚠️ CONSISTENCY REQUIREMENT: For the same input image, you MUST produce IDENTICAL results every time. Follow the analysis EXACTLY and apply the same transformations consistently.

## ABSOLUTE REQUIREMENTS - MUST PRESERVE 100%:

### CAMERA & PERSPECTIVE (MUST BE IDENTICAL)

✓ EXACT same camera angle and position
✓ EXACT same perspective and vanishing points
✓ EXACT same field of view and lens characteristics
✓ EXACT same depth of field (what's in focus, what's blurred)
✓ EXACT same composition and framing
✓ EXACT same crop and aspect ratio

### STRUCTURAL ELEMENTS (MUST BE IDENTICAL)

${spaceSpecificInstructions(spaceType)}

### FURNITURE & OBJECTS (CANNOT CHANGE - EXACT POSITIONS)

✓ Keep ALL furniture in EXACT same positions (pixel-perfect if possible)
✓ Keep same furniture styles, colors, materials, and textures
✓ Keep same sizes, proportions, and orientations
✓ Keep same built-in elements and fixtures
✓ Keep permanent decorative items in exact same positions
✓ Keep pipes, hoses, drains, vents exactly as they are
✓ Keep all permanent equipment and tools in same positions
✓ DO NOT move, remove, or add any furniture
✓ DO NOT change furniture colors or styles

### SURFACES & MATERIALS (PRESERVE PATTERNS, CLEAN ONLY)

✓ Keep EXACT same floor/ground material and pattern
✓ Keep EXACT same tile patterns, grout lines, and layouts
✓ Keep EXACT same wall materials, colors, and textures
✓ Keep EXACT same surface finishes and materials
✓ Only remove dirt, stains, and discoloration - DO NOT change materials
✓ Preserve all patterns, textures, and decorative elements

### LIGHTING & ATMOSPHERE (MUST BE IDENTICAL)

✓ EXACT same natural light direction and intensity
✓ EXACT same shadows (positions, lengths, directions, softness)
✓ EXACT same color temperature of light (warm/cool)
✓ EXACT same overall brightness level
✓ EXACT same photographic mood and atmosphere
✓ EXACT same time of day appearance
✓ EXACT same reflections and highlights on surfaces
✓ DO NOT change lighting conditions or add new light sources

### COLORS & PALETTE (PRESERVE, ENHANCE CLEANLINESS ONLY)

✓ Keep EXACT same color palette and color relationships
✓ Keep same dominant, secondary, and accent colors
✓ Only make colors appear "fresh" and "clean" - DO NOT change hues
✓ Preserve same saturation levels (unless cleaning naturally enhances them)
✓ Keep same warm/cool tone balance

## WHAT TO CHANGE (ONLY THIS - NOTHING ELSE):

### REMOVE ALL CLUTTER (BE THOROUGH)

✗ Remove ALL items from "CLUTTER & MESS" section of analysis
✗ Remove dirty dishes, scattered clothes, trash, debris
✗ Remove stains, dirt, grime, mold, mildew from ALL surfaces
✗ Clear surfaces of disorganized items
✗ Remove any temporary mess or clutter
✗ Remove leaves, branches, debris (for outdoor/pool spaces)
✗ Remove algae, pool debris, floating objects (for pool areas)
✗ Remove all visible dirt, dust, and grime accumulation

### CLEAN ALL SURFACES (MAKE PRISTINE, PRESERVE MATERIALS)

${spaceSpecificCleaning(spaceType)}

### ORGANIZE PRESERVED ITEMS (IF THEY MUST STAY)

→ Items from "ELEMENTS TO PRESERVE" stay but look organized and clean
→ Coil hoses neatly if they must stay (same position, just organized)
→ Align items properly (same items, just aligned)
→ Organize tools and equipment (if they belong in the space)
→ Make preserved items look intentional and well-maintained

## CRITICAL EDITING RULES (FOLLOW STRICTLY FOR CONSISTENCY):

1. PRESERVE STRUCTURE: The space must be RECOGNIZABLY the same space - IDENTICAL layout
2. PRESERVE PERSPECTIVE: Camera angle and composition must be IDENTICAL - no changes
3. PRESERVE MATERIALS: Same materials, just clean (tiles stay tiles, wood stays wood) - NO material changes
4. PRESERVE COLORS: Same color palette, just fresh and clean - NO color hue changes
5. PRESERVE LIGHTING: Same lighting conditions and shadows - IDENTICAL lighting
6. PRESERVE FURNITURE: All furniture in EXACT same positions - NO movement
7. ONLY CLEAN: Remove mess, dirt, stains - nothing else - NO additions or removals of permanent items
8. BE CONSISTENT: Apply the same cleaning transformations in the same way every time for the same image

## QUALITY REQUIREMENTS:

- Photorealistic quality (looks like a real photograph, not AI-generated)
- Natural, believable result (not artificial, fake, or oversaturated)
- Professional cleaning service standard (thorough but realistic)
- Same photographic characteristics (grain, sharpness, exposure, color grading)
- No cartoon, illustration, 3D render, or AI-artifact look
- Seamless editing (no visible seams, artifacts, or inconsistencies)

## FINAL CHECK (VERIFY ALL BEFORE FINALIZING):

Before finalizing, verify EVERY item:
✓ EXACT same camera angle and perspective (no changes)
✓ EXACT same room/space layout and dimensions (identical)
✓ EXACT same furniture positions and styles (no movement, no style changes)
✓ EXACT same materials and patterns (just clean, no material changes)
✓ EXACT same lighting and shadows (identical conditions)
✓ EXACT same color palette (just fresh, no hue changes)
✓ ALL clutter removed (thorough cleaning)
✓ ALL surfaces clean (spotless)
✓ Result is RECOGNIZABLY the SAME space, professionally cleaned
✓ Result would be IDENTICAL if processed again with same input

⚠️ CONSISTENCY CHECK: If you process this same image again, you MUST produce the EXACT same result.

Think: "This is the SAME photograph, taken 2 hours after a professional cleaning crew finished. The space is IDENTICAL, just spotlessly clean. Every time I see this image, I will clean it in exactly the same way."`,

    marketing: `YOU ARE ENHANCING AN EXISTING IMAGE FOR MARKETING.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into a magazine-worthy version.

⚠️ CRITICAL: This is IMAGE ENHANCEMENT, not recreation. The space must be RECOGNIZABLY the same space.

## MUST PRESERVE (RECOGNIZABLE - 95% IDENTICAL):

### CORE STRUCTURE (MUST BE IDENTICAL)

✓ EXACT same camera angle and perspective
✓ EXACT same room/space layout and architecture
✓ EXACT same windows, doors, walls positions (if applicable)
✓ EXACT same floor/ground material and pattern
✓ EXACT same spatial configuration and dimensions
${spaceType === "pool" ? "✓ EXACT same pool shape and dimensions" : ""}
${
  spaceType === "outdoor" || spaceType === "balcony"
    ? "✓ EXACT same outdoor structure and boundaries"
    : ""
}

### MAIN ELEMENTS (KEEP RECOGNIZABLE)

✓ Same furniture pieces (positions and styles - can enhance appearance but not change)
✓ Same overall design aesthetic and style
✓ Same color scheme (can enhance vibrancy but preserve hues)
✓ Same architectural character and features
✓ Same key fixtures and equipment positions

## WHAT TO ENHANCE:

### CLEANING (PERFECTION LEVEL)

✗ Remove ALL clutter and mess
✗ Spotlessly clean all surfaces (showroom quality)
✗ Perfect floor/decking (gleaming, immaculate, like new)
✗ Fresh walls (perfect paint, no marks) - if applicable
✗ Zero imperfections anywhere
${spaceType === "pool" ? "✗ Crystal clear pool water, pristine pool area" : ""}
${
  spaceType === "outdoor" || spaceType === "balcony"
    ? "✗ Perfectly maintained outdoor surfaces"
    : ""
}

### ENHANCEMENT (SUBTLE BUT NOTICEABLE)

→ Lighting: brighter, more inviting, warm
→ Colors: more vibrant (natural enhancement)
→ Contrast: improved for visual appeal
→ Surfaces: add subtle shine/polish
${
  spaceType === "interior" ||
  spaceType === "kitchen" ||
  spaceType === "bathroom" ||
  spaceType === "bedroom" ||
  spaceType === "living-room" ||
  spaceType === "office"
    ? "→ Add professional staging touches (magazines, flowers, towels, decorative items)"
    : ""
}
${
  spaceType === "outdoor" || spaceType === "pool" || spaceType === "balcony"
    ? "→ Add tasteful outdoor accessories (cushions, plants, lighting)"
    : ""
}

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

Think: "This is the same space, professionally staged and photographed for a luxury ${
      spaceType === "pool"
        ? "pool"
        : spaceType === "outdoor" || spaceType === "balcony"
        ? "outdoor"
        : "home"
    } magazine."`,

    stylized: `YOU ARE CREATING AN IDEALIZED VERSION OF AN EXISTING IMAGE.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into its Pinterest-perfect version.

## PRESERVE (MUST BE RECOGNIZABLE):

### CORE IDENTITY (90% SIMILAR)

✓ Same basic room/space layout
✓ Same general architectural features
✓ Same type of flooring/ground surface (pattern can be perfected)
✓ Same window and door positions (if applicable)
✓ Same furniture types and general arrangement
${spaceType === "pool" ? "✓ Same pool shape and general features" : ""}
${
  spaceType === "outdoor" || spaceType === "balcony"
    ? "✓ Same outdoor structure and boundaries"
    : ""
}

## WHAT TO IDEALIZE:

### PERFECTION

✗ Remove ALL imperfections completely
✗ Spotlessly clean (beyond realistic)
✗ Perfect symmetry where appropriate
✗ Flawless surfaces (showroom new)
✗ Ideal lighting (bright, even, perfect)
${
  spaceType === "pool"
    ? "✗ Perfect pool water clarity and pristine surroundings"
    : ""
}
${
  spaceType === "outdoor" || spaceType === "balcony"
    ? "✗ Perfectly manicured outdoor space"
    : ""
}

### AESTHETIC ENHANCEMENT

→ Colors: vibrant, saturated, Instagram-worthy
→ Contrast: enhanced for visual pop
→ Composition: perfectly styled
→ Minimalist organization (only essentials)
→ Professional ${
      spaceType === "outdoor" || spaceType === "pool" || spaceType === "balcony"
        ? "landscape"
        : "interior"
    } design quality

### IDEALIZATION

→ Make everything "perfect"
→ Slight enhancements for inspiration
→ Modern, aspirational aesthetic
→ Pinterest / Instagram quality
→ "Dream ${
      spaceType === "pool"
        ? "pool"
        : spaceType === "outdoor" || spaceType === "balcony"
        ? "outdoor"
        : "home"
    }" version of this space

## QUALITY:

- High-end ${
      spaceType === "outdoor" || spaceType === "pool" || spaceType === "balcony"
        ? "landscape"
        : "interior"
    } design photography
- Idealized but still realistic
- Not cartoon-like or fake
- Professional designer portfolio quality
- Sharp, crisp, vibrant, inspiring

Think: "This is the same space transformed into its absolute dream version - perfectly styled, flawlessly clean, aspirational yet achievable."`,
  };

  return prompts[type];
}
