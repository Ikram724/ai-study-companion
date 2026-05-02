import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LineChart, LogOut, BookOpen, User, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

function navClass({ isActive }) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive 
      ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
      : "text-white/60 hover:bg-white/5 hover:text-white"
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-72 h-screen sticky top-0 border-r border-white/5 bg-[#070A12]/80 backdrop-blur-2xl">
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            StudyAI
          </p>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
            Companion
          </p>
        </div>
      </div>

      <nav className="px-4 space-y-2 mt-4">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
          Main Menu
        </p>
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="/progress" className={navClass}>
          <LineChart className="w-5 h-5" />
          Progress
        </NavLink>
      </nav>

      <div className="mt-auto px-4 pb-8">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center">
              <User className="text-white w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.name || "User"}</p>
              <p className="text-xs text-white/40 truncate">{user?.email || "Student"}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </div>
    </aside>
  );
}

