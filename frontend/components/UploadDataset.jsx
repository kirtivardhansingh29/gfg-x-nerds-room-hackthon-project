import { useRef, useState } from "react";

import { formatCompactNumber, formatTimestamp } from "../lib/formatters";
import SurfaceCard from "./ui/SurfaceCard";
import SkeletonBlock from "./ui/SkeletonBlock";

export default function UploadDataset({ schema, isUploading, isSchemaLoading, onUpload }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const isInitialLoad = isSchemaLoading && !schema;
  const previewColumns = schema?.columns?.slice(0, 8) || [];
  const remainingColumns = Math.max((schema?.columns?.length || 0) - previewColumns.length, 0);

  const submitFile = (file) => {
    if (file && !isUploading) {
      onUpload(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    submitFile(event.dataTransfer.files?.[0]);
  };

  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Dataset Upload
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Bring in a CSV dataset
          </h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Files are sanitized, indexed, and stored in SQLite so the app can generate questions,
            summaries, and chart-ready results against a clean dataset.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs text-slate-600">
          <div className="font-semibold text-slate-950">Accepted format</div>
          <div className="mt-1">CSV only</div>
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-6 rounded-[26px] border-2 border-dashed p-6 transition ${
          dragActive
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-200 bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(236,244,255,0.9))]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => {
            submitFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-950 p-3 text-white shadow-soft">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 16V5" strokeLinecap="round" />
                <path d="M8.5 8.5 12 5l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 19.5h14" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <p className="font-heading text-xl font-semibold tracking-tight text-slate-950">
                {isUploading ? "Uploading and indexing dataset..." : "Drop your CSV here"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Drag and drop, or browse locally to prepare the dashboard for analysis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing
              </>
            ) : (
              "Choose CSV"
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Active Dataset
          </p>
          {isInitialLoad ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-20 w-full" />
              <SkeletonBlock className="h-20 w-full" />
              <SkeletonBlock className="h-20 w-full" />
              <SkeletonBlock className="h-20 w-full" />
            </div>
          ) : schema ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <DataPoint label="Table" value={schema.table_name} />
              <DataPoint label="Rows" value={formatCompactNumber(schema.row_count)} />
              <DataPoint label="Columns" value={schema.columns.length} />
              <DataPoint label="Uploaded" value={formatTimestamp(schema.uploaded_at)} />
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              No dataset loaded yet. Upload your CSV to unlock questions, schema previews, and chart
              generation.
            </p>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Schema Preview
          </p>
          {isInitialLoad ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-36 rounded-full" />
              <SkeletonBlock className="h-10 w-24 rounded-full" />
              <SkeletonBlock className="h-10 w-32 rounded-full" />
            </div>
          ) : schema ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {previewColumns.map((column) => (
                <div
                  key={column.name}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  title={`${column.original_name} • ${column.dtype}`}
                >
                  <span className="font-semibold text-slate-900">{column.name}</span>
                  <span className="ml-2 text-slate-500">{column.dtype}</span>
                </div>
              ))}
              {remainingColumns ? (
                <div className="rounded-full border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                  +{remainingColumns} more
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Uploaded column names and inferred data types will appear here automatically.
            </p>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}

function DataPoint({ label, value }) {
  return (
    <div className="rounded-2xl border border-white bg-white px-3 py-3 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
