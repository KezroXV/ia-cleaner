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
  const basePrompt = `Analyze this image in EXTREME DETAIL to enable identical reconstruction after cleaning.

## 1. CAMERA & PERSPECTIVE

- Camera angle (eye level / high angle / low angle / bird's eye)
- Distance from subject (close-up / medium / wide shot)
- Lens characteristics and field of view
- Depth of field (what's in focus, what's blurred)
- Composition (rule of thirds, symmetry, leading lines)
- Vanishing points and perspective lines`;

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

  const commonSections = `## 6. COLOR PALETTE

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
- Leaves, branches (for outdoor spaces)
- Algae (green / black / yellow), pool debris, floating objects (for pool areas - CRITICAL)
- Cloudy/murky water, scum, foam on water surface (for pools)
- Dirt and debris on pool bottom and walls (for pools)
- Stains on pool tiles, decking, coping (for pools)

## 8. ELEMENTS TO PRESERVE

List items that should STAY exactly as they are:

- Permanent fixtures (pipes, drains, vents)
- Decorative items in their proper place
- Tools or equipment that belong in the space
- Any hoses, cords, or functional items
- Architectural details
- Functional outdoor equipment
- Pool equipment and safety features

## 9. ATMOSPHERE & STYLE

- Overall design style (minimalist / maximalist / rustic / modern / traditional)
- Era or time period feel
- Mood and ambiance
- Cultural or regional characteristics
- Quality level (luxury / standard / budget)

Be EXTREMELY precise with spatial relationships, measurements, colors, and positions. The goal is to describe this space so accurately that it can be recreated identically, just cleaned.`;

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
        return `### KITCHEN-SPECIFIC PRESERVATION
✓ Keep ALL appliances in exact same positions and models
✓ Keep same cabinet layout, sizes, and styles
✓ Keep same countertop material and pattern
✓ Keep same backsplash pattern and colors
✓ Keep same sink and faucet style
✓ Keep same island/peninsula dimensions and position`;
      case "bathroom":
        return `### BATHROOM-SPECIFIC PRESERVATION
✓ Keep ALL fixtures in exact same positions
✓ Keep same tile patterns and layouts
✓ Keep same vanity, sink, and faucet styles
✓ Keep same shower/tub configuration
✓ Keep same mirror and lighting positions`;
      case "outdoor":
        return `### OUTDOOR-SPECIFIC PRESERVATION
✓ Keep same flooring/decking material and pattern
✓ Keep same railing/fence style and positions
✓ Keep same furniture positions and styles
✓ Keep same planters and permanent plants
✓ Keep same structural elements (pergolas, etc.)
✓ Preserve natural environment and views`;
      case "pool":
        return `### POOL-SPECIFIC PRESERVATION (CRITICAL)
✓ Keep EXACT same pool shape and dimensions (rectangular/oval/freeform/etc.)
✓ Keep same pool edge/coping style, material, and color
✓ Keep same decking material, pattern, and layout
✓ Keep same pool features (steps positions, fountains, jets, waterfalls)
✓ Keep same pool furniture positions and styles
✓ Keep same pool equipment positions (skimmers, drains, lights, ladders)
✓ Keep same pool bottom tile/liner pattern and colors
✓ Keep same pool wall tile/liner pattern and colors
✓ Preserve same water color tone (blue/turquoise) but make it crystal clear
✓ Keep same reflections and lighting on water surface
✓ Keep same surrounding landscape and views`;
      case "balcony":
        return `### BALCONY-SPECIFIC PRESERVATION
✓ Keep same railing style and material
✓ Keep same flooring material and pattern
✓ Keep same furniture positions and styles
✓ Keep same planters and plants
✓ Preserve views and surrounding environment`;
      case "garage":
        return `### GARAGE-SPECIFIC PRESERVATION
✓ Keep same storage systems and positions
✓ Keep same workbench positions and styles
✓ Keep same tools and equipment (if permanent)
✓ Keep same floor material and finish
✓ Keep same door and window positions`;
      case "office":
        return `### OFFICE-SPECIFIC PRESERVATION
✓ Keep same desk position and style
✓ Keep same storage systems (filing cabinets, shelves)
✓ Keep same technology equipment positions
✓ Keep same chair and furniture styles`;
      case "bedroom":
        return `### BEDROOM-SPECIFIC PRESERVATION
✓ Keep same bed position, size, and style
✓ Keep same furniture positions (nightstands, dresser)
✓ Keep same window treatments
✓ Keep same closet configuration`;
      case "living-room":
        return `### LIVING ROOM-SPECIFIC PRESERVATION
✓ Keep same seating arrangement and positions
✓ Keep same furniture styles and materials
✓ Keep same entertainment setup
✓ Keep same fireplace (if present)`;
      default:
        return `### STRUCTURE (CANNOT CHANGE)
✓ Exact same camera angle and perspective
✓ Exact same room dimensions and layout
✓ Exact same walls, windows, doors (positions AND sizes)
✓ Exact same floor material and pattern (terrazzo, tile, wood, etc.)
✓ Exact same grout lines pattern and layout
✓ Exact same architectural features
✓ Exact same spatial relationships between all elements`;
    }
  };

  const spaceSpecificCleaning = (spaceType: SpaceType): string => {
    switch (spaceType) {
      case "kitchen":
        return `→ Clean all countertops to spotless (same material, just pristine)
→ Clean all appliances (refrigerator, stove, oven) - same models, just clean
→ Clean all cabinets (same finish, just fresh)
→ Clean backsplash (same pattern, just immaculate)
→ Clean sink and faucet (same style, just polished)
→ Clean floor (same pattern, just pristine)
→ Remove all food debris, grease, stains`;
      case "bathroom":
        return `→ Clean all tiles to spotless (same pattern, just pristine)
→ Clean all fixtures (sink, faucet, shower, tub) - same styles, just polished
→ Clean mirror (same size, just crystal clear)
→ Clean countertop (same material, just immaculate)
→ Clean floor (same pattern, just pristine)
→ Remove all soap scum, water marks, mold, mildew`;
      case "outdoor":
        return `→ Clean all surfaces (decking, tiles, stone) - same materials, just pristine
→ Clean all furniture (same styles, just fresh)
→ Remove all leaves, debris, dirt
→ Clean planters (same positions, just tidy)
→ Remove stains and discoloration
→ Make everything look freshly maintained`;
      case "pool":
        return `→ Make pool water CRYSTAL CLEAR - remove all algae (green/black/yellow), debris, leaves, scum, foam
→ Water should be transparent and show the bottom tiles/liner clearly
→ Keep same water color (blue/turquoise) but make it pristine and clear
→ Clean pool bottom: remove all dirt, debris, algae from tiles/liner
→ Clean pool walls: remove all algae, stains, dirt from tiles/liner
→ Clean pool edges and coping (same material, just pristine, no stains)
→ Clean decking (same pattern, just immaculate, no dirt or stains)
→ Remove ALL floating debris, leaves, branches, insects from water
→ Remove all algae growth (green slime, black spots, yellow stains)
→ Clean pool furniture (same positions, just fresh and clean)
→ Clean pool equipment (same positions, just maintained and clean)
→ Remove any scum lines, water marks, or discoloration
→ Pool should look professionally maintained and ready to swim`;
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
      default:
        return `→ Make floor spotlessly clean (same pattern, just pristine)
→ Clean all walls (same color, just fresh paint look)
→ Polish surfaces to look well-maintained
→ Clean grout lines (same width, just bright white/clean)
→ Remove water marks, stains, and discoloration
→ Make everything look freshly cleaned`;
    }
  };

  const prompts: Record<PromptType, string> = {
    realistic: `YOU ARE EDITING AN EXISTING IMAGE, NOT CREATING A NEW ONE.

ORIGINAL IMAGE DETAILED ANALYSIS:

${analysis}

YOUR TASK: Transform this EXACT SAME SPACE into its clean version.

## ABSOLUTE REQUIREMENTS - MUST PRESERVE 100%:

${spaceSpecificInstructions(spaceType)}

### FURNITURE & OBJECTS (CANNOT CHANGE)

✓ Keep ALL furniture in EXACT same positions
✓ Keep same furniture styles, colors, and materials
✓ Keep same sizes and orientations
✓ Keep same built-in elements and fixtures
✓ Keep permanent decorative items
✓ Keep pipes, hoses, drains, vents exactly as they are
✓ Keep all permanent equipment and tools

### LIGHTING & ATMOSPHERE (CANNOT CHANGE)

✓ Same natural light direction and intensity
✓ Same shadows and their directions
✓ Same color temperature of light
✓ Same overall brightness level
✓ Same photographic mood
✓ Same time of day appearance

## WHAT TO CHANGE (ONLY THIS - NOTHING ELSE):

### REMOVE ALL CLUTTER

✗ Remove all items from "CLUTTER & MESS" section
✗ Remove dirty dishes, scattered clothes, trash
✗ Remove stains, dirt, grime, mold, mildew
✗ Clear surfaces of disorganized items
✗ Remove any temporary mess
✗ Remove leaves, debris (for outdoor/pool spaces)
✗ Remove algae, pool debris (for pool areas)

### CLEAN ALL SURFACES

${spaceSpecificCleaning(spaceType)}

### ORGANIZE PRESERVED ITEMS

→ Items from "ELEMENTS TO PRESERVE" stay but look organized
→ Coil hoses neatly if they must stay
→ Align items properly
→ Organize tools and equipment (if they belong in the space)

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
✓ Same room/space layout and architecture
✓ Same windows, doors, walls positions (if applicable)
✓ Same floor/ground material and general pattern
✓ Same spatial configuration
${spaceType === "pool" ? "✓ Same pool shape and dimensions" : ""}
${
  spaceType === "outdoor" || spaceType === "balcony"
    ? "✓ Same outdoor structure and boundaries"
    : ""
}

### MAIN ELEMENTS (KEEP RECOGNIZABLE)

✓ Same furniture pieces (styling can be enhanced)
✓ Same overall design aesthetic and style
✓ Same color scheme (can be enhanced/vibrant)
✓ Same architectural character
✓ Same key fixtures and equipment

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
