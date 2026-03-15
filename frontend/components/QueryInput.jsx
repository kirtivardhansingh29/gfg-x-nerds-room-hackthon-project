import { useEffect, useRef, useState } from "react";

export default function QueryInput({ disabled, isLoading, onSubmit, placeholder }) {
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
    <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ask Baniyabhai
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-ink">Query with text or voice</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Gemini turns your prompt into SQL, the backend validates it, and the dashboard picks a
            chart automatically.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <div className="font-semibold text-ink">Follow-ups</div>
          <div>Conversation history included</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Natural Language Prompt
          </span>
          <textarea
            rows={5}
            value={question}
            disabled={disabled}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={disabled || isLoading || !question.trim()}
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generating Insight..." : "Run Query"}
            </button>

            <button
              type="button"
              onClick={toggleListening}
              disabled={disabled || !speechSupported}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                listening
                  ? "bg-ember text-white hover:bg-orange-600"
                  : "border border-slate-200 bg-white text-ink hover:border-accent hover:text-accent"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {speechSupported ? (listening ? "Stop Mic" : "Use Microphone") : "Voice Unavailable"}
            </button>
          </div>

          <div className="text-sm text-slate-500">
            {listening
              ? "Listening now. Speak your question clearly."
              : "Try asking for a segment comparison, trend, or correlation."}
          </div>
        </div>
      </form>
    </section>
  );
}
