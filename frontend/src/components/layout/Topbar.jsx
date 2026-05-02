import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Menu, User, LogOut, LayoutDashboard, LineChart } from "lucide-react";
import NotificationBell from "../ui/NotificationBell";
import { cn } from "../../lib/utils";

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const notifications = useMemo(
    () => [
      {
        id: 1,
        title: "Welcome to StudyAI",
        desc: "Unlock your potential with AI-driven learning paths.",
        time: "Just now",
        read: false,
      },
      {
        id: 2,
        title: "Daily Goal reached!",
        desc: "You've completed 3 sessions today. Keep it up!",
        time: "2h ago",
        read: true,
      },
    ],
    []
  );

  const onSearch = (e) => {
    e.preventDefault();
    localStorage.setItem("globalSearch", query);
    if (location.pathname !== "/progress") navigate("/progress");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#070A12]/60 backdrop-blur-md">
      <div className="px-6 h-20 flex items-center justify-between gap-8">
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="hidden lg:flex items-center flex-1 max-w-xl group">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search study topics (e.g. Transformers)..."
              className="w-full h-11 rounded-2xl bg-white/[0.03] border border-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex gap-1">
              <kbd className="h-5 px-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-white/40 flex items-center justify-center">
                ⌘
              </kbd>
              <kbd className="h-5 px-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-white/40 flex items-center justify-center">
                K
              </kbd>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              onClick={() => navigate("/dashboard")}
              className={cn(
                "h-10 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                location.pathname === "/dashboard" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/progress")}
              className={cn(
                "h-10 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                location.pathname === "/progress" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <LineChart className="w-4 h-4" />
              <span className="hidden xl:inline">Insights</span>
            </button>
          </div>

          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

          <NotificationBell items={notifications} />

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-sm font-semibold text-white leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-white/30 font-medium tracking-wide">
                Premium Plan
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full rounded-[11px] bg-[#070A12] flex items-center justify-center overflow-hidden">
                <User className="text-white/70 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

