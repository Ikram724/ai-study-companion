import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, RotateCcw, Calendar, TrendingUp, BookOpen, Clock, ChevronRight } from "lucide-react";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/ui/StatCard";
import { cn } from "../lib/utils";

export default function Progress() {
  const [progress, setProgress] = useState([]);
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    api.get("/progress").then((res) => setProgress(res.data || []));
  }, []);

  useEffect(() => {
    const g = localStorage.getItem("globalSearch");
    if (g) {
      setQ(g);
      localStorage.removeItem("globalSearch");
    }
  }, []);

  const stats = useMemo(() => {
    const sessions = progress.length;
    const avg = sessions ? Math.round(progress.reduce((a, b) => a + (b.accuracy || 0), 0) / sessions) : 0;
    return { sessions, avg };
  }, [progress]);

  const filtered = useMemo(() => {
    let list = [...progress];
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((p) => (p.topic || "").toLowerCase().includes(s));
    }
    if (difficulty !== "all") {
      list = list.filter((p) => p.difficulty === difficulty);
    }
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [progress, q, difficulty, sort]);

  return (
    <AppLayout title="Learning Insights" subtitle="Deep dive into your session history and performance metrics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard 
          title="Total Sessions" 
          value={stats.sessions} 
          sub="Sessions recorded" 
          icon={BookOpen}
        />
        <StatCard 
          title="Average Accuracy" 
          value={`${stats.avg}%`} 
          sub="Across all topics" 
          icon={TrendingUp}
        />
      </div>

      <section className="rounded-[2rem] bg-white/[0.03] border border-white/5 p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
          <Filter className="w-32 h-32" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Advanced Filtering
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by topic..."
                  className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy Mode</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Expert Mode</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 rounded-xl bg-white/[0.03] border border-white/10 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer appearance-none"
              >
                <option value="newest">Recent First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => { setQ(""); setDifficulty("all"); setSort("newest"); }}
            className="h-12 px-6 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/10 text-sm font-bold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Results Found: <span className="text-indigo-400">{filtered.length}</span>
          </p>
        </div>
      </section>

      <div className="mt-8 rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">Session Log</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            Historical Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Study Topic</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Intensity</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 text-center">Timestamp</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Mastery Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={p._id} 
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{p.topic}</p>
                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-tighter">ID: {p._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      p.difficulty === "hard" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      p.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium text-white/60">{new Date(p.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-white/20 font-medium uppercase">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <p className={cn(
                        "text-xl font-black tabular-nums",
                        p.accuracy >= 80 ? "text-emerald-400" : p.accuracy >= 50 ? "text-indigo-400" : "text-red-400"
                      )}>
                        {p.accuracy}%
                      </p>
                      <div className="w-24 h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${p.accuracy}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            p.accuracy >= 80 ? "bg-emerald-400" : p.accuracy >= 50 ? "bg-indigo-400" : "bg-red-400"
                          )} 
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Calendar className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <p className="text-white/30 font-medium">No sessions found for this criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

