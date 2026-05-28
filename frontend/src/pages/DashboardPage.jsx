import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, Loader2, SlidersHorizontal, X, LayoutGrid, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchRecommendations } from "../api/client";
import MacroTracker from "../components/MacroTracker";
import UserContextForm from "../components/UserContextForm";
import RecommendationCard from "../components/RecommendationCard";

const DEFAULT_CONTEXT = {
  goal: "muscle_gain",
  calorie_target: 3200,
  calories_consumed_today: 1850,
  macro_targets: { protein_g: 180, carbs_g: 320, fat_g: 90 },
  macros_consumed_today: { protein_g: 90, carbs_g: 200, fat_g: 55 },
  conditions: [],
  preferences: ["high_protein"],
};

export default function DashboardPage() {
  const [userContext, setUserContext] = useState(DEFAULT_CONTEXT);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setHasFetched(true);
    setCurrentPage(1);
    try {
      const data = await fetchRecommendations(userContext);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!recommendations || recommendations.length === 0) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("NutriAI Recommendation Report", 14, 22);

    // Profile Info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Goal: ${userContext.goal.replace("_", " ").toUpperCase()}`, 14, 36);
    doc.text(`Calorie Target: ${userContext.calorie_target} kcal`, 14, 42);
    
    const condText = userContext.conditions.length > 0 ? userContext.conditions.join(", ") : "None";
    doc.text(`Conditions: ${condText}`, 14, 48);
    
    const prefText = userContext.preferences.length > 0 ? userContext.preferences.join(", ") : "None";
    doc.text(`Preferences: ${prefText}`, 14, 54);

    // Table Data
    const tableData = recommendations.map((rec, i) => [
      `#${i + 1}`,
      rec.food_name,
      `${(rec.score * 100).toFixed(0)}%`,
      `${rec.nutrition_snapshot.calories} kcal\n${rec.nutrition_snapshot.protein_g}g P | ${rec.nutrition_snapshot.carbs_g}g C | ${rec.nutrition_snapshot.fat_g}g F`,
      rec.explanation
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Rank", "Food Item", "Match", "Nutrition", "AI Explanation"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // emerald-500
      styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 15 },
        3: { cellWidth: 35 },
        4: { cellWidth: 'auto' }
      }
    });

    doc.save("NutriAI_Recommendations_Report.pdf");
  };

  const downloadCSV = () => {
    if (!recommendations || recommendations.length === 0) return;
    let content = `Rank,Food Item,Match Percentage,Calories,Protein (g),Carbs (g),Fat (g),Explanation\n`;
    recommendations.forEach((rec, index) => {
      const match = `${(rec.score * 100).toFixed(0)}%`;
      const explanation = `"${rec.explanation.replace(/"/g, '""')}"`;
      content += `${index + 1},"${rec.food_name}",${match},${rec.nutrition_snapshot.calories},${rec.nutrition_snapshot.protein_g},${rec.nutrition_snapshot.carbs_g},${rec.nutrition_snapshot.fat_g},${explanation}\n`;
    });
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "NutriAI_Recommendations_Report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadTXT = () => {
    if (!recommendations || recommendations.length === 0) return;
    let content = `NUTRI-AI: RECOMMENDATION REPORT\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    recommendations.forEach((rec, index) => {
      content += `#${index + 1}: ${rec.food_name}\n`;
      content += `Match: ${(rec.score * 100).toFixed(0)}%\n`;
      content += `Nutrition: ${rec.nutrition_snapshot.calories} kcal | ${rec.nutrition_snapshot.protein_g}g P | ${rec.nutrition_snapshot.carbs_g}g C | ${rec.nutrition_snapshot.fat_g}g F\n`;
      content += `Explanation: ${rec.explanation}\n-----------------------------------------\n`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "NutriAI_Recommendations_Report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Pagination logic
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = recommendations.slice(startIndex, startIndex + itemsPerPage);

  // Podium is only shown on the first page
  const podium = currentPage === 1 ? currentItems.slice(0, 3) : [];
  const rest = currentPage === 1 ? currentItems.slice(3) : currentItems;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-health-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Dashboard Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-16 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 dark:text-white text-sm md:text-base leading-none">
                Recommendation Dashboard
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 hidden md:block">
                Configure your profile and get AI-powered food picks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Button Group */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-2 pr-1 uppercase tracking-wider hidden lg:block">
                Export:
              </span>
              <button
                onClick={downloadReport}
                disabled={loading || recommendations.length === 0}
                className="px-3 py-1.5 text-xs font-bold text-health-600 dark:text-health-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download PDF"
              >
                PDF
              </button>
              <button
                onClick={downloadCSV}
                disabled={loading || recommendations.length === 0}
                className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-slate-100 dark:border-slate-700"
                title="Download CSV"
              >
                CSV
              </button>
              <button
                onClick={downloadTXT}
                disabled={loading || recommendations.length === 0}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-slate-100 dark:border-slate-700"
                title="Download TXT"
              >
                TXT
              </button>
            </div>

            {/* Profile Toggle Button */}
            <button
              onClick={() => setPanelOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-health-300 dark:hover:border-health-600 transition-all duration-200 shadow-sm active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4 text-health-500 dark:text-health-400" />
              <span className="hidden sm:block">{panelOpen ? "Hide Profile" : "Edit Profile"}</span>
              <span className="sm:hidden">{panelOpen ? "Hide" : "Edit"}</span>
            </button>

            <button
              onClick={handleFetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-health-600 hover:bg-health-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm shadow-health-600/20 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="hidden sm:block">{loading ? "Analysing…" : "Get Recommendations"}</span>
              <span className="sm:hidden">Go</span>
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT PANEL — Form + Tracker */}
          <AnimatePresence>
            {panelOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="lg:w-80 xl:w-96 flex-shrink-0 space-y-5"
              >
                {/* Macro Tracker */}
                <MacroTracker userContext={userContext} />

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 transition-colors duration-300">
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4 text-sm">
                    Profile Settings
                  </h3>
                  <UserContextForm value={userContext} onChange={setUserContext} />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* RIGHT PANEL — Results */}
          <div className="flex-1 min-w-0">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm mb-5"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Could not fetch recommendations</p>
                  <p className="text-red-600 text-xs mt-0.5">{error}</p>
                  <p className="text-red-600 text-xs mt-1">Make sure the FastAPI backend is running on <code className="bg-red-100 px-1 rounded">http://127.0.0.1:8000</code></p>
                </div>
              </motion.div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !hasFetched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-health-50 dark:bg-health-900/20 border border-health-100 dark:border-health-800/50 flex items-center justify-center mb-4">
                  <LayoutGrid className="w-8 h-8 text-health-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Ready to Analyse</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                  Configure your nutritional profile on the left (or load a mock user), then hit{" "}
                  <span className="font-semibold text-health-600 dark:text-health-400">Get Recommendations</span>.
                </p>
              </motion.div>
            )}

            {/* No results after fetch */}
            {!loading && hasFetched && recommendations.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No Foods Found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                  All candidates were filtered out by your conditions and preferences. Try relaxing your dietary restrictions.
                </p>
              </motion.div>
            )}

            {/* Results */}
            {!loading && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Podium */}
                {podium.length > 0 && (
                  <div>
                    <SectionHeader
                      emoji="✨"
                      title="Top Picks"
                      subtitle={`Ranked by AI score out of ${recommendations.length} recommendations`}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {podium.map((rec, i) => (
                        <RecommendationCard key={rec.food_id} rec={rec} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rest */}
                {rest.length > 0 && (
                  <div>
                    <SectionHeader emoji="🍽️" title="More Options" subtitle="Additional ranked suggestions" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {rest.map((rec, i) => (
                        <RecommendationCard key={rec.food_id} rec={rec} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ emoji, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <h2 className="font-display font-bold text-slate-900 dark:text-white text-lg leading-none">{title}</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
    </div>
  );
}
