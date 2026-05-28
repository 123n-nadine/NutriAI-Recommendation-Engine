import { motion } from "framer-motion";
import { BookOpen, Target, SlidersHorizontal, ArrowRight, Download } from "lucide-react";

export default function UserGuidePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-health-50 dark:bg-slate-900 py-12 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-health-100 dark:bg-health-900/30 flex items-center justify-center mx-auto mb-6 border border-health-200 dark:border-health-800">
            <BookOpen className="w-8 h-8 text-health-600 dark:text-health-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Comprehensive User Guide
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Welcome to NutriAI, your personal AI-powered nutritional assistant. Learn exactly how to leverage the AI to achieve your health goals.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Section 1 */}
          <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-health-50 dark:bg-health-900/50 text-health-600 dark:text-health-400">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. What Does NutriAI Do?</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>NutriAI is a smart recommendation engine designed to take the guesswork out of meal planning. Instead of just giving you generic meals, NutriAI:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-health-500">
                <li>Calculates exactly how many calories, proteins, carbohydrates, and fats your body needs based on your physical profile and fitness goals.</li>
                <li>Scans through a massive database of foods.</li>
                <li>Automatically <strong className="text-slate-900 dark:text-white">removes</strong> any foods that violate your dietary restrictions or medical conditions (e.g., hiding all bread if you are Celiac).</li>
                <li><strong className="text-slate-900 dark:text-white">Scores and ranks</strong> the remaining safe foods based on how perfectly they fit into your daily macronutrient targets.</li>
              </ul>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-health-50 dark:bg-health-900/50 text-health-600 dark:text-health-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Configuring Your Profile</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
              <p>To get the best recommendations, you need to tell the AI exactly what you need in the Dashboard Sidebar.</p>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Physical Profile & Goals</h3>
                <p>Select your goal (Lose Weight, Maintain, Build Muscle). This dynamically changes the macro ratios the AI looks for. For example, building muscle forces the AI to hunt for high-protein foods.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Dietary Conditions (Strict Rules)</h3>
                <p>This is the most important safety feature of the app. If you check any of these boxes, the AI applies a <strong className="text-slate-900 dark:text-white">Strict Safety Filter</strong>:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2 marker:text-health-500">
                  <li><strong className="text-slate-900 dark:text-white">Vegan / Vegetarian:</strong> Locks out all meat, poultry, fish, dairy, and eggs.</li>
                  <li><strong className="text-slate-900 dark:text-white">Celiac Disease:</strong> Removes all gluten, bread, pasta, and wheat-based products.</li>
                  <li><strong className="text-slate-900 dark:text-white">Diabetic / Hypertensive:</strong> Filters out ultra-processed foods and high-sugar/high-sodium items.</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-health-50 dark:bg-health-900/50 text-health-600 dark:text-health-400">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Understanding Your Results</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>Once the AI finishes thinking, your recommendations will populate the main screen.</p>
              <ul className="list-disc pl-6 space-y-3 marker:text-health-500">
                <li><strong className="text-slate-900 dark:text-white">The Top Picks Podium:</strong> The top 3 foods that most perfectly match your macro needs will be highlighted at the top of the first page.</li>
                <li><strong className="text-slate-900 dark:text-white">Match Percentage:</strong> A score (e.g., 92%) showing how perfectly this food aligns with what your body needs today.</li>
                <li><strong className="text-slate-900 dark:text-white">The AI Explanation:</strong> A brief sentence explaining *why* the AI chose this for you.</li>
                <li><strong className="text-slate-900 dark:text-white">Pagination:</strong> Use the Previous and Next buttons at the bottom to browse through your full list of matches.</li>
              </ul>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-health-50 dark:bg-health-900/50 text-health-600 dark:text-health-400">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Exporting Your Report</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>At the top right of the Dashboard, you will find an <strong className="text-slate-900 dark:text-white">Export Control Panel</strong>. You have three options:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-health-500">
                <li><strong className="text-slate-900 dark:text-white">PDF:</strong> Generates a beautifully formatted presentation document.</li>
                <li><strong className="text-slate-900 dark:text-white">CSV:</strong> Downloads a spreadsheet file to open in Excel or Google Sheets.</li>
                <li><strong className="text-slate-900 dark:text-white">TXT:</strong> Downloads a fast, lightweight text summary.</li>
              </ul>
              <p className="mt-4 text-sm text-slate-500 italic">Note: All exports are generated securely inside your own browser to protect your privacy!</p>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
