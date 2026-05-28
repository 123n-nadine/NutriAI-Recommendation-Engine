import { motion } from "framer-motion";
import { User, Target, Activity, Heart } from "lucide-react";

const MOCK_PROFILES = [
  {
    label: "User 1 — Muscle Gain",
    goal: "muscle_gain",
    calorie_target: 3200,
    calories_consumed_today: 1850,
    macro_targets: { protein_g: 180, carbs_g: 320, fat_g: 90 },
    macros_consumed_today: { protein_g: 90, carbs_g: 200, fat_g: 55 },
    conditions: [],
    preferences: ["high_protein", "meal_prep_friendly"],
  },
  {
    label: "User 2 — Weight Loss",
    goal: "weight_loss",
    calorie_target: 1500,
    calories_consumed_today: 820,
    macro_targets: { protein_g: 120, carbs_g: 130, fat_g: 40 },
    macros_consumed_today: { protein_g: 55, carbs_g: 80, fat_g: 22 },
    conditions: ["obesity"],
    preferences: ["low_calorie", "high_fiber"],
  },
  {
    label: "User 3 — Maintenance (Diabetic)",
    goal: "maintenance",
    calorie_target: 1800,
    calories_consumed_today: 960,
    macro_targets: { protein_g: 90, carbs_g: 180, fat_g: 60 },
    macros_consumed_today: { protein_g: 45, carbs_g: 90, fat_g: 30 },
    conditions: ["type2_diabetes"],
    preferences: ["low_glycemic", "low_sugar"],
  },
  {
    label: "User 4 — Maintenance (Vegan)",
    goal: "maintenance",
    calorie_target: 2000,
    calories_consumed_today: 800,
    macro_targets: { protein_g: 75, carbs_g: 260, fat_g: 66 },
    macros_consumed_today: { protein_g: 30, carbs_g: 100, fat_g: 25 },
    conditions: [],
    preferences: ["vegan", "gluten_free"],
  },
  {
    label: "User 5 — Maintenance (Hypertension)",
    goal: "maintenance",
    calorie_target: 1900,
    calories_consumed_today: 1100,
    macro_targets: { protein_g: 95, carbs_g: 200, fat_g: 60 },
    macros_consumed_today: { protein_g: 55, carbs_g: 110, fat_g: 35 },
    conditions: ["hypertension"],
    preferences: ["low_sodium"],
  },
];

const GOALS = [
  { value: "muscle_gain", label: "Muscle Gain", icon: <Activity className="w-4 h-4" /> },
  { value: "weight_loss", label: "Weight Loss", icon: <Target className="w-4 h-4" /> },
  { value: "maintenance", label: "Maintenance", icon: <Heart className="w-4 h-4" /> },
];

export default function UserContextForm({ value, onChange }) {
  const handleProfileSelect = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (idx >= 0) onChange(MOCK_PROFILES[idx]);
  };

  const set = (path, val) => {
    const parts = path.split(".");
    if (parts.length === 1) {
      onChange({ ...value, [parts[0]]: val });
    } else {
      onChange({
        ...value,
        [parts[0]]: { ...value[parts[0]], [parts[1]]: parseFloat(val) || 0 },
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Profile Quick Select */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <User className="w-3 h-3 inline-block mr-1" />
          Load Mock Profile
        </label>
        <select
          onChange={handleProfileSelect}
          defaultValue=""
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-health-400 focus:border-transparent transition-all"
        >
          <option value="" disabled className="dark:bg-slate-800 text-slate-500">
            Select a profile to auto-fill…
          </option>
          {MOCK_PROFILES.map((p, i) => (
            <option key={i} value={i} className="dark:bg-slate-800">
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Goal selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Goal</label>
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => set("goal", g.value)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                value.goal === g.value
                  ? "bg-health-600 text-white border-health-600 shadow-md shadow-health-600/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-health-300 dark:hover:border-health-500 hover:text-health-700 dark:hover:text-health-400"
              }`}
            >
              {g.icon}
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calories */}
      <NumberRow
        label="Calorie Target"
        unit="kcal"
        valA={value.calorie_target}
        valB={value.calories_consumed_today}
        labelA="Target"
        labelB="Consumed"
        onChangeA={(v) => set("calorie_target", v)}
        onChangeB={(v) => set("calories_consumed_today", v)}
      />

      {/* Macro Targets */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Macro Targets (g)</label>
        <div className="grid grid-cols-3 gap-2">
          <MacroInput label="Protein" color="text-sky-500 dark:text-sky-400" value={value.macro_targets?.protein_g || 0} onChange={(v) => set("macro_targets.protein_g", v)} />
          <MacroInput label="Carbs" color="text-amber-500 dark:text-amber-400" value={value.macro_targets?.carbs_g || 0} onChange={(v) => set("macro_targets.carbs_g", v)} />
          <MacroInput label="Fat" color="text-rose-500 dark:text-rose-400" value={value.macro_targets?.fat_g || 0} onChange={(v) => set("macro_targets.fat_g", v)} />
        </div>
      </div>

      {/* Macros Consumed */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consumed Today (g)</label>
        <div className="grid grid-cols-3 gap-2">
          <MacroInput label="Protein" color="text-sky-500 dark:text-sky-400" value={value.macros_consumed_today?.protein_g || 0} onChange={(v) => set("macros_consumed_today.protein_g", v)} />
          <MacroInput label="Carbs" color="text-amber-500 dark:text-amber-400" value={value.macros_consumed_today?.carbs_g || 0} onChange={(v) => set("macros_consumed_today.carbs_g", v)} />
          <MacroInput label="Fat" color="text-rose-500 dark:text-rose-400" value={value.macros_consumed_today?.fat_g || 0} onChange={(v) => set("macros_consumed_today.fat_g", v)} />
        </div>
      </div>
    </div>
  );
}

function NumberRow({ label, unit, valA, valB, labelA, labelB, onChangeA, onChangeB }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{labelA}</span>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 focus-within:ring-2 focus-within:ring-health-400 focus-within:border-transparent transition-all">
            <input
              type="number"
              value={valA}
              onChange={(e) => onChangeA(e.target.value)}
              className="w-full text-sm font-semibold text-slate-800 dark:text-white focus:outline-none bg-transparent"
            />
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">{unit}</span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{labelB}</span>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 focus-within:ring-2 focus-within:ring-health-400 focus-within:border-transparent transition-all">
            <input
              type="number"
              value={valB}
              onChange={(e) => onChangeB(e.target.value)}
              className="w-full text-sm font-semibold text-slate-800 dark:text-white focus:outline-none bg-transparent"
            />
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroInput({ label, color, value, onChange }) {
  return (
    <div className="space-y-1">
      <span className={`text-[11px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-2 focus-within:ring-2 focus-within:ring-health-400 focus-within:border-transparent transition-all">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-semibold text-slate-800 dark:text-white focus:outline-none bg-transparent"
        />
        <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">g</span>
      </div>
    </div>
  );
}
