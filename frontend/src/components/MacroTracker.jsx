import { motion } from "framer-motion";

function MacroBar({ label, value, max, color, unit = "g" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const remaining = Math.max(0, max - value);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {remaining.toFixed(0)}
          <span className="text-xs font-normal text-slate-500 dark:text-slate-500">/{max.toFixed(0)}{unit}</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="text-right text-xs text-slate-400 dark:text-slate-500">{pct.toFixed(0)}% used</div>
    </div>
  );
}

export default function MacroTracker({ userContext }) {
  const {
    calorie_target = 2000,
    calories_consumed_today = 0,
    macro_targets = {},
    macros_consumed_today = {},
  } = userContext;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-5 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white">Today's Budget</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-health-50 dark:bg-health-900/30 text-health-700 dark:text-health-400 border border-health-100 dark:border-health-800/50">
          {((calories_consumed_today / calorie_target) * 100).toFixed(0)}% consumed
        </span>
      </div>

      {/* Calorie ring summary */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-health-50 to-health-100 dark:from-health-900/20 dark:to-health-900/10 border border-health-100 dark:border-health-800/30">
        <div className="text-center">
          <p className="text-3xl font-display font-bold text-health-800 dark:text-health-400">
            {Math.max(0, calorie_target - calories_consumed_today).toFixed(0)}
          </p>
          <p className="text-xs font-semibold text-health-600 dark:text-health-500 uppercase tracking-wider">kcal left</p>
        </div>
        <div className="flex-1 border-l border-health-200 dark:border-health-800/50 pl-4 space-y-0.5 text-sm">
          <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-800 dark:text-slate-200">{calories_consumed_today}</span> consumed</p>
          <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-800 dark:text-slate-200">{calorie_target}</span> target</p>
        </div>
      </div>

      {/* Macro bars */}
      <div className="space-y-4">
        <MacroBar
          label="Protein"
          value={macros_consumed_today.protein_g || 0}
          max={macro_targets.protein_g || 50}
          color="bg-sky-400"
        />
        <MacroBar
          label="Carbohydrates"
          value={macros_consumed_today.carbs_g || 0}
          max={macro_targets.carbs_g || 150}
          color="bg-amber-400"
        />
        <MacroBar
          label="Fat"
          value={macros_consumed_today.fat_g || 0}
          max={macro_targets.fat_g || 65}
          color="bg-rose-400"
        />
      </div>
    </div>
  );
}
