import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, History, ArrowRight, CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/ui/StatCard";
import AccuracyChart from "../components/charts/AccuracyChart";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [err, setErr] = useState("");

  const loadProgress = async () => {
    try {
      const res = await api.get("/progress");
      setProgress(res.data || []);
    } catch (err) {
      console.error("Failed to load progress", err);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const stats = useMemo(() => {
    const sessions = progress.length;
    const avg = sessions ? Math.round(progress.reduce((a, b) => a + (b.accuracy || 0), 0) / sessions) : 0;
    const best = sessions ? Math.max(...progress.map((p) => p.accuracy || 0)) : 0;
    return { sessions, avg, best };
  }, [progress]);

  const chartData = useMemo(() => {
    const recent = [...progress].slice(0, 10).reverse();
    return recent.map((p, i) => ({
      label: `S${i + 1}`,
      accuracy: p.accuracy || 0,
    }));
  }, [progress]);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    setSubmitted(false);
    setAccuracy(null);
    try {
      const res = await api.post("/questions/generate", { topic, difficulty });
      setQuestions(res.data.questions || []);
      setAnswers({});
    } catch (err) {
      console.error("Generation failed", err);
      setErr(err.response?.data?.message || "Generation failed. Please check your AI keys and connection.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    setLoading(true);
    try {
      const res = await api.post("/questions/submit", {
        topic,
        difficulty,
        questions,
        answers,
      });
      setAccuracy(res.data.accuracy);
      setSubmitted(true);
      await loadProgress();
      // Don't clear questions immediately so user can see feedback
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestions([]);
    setAnswers({});
    setTopic("");
    setSubmitted(false);
    setAccuracy(null);
  };

  const setAns = (idx, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  return (
    <AppLayout
      title="Learning Studio"
      subtitle={`Welcome back, ${user?.name || "Scholar"} • Ready to master new concepts?`}
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Study Sessions" value={stats.sessions} sub="Total attempts" />
        <StatCard title="Average Accuracy" value={`${stats.avg}%`} sub="Overall mastery" />
        <StatCard title="Best Score" value={`${stats.best}%`} sub="Personal record" />
        <StatCard 
          title="Neural Engine" 
          value={import.meta.env.PROD ? "Gemini 1.5" : "Ollama"} 
          sub={import.meta.env.PROD ? "Cloud AI" : "Local & Private"} 
          icon={BrainCircuit}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Generation Control */}
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent border border-white/5 p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                  <Sparkles className="w-4 h-4" />
                  AI Intelligence
                </div>
                <h2 className="text-2xl font-bold text-white">Knowledge Generator</h2>
                <p className="text-white/40 text-sm">Generate adaptive questions based on your custom topics.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-bold text-white/60 uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {import.meta.env.PROD ? "Cloud AI Online" : "Local LLM Online"}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <div className="md:col-span-2 relative group">
                <input
                  className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-5 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all"
                  placeholder="e.g. Neural Networks, Calculus..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading || questions.length > 0}
                />
              </div>
              <select
                className="h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={loading || questions.length > 0}
              >
                <option value="easy">Easy Mode</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Expert Mode</option>
              </select>
              
              <button
                onClick={questions.length > 0 ? reset : generate}
                disabled={(!topic && questions.length === 0) || loading}
                className={cn(
                  "h-14 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2",
                  questions.length > 0 
                    ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                )}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : questions.length > 0 ? (
                  "Clear & Reset"
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
            {err && (
              <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {err}
              </div>
            )}
          </section>

          {/* Feedback Area */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-400 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Session Complete</p>
                    <p className="text-white font-bold text-xl">You achieved {accuracy}% accuracy!</p>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Next Challenge
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className={cn(
                  "relative rounded-[2rem] p-8 border transition-all duration-500",
                  submitted 
                    ? "bg-white/[0.02] border-white/5" 
                    : "bg-white/[0.03] border-white/10 hover:border-indigo-500/30"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">
                      {q.type.replace("_", " ")}
                    </span>
                  </div>
                  {submitted && (
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      answers[idx] === q.correct_answer ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {answers[idx] === q.correct_answer ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {answers[idx] === q.correct_answer ? "Correct" : "Incorrect"}
                    </div>
                  )}
                </div>

                <p className="text-xl font-semibold text-white leading-relaxed">{q.question}</p>

                {/* MCQ Options */}
                {q.type === "mcq" && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setAns(idx, opt)}
                        disabled={submitted}
                        className={cn(
                          "group relative rounded-2xl p-4 text-left border transition-all duration-300",
                          answers[idx] === opt 
                            ? "bg-indigo-600 border-transparent text-white shadow-lg shadow-indigo-600/20" 
                            : "bg-white/[0.03] border-white/5 text-white/60 hover:border-white/20 hover:bg-white/[0.05]",
                          submitted && opt === q.correct_answer && "ring-2 ring-emerald-500 bg-emerald-500/10 border-transparent text-emerald-400",
                          submitted && answers[idx] === opt && opt !== q.correct_answer && "bg-red-500/10 text-red-400 border-red-500/20 ring-2 ring-red-500"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                            answers[idx] === opt ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="font-medium text-sm">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {q.type === "true_false" && (
                  <div className="mt-8 flex gap-4">
                    {[true, false].map((val) => (
                      <button
                        type="button"
                        key={String(val)}
                        onClick={() => setAns(idx, val)}
                        disabled={submitted}
                        className={cn(
                          "flex-1 h-14 rounded-2xl font-bold text-sm border transition-all duration-300",
                          answers[idx] === val 
                            ? "bg-indigo-600 border-transparent text-white shadow-lg shadow-indigo-600/20" 
                            : "bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/[0.05]",
                          submitted && val === q.correct_answer && "ring-2 ring-emerald-500 bg-emerald-500/10 text-emerald-400 border-transparent",
                          submitted && answers[idx] === val && val !== q.correct_answer && "bg-red-500/10 text-red-400 border-red-500/20 ring-2 ring-red-500"
                        )}
                      >
                        {val ? "TRUE" : "FALSE"}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {q.type === "short" && (
                  <div className="mt-8 space-y-4">
                    <textarea
                      className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-5 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all min-h-[140px]"
                      placeholder="Synthesize your answer here..."
                      value={answers[idx] || ""}
                      onChange={(e) => setAns(idx, e.target.value)}
                      disabled={submitted}
                    />
                    {submitted && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Refined Key Answer</p>
                        <p className="text-sm text-white/80">{q.correct_answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {questions.length > 0 && !submitted && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={submitAnswers}
                disabled={loading || Object.keys(answers).length < questions.length}
                className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Finalize Submission
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Right column */}
        <aside className="lg:col-span-4 space-y-8">
          <AccuracyChart data={chartData} />

          <section className="rounded-[2rem] bg-white/[0.03] border border-white/5 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Recent Sessions</h3>
              </div>
              <button 
                onClick={() => navigate("/progress")}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {progress.slice(0, 5).map((p, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={p._id} 
                  className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.02] p-4 hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-sm truncate pr-4">{p.topic}</p>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-black",
                      p.accuracy >= 80 ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                    )}>
                      {p.accuracy}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase">{p.difficulty}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-medium text-white/20">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              {progress.length === 0 && (
                <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-white/10">
                  <HelpCircle className="w-12 h-12 text-white/5 mx-auto mb-4" />
                  <p className="text-sm text-white/30 font-medium">No sessions recorded yet</p>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

