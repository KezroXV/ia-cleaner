# Rapport des Prompts - IA Cleaner

## 📋 Table des matières

1. [Contexte du projet](#contexte-du-projet)
2. [Architecture et outils](#architecture-et-outils)
3. [Flux de travail](#flux-de-travail)
4. [Système de prompts](#système-de-prompts)
5. [Types d'espaces supportés](#types-despaces-supportés)
6. [Modes de transformation](#modes-de-transformation)
7. [Détails techniques des prompts](#détails-techniques-des-prompts)
8. [Recommandations d'optimisation](#recommandations-doptimisation)

---

## 🎯 Contexte du projet

**IA Cleaner** est une application web Next.js qui utilise l'intelligence artificielle pour nettoyer et améliorer des images d'espaces intérieurs et extérieurs. Le système analyse une image d'un espace en désordre et génère une version nettoyée et professionnelle de cet espace, en préservant fidèlement la structure, la perspective, les matériaux et les couleurs originales.

### Objectif principal
Transformer des images d'espaces désordonnés en versions propres et professionnelles, tout en préservant l'identité architecturale et visuelle de l'espace original.

### Cas d'usage
- Nettoyage virtuel de pièces pour des services de nettoyage professionnel
- Préparation d'images pour l'immobilier
- Visualisation "avant/après" pour des services de rénovation
- Marketing et présentation d'espaces

---

## 🛠️ Architecture et outils

### Stack technique

#### Frontend
- **Framework**: Next.js 16.1.0 (App Router)
- **UI**: React 19.2.3 avec TypeScript
- **Styling**: Tailwind CSS 4
- **Composants**: Radix UI
- **Gestion d'état**: React Hooks (useState)

#### Backend
- **Runtime**: Node.js (Vercel Edge/Serverless)
- **API Routes**: Next.js API Routes
- **Traitement d'images**: Sharp 0.34.5
- **Upload**: Cloudinary 2.8.0

#### Intelligence Artificielle

**Modèle principal utilisé**: Gemini 2.5 Flash Image
- **API**: Google Generative AI SDK (`@google/generative-ai`)
- **Modèle**: `gemini-2.5-flash-image`
- **Capacités**: Vision (analyse d'images) + Génération d'images
- **Coût estimé**: $0.039 par image

**Modèle alternatif** (non utilisé actuellement):
- **Vertex AI**: Imagen 3.0 (`imagen-3.0-generate-002`)
- **API**: Google Cloud Vertex AI
- **Mode**: Image-to-image avec `imageEditingStrength: 0.85`

### Flux de données

```
Image upload → Optimisation (Sharp) → 
Détection type d'espace (Gemini) → 
Analyse détaillée (Gemini) → 
Génération image nettoyée (Gemini) → 
Upload Cloudinary → 
URL optimisée retournée
```

---

## 🔄 Flux de travail

### Étape 0: Détection du type d'espace

**Fonction**: `detectSpaceType(imageBuffer: Buffer)`

**Modèle**: `gemini-2.5-flash-image`

**Prompt utilisé**: `getSpaceTypeDetectionPrompt()`

**Configuration**:
```typescript
{
  temperature: 0,      // Reproductibilité maximale
  topK: 1,             // Token le plus probable uniquement
  topP: 0.1            // Probabilité très faible
}
```

**Types détectables**:
- `interior` - Pièce intérieure (salon, chambre, bureau)
- `kitchen` - Cuisine
- `bathroom` - Salle de bain
- `outdoor` - Espace extérieur (terrasse, jardin, patio)
- `pool` - Piscine
- `balcony` - Balcon
- `garage` - Garage
- `office` - Bureau
- `bedroom` - Chambre
- `living-room` - Salon
- `auto` - Détection automatique (fallback)

**Normalisation**: La fonction `normalizeSpaceType()` parse la réponse et gère les variations de texte.

### Étape 1: Analyse détaillée de l'image

**Fonction**: `analyzeMessyRoom(imageBuffer: Buffer)`

**Modèle**: `gemini-2.5-flash-image`

**Prompt utilisé**: `getAnalysisPrompt(spaceType)`

**Configuration**:
```typescript
{
  temperature: 0,      // Reproductibilité de l'analyse
  topK: 40,            // Variété modérée pour analyse détaillée
  topP: 0.95           // Probabilité modérée
}
```

**Objectif**: Extraire TOUS les détails structurels, visuels et contextuels de l'image pour permettre une reconstruction identique après nettoyage.

**Sections d'analyse** (selon le type d'espace):
1. Camera & Perspective (CRITIQUE)
2. Structure architecturale (spécifique au type)
3. Surfaces & Matériaux
4. Mobilier & Objets permanents
5. Éclairage
6. Palette de couleurs (CRITIQUE)
7. Désordre & Saleté (à retirer)
8. Éléments à préserver (positions exactes)
9. Atmosphère & Style
10. Checklist de vérification finale

### Étape 2: Génération de l'image nettoyée

**Fonction**: `editImageWithGemini(originalImageBuffer, analysis, promptType, spaceType)`

**Modèle**: `gemini-2.5-flash-image`

**Prompt utilisé**: `getGenerationPrompt(promptType, analysis, spaceType)`

**Configuration**:
```typescript
{
  temperature: 0.1,    // Cohérence maximale avec créativité minimale
  topK: 20,            // Limiter les choix
  topP: 0.8            // Probabilité modérée
}
```

**Seed**: Généré à partir d'un hash SHA-256 de l'image pour reproductibilité (même si l'API ne le supporte pas directement, il est inclus dans le prompt).

**Modes disponibles**:
- `realistic` - Nettoyage réaliste et fidèle
- `marketing` - Amélioration pour marketing/immobilier
- `stylized` - Version idéalisée style Pinterest

---

## 📝 Système de prompts

### 1. Prompt de détection (`getSpaceTypeDetectionPrompt`)

**Localisation**: `lib/prompts.ts`, ligne 43-58

**Structure**:
```
Analyze this image and determine the TYPE OF SPACE shown. 
Respond with ONLY ONE of these exact values:

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

Respond with ONLY the type value, nothing else.
```

**Caractéristiques**:
- Très court et directif
- Format de réponse strict (un seul mot)
- Pas de contexte supplémentaire nécessaire

### 2. Prompt d'analyse (`getAnalysisPrompt`)

**Localisation**: `lib/prompts.ts`, ligne 152-679

**Structure générale**:

#### Partie commune (tous les types d'espaces)

**Base** (lignes 153-168):
```
Analyze this image in EXTREME DETAIL to enable IDENTICAL reconstruction after cleaning.

⚠️ CRITICAL: Your analysis will be used to recreate this EXACT SAME space, just cleaned. 
Be EXTREMELY precise with ALL details.

⚠️ CONSISTENCY REQUIREMENT: For the same image, you MUST produce the SAME analysis 
every time. Be systematic and thorough. Follow the same structure and level of detail 
consistently.

## 1. CAMERA & PERSPECTIVE (CRITICAL FOR PRESERVATION)

- EXACT camera angle (eye level / high angle / low angle / bird's eye / tilted)
- EXACT distance from subject (close-up / medium / wide shot / extreme wide)
- Lens characteristics: field of view (wide / normal / telephoto), distortion
- Depth of field: what's in sharp focus, what's blurred, blur amount
- Composition: rule of thirds, symmetry, leading lines, focal points
- Vanishing points: where perspective lines converge
- Camera position relative to the space (centered / off-center / angled)
- Any camera tilt or rotation
```

#### Sections spécifiques par type d'espace

Chaque type d'espace a des sections personnalisées (2-5) qui décrivent:
- Structure architecturale spécifique
- Surfaces et matériaux typiques
- Mobilier/équipement caractéristique
- Éclairage spécifique

**Exemple pour `pool`** (lignes 327-375):
```
## 2. POOL AREA STRUCTURE
- Pool shape and EXACT dimensions (rectangular / oval / freeform / infinity / kidney / round)
- Pool depth: shallow end, deep end, any depth changes
- Pool edge details (coping material, style, color, width)
- Decking/patio: material, pattern, area size, exact layout
- Pool features: steps, ledges, benches, fountains, jets, waterfalls
- Safety features: railings, fences, gates, pool covers
- Pool equipment visible: skimmers, drains, lights, ladders, diving boards

## 3. WATER CONDITION (CRITICAL FOR POOLS)
- Water color: current state (clear / cloudy / green / brown / black)
- Water visibility: can you see the bottom? How deep is visibility?
- Algae: type (green / black / yellow), location, coverage percentage
- Debris: leaves, branches, dirt, insects, floating objects (exact locations)
- Water level: is it full, low, or overflowing?
- Surface condition: foam, scum, oil slicks
- Bottom visibility: can you see tiles/liner? What color/pattern?
```

#### Sections communes (lignes 534-620)

**6. COLOR PALETTE (CRITICAL - PRESERVE EXACT COLORS)**
```
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
```

**7. CLUTTER & MESS (TO BE REMOVED - BE THOROUGH)**
```
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
```

**8. ELEMENTS TO PRESERVE (MUST STAY - EXACT POSITIONS)**
```
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

⚠️ CRITICAL: These items must remain in EXACT same positions - only organization/cleanliness 
can change.
```

**9. ATMOSPHERE & STYLE (PRESERVE MOOD)**
```
- Overall design style (minimalist / maximalist / rustic / modern / traditional / industrial / etc.)
- Era or time period feel (contemporary / vintage / classic / etc.)
- Mood and ambiance (cozy / spacious / industrial / luxurious / etc.)
- Cultural or regional characteristics (if visible)
- Quality level (luxury / standard / budget)
- Overall aesthetic coherence

⚠️ CRITICAL: The cleaned version should maintain the SAME atmosphere and style - just cleaner.
```

**10. FINAL VERIFICATION CHECKLIST**
```
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

⚠️ CRITICAL: Be EXTREMELY precise with spatial relationships, measurements, colors, and 
positions. The goal is to describe this space so accurately that it can be recreated 
IDENTICALLY, just cleaned. Every detail matters.

⚠️ CONSISTENCY: Use the same level of detail, same structure, and same precision every 
time you analyze this image. Your analysis should be deterministic and reproducible.
```

### 3. Prompt de génération (`getGenerationPrompt`)

**Localisation**: `lib/prompts.ts`, ligne 685-1198

**Signature**:
```typescript
getGenerationPrompt(
  type: PromptType,        // "realistic" | "marketing" | "stylized"
  analysis: string,        // Analyse détaillée de l'étape 1
  spaceType: SpaceType     // Type d'espace détecté
): string
```

**Structure générale**:

Le prompt est construit en 3 parties:

1. **Instructions spécifiques au type d'espace** (`spaceSpecificInstructions`)
   - Instructions de préservation spécifiques selon le type (kitchen, bathroom, pool, etc.)
   - Exemple pour `pool` (lignes 727-742):
   ```
   ### POOL-SPECIFIC PRESERVATION (CRITICAL - MOST IMPORTANT)
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
   ✓ DO NOT change water color (just clarity)
   ```

2. **Instructions de nettoyage spécifiques** (`spaceSpecificCleaning`)
   - Instructions de nettoyage adaptées au type d'espace
   - Exemple pour `pool` (lignes 841-855):
   ```
   → Make pool water CRYSTAL CLEAR - remove ALL algae (green/black/yellow), debris, leaves, scum, foam
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
   → CRITICAL: Water clarity is the most important - it must be crystal clear while preserving pool structure
   ```

3. **Template principal selon le mode** (`realistic`, `marketing`, `stylized`)

#### Mode `realistic` (lignes 886-1014)

**Objectif**: Nettoyage réaliste et fidèle, préservation maximale

**Structure**:
```
YOU ARE EDITING AN EXISTING IMAGE, NOT CREATING A NEW ONE.

ORIGINAL IMAGE DETAILED ANALYSIS:
[analyse complète]

YOUR TASK: Transform this EXACT SAME SPACE into its clean version.

⚠️ CRITICAL: This is IMAGE EDITING, not image generation. You MUST preserve the EXACT 
structure, layout, and composition of the original image.

⚠️ CONSISTENCY REQUIREMENT: For the same input image, you MUST produce IDENTICAL 
results every time. Follow the analysis EXACTLY and apply the same transformations 
consistently.

## ABSOLUTE REQUIREMENTS - MUST PRESERVE 100%:

### CAMERA & PERSPECTIVE (MUST BE IDENTICAL)
✓ EXACT same camera angle and position
✓ EXACT same perspective and vanishing points
✓ EXACT same field of view and lens characteristics
✓ EXACT same depth of field (what's in focus, what's blurred)
✓ EXACT same composition and framing
✓ EXACT same crop and aspect ratio

### STRUCTURAL ELEMENTS (MUST BE IDENTICAL)
[instructions spécifiques au type d'espace]

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
[instructions spécifiques au type d'espace]

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

Think: "This is the SAME photograph, taken 2 hours after a professional cleaning crew finished. 
The space is IDENTICAL, just spotlessly clean. Every time I see this image, I will clean it in 
exactly the same way."
```

#### Mode `marketing` (lignes 1016-1110)

**Objectif**: Amélioration pour marketing/immobilier, qualité magazine

**Caractéristiques**:
- Préservation 95% (reconnaissable mais peut être amélioré)
- Nettoyage niveau perfection
- Amélioration subtile de l'éclairage et des couleurs
- Ajout de staging professionnel (magazines, fleurs, accessoires)
- Qualité lifestyle magazine

**Structure**:
```
YOU ARE ENHANCING AN EXISTING IMAGE FOR MARKETING.

ORIGINAL IMAGE DETAILED ANALYSIS:
[analyse]

YOUR TASK: Transform this EXACT SAME SPACE into a magazine-worthy version.

⚠️ CRITICAL: This is IMAGE ENHANCEMENT, not recreation. The space must be RECOGNIZABLY 
the same space.

## MUST PRESERVE (RECOGNIZABLE - 95% IDENTICAL):

### CORE STRUCTURE (MUST BE IDENTICAL)
✓ EXACT same camera angle and perspective
✓ EXACT same room/space layout and architecture
✓ EXACT same windows, doors, walls positions (if applicable)
✓ EXACT same floor/ground material and pattern
✓ EXACT same spatial configuration and dimensions

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

### ENHANCEMENT (SUBTLE BUT NOTICEABLE)
→ Lighting: brighter, more inviting, warm
→ Colors: more vibrant (natural enhancement)
→ Contrast: improved for visual appeal
→ Surfaces: add subtle shine/polish
→ Add professional staging touches (magazines, flowers, towels, decorative items)

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

Think: "This is the same space, professionally staged and photographed for a luxury 
[home/pool/outdoor] magazine."
```

#### Mode `stylized` (lignes 1112-1194)

**Objectif**: Version idéalisée style Pinterest/Instagram

**Caractéristiques**:
- Préservation 90% (reconnaissable mais peut être idéalisé)
- Perfection absolue (au-delà du réaliste)
- Couleurs vibrantes et saturées
- Organisation minimaliste
- Qualité portfolio designer

**Structure**:
```
YOU ARE CREATING AN IDEALIZED VERSION OF AN EXISTING IMAGE.

ORIGINAL IMAGE DETAILED ANALYSIS:
[analyse]

YOUR TASK: Transform this EXACT SAME SPACE into its Pinterest-perfect version.

## PRESERVE (MUST BE RECOGNIZABLE):

### CORE IDENTITY (90% SIMILAR)
✓ Same basic room/space layout
✓ Same general architectural features
✓ Same type of flooring/ground surface (pattern can be perfected)
✓ Same window and door positions (if applicable)
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
→ Professional [interior/landscape] design quality

### IDEALIZATION
→ Make everything "perfect"
→ Slight enhancements for inspiration
→ Modern, aspirational aesthetic
→ Pinterest / Instagram quality
→ "Dream [home/pool/outdoor]" version of this space

## QUALITY:

- High-end [interior/landscape] design photography
- Idealized but still realistic
- Not cartoon-like or fake
- Professional designer portfolio quality
- Sharp, crisp, vibrant, inspiring

Think: "This is the same space transformed into its absolute dream version - perfectly 
styled, flawlessly clean, aspirational yet achievable."
```

---

## 🏠 Types d'espaces supportés

### 1. Interior (intérieur générique)
- **Détection**: Pièces intérieures non spécifiques (salon, chambre, bureau)
- **Sections spécialisées**: Structure architecturale générique, mobilier standard
- **Préservation**: Murs, fenêtres, portes, sol, plafond, mobilier

### 2. Kitchen (cuisine)
- **Détection**: Espace cuisine avec électroménagers
- **Sections spécialisées**: 
  - Layout (L/U/galley/island/open)
  - Électroménagers (positions, modèles, marques)
  - Cabinets, comptoir, backsplash
  - Sink, robinet, hotte
- **Préservation critique**: Positions électroménagers, layout, matériaux

### 3. Bathroom (salle de bain)
- **Détection**: Salle de bain avec sanitaires
- **Sections spécialisées**:
  - Vanity, douche, baignoire, toilette
  - Carrelage (sol et murs)
  - Miroir, éclairage, rangement
- **Préservation critique**: Positions sanitaires, patterns de carrelage

### 4. Outdoor (extérieur)
- **Détection**: Terrasse, jardin, patio
- **Sections spécialisées**:
  - Clôtures, murets, bordures
  - Sol extérieur (bois, pierre, béton, gazon)
  - Mobilier extérieur, planteurs
  - Éclairage extérieur
- **Préservation critique**: Structure extérieure, environnement naturel

### 5. Pool (piscine) ⭐ **LE PLUS COMPLEXE**
- **Détection**: Zone de piscine
- **Sections spécialisées**:
  - Forme et dimensions EXACTES de la piscine
  - **État de l'eau** (CRITIQUE): couleur, visibilité, algues, débris
  - Carrelage piscine (fond, murs, patterns)
  - Decking/patio autour
  - Équipement piscine (skimmers, drains, lumières, échelles)
  - Mobilier piscine
- **Préservation critique**: 
  - Forme et taille de la piscine (NE JAMAIS CHANGER)
  - Couleur de l'eau (ton bleu/turquoise, juste clarifier)
  - Patterns de carrelage
- **Nettoyage spécialisé**: 
  - Eau cristalline (transparence maximale)
  - Suppression complète des algues
  - Nettoyage fond et murs

### 6. Balcony (balcon)
- **Détection**: Balcon ou véranda
- **Sections spécialisées**: Garde-corps, sol, mobilier, vues
- **Préservation critique**: Structure, garde-corps, vues

### 7. Garage (garage)
- **Détection**: Garage ou espace de stockage
- **Sections spécialisées**: Porte, sol, rangement, outils, véhicules
- **Préservation critique**: Systèmes de rangement, équipement

### 8. Office (bureau)
- **Détection**: Bureau ou espace de travail
- **Sections spécialisées**: Bureau, chaise, rangement, technologie
- **Préservation critique**: Position bureau, équipement tech

### 9. Bedroom (chambre)
- **Détection**: Chambre à coucher
- **Sections spécialisées**: Lit, commodes, placard, fenêtres
- **Préservation critique**: Position lit, mobilier

### 10. Living-room (salon)
- **Détection**: Salon ou espace de vie
- **Sections spécialisées**: Assise, tables, divertissement, cheminée
- **Préservation critique**: Arrangement mobilier, style

### 11. Auto (détection automatique)
- **Fallback**: Si la détection échoue ou est ambiguë
- **Utilise**: Prompt générique adaptatif qui détecte le type pendant l'analyse

---

## 🎨 Modes de transformation

### Mode `realistic` (par défaut)

**Objectif**: Nettoyage fidèle et réaliste

**Préservation**: 100% (identique)

**Changements autorisés**:
- Suppression de la saleté, désordre, taches
- Nettoyage des surfaces (même matériaux, juste propres)
- Organisation des éléments préservés (même positions, juste organisés)

**Interdictions strictes**:
- ❌ Changer la perspective/camera
- ❌ Déplacer le mobilier
- ❌ Changer les matériaux
- ❌ Changer les couleurs (hues)
- ❌ Changer l'éclairage
- ❌ Ajouter/supprimer des éléments permanents

**Résultat attendu**: "La même photo, 2 heures après le passage d'une équipe de nettoyage professionnel"

### Mode `marketing`

**Objectif**: Amélioration pour marketing/immobilier

**Préservation**: 95% (reconnaissable)

**Changements autorisés**:
- Tout du mode `realistic` +
- Amélioration subtile de l'éclairage (plus lumineux, chaleureux)
- Amélioration des couleurs (plus vibrantes, naturelles)
- Ajout de staging (magazines, fleurs, serviettes, accessoires décoratifs)
- Amélioration du contraste
- Brillant subtil sur les surfaces

**Résultat attendu**: "Espace professionnellement mis en scène et photographié pour un magazine lifestyle de luxe"

### Mode `stylized`

**Objectif**: Version idéalisée style Pinterest

**Préservation**: 90% (reconnaissable)

**Changements autorisés**:
- Tout du mode `marketing` +
- Perfection absolue (au-delà du réaliste)
- Symétrie parfaite (si approprié)
- Couleurs très vibrantes et saturées
- Organisation minimaliste (essentiels uniquement)
- Éclairage idéal (lumineux, uniforme, parfait)

**Résultat attendu**: "Version rêve absolue de cet espace - parfaitement stylisé, impeccablement propre, aspirant mais réalisable"

---

## 🔧 Détails techniques des prompts

### Reproductibilité

**Problème**: Les modèles génératifs peuvent produire des résultats différents à chaque exécution.

**Solutions implémentées**:

1. **Température à 0 pour la détection**:
   ```typescript
   temperature: 0,  // Reproductibilité maximale
   topK: 1,         // Token le plus probable uniquement
   topP: 0.1        // Probabilité très faible
   ```

2. **Température à 0 pour l'analyse**:
   ```typescript
   temperature: 0,  // Analyse reproductible
   topK: 40,        // Variété modérée
   topP: 0.95       // Probabilité modérée
   ```

3. **Température très basse pour la génération**:
   ```typescript
   temperature: 0.1,  // Cohérence maximale avec créativité minimale
   topK: 20,          // Limiter les choix
   topP: 0.8          // Probabilité modérée
   ```

4. **Seed basé sur hash de l'image**:
   ```typescript
   function generateSeedFromImage(imageBuffer: Buffer): number {
     const hash = createHash("sha256").update(imageBuffer).digest("hex");
     const seedString = hash.substring(0, 8);
     const seed = parseInt(seedString, 16) % 2147483647;
     return seed;
   }
   ```
   Le seed est inclus dans le prompt même si l'API ne le supporte pas directement.

5. **Instructions de consistance dans les prompts**:
   - "⚠️ CONSISTENCY REQUIREMENT: For the same image, you MUST produce the SAME analysis every time"
   - "⚠️ CONSISTENCY CHECK: If you process this same image again, you MUST produce the EXACT same result"

### Gestion des erreurs

**Retry avec backoff exponentiel**:
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T>
```

**Détection d'erreurs de quota**:
```typescript
function parseQuotaError(error: unknown): {
  isQuotaError: boolean;
  retryAfter?: number;
  message: string;
}
```

### Optimisation des prompts

**Longueur des prompts**:
- Détection: ~200 tokens (très court)
- Analyse: ~2000-4000 tokens (très détaillé)
- Génération: ~3000-5000 tokens (très complet)

**Structure hiérarchique**:
- Utilisation de sections numérotées (## 1, ## 2, etc.)
- Emojis pour les avertissements critiques (⚠️)
- Checkmarks (✓) pour les exigences
- Crossmarks (✗) pour les suppressions
- Flèches (→) pour les actions

**Emphase sur les points critiques**:
- "⚠️ CRITICAL" pour les points absolument essentiels
- "MUST BE IDENTICAL" pour la préservation
- "DO NOT" pour les interdictions
- Répétition des concepts clés (préservation, consistance, exactitude)

---

## 💡 Recommandations d'optimisation

### 1. Optimisation de la longueur des prompts

**Problème actuel**: Les prompts sont très longs (3000-5000 tokens), ce qui:
- Augmente les coûts
- Ralentit le traitement
- Peut diluer l'attention du modèle

**Recommandations**:
- **Prioriser les sections critiques**: Garder les sections "CRITICAL" mais condenser les autres
- **Utiliser des références**: Au lieu de répéter, référencer l'analyse précédente
- **Structure conditionnelle**: N'inclure que les sections pertinentes au type d'espace
- **Raccourcir les exemples**: Réduire les listes d'exemples tout en gardant la clarté

**Exemple d'optimisation**:
```
AVANT (lignes 978-987):
## CRITICAL EDITING RULES (FOLLOW STRICTLY FOR CONSISTENCY):
1. PRESERVE STRUCTURE: The space must be RECOGNIZABLY the same space - IDENTICAL layout
2. PRESERVE PERSPECTIVE: Camera angle and composition must be IDENTICAL - no changes
[... 8 règles détaillées ...]

APRÈS (optimisé):
## CRITICAL RULES: PRESERVE structure, perspective, materials, colors, lighting, furniture positions. 
ONLY CLEAN: Remove mess/dirt/stains. BE CONSISTENT: Same transformations every time.
```

### 2. Amélioration de la spécificité par type d'espace

**Problème actuel**: Certains types d'espaces (comme `interior`) sont trop génériques.

**Recommandations**:
- **Affiner la détection**: Ajouter plus de types spécifiques (dining-room, hallway, etc.)
- **Prompts hybrides**: Combiner les caractéristiques de plusieurs types
- **Détection multi-niveau**: Détecter d'abord intérieur/extérieur, puis le type spécifique

### 3. Optimisation de la consistance

**Problème actuel**: Malgré les efforts, la reproductibilité n'est pas garantie à 100%.

**Recommandations**:
- **Template structuré pour l'analyse**: Forcer un format JSON structuré pour l'analyse
- **Validation de l'analyse**: Vérifier que toutes les sections critiques sont présentes
- **Cache des analyses**: Stocker les analyses pour éviter de les régénérer
- **Fine-tuning**: Si possible, fine-tuner un modèle sur des exemples spécifiques

**Exemple de template structuré**:
```
Analyze and respond in this EXACT JSON format:
{
  "camera": { "angle": "...", "distance": "...", "perspective": "..." },
  "structure": { "dimensions": "...", "layout": "..." },
  "colors": { "dominant": "...", "secondary": "...", "palette": "..." },
  "clutter": [{ "item": "...", "location": "...", "action": "remove" }],
  "preserve": [{ "item": "...", "location": "...", "action": "keep" }]
}
```

### 4. Amélioration de la gestion des cas limites

**Problème actuel**: Certains espaces peuvent être ambigus (ex: cuisine ouverte sur salon).

**Recommandations**:
- **Détection multi-label**: Permettre plusieurs types (ex: "kitchen + living-room")
- **Prompts adaptatifs**: Adapter le prompt selon les types détectés
- **Fallback intelligent**: Si détection échoue, utiliser le prompt le plus proche

### 5. Optimisation des performances

**Problème actuel**: 3 appels API séquentiels (détection → analyse → génération).

**Recommandations**:
- **Parallélisation**: Si possible, combiner détection et analyse en un seul appel
- **Cache intelligent**: Mettre en cache les analyses par hash d'image
- **Streaming**: Streamer l'analyse pendant que la génération démarre

### 6. Amélioration de la qualité pour les piscines

**Problème actuel**: Les piscines sont les plus complexes et peuvent nécessiter des prompts encore plus spécifiques.

**Recommandations**:
- **Sous-types de piscines**: Détecter le type de piscine (rectangulaire, ovale, infinity, etc.)
- **Instructions spécifiques par forme**: Adapter les instructions selon la forme
- **Focus sur l'eau**: Renforcer encore plus les instructions sur la clarté de l'eau

**Exemple d'amélioration**:
```
### POOL WATER CLARITY (HIGHEST PRIORITY)
The water MUST be:
- 100% transparent (you can see the bottom tiles/liner clearly from any angle)
- Crystal clear blue/turquoise tone (PRESERVE exact color from analysis)
- Zero algae (no green/black/yellow anywhere)
- Zero debris (no leaves, branches, dirt, insects, floating objects)
- Zero cloudiness (no murkiness, no foam, no scum)
- Perfect reflections (sky and surroundings clearly reflected on surface)
- Bottom visible (tiles/liner pattern and colors clearly visible through water)

Think: "This is a professionally maintained pool ready for a photoshoot. The water is 
so clear you could drink it."
```

### 7. Ajout de métriques de qualité

**Recommandations**:
- **Score de fidélité**: Comparer l'image générée avec l'originale (SSIM, LPIPS)
- **Score de propreté**: Analyser si tous les éléments de désordre ont été retirés
- **Score de consistance**: Comparer plusieurs générations de la même image
- **Feedback loop**: Utiliser ces métriques pour améliorer les prompts

### 8. Documentation et versioning

**Recommandations**:
- **Versioning des prompts**: Numéroter les versions des prompts (v1.0, v1.1, etc.)
- **A/B testing**: Tester différentes versions et comparer les résultats
- **Logging détaillé**: Logger les prompts utilisés, les réponses, et les résultats
- **Dashboard de monitoring**: Visualiser les performances par type d'espace et mode

---

## 📊 Métriques et coûts

### Coûts estimés (Gemini 2.5 Flash Image)

**Par image**:
- Détection: ~$0.001 (très court prompt)
- Analyse: ~$0.015 (prompt long, réponse longue)
- Génération: ~$0.023 (prompt très long + génération d'image)
- **Total**: ~$0.039 par image

**Optimisations possibles**:
- Cache des analyses: Économie de ~$0.015 par image réutilisée
- Réduction de 20% de la longueur des prompts: Économie de ~$0.008 par image

### Temps de traitement

**Estimations**:
- Détection: 1-2 secondes
- Analyse: 3-5 secondes
- Génération: 10-20 secondes
- **Total**: 15-30 secondes par image

**Optimisations possibles**:
- Parallélisation: Réduction de 30-40% du temps total
- Cache: Réduction de 50% pour les images réutilisées

---

## 🔍 Points d'attention pour l'optimisation

### 1. Longueur vs Clarté

**Dilemme**: Des prompts plus courts sont moins chers et plus rapides, mais peuvent être moins précis.

**Recommandation**: Tester des versions condensées tout en gardant les sections critiques.

### 2. Spécificité vs Généricité

**Dilemme**: Des prompts très spécifiques fonctionnent mieux pour chaque type, mais sont plus complexes à maintenir.

**Recommandation**: Créer un système de templates avec des sections modulaires.

### 3. Reproductibilité vs Qualité

**Dilemme**: Une température très basse garantit la reproductibilité mais peut réduire la qualité créative.

**Recommandation**: Tester différentes valeurs de température (0, 0.1, 0.2) et trouver le bon équilibre.

### 4. Préservation vs Amélioration

**Dilemme**: Le mode `realistic` préserve tout mais peut sembler "trop fidèle", le mode `marketing` améliore mais peut changer trop.

**Recommandation**: Créer un mode intermédiaire "realistic-enhanced" qui améliore subtilement sans changer la structure.

---

## 📝 Conclusion

Le système de prompts d'IA Cleaner est sophistiqué et bien structuré, avec une attention particulière à la préservation de la structure originale et à la reproductibilité. Les principaux axes d'optimisation sont:

1. **Réduction de la longueur** des prompts (sans perte de qualité)
2. **Amélioration de la spécificité** par type d'espace
3. **Renforcement de la consistance** avec des templates structurés
4. **Optimisation des performances** avec cache et parallélisation
5. **Amélioration spécialisée** pour les cas complexes (piscines)

Le système actuel fonctionne bien mais peut être optimisé pour réduire les coûts, améliorer la vitesse, et garantir une meilleure consistance des résultats.

---

**Document généré le**: 2024
**Version des prompts**: 1.0
**Dernière mise à jour**: Analyse du code actuel
