import Head from "next/head";
import { startTransition, useEffect, useState } from "react";

import BrandLogo from "../components/brand/BrandLogo";
import Dashboard from "../components/Dashboard";
import QueryInput from "../components/QueryInput";
import UploadDataset from "../components/UploadDataset";
import { fetchSchema, runQuery, uploadDataset } from "../services/api";

const SAMPLE_PROMPTS = [
  "Compare average online spend and store spend by city tier.",
  "Show which age groups place the most monthly online orders.",
  "Is tech savvy score related to monthly online orders?",
  "Break down shopping preference by gender.",
];

export default function HomePage() {
  const [schema, setSchema] = useState(null);
  const [cards, setCards] = useState([]);
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Upload a CSV to start exploring your dataset.");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExistingSchema = async () => {
      try {
        const existingSchema = await fetchSchema();
        startTransition(() => {
          setSchema(existingSchema);
          setStatusMessage(`Loaded ${existingSchema.row_count} rows from the active dataset.`);
        });
      } catch (error) {
        if (!String(error.message || "").includes("No dataset")) {
          setErrorMessage(error.message);
        }
      }
    };

    loadExistingSchema();
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setErrorMessage("");
    setStatusMessage("Uploading CSV and preparing the SQLite dataset...");

    try {
      const response = await uploadDataset(file);
      startTransition(() => {
        setSchema(response.dataset);
        setCards([]);
        setHistory([]);
        setStatusMessage(
          `Dataset ready. ${response.dataset.row_count} rows stored in ${response.dataset.table_name}.`
        );
      });
    } catch (error) {
      setErrorMessage(error.message);
      setStatusMessage("Upload failed. Please review the file and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleQuery = async (question) => {
    if (!schema) {
      return;
    }

    setQuerying(true);
    setErrorMessage("");
    setStatusMessage("Generating SQL with Gemini and building your chart...");

    try {
      const response = await runQuery({
        question,
        history,
      });

      const nextCard = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...response,
      };

      startTransition(() => {
        setCards((currentCards) => [nextCard, ...currentCards]);
        setHistory((currentHistory) => [
          ...currentHistory,
          {
            question: response.question,
            sql: response.sql,
            summary: response.summary,
          },
        ]);
        setStatusMessage("Insight ready. Ask a follow-up question to continue the conversation.");
      });
    } catch (error) {
      setErrorMessage(error.message);
      setStatusMessage("Insight generation failed. Refine the question and try again.");
    } finally {
      setQuerying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Baniya Dost</title>
        <meta
          name="description"
          content="Conversational BI dashboard for CSV uploads, Gemini-powered SQL, and auto-generated charts."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-canvas text-ink">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(15,157,141,0.25),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(255,122,89,0.2),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.72)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.72)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <header className="grid gap-6 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-10 max-w-[220px] shrink-0" />
                <span className="inline-flex w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Conversational Business Intelligence
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  Baniya Dost
                </h1>
                <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                  Upload a CSV, ask a question in plain language or by voice, and get SQL-backed
                  insights with charts in seconds.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <HeroMetricCard label="AI Engine" value="Google Gemini" tone="accent" />
                <HeroMetricCard label="Query Layer" value="Validated SQLite" tone="gold" />
                <HeroMetricCard label="Voice Input" value="Browser Speech API" tone="ember" />
              </div>
            </div>

            <div className="rounded-[28px] bg-ink p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                Starter Questions
              </p>
              <div className="mt-4 grid gap-3">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuery(prompt)}
                    disabled={!schema || querying}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:border-accent/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <UploadDataset schema={schema} isUploading={uploading} onUpload={handleUpload} />
            <QueryInput
              disabled={!schema || querying}
              isLoading={querying}
              onSubmit={handleQuery}
              placeholder={
                schema
                  ? "Ask about trends, segments, correlations, or follow-up questions..."
                  : "Upload a CSV before asking your first question."
              }
            />
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Session Status
                </p>
                <p className="mt-2 text-lg font-semibold text-ink">{statusMessage}</p>
              </div>
              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : (
                <div className="rounded-2xl border border-accent/15 bg-accent/10 px-4 py-3 text-sm text-accent">
                  {schema
                    ? `${schema.columns.length} columns available for Gemini-guided analysis.`
                    : "Waiting for your first dataset upload."}
                </div>
              )}
            </div>
          </section>

          <Dashboard cards={cards} isLoading={querying} />
        </div>
      </main>
    </>
  );
}

function HeroMetricCard({ label, value, tone }) {
  const toneMap = {
    accent: "from-accent/20 to-accent/5 text-accent",
    gold: "from-gold/25 to-gold/10 text-amber-700",
    ember: "from-ember/20 to-ember/10 text-orange-700",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${toneMap[tone]} px-4 py-4`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 font-heading text-xl font-bold">{value}</p>
    </div>
  );
}
