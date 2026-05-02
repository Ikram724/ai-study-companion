import { useEffect, useRef, useState } from "react";
import { Bell, BellDot, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export default function NotificationBell({ items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((x) => !x.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
          open ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
        )}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? <BellDot className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-[#070A12]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-96 rounded-[2rem] bg-[#0B0F1A]/95 border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <p className="font-bold text-lg text-white">Notifications</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">System Alerts</p>
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-auto">
              {items.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <Bell className="w-12 h-12 text-white/5 mx-auto mb-4" />
                  <p className="text-sm text-white/30 font-medium">No new notifications</p>
                </div>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className="px-8 py-5 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{n.title}</p>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{n.desc}</p>
                    <p className="text-[10px] font-bold text-white/20 mt-3 uppercase tracking-tighter">{n.time}</p>
                  </div>
                ))
              )}
            </div>

            <div className="px-8 py-5 bg-indigo-500/5 flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-[10px] font-medium text-indigo-400/80 leading-relaxed uppercase tracking-wider">
                Tip: Press <kbd className="px-1 rounded bg-indigo-500/20">⌘K</kbd> to quickly search your sessions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

