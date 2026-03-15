import { useRef, useState } from "react";

export default function UploadDataset({ schema, isUploading, onUpload }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const submitFile = (file) => {
    if (file) {
      onUpload(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    submitFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Dataset Upload
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-ink">Bring in a CSV dataset</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Files are validated, sanitized, and stored in SQLite as a queryable table named
            <span className="font-semibold text-ink"> customers</span>.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-xs text-slate-600">
          <div className="font-semibold text-ink">Accepted format</div>
          <div>CSV only</div>
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-6 rounded-[24px] border-2 border-dashed p-6 transition ${
          dragActive
            ? "border-accent bg-accent/5"
            : "border-slate-200 bg-[linear-gradient(135deg,rgba(15,157,141,0.04),rgba(255,122,89,0.06))]"
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

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-xl font-bold text-ink">
              {isUploading ? "Uploading and indexing dataset..." : "Drop your CSV here"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Drag and drop, or browse locally to prepare the dashboard for analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Processing..." : "Choose CSV"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Active Dataset
          </p>
          {schema ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <DataPoint label="Table" value={schema.table_name} />
              <DataPoint label="Rows" value={schema.row_count} />
              <DataPoint label="Columns" value={schema.columns.length} />
              <DataPoint label="Uploaded" value={new Date(schema.uploaded_at).toLocaleString()} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              No dataset loaded yet. Upload your customer behavior CSV to unlock questions and charts.
            </p>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Schema Preview
          </p>
          {schema ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {schema.columns.map((column) => (
                <div
                  key={column.name}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  title={`${column.original_name} • ${column.dtype}`}
                >
                  <span className="font-semibold text-ink">{column.name}</span>
                  <span className="ml-2 text-slate-500">{column.dtype}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              Uploaded column names and inferred data types will appear here automatically.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function DataPoint({ label, value }) {
  return (
    <div className="rounded-2xl border border-white bg-white px-3 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
