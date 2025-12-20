export type PromptType = "realistic" | "marketing" | "stylized";

export const ANALYSIS_PROMPT = `Analyze this image of a messy/cluttered space in EXTREME DETAIL. Provide a comprehensive structural description including:

1. **Room Type & Layout**: Exact room type (kitchen, bedroom, living room, office, etc.) and precise layout description
2. **Architectural Elements**: 
   - Exact positions of windows, doors, walls
   - Ceiling height and type
   - Floor type and color
   - Wall colors and textures
   - Corners and angles
3. **Furniture & Fixed Elements**:
   - Exact furniture placement (tables, chairs, beds, cabinets, etc.)
   - Sizes and positions relative to room
   - Colors and materials of each piece
   - Fixed installations (sinks, counters, shelves)
4. **Lighting Details**:
   - Light sources (windows, lamps, overhead lights)
   - Direction of natural light
   - Shadows and highlights
   - Overall lighting mood
5. **Color Palette**:
   - Dominant colors
   - Accent colors
   - Color temperature (warm/cool)
6. **Clutter Elements** (to be removed):
   - Dirty dishes, scattered items, trash
   - Items that need organizing
   - Stains or marks to clean
7. **Camera Angle & Perspective**:
   - Viewpoint (eye-level, high angle, etc.)
   - Focal point of the image
   - Depth and perspective

Be extremely precise about spatial relationships, positions, and structural details. This description will be used to recreate the EXACT SAME room structure.`;

export const GENERATION_PROMPTS: Record<
  PromptType,
  (analysis: string) => string
> = {
  realistic: (analysis: string) => `
You are editing an existing room image. Based on this detailed room analysis: "${analysis}"

Transform this EXACT room by:
- PRESERVE the identical room structure, layout, architecture, and camera angle
- MAINTAIN the exact same furniture positions, sizes, and orientations
- KEEP the same window positions, door locations, wall colors, floor type
- PRESERVE the original lighting direction and natural light sources
- MAINTAIN the exact same color palette and materials
- REMOVE ONLY: clutter, trash, dirty dishes, scattered items, stains
- CLEAN surfaces but keep them looking natural (not overly perfect)
- ORGANIZE items in their proper places (drawers, cabinets, shelves)
- ENHANCE lighting slightly (brighter but same style)
- KEEP the same perspective, camera angle, and focal point

CRITICAL: This must look like the SAME room photographed after cleaning, not a different room. The structure, furniture positions, and architectural elements must be IDENTICAL. Only remove mess and clean surfaces.

Style: Photorealistic, natural lighting, believable transformation, same room structure
`,

  marketing: (analysis: string) => `
You are editing an existing room image. Based on this detailed room analysis: "${analysis}"

Transform this EXACT room into a magazine-quality space:
- PRESERVE the identical room structure, layout, and architecture
- MAINTAIN the exact same furniture positions and camera angle
- KEEP the same architectural elements (windows, doors, walls, floor)
- REMOVE all clutter, trash, and mess completely
- CLEAN all surfaces to perfection (spotless, gleaming)
- ORGANIZE items beautifully in their proper places
- ENHANCE lighting significantly (bright, warm, inviting) but keep same direction
- IMPROVE decor arrangement subtly (better styling, but same items)
- ENHANCE color saturation slightly (more vibrant, but same palette)
- MAINTAIN the same perspective and focal point

CRITICAL: This must be the SAME room, just professionally cleaned and styled. Structure and layout must be IDENTICAL.

Style: Professional photography, lifestyle magazine, aspirational yet realistic, same room structure
`,

  stylized: (analysis: string) => `
You are editing an existing room image. Based on this detailed room analysis: "${analysis}"

Transform this EXACT room into an idealized artistic version:
- PRESERVE the identical room structure, layout, and architecture
- MAINTAIN the same furniture positions and camera angle
- KEEP the same architectural elements (windows, doors, walls, floor)
- REMOVE all clutter and mess completely
- CREATE minimalist aesthetic (hide non-essential items in storage)
- ORGANIZE with perfect symmetry and clean lines
- ENHANCE contrast and make colors more vibrant (but same palette)
- APPLY soft, diffused professional lighting (same direction, enhanced)
- MAINTAIN the same perspective and focal point

CRITICAL: This must be the SAME room structure, just stylized and idealized. Layout and architecture must be IDENTICAL.

Style: Modern interior design, lifestyle aesthetic, Pinterest-worthy, same room structure
`,
};

export function getAnalysisPrompt(): string {
  return ANALYSIS_PROMPT;
}

export function getGenerationPrompt(
  promptType: PromptType,
  analysis: string
): string {
  return GENERATION_PROMPTS[promptType](analysis);
}
