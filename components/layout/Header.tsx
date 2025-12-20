"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#2a2a2a] text-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-yellow-400">NI</span>
            <span className="text-white">ITE</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Accueil
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Services
          </Link>
          <Link
            href="/clear-ai"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Clear AI
          </Link>
          <Link
            href="/avant-apres"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Avant/Après
          </Link>
          <Link
            href="/avis"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Avis
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-white transition-colors hover:text-yellow-400"
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden xl:flex text-blue-400 hover:text-blue-300 hover:bg-transparent h-auto py-1.5"
          >
            Mise à niveau
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden xl:flex text-blue-400 hover:text-blue-300 hover:bg-transparent h-auto py-1.5"
          >
            Publier
          </Button>
          <Button
            size="sm"
            className="bg-transparent border border-white/20 hover:bg-white/10 text-white h-auto py-1.5 px-4 text-sm"
          >
            Demander un devis
          </Button>
        </div>
      </div>
    </header>
  );
}

