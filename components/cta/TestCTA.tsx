"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function TestCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-xl bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] px-10 py-7 text-base font-semibold shadow-xl transition-all hover:shadow-2xl"
      >
        <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
        Tester Clear AI gratuitement
      </Button>
      <p className="text-center text-sm text-gray-600 max-w-lg leading-relaxed">
        Notre IA vous montre votre espace comme s'il venait d'être nettoyé.
        Testez-le !
      </p>
    </div>
  );
}

