import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Flame, Wheat, Droplets, Award, Star } from "lucide-react";
import { cn } from "../lib/utils";

// Returns { emoji, gradient } for each food category - no external images needed
function getFoodVisual(category = "", foodName = "") {
  const c = (category + " " + foodName).toLowerCase();

  if (c.includes("chicken") || c.includes("turkey") || c.includes("roast"))
    return { emoji: "🍗", gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)" };
  if (c.includes("beef") || c.includes("steak") || c.includes("kofta") || c.includes("ground beef"))
    return { emoji: "🥩", gradient: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)" };
  if (c.includes("lamb") || c.includes("venison") || c.includes("duck"))
    return { emoji: "🍖", gradient: "linear-gradient(135deg, #831843 0%, #be185d 50%, #f472b6 100%)" };
  if (c.includes("pork") || c.includes("bacon") || c.includes("ham") || c.includes("sausage"))
    return { emoji: "🥓", gradient: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)" };
  if (c.includes("salmon") || c.includes("tuna") || c.includes("trout") || c.includes("mackerel"))
    return { emoji: "🍣", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)" };
  if (c.includes("cod") || c.includes("haddock") || c.includes("fish") || c.includes("halibut") || c.includes("plaice") || c.includes("sole"))
    return { emoji: "🐟", gradient: "linear-gradient(135deg, #164e63 0%, #0e7490 50%, #22d3ee 100%)" };
  if (c.includes("prawn") || c.includes("shrimp") || c.includes("lobster") || c.includes("crab") || c.includes("mussel") || c.includes("oyster") || c.includes("scallop") || c.includes("squid"))
    return { emoji: "🦐", gradient: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #60a5fa 100%)" };
  if (c.includes("egg"))
    return { emoji: "🥚", gradient: "linear-gradient(135deg, #713f12 0%, #ca8a04 50%, #fde047 100%)" };
  if (c.includes("milk") || c.includes("cheese") || c.includes("dairy") || c.includes("yogurt") || c.includes("cottage") || c.includes("whey"))
    return { emoji: "🧀", gradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)" };
  if (c.includes("bread") || c.includes("oat") || c.includes("grain") || c.includes("wheat") || c.includes("cereal"))
    return { emoji: "🍞", gradient: "linear-gradient(135deg, #92400e 0%, #b45309 50%, #f59e0b 100%)" };
  if (c.includes("pasta") || c.includes("rice") || c.includes("noodle"))
    return { emoji: "🍝", gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d8b4fe 100%)" };
  if (c.includes("spinach") || c.includes("kale") || c.includes("salad") || c.includes("vegetable") || c.includes("broccoli") || c.includes("veg"))
    return { emoji: "🥦", gradient: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #4ade80 100%)" };
  if (c.includes("bean") || c.includes("lentil") || c.includes("legume") || c.includes("chickpea") || c.includes("hummus"))
    return { emoji: "🫘", gradient: "linear-gradient(135deg, #3f6212 0%, #65a30d 50%, #a3e635 100%)" };
  if (c.includes("fruit") || c.includes("berry") || c.includes("apple") || c.includes("banana"))
    return { emoji: "🍎", gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)" };
  if (c.includes("avocado"))
    return { emoji: "🥑", gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #86efac 100%)" };
  if (c.includes("nut") || c.includes("almond") || c.includes("walnut") || c.includes("peanut"))
    return { emoji: "🥜", gradient: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #d97706 100%)" };
  if (c.includes("oil") || c.includes("butter"))
    return { emoji: "🫒", gradient: "linear-gradient(135deg, #365314 0%, #4d7c0f 50%, #84cc16 100%)" };
  if (c.includes("soup") || c.includes("stew"))
    return { emoji: "🍲", gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)" };
  if (c.includes("dessert") || c.includes("sugar") || c.includes("cake"))
    return { emoji: "🍰", gradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #f9a8d4 100%)" };
  if (c.includes("fast") || c.includes("junk") || c.includes("burger"))
    return { emoji: "🍔", gradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #fcd34d 100%)" };
  if (c.includes("protein"))
    return { emoji: "💪", gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #818cf8 100%)" };

  // Default
  return { emoji: "🥗", gradient: "linear-gradient(135deg, #065f46 0%, #059669 50%, #6ee7b7 100%)" };
}

const RANK_CONFIG = {
  1: {
    badge: "🥇 Best Match",
    border: "border-amber-300 dark:border-amber-500/50",
    headerBg: "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    glow: "shadow-amber-100 dark:shadow-none",
  },
  2: {
    badge: "🥈 Runner-Up",
    border: "border-slate-300 dark:border-slate-600",
    headerBg: "from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700/50",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
    glow: "shadow-slate-100 dark:shadow-none",
  },
  3: {
    badge: "🥉 Third Place",
    border: "border-orange-300 dark:border-orange-500/50",
    headerBg: "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
    glow: "shadow-orange-100 dark:shadow-none",
  },
};

const DEFAULT_CONFIG = {
  badge: null,
  border: "border-slate-100 dark:border-slate-700",
  headerBg: "from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80",
  badgeClass: "bg-health-50 text-health-700 border-health-100 dark:bg-health-900/30 dark:text-health-400 dark:border-health-800/50",
  glow: "shadow-slate-50 dark:shadow-none",
};

function ScoreBar({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] md:text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400 capitalize">{label.replace(/_score$/, "").replace(/_/g, " ")}</span>
        <span className="font-bold text-slate-700 dark:text-slate-300">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-health-400 to-health-600 dark:from-health-500 dark:to-health-400"
        />
      </div>
    </div>
  );
}

export default function RecommendationCard({ rec, index }) {
  const [expanded, setExpanded] = useState(false);
  const config = RANK_CONFIG[rec.rank] || DEFAULT_CONFIG;
  const ns = rec.nutrition_snapshot;
  const { emoji, gradient } = getFoodVisual(rec.category || "", rec.food_name || "");

  const FLAG_STYLES = {
    high_protein: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50",
    low_calorie: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
    low_carb: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
    low_fat: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
    whole_food: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
    muscle_gain_friendly: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    weight_loss_friendly: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/50",
    limit_recommended: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl border bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex flex-col h-full transition-colors duration-300",
        config.border,
        config.glow
      )}
    >
      {/* Card Info Header */}
      <div className={cn("relative bg-gradient-to-r px-5 py-3 border-b dark:border-slate-700/50 flex-shrink-0", config.headerBg)}>
        {/* Score Badge floating on the right side of the header */}
        <div className={cn("absolute top-3 right-3 flex flex-col items-center justify-center w-12 h-12 rounded-xl border backdrop-blur-md shadow-sm", config.badgeClass)}>
          <span className="text-sm font-display font-black leading-none mt-0.5">{(rec.score * 100).toFixed(0)}</span>
          <span className="text-[9px] font-semibold opacity-80 uppercase tracking-wide">score</span>
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-1 pr-14">
          {config.badge && (
            <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full border", config.badgeClass)}>
              {config.badge}
            </span>
          )}
          {!config.badge && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">#{rec.rank}</span>
          )}
        </div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug">
          {rec.food_name}
        </h3>
      </div>

      {/* Nutrition Grid */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-700 border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 flex-shrink-0">
        <NutriCell icon={<Flame className="w-3.5 h-3.5 text-orange-500" />} label="Calories" value={ns.calories.toFixed(0)} unit="kcal" />
        <NutriCell icon={<Award className="w-3.5 h-3.5 text-sky-500" />} label="Protein" value={ns.protein_g.toFixed(1)} unit="g" />
        <NutriCell icon={<Wheat className="w-3.5 h-3.5 text-amber-500" />} label="Carbs" value={ns.carbs_g.toFixed(1)} unit="g" />
        <NutriCell icon={<Droplets className="w-3.5 h-3.5 text-rose-500" />} label="Fat" value={ns.fat_g.toFixed(1)} unit="g" />
      </div>

      {/* Body (Flex grow so it expands naturally) */}
      <div className="px-5 py-4 space-y-3 flex-grow flex flex-col">
        {/* Flags */}
        {rec.flags && rec.flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {rec.flags.map((flag) => (
              <span
                key={flag}
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                  FLAG_STYLES[flag] || "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                )}
              >
                {flag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {/* Explanation */}
        <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed flex-grow">
          {rec.explanation}
        </p>

        {/* Expandable score breakdown */}
        {rec.score_breakdown && (
          <div className="pt-2 mt-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-health-600 dark:text-health-400 hover:text-health-800 dark:hover:text-health-300 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Score breakdown
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-inner">
                    {Object.entries(rec.score_breakdown).map(([key, val]) => (
                      <ScoreBar key={key} label={key} value={val} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NutriCell({ icon, label, value, unit }) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-1 gap-0.5">
      {icon}
      <span className="font-display font-bold text-slate-900 dark:text-white text-sm md:text-base leading-none mt-0.5">{value}</span>
      <div className="flex items-center gap-0.5 mt-0.5">
        <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-medium">{label}</span>
        <span className="text-[9px] md:text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">({unit})</span>
      </div>
    </div>
  );
}
