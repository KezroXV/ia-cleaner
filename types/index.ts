export interface CleanImageRequest {
  imageFile: File;
  promptType?: "realistic" | "marketing" | "stylized";
}

export interface CleanImageResponse {
  success: boolean;
  generatedImageUrl?: string;
  meta?: {
    width: number;
    height: number;
    format: string;
    analysisText?: string;
  };
  error?: string;
  details?: string;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface ImageAnalysis {
  description: string;
  roomType: string;
  messyElements: string[];
}

