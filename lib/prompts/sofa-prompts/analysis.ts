/**
 * Prompt d'analyse détaillée pour canapé/salon
 */
export function getSofaAnalysisPrompt(): string {
  return `Analyze this sofa/living room image in EXTREME DETAIL to enable IDENTICAL reconstruction after cleaning.

⚠️ PARTIAL VIEW RULE: The image may show ONLY A PART of the sofa or room (e.g. one cushion, back+seat only, arm only, close-up of fabric). You MUST analyze ONLY what is VISIBLE in the frame. Do NOT describe, infer, or assume any element that is outside the image or cut by the frame. Do NOT try to "complete" the sofa or room in your description. List explicitly which parts ARE visible (e.g. "Visible: seat cushion, back cushion, small strip of floor") so the cleaning applies only to those areas.

⚠️ CRITICAL: Your analysis will be used to recreate this EXACT SAME space, just cleaned.
Be EXTREMELY precise with ALL details that are actually visible.

⚠️ CONSISTENCY REQUIREMENT: For the same image, you MUST produce the SAME analysis 
every time. Be systematic and thorough.

## 0. SCOPE OF IMAGE (PARTIAL VIEW - MANDATORY FIRST STEP)

- Is this a FULL sofa/room view or a PARTIAL view? (partial = only part of sofa or room is in frame)
- List EXACTLY which parts are VISIBLE: e.g. "one seat cushion + back cushion", "arm + corner of seat", "close-up of fabric with cushion seam", "sofa + coffee table + strip of floor"
- Do NOT list or describe anything that is not visible (e.g. if the other arm is cut off, do not describe it)

## 1. CAMERA & PERSPECTIVE (CRITICAL FOR PRESERVATION)

- EXACT camera angle (frontal view / angled view / from above / from below / side angle)
- EXACT distance from sofa (close-up on cushions / medium showing full sofa / wide room view)
- Lens characteristics: field of view (wide / normal / telephoto), distortion level
- Depth of field: what's in sharp focus, what's blurred
- Composition: which parts of sofa/room are visible (front cushions / back rest / sides / legs / full sofa / room beyond)
- Camera position relative to sofa (centered / off-center / tilted / rotated)
- Visible room context: walls / floor / ceiling / other furniture / windows / doors
- Light source direction and quality (natural from windows / artificial overhead / lamps / combination)

## 2. SOFA STRUCTURE & DESIGN (CRITICAL)

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

⚠️ CRITICAL: These items must remain in EXACT same positions - only cleaning and organization change.

## 10. FINAL VERIFICATION CHECKLIST

Before completing your analysis, verify you have described:

✓ EXACT camera angle and perspective
✓ EXACT sofa positioning and placement in room
✓ EXACT sofa structure, style, size, and configuration
✓ EXACT fabric type, color, pattern, and material for sofa
✓ EXACT positioning of all throw pillows (count and arrangement)
✓ EXACT throw blanket (if present) arrangement and material
✓ EXACT colors for every element
✓ EXACT lighting conditions and mood
✓ COMPLETE list of ALL stains, dirt, and mess to remove
✓ COMPLETE list of ALL elements to preserve
✓ EXACT room context and decor visible
✓ EXACT atmosphere and design style

⚠️ CRITICAL: Be EXTREMELY precise with all details. The goal is to describe this sofa/room 
so accurately that it can be recreated IDENTICALLY, just cleaned.

⚠️ CONSISTENCY: Use the same level of detail, same structure, and same precision every time.`;
}
