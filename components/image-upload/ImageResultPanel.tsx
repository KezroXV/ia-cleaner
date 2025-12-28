"use client";

import { Sparkles, Loader2, Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { Button } from "@/components/ui/button";

interface ImageResultPanelProps {
  result?: string;
  loading?: boolean;
  startTime?: number;
}

// L'URL est déjà optimisée côté serveur, pas besoin de transformation supplémentaire

export function ImageResultPanel({
  result,
  loading,
  startTime,
}: ImageResultPanelProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Réinitialiser l'état de chargement quand le résultat change
  useEffect(() => {
    if (result) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [result]);

  const handleDownload = async () => {
    if (!result) return;

    try {
      // Récupérer l'image depuis l'URL
      const response = await fetch(result);
      const blob = await response.blob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Générer un nom de fichier avec timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `image-generee-${timestamp}.jpg`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white min-h-[500px]",
        loading && "animate-pulse"
      )}
    >
      {result ? (
        <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className="h-12 w-12 text-yellow-400 animate-spin" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Erreur de chargement de l'image</p>
            </div>
          ) : (
            <Image
              src={result}
              alt="Résultat"
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
              priority={!loading}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {!imageLoading && !imageError && (
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={handleDownload}
                variant="default"
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg border border-gray-200"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          {loading ? (
            <div className="w-full max-w-md">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 mx-auto">
                <Loader2 className="h-10 w-10 text-yellow-400 animate-spin" />
              </div>
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                Génération en cours...
              </h3>
              <ProgressIndicator loading={loading} startTime={startTime} />
            </div>
          ) : (
            <>
              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-yellow-50">
                <Sparkles className="h-14 w-14 text-yellow-400" />
              </div>
              <p className="mb-2 text-lg font-semibold text-gray-900">
                Découvrez le système Clear AI
              </p>
              <p className="mb-6 text-sm text-gray-500">
                Votre espace transformé apparaîtra ici
              </p>
              <div className="flex gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center rounded-full bg-yellow-400 px-5 py-2 text-xs font-medium text-gray-900 shadow-sm">
          Après
        </span>
      </div>
    </div>
  );
}
