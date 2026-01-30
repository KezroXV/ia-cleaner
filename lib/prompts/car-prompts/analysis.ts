/**
 * Prompt d'analyse détaillée pour intérieur de voiture
 */
export function getCarAnalysisPrompt(): string {
  return `Analyze this car interior image in EXTREME DETAIL to enable IDENTICAL reconstruction after cleaning.

⚠️ PARTIAL VIEW RULE: The image may show ONLY A PART of the car interior (e.g. floor only, floor+seat base, door sill, one seat corner). You MUST analyze ONLY what is VISIBLE in the frame. Do NOT describe, infer, or assume any element that is outside the image or cut by the frame. Do NOT try to "complete" the car in your description. List explicitly which zones ARE visible (e.g. "Visible: driver floor mat, pedals area, seat base edge, door threshold") so the cleaning applies only to those areas.

⚠️ CRITICAL: Your analysis will be used to recreate this EXACT SAME interior, just cleaned.
Be EXTREMELY precise with ALL details that are actually visible.

⚠️ CONSISTENCY REQUIREMENT: For the same image, you MUST produce the SAME analysis 
every time. Be systematic and thorough.

## 0. SCOPE OF IMAGE (PARTIAL VIEW - MANDATORY FIRST STEP)

- Is this a FULL cabin view or a PARTIAL view? (partial = only part of interior is in frame)
- List EXACTLY which areas are VISIBLE: e.g. "floor mat only", "floor + lower seat + door sill", "dashboard + steering wheel", "seat base + rails + carpet"
- Do NOT list or describe anything that is not visible (e.g. if steering wheel is not in frame, do not describe it)

## 1. CAMERA & PERSPECTIVE (CRITICAL FOR PRESERVATION)

- EXACT camera angle (driver view / shotgun view / rear view / bird's eye / from above through sunroof)
- EXACT distance from subject (close-up on seats / medium interior view / wide cabin view)
- Lens characteristics: field of view (wide / normal / telephoto), distortion (fisheye/barrel)
- Depth of field: what's in sharp focus, what's blurred, blur amount
- Composition: which parts of interior are visible (steering wheel / dashboard / windshield / door panels / rear seats / headliner)
- Camera position: centered / off-center / tilted / rotated
- Visible through windows: exterior background (highway / parking / street / garage)
- Dashboard reflection on windshield (if visible)
- Sunlight angle and intensity entering through windows

## 2. CAR INTERIOR STRUCTURE (CRITICAL)

### Seating Configuration:
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

**⚠️⚠️⚠️ ZERO TOLERANCE FOR PARTICLES ⚠️⚠️⚠️**

**You MUST identify and list EVERY SINGLE visible particle, crumb, miette, speck, and stain:**

**PARTICLES & CRUMBS (MOST CRITICAL - LIST EVERY ONE):**
- **ALL crumbs and miettes** on carpet/floor (white, beige, brown, any color) - count approximate number and describe locations
- **ALL small particles** on seats (in seams, perforations, on surface) - describe each location
- **ALL fine dust particles** on dashboard, console, and all surfaces - describe distribution
- **ALL specks and debris** in crevices, between seats, under seats - describe locations
- **ALL embedded particles** in carpet fibers - describe areas affected
- **ALL particles** in seat seams, stitching, and perforations - describe each location
- **ALL small debris** in cupholders, storage areas, door pockets - describe contents
- **ALL fine particles** on threshold areas, door sills - describe locations
- **ALL crumbs and particles** around seat rails, bolts, and mechanical parts - describe locations

**⚠️⚠️⚠️ FLOOR MATS - ULTRA-CRITICAL INSPECTION ⚠️⚠️⚠️**

FLOOR MATS require EXTREME ATTENTION. You MUST identify EVERY detail:

**On RUBBER floor mats:**
- **EVERY particle** on the surface (sand, dirt, pebbles, crumbs, leaves, debris)
- **EVERY speck of dirt** in the grooves and ridges between the mat pattern
- **EVERY embedded particle** in the textured surface
- **ALL dirt** in the corners and edges of the mat
- **ALL stains** (mud, water marks, oil, dried spills, discoloration)
- **ALL dust** accumulated in the raised patterns
- Approximate particle count and exact locations (driver side front left corner, passenger side center, etc.)

**On TEXTILE/CARPET floor mats:**
- **EVERY crumb** embedded in the fibers (count them!)
- **EVERY particle** visible on the surface
- **ALL dirt** embedded deep in the pile
- **ALL stains** (coffee, mud, oil, food, mystery stains)
- **ALL discoloration** from wear or dirt
- **ALL pilling** or fiber wear showing dirt accumulation
- **ALL debris** in the binding or edges
- Exact description of dirt distribution (heavy in driver heel area, light elsewhere, etc.)

**Under and around floor mats:**
- **ALL dirt** visible where mat meets carpet
- **ALL debris** that has slipped under the mat
- **ALL particles** around the mat perimeter

**Floor mat cleanliness verification:**
You MUST answer these questions for EACH floor mat:
1. How many visible particles are on the mat surface? (estimate if >10)
2. Is there dirt in the grooves/ridges? How much? Where specifically?
3. Are there stains? What type? What color? Where exactly?
4. Is there embedded dirt in fibers? How extensive?
5. Are the edges and corners clean or dirty?
6. Overall cleanliness rating: pristine / slightly dirty / moderately dirty / very dirty / extremely dirty

⚠️ CRITICAL: Be OBSESSIVELY detailed about floor mats. Every speck matters!

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

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.

## 9. FINAL VERIFICATION CHECKLIST

Before completing your analysis, verify you have described:

✓ EXACT camera angle and perspective from interior
✓ EXACT seating configuration and positions
✓ EXACT dashboard layout and visible features
✓ EXACT positions of ALL visible objects and features
✓ EXACT materials, colors, and patterns for ALL surfaces
✓ EXACT lighting conditions from windows and internal lights
✓ EXACT color palette and relationships
✓ COMPLETE list of ALL clutter and mess to remove
✓ COMPLETE list of ALL elements to preserve
✓ EXACT atmosphere and style of the vehicle interior
✓ Visible exterior through windows (preserve background)

⚠️ CRITICAL: Be EXTREMELY precise with spatial relationships, colors, and positions. 
Every detail matters for identical reconstruction.

⚠️ CONSISTENCY: Use the same level of detail, same structure, and same precision every time 
you analyze this image. Your analysis should be deterministic and reproducible.`;
}
