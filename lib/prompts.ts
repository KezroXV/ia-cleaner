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
  | "car-interior" // Habitacle de voiture
  | "car-seats" // Sièges de voiture
  | "car-dashboard" // Tableau de bord
  | "car-trunk" // Coffre
  | "sofa" // Canapé isolé
  | "sofa-living-room" // Canapé dans salon
  | "living-room-full" // Salon complet
  | "armchair" // Fauteuil
  | "auto"; // Détection automatique

/**
 * Prompt de détection du type d'espace
 */
export function getSpaceTypeDetectionPrompt(): string {
  return `Analyze this image and determine the TYPE OF SPACE shown. Respond with ONLY ONE of these exact values:

⚠️ PARTIAL VIEWS: The image may show ONLY A PART of a space (e.g. just the car floor, one seat corner, one sofa cushion, close-up of dashboard). Still classify by the SPACE TYPE that best matches what is visible. Do NOT require the full room or full car to be visible.

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
- "car-interior" - Car interior (full cabin OR partial: floor only, floor+seat base, door panel, etc.)
- "car-seats" - Car seats (full or partial: one seat, seat base, seat back, rails visible)
- "car-dashboard" - Dashboard/steering area (full or partial: wheel only, console only, etc.)
- "car-trunk" - Trunk or boot of the car
- "sofa" - Sofa/couch (full sofa OR partial: one cushion, back+seat only, arm only, close-up of fabric)
- "sofa-living-room" - Sofa as main element in a living room (can be partial view of room)
- "living-room-full" - Full living room with sofa, furniture, and decor
- "armchair" - Single armchair or accent chair (full or partial)

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
    "car-interior": "car-interior",
    "car interior": "car-interior",
    carinterior: "car-interior",
    "car-seats": "car-seats",
    "car seats": "car-seats",
    carseats: "car-seats",
    "car-dashboard": "car-dashboard",
    "car dashboard": "car-dashboard",
    cardashboard: "car-dashboard",
    dashboard: "car-dashboard",
    "car-trunk": "car-trunk",
    "car trunk": "car-trunk",
    cartrunk: "car-trunk",
    trunk: "car-trunk",
    sofa: "sofa",
    couch: "sofa",
    "sofa-living-room": "sofa-living-room",
    "sofa living room": "sofa-living-room",
    sofalivingroom: "sofa-living-room",
    "living-room-full": "living-room-full",
    "living room full": "living-room-full",
    livingroomfull: "living-room-full",
    armchair: "armchair",
    "arm chair": "armchair",
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
  // Car Interior matching
  if (
    normalized.includes("car") ||
    normalized.includes("interior") ||
    normalized.includes("cabin")
  ) {
    if (normalized.includes("seat")) return "car-seats";
    if (normalized.includes("dashboard")) return "car-dashboard";
    if (normalized.includes("trunk") || normalized.includes("boot"))
      return "car-trunk";
    return "car-interior";
  }

  // Sofa matching
  if (normalized.includes("sofa") || normalized.includes("couch")) {
    if (normalized.includes("room") || normalized.includes("living"))
      return "sofa-living-room";
    if (normalized.includes("full")) return "living-room-full";
    return "sofa";
  }

  if (normalized.includes("armchair")) return "armchair";
  if (normalized.includes("living") || normalized.includes("room"))
    return "living-room-full";

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

    "car-interior": `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the car (e.g. floor only, seat base only, door sill): analyze ONLY what is VISIBLE. List explicitly which zones ARE visible. Do NOT describe or assume elements outside the frame.

## 2. CAR INTERIOR STRUCTURE (CRITICAL - ONLY WHAT IS VISIBLE)

### Seating Configuration (only if visible in frame):
- Seating type: 2-seater / 4-seater / 5-seater / 7-seater
- Seat arrangement (bucket seats / bench seats / captain's chairs)
- Front seat positions: reclined angle, distance forward/backward from steering wheel
- Rear seat configuration: folded / deployed / split-folding status
- Headrest positions: up / down / missing
- Seat orientation (forward / backward / rotated)

### Interior Layout:
- Steering wheel size, design style, material (leather / fabric / grip material)
- Steering wheel angle: straight / tilted up / tilted down
- Steering column: extended / retracted
- Dashboard shape and layout (angular / curved / multi-tier)
- Dashboard features visible: instrument cluster, infotainment screen, air vents, cup holders, storage cubbies
- Center console layout and contents visible
- Door panels design: smooth / textured / with armrests / pockets visible
- Windows: tinted level (clear / lightly tinted / heavily tinted / privacy tinted)
- Sunroof/moonroof: open / closed / panoramic
- Roof/headliner material: cloth / leather / suede / Alcantara / vinyl
- Headliner color and finish (glossy / matte)

### Flooring:
- Floor mat type: rubber / textile / OEM mats / custom mats / no mats
- Floor carpet color and material (if visible under mats)
- Flooring condition: original / worn / new
- Pedals visible: automatic / manual transmission indicators

## 3. MATERIALS & TEXTURES (CRITICAL - PRESERVE EXACTLY)

For EACH visible surface, specify:
- Leather: finish (matte / glossy / satin), grain pattern, stitching color, embossing patterns
- Fabric: weave type (velvet / mesh / suede / polyester / cotton), pattern, texture, pile height
- Plastic: finish (glossy / matte / soft-touch), color, texture, grain patterns
- Wood: finish (matte / glossy / satin), grain direction, color tone (dark / medium / light)
- Metal: finish (brushed / polished / satin / gun metal), color (silver / chrome / gold / black)
- Rubber: texturing patterns, color, shine level
- Carbon fiber: pattern and weave details (if present)
- Stitching: color, pattern, density (tight / loose), where visible

**Examples from image**:
- Steering wheel: material [leather/fabric/plastic], color [specific shade], stitching pattern [if visible]
- Seat material: [leather/fabric/suede], color [specific shade], stitching pattern, texture details
- Dashboard: material [plastic/leather/suede], color [specific shade], finish [glossy/matte], texture patterns
- Door panels: material [plastic/fabric/leather], color, texture, embossing patterns
- Floor mats: material [rubber/textile], pattern, color, texture details

⚠️ CRITICAL: Materials must be preserved EXACTLY - only cleanliness should change appearance.

## 4. LIGHTING & ATMOSPHERE (CRITICAL)

- Natural light source: sunlight angle (from windshield / side windows / rear window / through sunroof)
- Sunlight intensity: bright / moderate / dim / none
- Shadows cast by steering wheel on dashboard
- Shadows cast by occupants (if visible)
- Ambient cabin lighting: off / on / LED ambient lighting color
- Dashboard illumination: off / on / brightness level
- Screen glow from infotainment system (if on)
- Color temperature of light overall: warm (afternoon sun) / cool (overcast) / artificial (streetlight)
- Window reflections: clear / mirror-like / reflective glare
- Windshield glare intensity
- Overall brightness level: bright cabin / dark cabin / medium
- Any dust particles visible in light beams

## 5. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

For EACH major surface and element, specify:
- Seat color: exact shade [e.g., "charcoal gray", "cream leather", "black suede", "burgundy with black stitching"]
- Dashboard color: exact shade and finish description
- Door panel color: exact shade
- Steering wheel color: exact shade and accent colors (if any)
- Floor mat color: exact shade and pattern (if applicable)
- Headliner color: exact shade
- Accent colors: red stitching, chrome details, wood trim, etc.
- Warm vs cool tones balance: percentage warm vs cool
- Saturation levels: vibrant / muted / neutral
- Any color gradients or transitions between materials

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 6. CLUTTER & MESS IN CAR (TO BE REMOVED - BE THOROUGH)

List ALL items that make the interior messy. For EACH item, specify:
- Item type and description
- EXACT location (on seat / under seat / in cupholder / on floor / in door pocket / on dashboard / hanging from mirror / on steering wheel)
- Size and quantity
- Condition (dirty, sticky, scattered, trash, etc.)

**⚠️⚠️⚠️ CRITICAL - ZERO TOLERANCE FOR PARTICLES ⚠️⚠️⚠️**

**You MUST identify and list EVERY SINGLE visible particle, crumb, miette, speck, and stain:**

**PARTICLES & CRUMBS (MOST CRITICAL - LIST EVERY ONE):**
- **ALL crumbs and miettes** on carpet/floor (white, beige, brown, any color) - count approximate number and describe locations
- **ALL small particles** on seats (in seams, perforations, on surface) - describe each location
- **ALL fine dust particles** on dashboard, console, and all surfaces - describe distribution
- **ALL specks and debris** in crevices, between seats, under seats - describe locations
- **ALL embedded particles** in carpet fibers - describe areas affected
- **ALL particles** in seat seams, stitching, and perforations - describe each location
- **ALL small debris** in cupholders, storage areas, door pockets - describe contents
- **ALL particles** on floor mats (on surface AND between ridges/grooves) - describe locations
- **ALL fine particles** on threshold areas, door sills - describe locations
- **ALL crumbs and particles** around seat rails, bolts, and mechanical parts - describe locations

**LARGER ITEMS (ALSO CRITICAL):**
- Fast food bags and packaging on seats or floor
- Empty or full beverage containers (cups, bottles) in cupholders or floor
- Food wrappers, candy wrappers, napkins (location by location)
- Trash items on floor, seats, or dashboard
- Papers, documents, receipts scattered around
- Dust and dirt accumulation on dashboard
- Dirt on floor mats and carpeting
- Sticky residue or stains on seats, steering wheel, or dashboard
- Mud or dirt on pedals
- Grime around door handles and windows
- Foggy or smudged windows (interior condensation / dust on glass)
- Spills on seats or floor (dried or wet)
- Pet hair (on seats and in corners)
- Unorganized items in cupholders, door pockets, console
- Visible personal items scattered (keys, phones, sunglasses, etc.)
- Hanging air freshener or decorations (if shabby or needs replacement)
- Grease or grime on steering wheel
- Dirty or stained seat belts
- Debris between seats (pennies, crumbs, trash)
- Visible odor indicators (if noticeable in image)
- Coffee stains or beverage spills on fabric
- Scratches or scuffs on dashboard
- Fogged glass or condensation on windows
- Dirty visor or headliner spots

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed. Pay EXTRA attention to small particles, crumbs, and miettes - they must ALL be identified and removed.

## 7. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position (on steering wheel / hanging from mirror / mounted on dashboard / in center console / door pocket containing)
- Size, orientation, and attachment method
- Why it should stay (functional, decorative, safety feature)

**Specific examples - PRESERVE THESE**:
- Steering wheel (exact angle and position)
- Dashboard layout and all permanent fixtures
- Seats and headrests (exact positions, recline angles)
- Seat belt systems (exact positions and routing)
- Air vents and their orientation
- Steering column (extended/retracted position)
- Rearview mirror (angle and position)
- Side mirrors (angle and position)
- Gear shift (exact position)
- Parking brake position
- Steering wheel horn pad and controls
- Steering wheel spokes (exact positioning)
- Dashboard warning lights and indicator locations
- Infotainment screen (exact position and size)
- Climate control dials/buttons (exact state)
- Window switches and door controls
- Armrests (exact position and state - up/down)
- Console storage (position and state)
- Cupholder positions and orientation
- Door handle shapes and positions
- Window trim and bezels
- Roof handle grab handles (exact positions)
- Fasteners and screws visible
- Door pockets and their orientation
- Seatbelt anchors and routing
- ISOFIX child seat anchors (if visible)
- Air bag covers (exact positions)
- Pedal design and positioning
- Carpet edge binding and stitching patterns

⚠️ CRITICAL: These items must remain in EXACT same positions - only organization/cleanliness can change.

## 8. ATMOSPHERE & STYLE (PRESERVE MOOD)

- Overall design theme (sporty / luxury / minimalist / practical / tech-forward / classic / rugged)
- Era/generation of car (modern 2020+ / recent 2015-2020 / older 2010-2015 / classic)
- Mood and ambiance (premium/luxurious / practical/functional / sporty / cozy)
- Quality level indicated by materials (luxury / mid-range / budget)
- Technology level visible (modern touch screen / physical buttons / mix)
- Customization level: stock / personalized / heavily modified
- Cultural/regional characteristics (if applicable)

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.`,

    "car-seats": `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the seats (e.g. seat base only, rails, one cushion): analyze ONLY what is VISIBLE. List explicitly which parts ARE visible. Do NOT describe or assume elements outside the frame.

## 2. CAR SEATS STRUCTURE (CRITICAL - ONLY WHAT IS VISIBLE)

### Seating Configuration (only if visible in frame):
- Seating type: 2-seater / 4-seater / 5-seater / 7-seater
- Seat arrangement (bucket seats / bench seats / captain's chairs)
- Front seat positions: reclined angle, distance forward/backward from steering wheel
- Rear seat configuration: folded / deployed / split-folding status
- Headrest positions: up / down / missing
- Seat orientation (forward / backward / rotated)
- Which seats are visible: driver / passenger / rear / all

### Seat Details:
- Seat material: leather / fabric / suede / Alcantara / vinyl
- Seat color: exact shade [e.g., "charcoal gray", "cream leather", "black suede"]
- Stitching pattern: color, density, style
- Seat adjustments visible: lumbar support, side bolsters, heating/cooling controls
- Seat condition: new / slightly worn / heavily worn / damaged areas

## 3. MATERIALS & TEXTURES (CRITICAL - PRESERVE EXACTLY)

For EACH visible seat surface, specify:
- Material type: leather / fabric / suede / Alcantara / vinyl
- Material finish: matte / glossy / satin
- Grain pattern (for leather)
- Weave type (for fabric): velvet / mesh / suede / polyester / cotton
- Texture details: pile height, smoothness, embossing
- Stitching: color, pattern, density (tight / loose), where visible
- Any wear patterns or creases

⚠️ CRITICAL: Materials must be preserved EXACTLY - only cleanliness should change appearance.

## 4. LIGHTING & ATMOSPHERE (CRITICAL)

- Natural light source: sunlight angle (from windows / sunroof)
- Sunlight intensity: bright / moderate / dim / none
- Shadows on seats: positions, softness
- Ambient cabin lighting: off / on / LED ambient lighting color
- Color temperature of light overall: warm (afternoon sun) / cool (overcast) / artificial
- Overall brightness level: bright cabin / dark cabin / medium

## 5. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Seat color: exact shade and undertone [warm / cool / neutral]
- Stitching color: exact shade
- Accent colors: any contrasting elements
- Warm vs cool tones balance: percentage warm vs cool
- Saturation levels: vibrant / muted / neutral

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 6. CLUTTER & MESS IN CAR (TO BE REMOVED - BE THOROUGH)

List ALL items that make the seats messy. For EACH item, specify:
- Item type and description
- EXACT location (on seat / under seat / between cushions / in seat crevices)
- Size and quantity
- Condition (dirty, sticky, scattered, trash, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Food debris on cushions or between cushions
- Beverage spills or stains (coffee, wine, juice, water)
- Crumbs scattered on fabric
- Sticky residue from spills
- Dirt and dust accumulation on seat surfaces
- Pet hair and dander (significant amounts)
- Visible stains on seat fabric/leather
- Crumbs and debris in seat crevices
- Dirt on seat belts
- Stains of unknown origin
- Ring marks from glasses or cups
- Makeup stains (lipstick, foundation, etc.)
- Ink or pen marks
- General grime and dullness
- Visible odor indicators (if noticeable in image)

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 7. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position and orientation
- Size, color, style, and material
- Why it should stay (functional, decorative, safety feature)

**Specific examples - PRESERVE THESE**:
- Seat structure: frame, legs, armrests (exact positions and design)
- Seat fabric: material type, color, pattern, texture (PRESERVE - just clean)
- Cushion structure: back cushions, seat cushions (PRESERVE - just clean)
- Headrest positions and design
- Seat belt systems (exact positions and routing)
- Seat adjustments: lumbar support, side bolsters (exact state)
- Any built-in features: heating/cooling controls, storage (exact state PRESERVE)

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.

## 8. ATMOSPHERE & STYLE (PRESERVE MOOD)

- Overall design theme (sporty / luxury / minimalist / practical / tech-forward / classic / rugged)
- Era/generation of car (modern 2020+ / recent 2015-2020 / older 2010-2015 / classic)
- Mood and ambiance (premium/luxurious / practical/functional / sporty / cozy)
- Quality level indicated by materials (luxury / mid-range / budget)

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.`,

    "car-dashboard": `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the dashboard (e.g. wheel only, console only): analyze ONLY what is VISIBLE. List explicitly which parts ARE visible. Do NOT describe or assume elements outside the frame.

## 2. CAR DASHBOARD STRUCTURE (CRITICAL - ONLY WHAT IS VISIBLE)

### Dashboard Layout (only if visible in frame):
- Dashboard shape and layout (angular / curved / multi-tier)
- Dashboard features visible: instrument cluster, infotainment screen, air vents, cup holders, storage cubbies
- Steering wheel size, design style, material (leather / fabric / grip material)
- Steering wheel angle: straight / tilted up / tilted down
- Steering column: extended / retracted
- Center console layout and contents visible
- Gear shift position and style
- Parking brake position

### Interior Elements:
- Door panels design: smooth / textured / with armrests / pockets visible
- Windows: tinted level (clear / lightly tinted / heavily tinted / privacy tinted)
- Visible through windows: exterior background (highway / parking / street / garage)
- Dashboard reflection on windshield (if visible)

## 3. MATERIALS & TEXTURES (CRITICAL - PRESERVE EXACTLY)

For EACH visible surface, specify:
- Dashboard material: plastic / leather / suede / wood / carbon fiber
- Dashboard finish: glossy / matte / soft-touch
- Texture patterns: grain, embossing, texture details
- Steering wheel material: leather / fabric / plastic
- Steering wheel grip texture and design
- Center console materials and finishes
- Door panel materials and textures
- Any wood, metal, or carbon fiber trim details

⚠️ CRITICAL: Materials must be preserved EXACTLY - only cleanliness should change appearance.

## 4. LIGHTING & ATMOSPHERE (CRITICAL)

- Natural light source: sunlight angle (from windshield / side windows)
- Sunlight intensity: bright / moderate / dim / none
- Shadows cast by steering wheel on dashboard
- Ambient cabin lighting: off / on / LED ambient lighting color
- Dashboard illumination: off / on / brightness level
- Screen glow from infotainment system (if on)
- Color temperature of light overall: warm (afternoon sun) / cool (overcast) / artificial
- Window reflections: clear / mirror-like / reflective glare
- Windshield glare intensity
- Overall brightness level: bright cabin / dark cabin / medium

## 5. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Dashboard color: exact shade and finish description
- Steering wheel color: exact shade and accent colors (if any)
- Door panel color: exact shade
- Accent colors: chrome details, wood trim, screen colors, etc.
- Warm vs cool tones balance: percentage warm vs cool
- Saturation levels: vibrant / muted / neutral

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 6. CLUTTER & MESS IN CAR (TO BE REMOVED - BE THOROUGH)

List ALL items that make the dashboard messy. For EACH item, specify:
- Item type and description
- EXACT location (on dashboard / in cupholders / on steering wheel / in center console)
- Size and quantity
- Condition (dirty, sticky, scattered, trash, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Dust and dirt accumulation on dashboard
- Fingerprints and smudges on steering wheel, screens, and controls
- Trash items on dashboard or in cupholders
- Papers, documents, receipts scattered
- Beverage containers in cupholders
- Sticky residue on surfaces
- Grease or grime on steering wheel
- Foggy or smudged windows (interior condensation / dust on glass)
- Visible personal items scattered (keys, phones, sunglasses, etc.)
- Hanging air freshener or decorations (if shabby or needs replacement)
- Coffee stains or beverage spills
- Scratches or scuffs on dashboard
- Dirt around air vents and controls

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 7. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position (on steering wheel / mounted on dashboard / in center console)
- Size, orientation, and attachment method
- Why it should stay (functional, decorative, safety feature)

**Specific examples - PRESERVE THESE**:
- Steering wheel (exact angle and position)
- Dashboard layout and all permanent fixtures
- Instrument cluster (exact position and design)
- Infotainment screen (exact position and size)
- Air vents and their orientation
- Climate control dials/buttons (exact state)
- Window switches and door controls
- Center console layout and storage positions
- Cupholder positions and orientation
- Gear shift (exact position)
- Parking brake position
- All dashboard warning lights and indicator locations

⚠️ CRITICAL: These items must remain in EXACT same positions - only organization/cleanliness can change.

## 8. ATMOSPHERE & STYLE (PRESERVE MOOD)

- Overall design theme (sporty / luxury / minimalist / practical / tech-forward / classic / rugged)
- Era/generation of car (modern 2020+ / recent 2015-2020 / older 2010-2015 / classic)
- Mood and ambiance (premium/luxurious / practical/functional / sporty / cozy)
- Quality level indicated by materials (luxury / mid-range / budget)
- Technology level visible (modern touch screen / physical buttons / mix)

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.`,

    "car-trunk": `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the trunk: analyze ONLY what is VISIBLE. List explicitly which parts ARE visible. Do NOT describe or assume elements outside the frame.

## 2. CAR TRUNK STRUCTURE (CRITICAL - ONLY WHAT IS VISIBLE)

### Trunk Layout (only if visible in frame):
- Trunk dimensions and shape
- Floor material: carpet / plastic / rubber mat / exposed metal
- Side panels: material, color, texture
- Trunk lid interior: material, color, finish
- Spare tire: visible / hidden / absent
- Storage compartments: positions, sizes, materials
- Trunk lighting: position, type, on/off state

### Visible Elements:
- Trunk opening: size, shape
- Hinges and mechanisms: positions, types
- Carpet/flooring condition: new / worn / damaged
- Any cargo area features

## 3. MATERIALS & TEXTURES (CRITICAL - PRESERVE EXACTLY)

For EACH visible surface, specify:
- Floor material: carpet / plastic / rubber / metal
- Floor texture and pattern
- Side panel materials: plastic / fabric / carpet
- Trunk lid interior material and finish
- Any visible structural elements

⚠️ CRITICAL: Materials must be preserved EXACTLY - only cleanliness should change appearance.

## 4. LIGHTING & ATMOSPHERE (CRITICAL)

- Natural light source: sunlight angle (from trunk opening)
- Sunlight intensity: bright / moderate / dim / none
- Trunk lighting: on / off, position, color temperature
- Shadows: positions, softness
- Overall brightness level: bright / dark / medium

## 5. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Floor color: exact shade
- Side panel colors: exact shades
- Trunk lid interior color: exact shade
- Overall color scheme: warm / cool / neutral
- Saturation levels: vibrant / muted / neutral

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 6. CLUTTER & MESS IN TRUNK (TO BE REMOVED - BE THOROUGH)

List ALL items that make the trunk messy. For EACH item, specify:
- Item type and description
- EXACT location (on floor / in corners / in storage compartments)
- Size and quantity
- Condition (dirty, sticky, scattered, trash, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Trash items and debris
- Dirt and dust accumulation
- Stains on carpet or surfaces
- Visible personal items scattered
- Spills or moisture marks
- Odor indicators (if noticeable in image)
- Loose items not properly stored

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 7. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position
- Size, color, style, and material
- Why it should stay (functional, decorative, safety feature)

**Specific examples - PRESERVE THESE**:
- Trunk structure: floor, side panels, lid interior (exact design PRESERVE)
- Spare tire (if visible and properly stored)
- Storage compartments (exact positions and design)
- Trunk lighting (exact position and type)
- Any permanent fixtures or equipment

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.

## 8. ATMOSPHERE & STYLE (PRESERVE MOOD)

- Overall design theme (practical / organized / utilitarian)
- Quality level indicated by materials (luxury / mid-range / budget)
- Condition baseline: new / slightly worn / heavily worn

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.`,

    sofa: `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the sofa or room (e.g. one cushion, back+seat only, arm only): analyze ONLY what is VISIBLE. List explicitly which parts ARE visible. Do NOT describe or assume elements outside the frame.

## 2. SOFA STRUCTURE & DESIGN (CRITICAL - ONLY WHAT IS VISIBLE)

### Sofa Type & Configuration (only if visible in frame):
- Sofa style: sectional / modular / straight / curved / L-shaped / U-shaped / chaise lounge / sleeper sofa
- Sofa size: 2-seater / 3-seater / 4-seater / XL / oversized
- Sectional configuration (if applicable): left-facing / right-facing / neutral
- Chaise position (if applicable): left / right / detachable
- Back style: high back / low back / no back / adjustable / pillow back
- Arm design: rolled / straight / low / high / with storage / wingback
- Legs: visible / hidden / metal / wood / upholstered / height
- Cushion type: down-filled / foam / memory foam / combination / firm / soft / sink-in
- Cushion count: number of seat cushions visible
- Back cushion arrangement: attached / removable / number of cushions
- Throw pillows: count, size, arrangement, placement
- Throw blanket: present / folded / draped / color / material / texture
- Sofa condition baseline: new / slightly worn / heavily worn / damaged areas

### Sofa Placement:
- Room positioning: against wall / floating / in corner / facing TV / facing fireplace
- Distance from walls: exact measurements (inches from walls)
- Orientation: facing forward / angled / parallel to wall
- Relationship to other furniture: distance to coffee table / entertainment center / other seating

## 3. SOFA MATERIALS & FABRIC (CRITICAL - PRESERVE EXACTLY)

### Upholstery Material:
- Fabric type: leather / microsuede / linen / velvet / polyester / cotton blend / performance fabric / synthetic
- Leather type (if applicable): top-grain / full-grain / genuine / faux / nubuck / suede finish
- Fabric color: exact shade [e.g., "charcoal gray", "cream", "deep navy", "warm taupe"]
- Fabric pattern: solid / textured / striped / checkered / floral / geometric / plaid / other pattern (describe in detail)
- Fabric weave: tight / loose / smooth / nubby / shaggy / chenille / velvet pile height
- Fabric finish: matte / glossy / satin / brushed
- Fabric condition baseline: clean / slightly stained / soiled / faded / pilled
- Stitching details: color, pattern, density, visible seams
- Piping or trim: color, material, style, locations
- Embellishments: buttons, tufting, nailhead trim, other decorative details

### Cushions & Pillows:
- Back cushions: material, fill, color, pattern, firmness
- Seat cushions: material, fill, color, pattern, firmness
- Throw pillows: count each pillow separately
  - Pillow 1: color, pattern, size, texture, material, exact position
  - Pillow 2: color, pattern, size, texture, material, exact position
  - [etc. for all pillows]
- Pillow covers: removable / fixed / zipper visible / material

### Other Elements:
- Throw blanket: material [wool / cotton / synthetic / chenille], color, weave pattern, drape
- Piping color and material: contrasting / matching / metallic
- Nail heads (if applicable): color, spacing, overall aesthetic impact

⚠️ CRITICAL: Fabric must be preserved EXACTLY - only cleanliness should change appearance.

## 4. SOFA CLEANLINESS BASELINE (DETAILED ASSESSMENT)

Document the CURRENT state of sofa before cleaning:
- Overall sofa appearance: pristine / clean / slightly soiled / heavily soiled / very dirty
- Visible stains: locations, types (food / drink / dirt / pet / unknown), size, darkness level
- Dust and dirt: general accumulation level, where concentrated
- Pilling: fabric pilling level (none / light / moderate / heavy)
- Odor indicators (if visible): freshness / staleness indication
- Pet hair: presence level (none / light / moderate / heavy), distribution
- Wrinkles and creases: natural from sitting / extra wrinkled / pressed appearance
- Color vibrancy: bright / slightly faded / significantly faded / discolored
- Shine level: matte / slightly shiny / very shiny (sweat marks)
- Overall maintenance level: well-maintained / neglected / mixed

## 5. ROOM CONTEXT (CRITICAL FOR LIVING ROOM FULL)

If visible in the image:
- Wall color and finish
- Floor type and color
- Other furniture: coffee table (material, color, style), TV stand, bookshelf, chairs, etc.
- Decor items: artwork, mirrors, plants, lamps, rugs, throws
- Windows: visible / curtains / blinds / natural light amount
- Doors: visible location and style
- Room size impression: small / medium / large / spacious
- Design style: modern / traditional / eclectic / minimalist / rustic / contemporary
- Color scheme: warm / cool / neutral / multi-colored

## 6. LIGHTING & ATMOSPHERE (CRITICAL)

- Primary light source: natural (windows / daylight) / artificial (overhead lights / lamps) / combination
- Light direction and angle: warm afternoon sun / cool morning light / harsh midday / soft artificial
- Shadows on sofa: shadow positions, lengths, softness, what casts them
- Reflections: on sofa surface, in room windows or mirrors
- Overall brightness: bright / medium / dim / moody
- Color temperature: warm (yellowish) / cool (bluish) / neutral
- Time of day impression (if applicable): morning / afternoon / evening
- Mood created by lighting: energetic / cozy / dramatic / neutral
- Any glare or hotspots on fabric

## 7. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Sofa primary color: exact shade and undertone [warm / cool / neutral]
- Sofa secondary colors (if patterned): all colors in pattern and approximate percentages
- Throw pillow colors: individually for each pillow
- Throw blanket color: exact shade
- Room wall colors: if visible
- Floor color: if visible
- Other furniture colors: if visible
- Accent colors: metallics, trim, piping colors
- Overall color harmony: monochromatic / complementary / analogous / triadic
- Warm vs cool balance of entire scene
- Saturation levels: vibrant / muted / neutral / washed out
- Any color fading or discoloration patterns

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 8. CLUTTER & MESS (TO BE REMOVED - BE THOROUGH)

List ALL items that make the sofa/room messy. For EACH item, specify:
- Item type and description
- EXACT location on sofa or in room (left armrest / center cushion / right corner / floor beneath / coffee table / etc.)
- Size and quantity
- Condition (dirty, sticky, wrinkled, scattered, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Food debris on cushions or between cushions
- Beverage spills or stains (coffee, wine, juice, water)
- Crumbs scattered on fabric
- Sticky residue from spills
- Dirt and dust accumulation on surfaces and between cushions
- Pet hair and dander (significant amounts)
- Pilling and fabric wear showing
- Visible wrinkles and creases (other than natural sitting wrinkles)
- Fallen throw pillow stuffing or fibers
- Loose threads or tears in fabric
- Faded spots from sun exposure or uneven cleaning
- Odor indicators (visible moisture / discoloration suggesting odor)
- Stains of unknown origin
- Ring marks from glasses or cups
- Makeup stains (lipstick, foundation, etc.)
- Ink or pen marks
- Chewing gum or adhesive residue
- General grime and dullness
- Cushion indentation that won't recover
- Unraveling seams
- Discolored piping or trim
- Dusty or dirty throw blanket (if present)
- Soiled throw pillows
- Clutter on sofa surface (remote controls, phones, magazines, books, toys, etc.)
- Items under sofa visible (dust bunnies, lost items, debris)
- Disorganized throw pillows (scattered instead of arranged)
- Room clutter affecting presentation (visible mess on coffee table, floor, etc.)

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 9. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position and arrangement
- Size, color, style, and material
- Why it should stay

**Specific examples - PRESERVE THESE**:
- Sofa structure: frame, legs, armrests (exact positions and design)
- Sofa fabric: material type, color, pattern, texture (PRESERVE - just clean)
- Cushion structure: back cushions, seat cushions (PRESERVE - just clean)
- Throw pillows: exact count, arrangement, colors, patterns (PRESERVE - just clean)
- Throw blanket: fold/drape arrangement (if intentional), color (PRESERVE - just clean)
- Sofa legs: exact material, color, style, visible wear patterns (PRESERVE as-is)
- Piping and trim: exact color and placement (PRESERVE - just clean)
- Any built-in features: recliners, storage, cup holders (exact state PRESERVE)
- Room furniture positions: coffee table, TV stand, other seating (EXACT positions PRESERVE)
- Decor items: artwork, plants, lamps (EXACT positions PRESERVE)
- Rug or carpet under sofa (exact placement and pattern PRESERVE)
- Any damage that's structural: worn spots, faded areas (acceptable if not "dirty")

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.`,

    "sofa-living-room": `## 0. PARTIAL VIEW (MANDATORY IF APPLICABLE)
- If the image shows ONLY A PART of the sofa or room: analyze ONLY what is VISIBLE. List explicitly which parts ARE visible. Do NOT describe or assume elements outside the frame.

## 2. SOFA STRUCTURE & DESIGN (CRITICAL - ONLY WHAT IS VISIBLE)

### Sofa Type & Configuration (only if visible in frame):
- Sofa style: sectional / modular / straight / curved / L-shaped / U-shaped / chaise lounge / sleeper sofa
- Sofa size: 2-seater / 3-seater / 4-seater / XL / oversized
- Sectional configuration (if applicable): left-facing / right-facing / neutral
- Chaise position (if applicable): left / right / detachable
- Back style: high back / low back / no back / adjustable / pillow back
- Arm design: rolled / straight / low / high / with storage / wingback
- Legs: visible / hidden / metal / wood / upholstered / height
- Cushion type: down-filled / foam / memory foam / combination / firm / soft / sink-in
- Cushion count: number of seat cushions visible
- Back cushion arrangement: attached / removable / number of cushions
- Throw pillows: count, size, arrangement, placement
- Throw blanket: present / folded / draped / color / material / texture
- Sofa condition baseline: new / slightly worn / heavily worn / damaged areas

### Sofa Placement:
- Room positioning: against wall / floating / in corner / facing TV / facing fireplace
- Distance from walls: exact measurements (inches from walls)
- Orientation: facing forward / angled / parallel to wall
- Relationship to other furniture: distance to coffee table / entertainment center / other seating

## 3. SOFA MATERIALS & FABRIC (CRITICAL - PRESERVE EXACTLY)

### Upholstery Material:
- Fabric type: leather / microsuede / linen / velvet / polyester / cotton blend / performance fabric / synthetic
- Leather type (if applicable): top-grain / full-grain / genuine / faux / nubuck / suede finish
- Fabric color: exact shade [e.g., "charcoal gray", "cream", "deep navy", "warm taupe"]
- Fabric pattern: solid / textured / striped / checkered / floral / geometric / plaid / other pattern (describe in detail)
- Fabric weave: tight / loose / smooth / nubby / shaggy / chenille / velvet pile height
- Fabric finish: matte / glossy / satin / brushed
- Fabric condition baseline: clean / slightly stained / soiled / faded / pilled
- Stitching details: color, pattern, density, visible seams
- Piping or trim: color, material, style, locations
- Embellishments: buttons, tufting, nailhead trim, other decorative details

### Cushions & Pillows:
- Back cushions: material, fill, color, pattern, firmness
- Seat cushions: material, fill, color, pattern, firmness
- Throw pillows: count each pillow separately
  - Pillow 1: color, pattern, size, texture, material, exact position
  - Pillow 2: color, pattern, size, texture, material, exact position
  - [etc. for all pillows]
- Pillow covers: removable / fixed / zipper visible / material

### Other Elements:
- Throw blanket: material [wool / cotton / synthetic / chenille], color, weave pattern, drape
- Piping color and material: contrasting / matching / metallic
- Nail heads (if applicable): color, spacing, overall aesthetic impact

⚠️ CRITICAL: Fabric must be preserved EXACTLY - only cleanliness should change appearance.

## 4. SOFA CLEANLINESS BASELINE (DETAILED ASSESSMENT)

Document the CURRENT state of sofa before cleaning:
- Overall sofa appearance: pristine / clean / slightly soiled / heavily soiled / very dirty
- Visible stains: locations, types (food / drink / dirt / pet / unknown), size, darkness level
- Dust and dirt: general accumulation level, where concentrated
- Pilling: fabric pilling level (none / light / moderate / heavy)
- Odor indicators (if visible): freshness / staleness indication
- Pet hair: presence level (none / light / moderate / heavy), distribution
- Wrinkles and creases: natural from sitting / extra wrinkled / pressed appearance
- Color vibrancy: bright / slightly faded / significantly faded / discolored
- Shine level: matte / slightly shiny / very shiny (sweat marks)
- Overall maintenance level: well-maintained / neglected / mixed

## 5. ROOM CONTEXT (CRITICAL FOR LIVING ROOM FULL)

If visible in the image:
- Wall color and finish
- Floor type and color
- Other furniture: coffee table (material, color, style), TV stand, bookshelf, chairs, etc.
- Decor items: artwork, mirrors, plants, lamps, rugs, throws
- Windows: visible / curtains / blinds / natural light amount
- Doors: visible location and style
- Room size impression: small / medium / large / spacious
- Design style: modern / traditional / eclectic / minimalist / rustic / contemporary
- Color scheme: warm / cool / neutral / multi-colored

## 6. LIGHTING & ATMOSPHERE (CRITICAL)

- Primary light source: natural (windows / daylight) / artificial (overhead lights / lamps) / combination
- Light direction and angle: warm afternoon sun / cool morning light / harsh midday / soft artificial
- Shadows on sofa: shadow positions, lengths, softness, what casts them
- Reflections: on sofa surface, in room windows or mirrors
- Overall brightness: bright / medium / dim / moody
- Color temperature: warm (yellowish) / cool (bluish) / neutral
- Time of day impression (if applicable): morning / afternoon / evening
- Mood created by lighting: energetic / cozy / dramatic / neutral
- Any glare or hotspots on fabric

## 7. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Sofa primary color: exact shade and undertone [warm / cool / neutral]
- Sofa secondary colors (if patterned): all colors in pattern and approximate percentages
- Throw pillow colors: individually for each pillow
- Throw blanket color: exact shade
- Room wall colors: if visible
- Floor color: if visible
- Other furniture colors: if visible
- Accent colors: metallics, trim, piping colors
- Overall color harmony: monochromatic / complementary / analogous / triadic
- Warm vs cool balance of entire scene
- Saturation levels: vibrant / muted / neutral / washed out
- Any color fading or discoloration patterns

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 8. CLUTTER & MESS (TO BE REMOVED - BE THOROUGH)

List ALL items that make the sofa/room messy. For EACH item, specify:
- Item type and description
- EXACT location on sofa or in room (left armrest / center cushion / right corner / floor beneath / coffee table / etc.)
- Size and quantity
- Condition (dirty, sticky, wrinkled, scattered, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Food debris on cushions or between cushions
- Beverage spills or stains (coffee, wine, juice, water)
- Crumbs scattered on fabric
- Sticky residue from spills
- Dirt and dust accumulation on surfaces and between cushions
- Pet hair and dander (significant amounts)
- Pilling and fabric wear showing
- Visible wrinkles and creases (other than natural sitting wrinkles)
- Fallen throw pillow stuffing or fibers
- Loose threads or tears in fabric
- Faded spots from sun exposure or uneven cleaning
- Odor indicators (visible moisture / discoloration suggesting odor)
- Stains of unknown origin
- Ring marks from glasses or cups
- Makeup stains (lipstick, foundation, etc.)
- Ink or pen marks
- Chewing gum or adhesive residue
- General grime and dullness
- Cushion indentation that won't recover
- Unraveling seams
- Discolored piping or trim
- Dusty or dirty throw blanket (if present)
- Soiled throw pillows
- Clutter on sofa surface (remote controls, phones, magazines, books, toys, etc.)
- Items under sofa visible (dust bunnies, lost items, debris)
- Disorganized throw pillows (scattered instead of arranged)
- Room clutter affecting presentation (visible mess on coffee table, floor, etc.)

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 9. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position and arrangement
- Size, color, style, and material
- Why it should stay

**Specific examples - PRESERVE THESE**:
- Sofa structure: frame, legs, armrests (exact positions and design)
- Sofa fabric: material type, color, pattern, texture (PRESERVE - just clean)
- Cushion structure: back cushions, seat cushions (PRESERVE - just clean)
- Throw pillows: exact count, arrangement, colors, patterns (PRESERVE - just clean)
- Throw blanket: fold/drape arrangement (if intentional), color (PRESERVE - just clean)
- Sofa legs: exact material, color, style, visible wear patterns (PRESERVE as-is)
- Piping and trim: exact color and placement (PRESERVE - just clean)
- Any built-in features: recliners, storage, cup holders (exact state PRESERVE)
- Room furniture positions: coffee table, TV stand, other seating (EXACT positions PRESERVE)
- Decor items: artwork, plants, lamps (EXACT positions PRESERVE)
- Rug or carpet under sofa (exact placement and pattern PRESERVE)
- Any damage that's structural: worn spots, faded areas (acceptable if not "dirty")

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.`,

    "living-room-full": `## 2. LIVING ROOM STRUCTURE

- Room dimensions and layout
- Seating arrangement: positions, configuration
- Windows: positions, sizes, types, treatments
- Doors: positions, types
- Fireplace: if present, type, material, position
- Built-in features (shelves, entertainment center)

## 3. SOFA STRUCTURE & DESIGN (CRITICAL)

### Sofa Type & Configuration:
- Sofa style: sectional / modular / straight / curved / L-shaped / U-shaped / chaise lounge / sleeper sofa
- Sofa size: 2-seater / 3-seater / 4-seater / XL / oversized
- Sectional configuration (if applicable): left-facing / right-facing / neutral
- Chaise position (if applicable): left / right / detachable
- Back style: high back / low back / no back / adjustable / pillow back
- Arm design: rolled / straight / low / high / with storage / wingback
- Legs: visible / hidden / metal / wood / upholstered / height
- Cushion type: down-filled / foam / memory foam / combination / firm / soft / sink-in
- Cushion count: number of seat cushions visible
- Back cushion arrangement: attached / removable / number of cushions
- Throw pillows: count, size, arrangement, placement
- Throw blanket: present / folded / draped / color / material / texture
- Sofa condition baseline: new / slightly worn / heavily worn / damaged areas

### Sofa Placement:
- Room positioning: against wall / floating / in corner / facing TV / facing fireplace
- Distance from walls: exact measurements (inches from walls)
- Orientation: facing forward / angled / parallel to wall
- Relationship to other furniture: distance to coffee table / entertainment center / other seating

## 4. SOFA MATERIALS & FABRIC (CRITICAL - PRESERVE EXACTLY)

### Upholstery Material:
- Fabric type: leather / microsuede / linen / velvet / polyester / cotton blend / performance fabric / synthetic
- Leather type (if applicable): top-grain / full-grain / genuine / faux / nubuck / suede finish
- Fabric color: exact shade [e.g., "charcoal gray", "cream", "deep navy", "warm taupe"]
- Fabric pattern: solid / textured / striped / checkered / floral / geometric / plaid / other pattern (describe in detail)
- Fabric weave: tight / loose / smooth / nubby / shaggy / chenille / velvet pile height
- Fabric finish: matte / glossy / satin / brushed
- Fabric condition baseline: clean / slightly stained / soiled / faded / pilled
- Stitching details: color, pattern, density, visible seams
- Piping or trim: color, material, style, locations
- Embellishments: buttons, tufting, nailhead trim, other decorative details

### Cushions & Pillows:
- Back cushions: material, fill, color, pattern, firmness
- Seat cushions: material, fill, color, pattern, firmness
- Throw pillows: count each pillow separately
  - Pillow 1: color, pattern, size, texture, material, exact position
  - Pillow 2: color, pattern, size, texture, material, exact position
  - [etc. for all pillows]
- Pillow covers: removable / fixed / zipper visible / material

### Other Elements:
- Throw blanket: material [wool / cotton / synthetic / chenille], color, weave pattern, drape
- Piping color and material: contrasting / matching / metallic
- Nail heads (if applicable): color, spacing, overall aesthetic impact

⚠️ CRITICAL: Fabric must be preserved EXACTLY - only cleanliness should change appearance.

## 5. SURFACES & MATERIALS

- Floor: material (carpet / wood / tile), pattern, condition
- Walls: material, color, finish
- Ceiling: material, finish
- Window treatments: types, colors, styles

## 6. FURNITURE & DECOR

- Seating: sofas, chairs, positions, sizes, materials, colors
- Tables: coffee table, side tables, positions, materials
- Entertainment: TV, speakers, positions
- Storage: shelves, cabinets, materials, styles
- Decorative items: art, plants, accessories

## 7. LIGHTING ANALYSIS

- Natural light: windows, direction, intensity
- Artificial light: ceiling lights, floor lamps, table lamps, styles
- Overall brightness and mood`,

    armchair: `## 2. ARMCHAIR STRUCTURE & DESIGN (CRITICAL)

### Armchair Type & Configuration:
- Armchair style: wingback / recliner / accent / swivel / club / modern / traditional
- Armchair size: small / medium / large / oversized
- Back style: high back / low back / no back / adjustable
- Arm design: rolled / straight / low / high / wingback
- Legs: visible / hidden / metal / wood / upholstered / height
- Cushion type: down-filled / foam / memory foam / combination / firm / soft
- Back cushion: attached / removable / none
- Throw pillow: present / absent / color / material / position
- Throw blanket: present / folded / draped / color / material / texture
- Armchair condition baseline: new / slightly worn / heavily worn / damaged areas

### Armchair Placement:
- Room positioning: against wall / floating / in corner / next to window
- Distance from walls: exact measurements
- Orientation: facing forward / angled / rotated
- Relationship to other furniture: distance to side table / lamp / other seating

## 3. ARMCHAIR MATERIALS & FABRIC (CRITICAL - PRESERVE EXACTLY)

### Upholstery Material:
- Fabric type: leather / microsuede / linen / velvet / polyester / cotton blend / performance fabric / synthetic
- Leather type (if applicable): top-grain / full-grain / genuine / faux / nubuck / suede finish
- Fabric color: exact shade [e.g., "charcoal gray", "cream", "deep navy", "warm taupe"]
- Fabric pattern: solid / textured / striped / checkered / floral / geometric / plaid / other pattern (describe in detail)
- Fabric weave: tight / loose / smooth / nubby / shaggy / chenille / velvet pile height
- Fabric finish: matte / glossy / satin / brushed
- Fabric condition baseline: clean / slightly stained / soiled / faded / pilled
- Stitching details: color, pattern, density, visible seams
- Piping or trim: color, material, style, locations
- Embellishments: buttons, tufting, nailhead trim, other decorative details

### Cushions & Pillows:
- Seat cushion: material, fill, color, pattern, firmness
- Back cushion: material, fill, color, pattern, firmness (if present)
- Throw pillow: color, pattern, size, texture, material, exact position (if present)

### Other Elements:
- Throw blanket: material [wool / cotton / synthetic / chenille], color, weave pattern, drape (if present)
- Piping color and material: contrasting / matching / metallic
- Nail heads (if applicable): color, spacing, overall aesthetic impact

⚠️ CRITICAL: Fabric must be preserved EXACTLY - only cleanliness should change appearance.

## 4. ARMCHAIR CLEANLINESS BASELINE (DETAILED ASSESSMENT)

Document the CURRENT state of armchair before cleaning:
- Overall armchair appearance: pristine / clean / slightly soiled / heavily soiled / very dirty
- Visible stains: locations, types (food / drink / dirt / pet / unknown), size, darkness level
- Dust and dirt: general accumulation level, where concentrated
- Pilling: fabric pilling level (none / light / moderate / heavy)
- Odor indicators (if visible): freshness / staleness indication
- Pet hair: presence level (none / light / moderate / heavy), distribution
- Wrinkles and creases: natural from sitting / extra wrinkled / pressed appearance
- Color vibrancy: bright / slightly faded / significantly faded / discolored
- Shine level: matte / slightly shiny / very shiny (sweat marks)
- Overall maintenance level: well-maintained / neglected / mixed

## 5. ROOM CONTEXT

If visible in the image:
- Wall color and finish
- Floor type and color
- Other furniture: side table, lamp, other seating, etc.
- Decor items: artwork, mirrors, plants, rugs
- Windows: visible / curtains / blinds / natural light amount
- Room size impression: small / medium / large / spacious
- Design style: modern / traditional / eclectic / minimalist / rustic / contemporary
- Color scheme: warm / cool / neutral / multi-colored

## 6. LIGHTING & ATMOSPHERE (CRITICAL)

- Primary light source: natural (windows / daylight) / artificial (overhead lights / lamps) / combination
- Light direction and angle: warm afternoon sun / cool morning light / harsh midday / soft artificial
- Shadows on armchair: shadow positions, lengths, softness, what casts them
- Reflections: on armchair surface, in room windows or mirrors
- Overall brightness: bright / medium / dim / moody
- Color temperature: warm (yellowish) / cool (bluish) / neutral
- Time of day impression (if applicable): morning / afternoon / evening
- Mood created by lighting: energetic / cozy / dramatic / neutral
- Any glare or hotspots on fabric

## 7. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)

- Armchair primary color: exact shade and undertone [warm / cool / neutral]
- Armchair secondary colors (if patterned): all colors in pattern and approximate percentages
- Throw pillow color: exact shade (if present)
- Throw blanket color: exact shade (if present)
- Room wall colors: if visible
- Floor color: if visible
- Other furniture colors: if visible
- Accent colors: metallics, trim, piping colors
- Overall color harmony: monochromatic / complementary / analogous / triadic
- Warm vs cool balance of entire scene
- Saturation levels: vibrant / muted / neutral / washed out
- Any color fading or discoloration patterns

⚠️ CRITICAL: Colors must be preserved exactly - only cleanliness should change appearance.

## 8. CLUTTER & MESS (TO BE REMOVED - BE THOROUGH)

List ALL items that make the sofa/room messy. For EACH item, specify:
- Item type and description
- EXACT location on sofa or in room
- Size and quantity
- Condition (dirty, sticky, wrinkled, scattered, etc.)

**Specific examples - REMOVE ALL OF THESE IF PRESENT**:
- Food debris on cushions or between cushions
- Beverage spills or stains
- Crumbs scattered on fabric
- Sticky residue from spills
- Dirt and dust accumulation
- Pet hair and dander
- Pilling and fabric wear
- Visible wrinkles and creases
- Stains of unknown origin
- Clutter on surfaces
- Room clutter affecting presentation

⚠️ CRITICAL: List EVERYTHING that needs to be removed - nothing should be missed.

## 9. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)

List items that should STAY exactly as they are. For EACH item, specify:
- Item type and description
- EXACT position and arrangement
- Size, color, style, and material
- Why it should stay

**Specific examples - PRESERVE THESE**:
- Sofa structure and fabric (PRESERVE - just clean)
- Cushion structure (PRESERVE - just clean)
- Throw pillows and blanket (PRESERVE - just clean)
- Room furniture positions (EXACT positions PRESERVE)
- Decor items (EXACT positions PRESERVE)

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.`,
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

  // Pour les types car-* et sofa-*, ils ont déjà leurs propres sections 6-8
  // On ajoute seulement les sections 9 et 10 finales
  const isCarOrSofaType =
    spaceType.startsWith("car-") ||
    spaceType === "sofa" ||
    spaceType === "sofa-living-room" ||
    spaceType === "living-room-full" ||
    spaceType === "armchair";

  if (isCarOrSofaType) {
    const finalSections = `## 9. ATMOSPHERE & STYLE (PRESERVE MOOD)

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

    return `${basePrompt}

${spaceSpecific}

${finalSections}`;
  }

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
  spaceType: SpaceType = "auto",
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
      case "car-interior":
      case "car-seats":
      case "car-dashboard":
      case "car-trunk":
        return `### CAR-SPECIFIC PRESERVATION (STRUCTURE ONLY - CLEANING IS AGGRESSIVE)
✓ PARTIAL VIEW: Clean and improve ONLY what is visible in the frame. Do NOT generate, complete, or invent any part of the car outside the image (e.g. do not add steering wheel or full seat if only floor is visible).

**PRESERVE (Structure & Design - ~95%):**
✓ Keep same steering wheel angle, size, design, material type, color
✓ Keep same dashboard layout, shape, and fixture positions
✓ Keep same seat positions, recline angles, and orientations
✓ Keep same seating arrangement (front/rear, bucket/bench)
✓ Keep same color scheme of interior elements (base colors)
✓ Keep same material types for seats, dashboard, panels (leather/fabric/plastic textures)
✓ Keep same floor mat position, color, pattern, and material
✓ Keep same headliner color and material
✓ Keep same door panel layout and design
✓ Keep same air vent positions and orientations
✓ Keep same dashboard features (buttons, screen, vents, cubbies)
✓ Keep same center console layout and storage positions
✓ Keep same window tint level (clear/lightly/heavily tinted)
✓ Keep same exterior view through windows (background preservation)
✓ Keep same natural light direction from windows
✓ Keep same interior ambient lighting state (on/off/color)

**AGGRESSIVE CLEANING ALLOWED (Particles & Dirt - 100% Removal):**
→ You CAN and MUST completely remove ALL particles, crumbs, miettes, specks, stains, and dirt
→ You CAN clean surfaces to make them look brand new - this is EXPECTED
→ You CAN remove embedded dirt from carpet fibers - make carpet look fresh
→ You CAN remove all dust, smudges, and fingerprints - surfaces should shine
→ You CAN remove all particles from seams, crevices, and hard-to-reach areas
→ The goal is PERFECT cleanliness - don't hesitate to remove ANY visible dirt or particles

**DO NOT:**
✗ DO NOT change steering wheel angle or position
✗ DO NOT move or reposition any seats
✗ DO NOT change seat fabric type or material (but clean it perfectly)
✗ DO NOT change dashboard layout or features
✗ DO NOT change base interior color scheme (but make colors look fresh)
✗ DO NOT change window tint or exterior background view
✗ DO NOT add or remove any permanent fixtures`;
      case "sofa":
      case "sofa-living-room":
      case "living-room-full":
      case "armchair":
        return `### SOFA-SPECIFIC PRESERVATION (CRITICAL - MOST IMPORTANT)
✓ PARTIAL VIEW: Clean and improve ONLY what is visible in the frame. Do NOT generate, complete, or invent any part of the sofa or room outside the image (e.g. do not add missing cushions or arms).
✓ Keep EXACT same sofa style, size, and configuration
✓ Keep EXACT same sofa frame shape and leg design
✓ Keep EXACT same fabric type [leather/microsuede/linen/velvet/etc.] - DO NOT change material type
✓ Keep EXACT same fabric color - DO NOT change hues
✓ Keep EXACT same fabric pattern [if patterned] - preserve all pattern details
✓ Keep EXACT same fabric texture and weave - preserve nubby/velvet/smooth finish
✓ Keep EXACT same cushion configuration (back cushions, seat cushions)
✓ Keep EXACT same throw pillow count and positions
✓ Keep EXACT same throw pillow colors and patterns
✓ Keep EXACT same throw pillow sizes and arrangements
✓ Keep EXACT same throw blanket (if present) - color, material, drape/fold
✓ Keep EXACT same piping, trim, and decorative details
✓ Keep EXACT same armrest design and material
✓ Keep EXACT same sofa legs - material, color, visible wear patterns
✓ Keep EXACT same sofa positioning in room
✓ Keep EXACT same relationship to other furniture
✓ Keep EXACT same room layout and decor
✓ Keep EXACT same color scheme of entire space
✓ Keep EXACT same lighting conditions and mood
✓ Keep EXACT same any built-in features (recliners, storage)
✓ Keep EXACT same visible damage patterns (worn spots, fading)
✓ DO NOT reposition or rotate sofa
✓ DO NOT change fabric type or material
✓ DO NOT change colors or patterns
✓ DO NOT move throw pillows from their positions
✓ DO NOT add or remove throw pillows
✓ DO NOT change throw blanket arrangement (if intentional)
✓ DO NOT redecorated or change room styling`;
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
      case "car-interior":
      case "car-seats":
      case "car-dashboard":
      case "car-trunk":
        return `→ **🎯 MAIN GOAL: CREATE A STUNNING, GORGEOUS, MAGAZINE-QUALITY INTERIOR**

→ **🎯 PRIMARY GOAL - ZERO MIETTES (NON-NEGOTIABLE):** The result FAILS if ANY white/light speck, crumb, or miette remains on floor, mats, carpet, or seats. Clean MAXIMUM—ZERO particles left. No exceptions.
→ **RULE #1 - ZERO MIETTES**: Remove EVERY SINGLE white/light speck, particle, or dot from ALL surfaces. If you see ANY light-colored specks on floor mats, carpet, or seats - DELETE THEM IMMEDIATELY. They are MIETTES and must be 100% GONE.

→ **RULE #2 - ACCENTUATE COLORS FOR BEAUTY**: 
  - Black surfaces → Make them DEEPER, RICHER, MORE INTENSE BLACK - "more black" for stunning visual impact
  - All colors → INCREASE saturation and intensity - make them more vibrant, rich, and beautiful
  - Goal: Create a BEAUTIFUL, GORGEOUS result - even if less realistic, prioritize BEAUTY

→ **FLOOR & CARPET - ZERO MIETTES + DEEP BLACK ACCENTUATION**:
→ **STEP 1 - DELETE ALL MIETTES**: Scan carpet and floor mats. If you see ANY white/light specks, particles, or dots → DELETE THEM ALL IMMEDIATELY. ZERO tolerance - they must be 100% GONE.
→ **STEP 2 - DEEP BLACK ACCENTUATION**: If carpet/mats are black → Make them MUCH DEEPER, RICHER, MORE INTENSE BLACK. Think "luxury showroom" - black should be DEEP and RICH, not just clean.
→ **STEP 3 - ENHANCE ALL COLORS**: If carpet/mats are grey or colored → INCREASE saturation significantly. Make colors more vibrant, rich, and beautiful.
→ Remove ALL dust, dirt, grime, particles - COMPLETE elimination
→ Remove ALL debris from under seats, between rails, in crevices - ZERO particles anywhere
→ **FINAL FLOOR CHECK**: 
  - ✓ ZERO white/light specks visible? If NO → DELETE remaining specks
  - ✓ Black surfaces DEEP and RICH? If NO → Make them DEEPER BLACK
  - ✓ Colors vibrant and beautiful? If NO → Increase saturation more
→ Result: PERFECTLY clean floor with ZERO miettes + DEEP, RICH, ACCENTUATED colors

→ **SEATS - ZERO MIETTES + DEEP BLACK ACCENTUATION**:
→ **STEP 1 - DELETE ALL MIETTES**: Scan seat fabric. If you see ANY white/light specks, particles, or dots → DELETE THEM ALL IMMEDIATELY. ZERO tolerance - they must be 100% GONE.
→ **STEP 2 - DEEP BLACK ACCENTUATION**: If seats are black → Make them MUCH DEEPER, RICHER, MORE INTENSE BLACK. Think "luxury showroom" - black should be DEEP and RICH, not just clean.
→ **STEP 3 - ENHANCE ALL COLORS**: If seats are grey or colored → INCREASE saturation significantly. Make colors more vibrant, rich, and beautiful.
→ Remove ALL particles from seams, stitching, perforations, crevices - ZERO particles anywhere
→ Remove ALL dust, dirt, stains - COMPLETE elimination
→ **FINAL SEAT CHECK**: 
  - ✓ ZERO white/light specks visible? If NO → DELETE remaining specks
  - ✓ Black seats DEEP and RICH? If NO → Make them DEEPER BLACK
  - ✓ Colors vibrant and beautiful? If NO → Increase saturation more
→ Result: PERFECTLY clean seats with ZERO miettes + DEEP, RICH, ACCENTUATED colors

→ **DASHBOARD & SURFACES (SHOWROOM PERFECT)**:
→ Clean dashboard: remove ALL dust, dirt, fingerprints, spills, and particles - make it PERFECTLY clean (PRESERVE color, finish, and fixture positions)
→ Remove ALL dust from air vents, grilles, and ventilation openings - deep cleaning to PERFECTION
→ Remove ALL particles, crumbs, and debris - complete elimination - dashboard should look BRAND NEW
→ Clean all plastic surfaces: remove ALL dust, smudges, and fingerprints - make them SHINE like new
→ Enhance dashboard appearance: add subtle shine/polish to make it look PERFECT and well-maintained
→ Remove ALL dust and particles from instrument cluster, screens, and displays - make them CRYSTAL CLEAR
→ Dashboard must be COMPLETELY dust-free and spotless - SHOWROOM QUALITY

→ **STEERING WHEEL & CONTROLS (PERFECT - IDEALIZED)**:
→ Clean steering wheel: remove ALL grease, dirt, grime, and particles - make it look BRAND NEW (PRESERVE material and design)
→ Remove ALL dust, fingerprints, and smudges - make steering wheel look PERFECT and well-maintained
→ Enhance steering wheel appearance: add subtle shine/polish to make it look like NEW
→ Clean all controls, buttons, and switches - remove ALL dust and particles - make them PERFECT
→ Steering wheel must be IMMACULATE - like it just came from the factory

→ **CONSOLE & STORAGE (SHOWROOM PERFECT)**:
→ Clean center console: remove ALL spills, dirt, debris, crumbs, and particles - make it PERFECTLY clean (PRESERVE layout and accessibility)
→ Clean cupholders: remove ALL stains, spills, debris, and particles - make them SPOTLESS and PERFECT (PRESERVE position and material)
→ Remove ALL particles and debris from all storage compartments and pockets - PERFECT cleanliness
→ Enhance console appearance: make it look fresh and well-maintained - SHOWROOM QUALITY
→ Console must be PERFECTLY clean - no visible debris anywhere

→ **INTERIOR TRIM & DETAILS (SHOWROOM PERFECT)**:
→ Clean all interior trim: remove ALL dust, grime, and particles - make it PERFECTLY clean (PRESERVE material and color)
→ Remove ALL dust and particles from all trim pieces, bezels, and decorative elements - PERFECT result
→ Clean door panels: remove ALL dirt, smudges, and particles - make them look BRAND NEW
→ Enhance trim appearance: add subtle polish/shine to make it look PERFECT and well-maintained
→ Remove ALL dust and particles from headliner and roof areas - PERFECT cleanliness

→ **WINDOWS & GLASS (CRYSTAL CLEAR - PERFECT)**:
→ Clean windows from inside: remove ALL condensation, dust, fingerprints, fogging, and smudges - make them CRYSTAL CLEAR (PRESERVE tint level)
→ Windows must be PERFECTLY clear - like they just came from the factory - NO marks or particles

→ **SEAT BELTS & SAFETY (PERFECT)**:
→ Clean seat belts: remove ALL visible dirt, grime, and particles - make them look PERFECT (PRESERVE routing and position)
→ Remove ALL dust and debris from seat belt mechanisms - PERFECT cleanliness

→ **PEDALS & FOOT AREAS (SHOWROOM PERFECT)**:
→ Clean pedals and foot area: remove ALL dirt, mud, and debris - make them SPOTLESS
→ Remove ALL particles from pedal surfaces and surrounding areas - PERFECT result

→ **FINAL REQUIREMENTS - STUNNING BEAUTIFUL RENDERING**:
→ Remove ALL trash, residue, pet hair, stains - COMPLETE removal
→ **🎯 FINAL CHECKLIST - DO ALL OF THIS:**
  → **RENDER RULE**: When drawing the output, floor/mats/carpet/seats = UNIFORM dark color. Do NOT add white/light dots, specks, or grain on these surfaces.
  → **MIETTES CHECK**: Scan ENTIRE image. ANY white/light specks visible? → DELETE THEM ALL. ZERO miettes allowed.
  → **BLACK ACCENTUATION CHECK**: ALL black surfaces (carpet, seats, mats, dashboard) DEEP and RICH? → If NO, make them MUCH DEEPER BLACK.
  → **COLOR ENHANCEMENT CHECK**: ALL colors vibrant and beautiful? → If NO, INCREASE saturation significantly.
  → **BEAUTY CHECK**: Does it look STUNNING and GORGEOUS? → If NO, enhance colors more and remove any remaining specks.
→ **RESULT MUST BE**: 
  ✓ ZERO miettes/particles visible ANYWHERE
  ✓ Black surfaces DEEP, RICH, INTENSE BLACK - "more black"
  ✓ All colors VIBRANT, SATURATED, BEAUTIFUL
  ✓ Overall appearance: STUNNING, GORGEOUS, MAGAZINE-QUALITY
→ **REMEMBER**: Your goal is BEAUTY - even if less realistic, make it STUNNING and GORGEOUS with zero miettes and enhanced colors
→ **OUTPUT IMAGE RENDER RULE (CRITICAL):** When you RENDER the output image, floor/mats/carpet/seats must be SMOOTH and UNIFORM dark color. Do NOT draw or add any white, beige, or light dots/specks/grain on these surfaces. ZERO miettes in the rendered result—do not introduce particles while rendering.`;
      case "sofa":
      case "sofa-living-room":
      case "living-room-full":
      case "armchair":
        return `→ **🎯 PRIMARY GOAL - MAXIMUM CLEAN (NON-NEGOTIABLE):** The before/after must be VISIBLY different. ALL stains, dark spots, and dirt must be GONE. Fabric must look UNIFORMLY clean. If the result looks almost the same as before, it FAILS.
→ Remove ALL visible stains from fabric COMPLETELY (food, drink, dirt, pet, unknown origin) - every dark spot, ring, auréole must DISAPPEAR
→ Remove ALL dirt and dust accumulation from sofa surface
→ Remove ALL dust and debris from between cushions
→ Remove ALL pet hair from sofa fabric (thorough cleaning)
→ Clean and refresh sofa fabric - make it appear fresh and like-new
→ Remove any sticky residue or grime from fabric
→ Restore fabric color vibrancy (slightly) where dirt was hiding color
→ Straighten and fluff all cushions (seat and back cushions)
→ Clean all throw pillows: remove stains, dust, pet hair
→ Clean throw blanket (if present): remove stains, dust, wrinkles - fold neatly
→ Clean armrests thoroughly: remove dirt, grime, sweat marks
→ Clean sofa legs: remove dust and debris
→ Remove fabric pilling (where appropriate and possible)
→ Reduce visible wrinkles (steam effect - just from cleaning)
→ Clean piping and trim details
→ If applicable, clean visible cushion seams
→ Remove any odor indicators (visual signs of staleness)
→ Room decor: clean any visible dust on other furniture, artwork, plants, lamps
→ Sofa should look professionally cleaned and refreshed
→ All colors appear vibrant and true to original
→ Fabric appears soft, clean, and well-maintained
→ CRITICAL: Transform from "lived-in" to "showroom fresh" while preserving all original characteristics`;
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

YOUR TASK: Transform this space into its clean, beautiful version.

${
  spaceType.startsWith("car-")
    ? `⚠️ **FOR CAR INTERIORS - STYLIZED RENDERING ALLOWED**: This is IMAGE ENHANCEMENT for beauty. The result should be RECOGNIZABLY the same interior, but you can create a STUNNING, GORGEOUS, stylized result. Prioritize visual impact and beauty - even if slightly less realistic, make it BEAUTIFUL.

⚠️ **ALLOWED ENHANCEMENTS**: 
  - Slight perspective/composition optimizations for visual appeal
  - Enhanced lighting for beauty
  - Accentuated colors (deeper blacks, more saturated colors)
  - Stylized rendering for magazine-quality result
  - Visual impact over strict authenticity`
    : `⚠️ CRITICAL: This is IMAGE EDITING, not image generation. You MUST preserve the EXACT structure, layout, and composition of the original image.

⚠️ CONSISTENCY REQUIREMENT: For the same input image, you MUST produce IDENTICAL results every time. Follow the analysis EXACTLY and apply the same transformations consistently.`
}

${
  spaceType.startsWith("car-")
    ? `⚠️⚠️⚠️ CRITICAL FOR CAR INTERIORS - PERFECT BEAUTIFUL RENDERING ⚠️⚠️⚠️

**🎯 YOUR MAIN GOAL: CREATE A STUNNING, GORGEOUS, MAGAZINE-QUALITY INTERIOR**

**⚠️⚠️⚠️ RULE #1: ZERO MIETTES - ABSOLUTELY NONE ⚠️⚠️⚠️**

**MIETTES = ANY small white/light specks, particles, dots, or debris visible on ANY surface. DELETE THEM ALL.**

**SIMPLE RULE**: If you see ANY light-colored specks, dots, or particles on floor mats, carpet, or seats - DELETE THEM IMMEDIATELY. They are MIETTES and must be 100% GONE.

**⚠️⚠️⚠️ RULE #2: ACCENTUATE COLORS - MAKE IT BEAUTIFUL ⚠️⚠️⚠️**

**BLACK = DEEP, RICH, INTENSE BLACK**
- If you see black carpet, seats, or mats → Make them DEEPER, RICHER, MORE INTENSE BLACK
- Black should look "MORE BLACK" than original - deeper and richer for visual impact
- Think: "luxury car showroom" or "magazine photoshoot" - black should POP

**ALL COLORS = MORE SATURATED, MORE VIBRANT**
- Increase color saturation and intensity for ALL colors
- Make colors more vibrant, rich, and beautiful
- Even if less realistic - prioritize BEAUTY over realism

**MANDATORY CHECKLIST - DO ALL OF THIS:**
✓ Remove EVERY SINGLE white/light speck, particle, or dot from floor mats - ZERO visible
✓ Remove EVERY SINGLE white/light speck, particle, or dot from carpet - ZERO visible  
✓ Remove EVERY SINGLE white/light speck, particle, or dot from seats - ZERO visible
✓ Make ALL black surfaces DEEPER, RICHER, MORE INTENSE BLACK - "more black"
✓ Increase saturation of ALL colors - make them more vibrant and beautiful
✓ Create a STUNNING, GORGEOUS result - magazine-quality, showroom-quality
✓ The result must be BEAUTIFUL - even if slightly idealized

**FINAL CHECK BEFORE FINISHING:**
1. Scan entire image for ANY light specks/particles → DELETE THEM ALL
2. Check if black surfaces are DEEP and RICH → If not, make them DEEPER
3. Check if colors are VIBRANT and BEAUTIFUL → If not, increase saturation
4. Result should look STUNNING and GORGEOUS → If not, enhance more

**REMEMBER**: Your goal is to create a BEAUTIFUL, PERFECT rendering - not just clean, but STUNNING and GORGEOUS with zero miettes and enhanced colors.`
    : ""
}

## REQUIREMENTS - PRESERVE RECOGNIZABLE STRUCTURE (ALLOW STYLIZED RENDERING):

### CAMERA & PERSPECTIVE (SIMILAR BUT ALLOW ENHANCEMENT)

${
  spaceType.startsWith("car-")
    ? `✓ **FOR CAR INTERIORS - STYLIZED ALLOWED**: Similar camera angle and perspective - recognizable but can be slightly enhanced for beauty
✓ Similar perspective and composition - should be RECOGNIZABLY the same view
✓ Similar field of view - can be slightly adjusted for better visual impact
✓ Similar depth of field - can be enhanced for visual appeal
✓ Similar composition and framing - recognizable but can be optimized for beauty
✓ Similar crop and aspect ratio - can be slightly adjusted for better presentation
✓ **GOAL**: Keep it RECOGNIZABLY the same interior, but allow stylized enhancements for a STUNNING, BEAUTIFUL result`
    : `✓ EXACT same camera angle and position
✓ EXACT same perspective and vanishing points
✓ EXACT same field of view and lens characteristics
✓ EXACT same depth of field (what's in focus, what's blurred)
✓ EXACT same composition and framing
✓ EXACT same crop and aspect ratio`
}

### STRUCTURAL ELEMENTS (PRESERVE STRUCTURE - BUT CLEAN AGGRESSIVELY)

${spaceSpecificInstructions(spaceType)}

${spaceType.startsWith("car-") ? `⚠️ **IMPORTANT FOR CAR INTERIORS**: While preserving structure, you MUST be AGGRESSIVE in cleaning. Remove ALL particles, crumbs, and dirt - don't be conservative. The structure stays the same, but cleanliness should be PERFECT.` : ""}

### FURNITURE & OBJECTS (PRESERVE POSITIONS - BUT CLEAN THOROUGHLY)

✓ Keep ALL furniture in same positions
✓ Keep same furniture styles, colors, materials, and textures
✓ Keep same sizes, proportions, and orientations
✓ Keep same built-in elements and fixtures
✓ Keep permanent decorative items in same positions
✓ Keep pipes, hoses, drains, vents exactly as they are
✓ Keep all permanent equipment and tools in same positions
${spaceType.startsWith("car-") ? `✓ **FOR CAR INTERIORS**: Seats, dashboard, console stay in same positions, but you MUST clean them PERFECTLY - remove ALL particles, crumbs, and dirt from surfaces` : ""}
✓ DO NOT move, remove, or add any furniture
✓ DO NOT change furniture colors or styles (but make them look clean and fresh)

### SURFACES & MATERIALS (PRESERVE MATERIALS, CLEAN AGGRESSIVELY)

✓ Keep same floor/ground material and pattern
✓ Keep same tile patterns, grout lines, and layouts
✓ Keep same wall materials, colors, and textures
✓ Keep same surface finishes and materials
${spaceType.startsWith("car-") ? `✓ **FOR CAR INTERIORS**: Preserve carpet material, seat fabric, dashboard materials - but clean them AGGRESSIVELY to remove ALL embedded dirt, particles, and stains. Make surfaces look brand new while keeping the same materials.` : ""}
✓ Remove ALL dirt, stains, discoloration, particles, and debris - be THOROUGH
✓ Preserve all patterns, textures, and decorative elements (but make them clean)

### LIGHTING & ATMOSPHERE (SIMILAR BUT CAN BE ENHANCED)

${
  spaceType.startsWith("car-")
    ? `✓ **FOR CAR INTERIORS - ENHANCED LIGHTING ALLOWED**: Similar natural light direction - recognizable but can be enhanced for beauty
✓ Similar shadows - can be optimized for visual appeal
✓ Similar color temperature - can be slightly enhanced for warmth/beauty
✓ Similar overall brightness - can be optimized for visual impact
✓ Similar photographic mood - can be enhanced for stunning result
✓ Similar time of day appearance - recognizable but can be optimized
✓ Similar reflections - can be enhanced for visual appeal
✓ **ALLOWED**: Slight lighting enhancements for a more beautiful, stunning result - prioritize visual impact`
    : `✓ EXACT same natural light direction and intensity
✓ EXACT same shadows (positions, lengths, directions, softness)
✓ EXACT same color temperature of light (warm/cool)
✓ EXACT same overall brightness level
✓ EXACT same photographic mood and atmosphere
✓ EXACT same time of day appearance
✓ EXACT same reflections and highlights on surfaces
✓ DO NOT change lighting conditions or add new light sources`
}

### COLORS & PALETTE (ENHANCE & ACCENTUATE COLORS FOR BEAUTY)

✓ Keep same color palette and color relationships
✓ Keep same dominant, secondary, and accent colors
${
  spaceType.startsWith("car-")
    ? `✓ **FOR CAR INTERIORS - COLOR ACCENTUATION FOR BEAUTY**: 
  - **BLACK ACCENTUATION**: Make black surfaces (carpet, seats, mats, dashboard) DEEPER, RICHER, MORE INTENSE BLACK - enhance black to be "more black" for beautiful rendering
  - **GREY ACCENTUATION**: Make grey surfaces DEEPER and MORE SATURATED - enhance grey tones for visual appeal
  - **COLOR ENHANCEMENT**: Increase color saturation and intensity for ALL colored surfaces - make colors more vibrant and beautiful
  - **BEAUTIFUL RENDERING**: Even if slightly less realistic, create a STUNNING, BEAUTIFUL result with enhanced colors
  - **GOAL**: Make the interior look GORGEOUS with rich, deep, saturated colors - prioritize beauty over strict realism
  - Black should look DEEPER and RICHER - "more black" than original for visual impact
  - Colors should be ENHANCED and ACCENTUATED for a beautiful, magazine-quality result`
    : ""
}
✓ Enhance colors to appear "fresh", "clean", and "beautiful" - INCREASE saturation and depth for visual appeal
✓ Make colors more vibrant and rich - ENHANCE color intensity for beautiful rendering
✓ Keep same warm/cool tone balance (but enhance within that balance)
✓ **COLOR ENHANCEMENT FOR BEAUTY**: Colors should look clean, beautiful, and ENHANCED - make them more saturated and intense for stunning visual appeal

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
${
  spaceType.startsWith("car-")
    ? `✗ **CRITICAL FOR CAR INTERIORS - ZERO MIETTES POLICY**: Remove EVERY SINGLE crumb, miette, particle, speck, and stain
✗ **MIETTES ELIMINATION - HIGHEST PRIORITY**: Remove ALL small white specks, light particles, and dots from carpet, seats, floor mats, and ALL surfaces - these are MIETTES and MUST be COMPLETELY REMOVED
✗ Remove ALL small particles (white, beige, brown, grey, any color, any size) from carpet, seats, and all surfaces - ZERO TOLERANCE
✗ Remove ALL fine dust particles and debris - ZERO TOLERANCE for any visible particles - if you see a speck, REMOVE IT
✗ Remove ALL embedded dirt, crumbs, and particles from carpet fibers and seat fabric - deep cleaning to PERFECTION
✗ Remove ALL particles from seams, crevices, perforations, and hard-to-reach areas - NO particles should remain
✗ Remove ALL dust, smudges, and fingerprints from all surfaces - COMPLETE elimination
✗ **FLOOR MATS - ZERO MIETTES**: Remove ALL white specks and particles from floor mats - they are MIETTES and must be GONE
✗ **SEATS - ZERO MIETTES**: Remove ALL white specks and particles from seat fabric - they are MIETTES and must be GONE
✗ **FINAL CHECK**: Before finishing, scan the entire image for ANY white specks, light particles, or small dots - if you see ANY, REMOVE THEM - they are MIETTES
✗ NO exceptions - EVERY visible particle, crumb, miette, or speck must be removed for PERFECT cleanliness - ZERO MIETTES REMAINING`
    : ""
}

### CLEAN ALL SURFACES (MAKE PRISTINE, PRESERVE MATERIALS)

${
  spaceType.startsWith("car-")
    ? `⚠️⚠️⚠️ **CAR INTERIOR CLEANING - HIGHEST PRIORITY** ⚠️⚠️⚠️

**THIS IS THE MOST IMPORTANT PART FOR CAR INTERIORS:**
You are cleaning a CAR INTERIOR. The instructions below are EXTREMELY detailed and you MUST follow them PERFECTLY.
Every single particle, crumb, miette, and speck MUST be removed. This is not optional - it's MANDATORY.
Read the cleaning instructions below VERY CAREFULLY and execute them with ZERO TOLERANCE for any remaining particles.

`
    : ""
}

${spaceSpecificCleaning(spaceType)}

### ORGANIZE PRESERVED ITEMS (IF THEY MUST STAY)

→ Items from "ELEMENTS TO PRESERVE" stay but look organized and clean
→ Coil hoses neatly if they must stay (same position, just organized)
→ Align items properly (same items, just aligned)
→ Organize tools and equipment (if they belong in the space)
→ Make preserved items look intentional and well-maintained

## CRITICAL EDITING RULES (FOLLOW STRICTLY FOR CONSISTENCY):

${
  spaceType.startsWith("car-")
    ? `1. **PRESERVE RECOGNIZABLE STRUCTURE**: The space must be RECOGNIZABLY the same interior - similar layout (not necessarily IDENTICAL, but recognizable)
2. **ALLOW STYLIZED PERSPECTIVE**: Camera angle and composition should be SIMILAR - can be slightly enhanced for beauty (not necessarily IDENTICAL)
3. **PRESERVE MATERIALS**: Same materials, just clean (carpet stays carpet, leather stays leather) - NO material changes
4. **ENHANCE COLORS FOR BEAUTY**: ACCENTUATE colors - make black DEEPER and RICHER, increase saturation of all colors for beautiful rendering. This is MANDATORY for car interiors.
5. **ENHANCE LIGHTING FOR BEAUTY**: Similar lighting conditions - can be slightly enhanced for visual impact and beauty
6. **PRESERVE FURNITURE POSITIONS**: All furniture in similar positions - recognizable arrangement (not necessarily EXACT)
7. **CLEAN + ENHANCE**: Remove mess, dirt, stains, miettes AND enhance visual appeal for stunning result
8. **BEAUTIFUL RENDERING**: Create a STUNNING, GORGEOUS result - even if slightly stylized, prioritize beauty`
    : `1. PRESERVE STRUCTURE: The space must be RECOGNIZABLY the same space - IDENTICAL layout
2. PRESERVE PERSPECTIVE: Camera angle and composition must be IDENTICAL - no changes
3. PRESERVE MATERIALS: Same materials, just clean (tiles stay tiles, wood stays wood) - NO material changes
4. PRESERVE COLORS: Same color palette, just fresh and clean - NO color hue changes
5. PRESERVE LIGHTING: Same lighting conditions and shadows - IDENTICAL lighting
6. PRESERVE FURNITURE: All furniture in EXACT same positions - NO movement
7. ONLY CLEAN: Remove mess, dirt, stains, miettes - nothing else - NO additions or removals of permanent items
8. BE CONSISTENT: Apply the same cleaning transformations in the same way every time for the same image`
}

## QUALITY REQUIREMENTS:

${
  spaceType.startsWith("car-")
    ? `- **BEAUTIFUL, STUNNING RENDERING**: Create a gorgeous, magazine-quality result - even if slightly idealized
- **ENHANCED COLORS**: Colors should be ACCENTUATED - black deeper and richer, all colors more saturated and vibrant
- **ZERO MIETTES**: Absolutely NO visible particles, specks, or debris - PERFECT cleanliness
- **VISUAL IMPACT**: Result should be STUNNING and GORGEOUS - prioritize beauty over strict realism
- Professional showroom or magazine photoshoot quality
- Same photographic characteristics (grain, sharpness, exposure) but with enhanced color grading
- No cartoon, illustration, 3D render, or AI-artifact look
- Seamless editing (no visible seams, artifacts, or inconsistencies)
- **GOAL**: Beautiful, perfect, stunning result with zero miettes and enhanced colors`
    : `- Photorealistic quality (looks like a real photograph, not AI-generated)
- Natural, believable result (not artificial, fake, or oversaturated)
- Professional cleaning service standard (thorough but realistic)
- Same photographic characteristics (grain, sharpness, exposure, color grading)
- No cartoon, illustration, 3D render, or AI-artifact look
- Seamless editing (no visible seams, artifacts, or inconsistencies)`
}

## FINAL CHECK (VERIFY ALL BEFORE FINALIZING):

Before finalizing, verify EVERY item:
${
  spaceType.startsWith("car-")
    ? `✓ **FOR CAR INTERIORS - STYLIZED CHECKLIST**:
  ✓ Similar camera angle and perspective - RECOGNIZABLY the same view (can be slightly enhanced)
  ✓ Similar interior layout - RECOGNIZABLY the same car interior (not necessarily IDENTICAL)
  ✓ Similar furniture positions - RECOGNIZABLY the same arrangement (can be slightly optimized)
  ✓ Same materials - carpet, leather, plastic stay the same (just clean and enhanced)
  ✓ Similar lighting - RECOGNIZABLY similar (can be enhanced for beauty)
  ✓ **ENHANCED COLORS**: Black is DEEPER and RICHER, all colors are MORE SATURATED and VIBRANT
  ✓ **ZERO MIETTES**: ZERO visible particles, crumbs, miettes, or specks ANYWHERE - ABSOLUTELY NONE
  ✓ **MIETTES CHECK**: Verify that ALL white specks, light particles, and small dots have been COMPLETELY REMOVED
  ✓ **PERFECT CLEANLINESS**: All surfaces are IMMACULATE - NO MIETTES VISIBLE
  ✓ **BEAUTIFUL RENDERING**: Result is STUNNING, GORGEOUS, MAGAZINE-QUALITY - even if slightly stylized
  ✓ Result is RECOGNIZABLY the SAME car interior, but STUNNING and BEAUTIFUL with enhanced colors and zero miettes`
    : `✓ EXACT same camera angle and perspective (no changes)
✓ EXACT same room/space layout and dimensions (identical)
✓ EXACT same furniture positions and styles (no movement, no style changes)
✓ EXACT same materials and patterns (just clean, no material changes)
✓ EXACT same lighting and shadows (identical conditions)
✓ EXACT same color palette (just fresh, no hue changes)
✓ ALL clutter removed (thorough cleaning)
✓ ALL surfaces clean (spotless)
✓ Result is RECOGNIZABLY the SAME space, professionally cleaned
✓ Result would be IDENTICAL if processed again with same input`
}

${spaceType.startsWith("car-") ? `⚠️ **FOR CAR INTERIORS**: Result should be RECOGNIZABLY the same interior but STUNNING and BEAUTIFUL - prioritize visual impact and beauty over strict authenticity.` : `⚠️ CONSISTENCY CHECK: If you process this same image again, you MUST produce the EXACT same result.`}

${
  spaceType.startsWith("car-")
    ? `Think: "This is the SAME car interior, but now it's STUNNING and GORGEOUS. I have:
1. DELETED ALL miettes - ZERO white/light specks visible anywhere
2. ACCENTUATED ALL black surfaces - made them DEEPER, RICHER, MORE INTENSE BLACK - 'more black'
3. ENHANCED ALL colors - increased saturation to make them vibrant and beautiful
4. Created a PERFECT, IMMACULATE, BEAUTIFUL result - magazine-quality, showroom-quality
The interior structure is IDENTICAL, but it's PERFECTLY CLEAN with ZERO miettes and ENHANCED, ACCENTUATED colors. Black is DEEP and RICH. Colors are VIBRANT and BEAUTIFUL. The result is STUNNING and GORGEOUS - even if slightly idealized, it's BEAUTIFUL. Every time I see this image, I will create this STUNNING, BEAUTIFUL result with zero miettes and enhanced colors."`
    : `Think: "This is the SAME photograph, taken 2 hours after a professional cleaning crew finished. The space is IDENTICAL, just spotlessly clean. Every time I see this image, I will clean it in exactly the same way."`
}`,

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
