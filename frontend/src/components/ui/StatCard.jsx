import { motion } from "framer-motion";
import { TrendingUp, Users, Trophy, Zap } from "lucide-react";

const icons = {
  "Study Sessions": Zap,
  "Average Accuracy": TrendingUp,
  "Best Score": Trophy,
  "Model": Users
};

export default function StatCard({ title, value, sub, icon: IconOverride }) {
  const Icon = IconOverride || icons[title] || Zap;

  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 p-6 shadow-2xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon className="w-20 h-20 text-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">{title}</p>
        </div>
        
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold tracking-tight text-white">{value}</p>
        </div>
        
        {sub && (
          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <p className="text-xs font-medium text-white/30 uppercase tracking-widest">{sub}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

