"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageResultPanelProps {
  result?: string;
  loading?: boolean;
}

export function ImageResultPanel({ result, loading }: ImageResultPanelProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white min-h-[500px]",
        loading && "animate-pulse"
      )}
    >
      {result ? (
        <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
          <img
            src={result}
            alt="Résultat"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          {loading ? (
            <>
              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-yellow-50">
                <Loader2 className="h-14 w-14 text-yellow-400 animate-spin" />
              </div>
              <p className="mb-2 text-lg font-semibold text-gray-900">
                Génération en cours...
              </p>
            </>
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
