"use client";

import { ArrowRight } from "lucide-react";

export function ArrowConnector() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 shadow-lg">
        <ArrowRight className="h-10 w-10 text-gray-900" strokeWidth={2.5} />
      </div>
    </div>
  );
}

