import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const examples = [
    "Explain Blockchain in simple Hinglish",
    "Create a 3-day productivity plan",
    "Explain multi-agent system",
    "Make AI study roadmap",
  ];

  // typewriter placeholder
  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    let i = 0;
    const text = "Ask your query… multi-agents will handle the heavy work ⚡";
    const type = () => {
      setPlaceholder(text.substring(0, i));
      i++;
      if (i <= text.length) setTimeout(type, 40);
    };
    type();
  }, []);

  const runAgents = async () => {
    if (!query.trim()) {
      alert("Please enter a query first!");
      return;
    }

    setLoading(true);
    setResponseText("");

    // history update (front-end only)
    setHistory((prev) => {
      const updated = [query, ...prev];
      return updated.slice(0, 5); // last 5 queries
    });

    try {
      const res = await axios.post("http://127.0.0.1:8000/run", { query });

      const output =
        res?.data?.response !== undefined && res?.data?.response !== null
          ? String(res.data.response)
          : "⚠ Backend sent empty response.";

      setResponseText(output);
    } catch (error) {
      console.error(error);
      setResponseText("❌ Backend error.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResponseText("");
  };

  const handleExampleClick = (text) => {
    setQuery(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex w-60 bg-slate-950 border-r border-slate-800 flex-col">
        {/* Logo / Brand */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-950 shadow-lg animate-float">
            AG
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              Agent Studio
            </h1>
            <p className="text-[11px] text-slate-400">
              Python Agents • Node Data
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-4 py-4 space-y-2 text-[13px] flex-1">
          <div className="sidebar-item sidebar-item-active">
            <span className="text-xs">⚙️</span>
            <span>Query Console</span>
          </div>
          <div className="sidebar-item">
            <span className="text-xs">🧠</span>
            <span>Agents Config (soon)</span>
          </div>
          <div className="sidebar-item">
            <span className="text-xs">📜</span>
            <span>Logs / History (soon)</span>
          </div>

          {/* Quick examples */}
          <div className="mt-6">
            <p className="text-[11px] text-slate-500 mb-2">Quick prompts</p>
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(ex)}
                  className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 hover:bg-slate-900/80 transition flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
                  <span className="line-clamp-1">{ex}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          <div className="mt-6">
            <p className="text-[11px] text-slate-500 mb-1">Recent queries</p>
            {history.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Run something to see history.
              </p>
            )}
            <ul className="space-y-1">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="text-[11px] text-slate-300/90 line-clamp-1"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
          <p>Made By Tushar</p>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        {/* Top header */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur flex items-center justify-between px-4 lg:px-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 uppercase tracking-[0.18em]">
              Multi-Agent Console
            </span>
            <span className="text-sm font-medium text-slate-100">
              Ask, process and view responses
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/60 text-emerald-300 bg-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Agents Online
            </span>
            <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-300 bg-slate-900/80">
              http://127.0.0.1:8000/run
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-6 py-5 lg:py-7">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 lg:gap-7 items-start animate-panel">
            {/* LEFT: Input */}
            <section className="space-y-4">
              {/* Description card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 shadow-md shadow-black/40">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  Query to Python agents
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/40">
                    Researcher + Writer
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Your message will go to the backend (FastAPI + CrewAI). Agents
                  will research + write and send the final response back here.
                </p>
              </div>

              {/* Main input card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-lg shadow-black/40 space-y-3 animate-card">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="text-sm font-medium text-slate-100">
                      Your query
                    </label>
                    <p className="text-[11px] text-slate-500">
                      English / Hinglish both allowed. Be specific for better output.
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full border border-slate-700 text-slate-400">
                    POST /run
                  </span>
                </div>

                <textarea
                  rows={7}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60 resize-y placeholder:text-slate-500"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {/* Buttons + status */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={runAgents}
                      disabled={loading}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                        loading
                          ? "bg-sky-600/60 text-sky-100 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-400 text-slate-950 hover:-translate-y-[1px] shadow-md shadow-sky-500/40"
                      }`}
                    >
                      {loading && (
                        <span className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      )}
                      {loading ? "Running agents…" : "Run agents"}
                    </button>

                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex items-center rounded-full px-3 py-2 text-[11px] sm:text-xs font-medium border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900/70 transition"
                    >
                      Clear
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Status:{" "}
                    <span
                      className={
                        loading
                          ? "text-amber-300"
                          : responseText
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }
                    >
                      {loading
                        ? "Agents are thinking…"
                        : responseText
                        ? "Response ready"
                        : "Waiting for query"}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* RIGHT: Response */}
            <section className="space-y-3 animate-panel delay-100">
              <div className="rounded-xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-lg shadow-black/40 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold">Agent response</h2>
                    <p className="text-[11px] text-slate-500">
                      Structured answer generated by your Python agents.
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-h-[230px] rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-3 text-xs overflow-auto">
                  {/* Empty */}
                  {!loading && !responseText && (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-slate-500 text-[12px] text-center">
                        Response will appear here after you run the agents.
                      </p>
                    </div>
                  )}

                  {/* Loading */}
                  {loading && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sky-300 text-[12px]">
                        <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" />
                        <span
                          className="h-2 w-2 rounded-full bg-sky-400 animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-sky-400 animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        />
                        <span>Agents are processing your request…</span>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="h-3 rounded-full bg-slate-800 animate-shimmer" />
                        <div className="h-3 rounded-full bg-slate-800 animate-shimmer" />
                        <div className="h-3 w-3/4 rounded-full bg-slate-800 animate-shimmer" />
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  {!loading && responseText && (
                    <div className="mt-1 animate-fadeIn">
                      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Agent Output
                      </div>

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-base sm:text-lg font-semibold mb-2 text-sky-300"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-sm sm:text-base font-semibold mt-3 mb-1 text-sky-200"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-sm font-semibold mt-2 mb-1 text-slate-100"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="mb-2 text-slate-200 text-[12px]"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              className="ml-4 list-disc text-slate-200 mb-1 text-[12px]"
                              {...props}
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-semibold text-sky-300"
                              {...props}
                            />
                          ),
                          hr: () => <hr className="my-3 border-slate-700" />,
                        }}
                      >
                        {responseText}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
