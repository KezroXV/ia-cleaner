"use client";

import { useState } from "react";

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clear AI - Test Backend</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img src={preview} alt="Preview" className="max-w-sm rounded" />
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Génération en cours..." : "Générer Image Nettoyée"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            Erreur: {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Résultat:</h2>
            <img src={result} alt="Generated" className="max-w-full rounded" />
            <p className="mt-2 text-sm text-gray-600 break-all">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
