import { motion } from "framer-motion";
import { Leaf, LayoutDashboard, Home, BookOpen, Moon, Sun } from "lucide-react";

export default function Navbar({ onNavigate, currentPage, theme, toggleTheme }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 shadow-sm transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center shadow-md shadow-health-600/30">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-health-950 dark:text-white tracking-tight transition-colors">
            Nutri<span className="text-health-600 dark:text-health-400">AI</span>
          </span>
        </button>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <NavButton
            icon={<Home className="w-4 h-4" />}
            label="Home"
            active={currentPage === "landing"}
            onClick={() => onNavigate("landing")}
          />
          <NavButton
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
            active={currentPage === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />
          <NavButton
            icon={<BookOpen className="w-4 h-4" />}
            label="Guide"
            active={currentPage === "guide"}
            onClick={() => onNavigate("guide")}
          />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-health-50 dark:bg-health-900/30 text-health-700 dark:text-health-400 border border-health-200 dark:border-health-800/50"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
