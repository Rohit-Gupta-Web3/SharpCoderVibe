"use client";

import { useState } from "react";

export default function ImprovePage() {
  const [prompt, setPrompt] = useState("" );
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prompt Improver</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Enter your prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border rounded p-2 min-h-[120px]"
            required
            aria-label="Raw prompt"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Improving..." : "Improve"}
        </button>
      </form>
      {result && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Improved Prompt</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded" aria-live="polite">{result}</pre>
        </section>
      )}
      {error && (
        <p className="mt-4 text-red-600" role="alert">{error}</p>
      )}
    </main>
  );
}
