import { useEffect, useRef, useState } from "react";

import SurfaceCard from "./ui/SurfaceCard";

export default function QueryInput({ disabled, isLoading, onSubmit, placeholder, samplePrompts = [] }) {
  const [question, setQuestion] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return undefined;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setQuestion((currentValue) => `${currentValue} ${transcript}`.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || disabled || isLoading) {
      return;
    }

    onSubmit(trimmedQuestion);
    setQuestion("");
  };

  const toggleListening = () => {
    if (!recognitionRef.current || disabled) {
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ask Baniya Dost
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Query with text or voice
          </h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Turn a natural-language business question into validated SQL, then render the result as
            a polished chart card on the dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="font-semibold text-slate-950">Context-aware follow-ups</div>
          <div className="mt-1">Recent turns stay in the query history.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Natural Language Prompt
          </span>
          <textarea
            rows={6}
            value={question}
            disabled={disabled}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Quick Angles
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setQuestion(prompt)}
                disabled={disabled || isLoading}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={disabled || isLoading || !question.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Building Insight
                </>
              ) : (
                "Run Query"
              )}
            </button>

            <button
              type="button"
              onClick={toggleListening}
              disabled={disabled || !speechSupported}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                listening
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {speechSupported ? (listening ? "Stop Microphone" : "Use Microphone") : "Voice Unavailable"}
            </button>
          </div>

          <div className="text-sm text-slate-500">
            {listening
              ? "Listening now. Speak your question clearly."
              : "Try asking for a comparison, trend, split, or correlation."}
          </div>
        </div>
      </form>
    </SurfaceCard>
  );
}
