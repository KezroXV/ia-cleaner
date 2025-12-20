"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ImageUploadPanel } from "@/components/image-upload/ImageUploadPanel";
import { ImageResultPanel } from "@/components/image-upload/ImageResultPanel";
import { ArrowConnector } from "@/components/image-upload/ArrowConnector";
import { TestCTA } from "@/components/cta/TestCTA";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
    setResult("");
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("promptType", "realistic");

      const response = await fetch("/api/clean-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.generatedImageUrl);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Main Content Card */}
          <div className="rounded-3xl bg-white p-10 shadow-xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
              {/* Upload Panel */}
              <ImageUploadPanel
                onFileSelect={handleFileSelect}
                preview={preview}
                disabled={loading}
              />

              {/* Arrow Connector */}
              <div className="hidden lg:flex items-center">
                <ArrowConnector />
              </div>

              {/* Result Panel */}
              <ImageResultPanel result={result} loading={loading} />
            </div>

            {/* CTA Button */}
            <div className="mt-16">
              <TestCTA onClick={handleSubmit} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-8 rounded-xl bg-red-50 border border-red-200 p-5 text-sm text-red-700">
                <p className="font-medium">Erreur : {error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
