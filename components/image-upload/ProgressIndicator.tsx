"use client";

import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  estimatedTime: number; // en secondes
}

const STEPS: ProgressStep[] = [
  {
    id: "upload",
    label: "Upload de l'image",
    description: "Envoi vers le serveur...",
    estimatedTime: 1,
  },
  {
    id: "processing",
    label: "Traitement de l'image",
    description: "Optimisation et préparation...",
    estimatedTime: 2,
  },
  {
    id: "analysis",
    label: "Analyse IA",
    description: "Analyse détaillée avec Gemini Vision...",
    estimatedTime: 15,
  },
  {
    id: "generation",
    label: "Génération IA",
    description: "Création de l'image transformée...",
    estimatedTime: 45,
  },
  {
    id: "upload-cloudinary",
    label: "Finalisation",
    description: "Upload et optimisation finale...",
    estimatedTime: 3,
  },
];

interface ProgressIndicatorProps {
  loading: boolean;
  startTime?: number;
}

export function ProgressIndicator({
  loading,
  startTime,
}: ProgressIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!loading || !startTime) {
      setCurrentStep(0);
      setProgress(0);
      setElapsedTime(0);
      return;
    }

    // Mise à jour du temps écoulé
    const timeInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    // Simulation de la progression basée sur le temps estimé
    const progressInterval = setInterval(() => {
      if (!loading) {
        clearInterval(progressInterval);
        clearInterval(timeInterval);
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;

      // Calculer la progression totale basée sur les temps estimés
      const totalEstimatedTime = STEPS.reduce(
        (sum, step) => sum + step.estimatedTime,
        0
      );
      let cumulativeTime = 0;
      let stepIndex = 0;

      for (let i = 0; i < STEPS.length; i++) {
        cumulativeTime += STEPS[i].estimatedTime;
        if (elapsed <= cumulativeTime) {
          stepIndex = i;
          break;
        }
        stepIndex = i + 1;
      }

      // Limiter à la dernière étape
      if (stepIndex >= STEPS.length) {
        stepIndex = STEPS.length - 1;
      }

      setCurrentStep(stepIndex);

      // Calculer la progression dans l'étape actuelle
      let stepProgress = 0;
      if (stepIndex > 0) {
        const previousCumulative = STEPS.slice(0, stepIndex).reduce(
          (sum, step) => sum + step.estimatedTime,
          0
        );
        const currentStepTime = elapsed - previousCumulative;
        stepProgress = Math.min(
          (currentStepTime / STEPS[stepIndex].estimatedTime) * 100,
          100
        );
      } else {
        stepProgress = Math.min((elapsed / STEPS[0].estimatedTime) * 100, 100);
      }

      // Calculer la progression globale
      const previousStepsProgress = (stepIndex / STEPS.length) * 100;
      const currentStepProgress = (stepProgress / 100) * (100 / STEPS.length);
      const globalProgress = Math.min(
        previousStepsProgress + currentStepProgress,
        95
      ); // Max 95% jusqu'à la fin

      setProgress(globalProgress);
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [loading, startTime]);

  if (!loading) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Barre de progression globale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Progression globale</span>
          <span className="text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-yellow-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Temps écoulé : {formatTime(elapsedTime)}</span>
          <span>
            Temps estimé : ~
            {formatTime(
              STEPS.reduce((sum, step) => sum + step.estimatedTime, 0)
            )}
          </span>
        </div>
      </div>

      {/* Étapes détaillées */}
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all",
                isCurrent && "bg-yellow-50 border border-yellow-200",
                isCompleted && "bg-green-50 border border-green-200",
                isPending && "bg-gray-50 border border-gray-200"
              )}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-yellow-900",
                      isCompleted && "text-green-900",
                      isPending && "text-gray-500"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-xs text-yellow-600 font-medium">
                      En cours...
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    isCurrent && "text-yellow-700",
                    isCompleted && "text-green-700",
                    isPending && "text-gray-400"
                  )}
                >
                  {step.description}
                </p>
                {isCurrent && (
                  <div className="mt-2">
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300 ease-out"
                        style={{
                          width: `${Math.min(
                            ((progress - (index / STEPS.length) * 100) /
                              (100 / STEPS.length)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
