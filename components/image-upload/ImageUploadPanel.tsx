"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadPanelProps {
  onFileSelect: (file: File) => void;
  preview?: string;
  disabled?: boolean;
}

export function ImageUploadPanel({
  onFileSelect,
  preview,
  disabled,
}: ImageUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[500px]",
        isDragging
          ? "border-yellow-400 bg-yellow-400/5"
          : "border-gray-300 bg-white hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
            <Upload className="h-14 w-14 text-gray-400" />
          </div>
          <p className="mb-2 text-lg font-semibold text-gray-900">
            Déposez votre photo ici
          </p>
          <p className="mb-6 text-sm text-gray-500">
            ou cliquez pour parcourir
          </p>
          <p className="text-xs text-gray-400">PNG, JPG jusqu'à 10MB</p>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-5 py-2 text-xs font-medium text-gray-700 shadow-sm">
          Avant
        </span>
      </div>
    </div>
  );
}

