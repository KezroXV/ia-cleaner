export type PromptType = "realistic" | "marketing" | "stylized";

export const ANALYSIS_PROMPT = `Analyze this image of a messy/cluttered space. Provide a concise description (2-3 sentences) including:
1. Type of room (kitchen, bedroom, living room, office, etc.)
2. Main clutter/mess elements (dirty dishes, scattered clothes, papers, etc.)
3. Current lighting and color atmosphere
4. Architectural features (windows, furniture placement)

Keep it factual and detailed. Focus on what needs to be cleaned/organized.`;

export const GENERATION_PROMPTS: Record<
  PromptType,
  (analysis: string) => string
> = {
  realistic: (analysis: string) => `
Based on this messy room: "${analysis}"

Generate a photorealistic image of the EXACT SAME ROOM after professional cleaning:
- Keep identical room layout, furniture, and architecture
- Remove all clutter, trash, dirty items
- Clean all surfaces (spotless, no stains)
- Organize items neatly in their proper places
- Maintain original lighting style (slightly enhanced)
- Keep the same color palette
- Natural, realistic appearance (not overly perfect)
- Professional cleaning service quality
- Photo quality: high resolution, sharp details

Style: Photorealistic, natural lighting, believable transformation
`,

  marketing: (analysis: string) => `
Based on this space: "${analysis}"

Create a magazine-quality image of the SAME ROOM after deep cleaning:
- Professional interior design presentation
- Immaculately clean and organized
- Enhanced lighting (bright, inviting, warm)
- Subtle styling improvements (better decor arrangement)
- Premium, aspirational feel (but still realistic)
- Colors: slightly enhanced saturation
- Home magazine editorial quality
- Perfect for real estate or cleaning service marketing

Style: Professional photography, lifestyle magazine, aspirational yet achievable
`,

  stylized: (analysis: string) => `
Based on this room: "${analysis}"

Generate an idealized artistic version of the SAME SPACE after organization:
- Minimalist aesthetic (only essential items visible)
- Perfect organization and symmetry
- Enhanced contrast and vibrant colors
- Soft, diffused professional lighting
- Instagram-worthy interior design
- Clean lines, modern feel
- Inspirational home transformation
- Slightly elevated beyond reality (but not cartoon-like)

Style: Modern interior design, lifestyle aesthetic, Pinterest-worthy
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

