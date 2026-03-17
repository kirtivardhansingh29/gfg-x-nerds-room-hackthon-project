import Head from "next/head";
import { startTransition, useEffect, useState } from "react";

import BrandLogo from "../components/brand/BrandLogo";
import Dashboard from "../components/Dashboard";
import KpiStrip from "../components/dashboard/KpiStrip";
import Navbar from "../components/layout/Navbar";
import QueryInput from "../components/QueryInput";
import UploadDataset from "../components/UploadDataset";
import SurfaceCard from "../components/ui/SurfaceCard";
import { formatCompactNumber, formatTimestamp, humanizeLabel } from "../lib/formatters";
import { fetchSchema, runQuery, uploadDataset } from "../services/api";

const STARTER_PROMPTS = [
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
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Upload a CSV to start exploring your dataset.");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadExistingSchema = async () => {
      setSchemaLoading(true);

      try {
        const existingSchema = await fetchSchema();

        if (!active) {
          return;
        }

        startTransition(() => {
          setSchema(existingSchema);
          setStatusMessage(`Loaded ${formatCompactNumber(existingSchema.row_count)} rows from the active dataset.`);
        });
      } catch (error) {
        if (!active) {
          return;
        }

        if (!String(error.message || "").includes("No dataset")) {
          setErrorMessage(error.message);
        }
      } finally {
        if (active) {
          setSchemaLoading(false);
        }
      }
    };

    loadExistingSchema();

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setErrorMessage("");
    setStatusMessage("Uploading CSV and preparing the dataset workspace...");

    try {
      const response = await uploadDataset(file);
      startTransition(() => {
        setSchema(response.dataset);
        setCards([]);
        setHistory([]);
        setStatusMessage(
          `Dataset ready. ${formatCompactNumber(response.dataset.row_count)} rows indexed in ${response.dataset.table_name}.`
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
    if (!schema || querying) {
      return;
    }

    setQuerying(true);
    setErrorMessage("");
    setStatusMessage("Generating SQL and assembling the next insight card...");

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
        setStatusMessage("Insight ready. Ask a follow-up question to keep the analysis moving.");
      });
    } catch (error) {
      setErrorMessage(error.message);
      setStatusMessage("Insight generation failed. Refine the question and try again.");
    } finally {
      setQuerying(false);
    }
  };

  const latestCard = cards[0];
  const kpis = [
    {
      label: "Rows Indexed",
      value: schema ? formatCompactNumber(schema.row_count) : "--",
      badge: "Data",
      helper: schema ? "Ready for validated SQL analysis." : "Upload a CSV to start your workspace.",
      tone: "accent",
    },
    {
      label: "Fields Mapped",
      value: schema ? schema.columns.length : "--",
      badge: "Schema",
      helper: schema ? "Sanitized columns with inferred types." : "Column metadata appears after upload.",
      tone: "sky",
    },
    {
      label: "Insight Cards",
      value: cards.length,
      badge: "Dashboard",
      helper: cards.length ? "Each question becomes a reusable card." : "Run a prompt to populate the dashboard.",
      tone: "gold",
    },
    {
      label: "Latest View",
      value: latestCard ? humanizeLabel(latestCard.chart.chart_type) : "Waiting",
      badge: "Status",
      helper: latestCard ? `Created ${formatTimestamp(latestCard.createdAt)}.` : "No visualizations generated yet.",
      tone: "slate",
    },
  ];

  return (
    <>
      <Head>
        <title>Baniya Dost</title>
        <meta
          name="description"
          content="Baniya Dost is a modern conversational BI workspace for CSV uploads, natural language analysis, KPI cards, and polished charts."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-canvas text-ink">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <Navbar />

          <div className="mt-6 space-y-6">
            <section id="overview" className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
              <SurfaceCard tone="hero" className="relative overflow-hidden p-8 sm:p-10">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.14),transparent_58%)] lg:block" />

                <div className="relative space-y-8">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Modern Analytics Workspace
                  </div>

                  <div className="space-y-4">
                    <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                      Business analytics that feels like a clean SaaS command center.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                      Baniya Dost helps you upload data, ask better business questions, and turn raw
                      tables into polished KPI cards, charts, and SQL-backed insight summaries.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#workspace"
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Start With a Dataset
                    </a>
                    <a
                      href="#dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      Explore Dashboard
                    </a>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <HeroSignalCard label="Input Modes" value="CSV + Voice" detail="Upload locally and ask by text or mic." />
                    <HeroSignalCard label="Query Layer" value="Validated SQL" detail="Natural language converted into safe SELECT queries." />
                    <HeroSignalCard label="Outputs" value="Cards + Charts" detail="Dashboards update with summaries, visuals, and previews." />
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard tone="contrast" className="flex flex-col justify-between gap-8 p-8">
                <div className="space-y-6">
                  <BrandLogo theme="dark" />

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <StatusPanel
                      label="Workspace Status"
                      value={schema ? "Dataset connected" : schemaLoading ? "Loading..." : "Awaiting upload"}
                      detail={schema ? `${formatCompactNumber(schema.row_count)} rows ready for analysis.` : "Upload a CSV to unlock prompts and charts."}
                    />
                    <StatusPanel
                      label="Latest Insight"
                      value={latestCard ? latestCard.title : "No cards yet"}
                      detail={latestCard ? latestCard.summary : "Your first question will create a dashboard card here."}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                        Starter Questions
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        Quick prompts to populate the dashboard.
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                      {querying ? "Working" : "Ready"}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleQuery(prompt)}
                        disabled={!schema || querying}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </SurfaceCard>
            </section>

            <KpiStrip metrics={kpis} isLoading={schemaLoading && !schema} />

            <section id="workspace" className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
              <UploadDataset
                schema={schema}
                isUploading={uploading}
                isSchemaLoading={schemaLoading}
                onUpload={handleUpload}
              />
              <QueryInput
                disabled={!schema || querying}
                isLoading={querying}
                onSubmit={handleQuery}
                samplePrompts={STARTER_PROMPTS}
                placeholder={
                  schema
                    ? "Ask about trends, segments, retention signals, correlations, or follow-up questions..."
                    : "Upload a CSV before asking your first question."
                }
              />
            </section>

            <SurfaceCard className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Session Status
                  </p>
                  <p className="text-lg font-semibold text-slate-950">{statusMessage}</p>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <StatusChip label={schema ? `${schema.columns.length} fields available` : "Waiting for upload"} />
                    <StatusChip label={querying ? "Generating insight" : "Query engine idle"} />
                    <StatusChip label={uploading ? "Upload in progress" : "Storage ready"} />
                  </div>
                )}
              </div>
            </SurfaceCard>

            <Dashboard cards={cards} isLoading={querying} onPromptSelect={handleQuery} />
          </div>
        </div>
      </main>
    </>
  );
}

function HeroSignalCard({ label, value, detail }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/78 p-4 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </div>
  );
}

function StatusPanel({ label, value, detail }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</p>
      <p className="mt-3 font-heading text-2xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-white/65">{detail}</p>
    </div>
  );
}

function StatusChip({ label }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
      {label}
    </span>
  );
}
