import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, ShieldCheck } from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch high-quality editorial photos of healthy food for the home page
    fetch(`https://pixabay.com/api/?key=56051191-afd3d9009c3df9a8ed5a42d4e&q=healthy+food+avocado&image_type=photo&orientation=vertical&per_page=6&editors_choice=true`)
      .then(res => res.json())
      .then(data => {
        if (data.hits && data.hits.length > 0) {
          setImages(data.hits.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-health-300/20 blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-health-500/10 blur-3xl mix-blend-multiply pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 z-10 w-full py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-health-100 dark:bg-health-900/30 text-health-800 dark:text-health-400 text-sm font-semibold mb-6 border border-health-200 dark:border-health-800/50">
              <span className="w-2 h-2 rounded-full bg-health-500 animate-pulse" />
              AI-Powered Nutrition Core v1.0
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-display font-bold text-health-950 dark:text-white mb-4 leading-tight tracking-tight transition-colors">
              Smarter Choices, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-health-600 to-health-400 dark:from-health-400 dark:to-health-300">Better Health.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-8 leading-relaxed transition-colors">
              NutriAI analyzes your daily macro targets, dietary restrictions, and personal goals to generate perfectly tailored meal recommendations in milliseconds.
            </motion.p>

            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-health-600 hover:bg-health-700 text-white rounded-xl font-semibold shadow-lg shadow-health-600/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Images */}
          <div className="relative h-[300px] lg:h-[400px] w-full hidden sm:block">
            {images.length === 3 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Image 1 (Left, slightly lower) */}
                <motion.div 
                  className="absolute left-[5%] top-[20%] w-[45%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-health-500 z-10"
                  whileHover={{ y: -10, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={images[0].webformatURL} alt="Healthy Food" className="w-full h-full object-cover" />
                </motion.div>

                {/* Image 2 (Center, highest, prominent) */}
                <motion.div 
                  className="absolute left-[28%] top-[5%] w-[50%] h-[65%] rounded-2xl overflow-hidden shadow-2xl border-4 border-health-500 z-20"
                  whileHover={{ y: -10, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={images[1].webformatURL} alt="Healthy Food" className="w-full h-full object-cover" />
                </motion.div>

                {/* Image 3 (Right, lowest) */}
                <motion.div 
                  className="absolute right-[5%] top-[30%] w-[45%] h-[50%] rounded-2xl overflow-hidden shadow-2xl border-4 border-health-500 z-30"
                  whileHover={{ y: -10, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={images[2].webformatURL} alt="Healthy Food" className="w-full h-full object-cover" />
                </motion.div>
              </motion.div>
            ) : (
              /* Fallback glowing shape if images are loading */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-health-400 to-health-600 blur-3xl opacity-30 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 lg:mt-16 text-left"
        >
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-health-600" />}
            title="Real-Time Analysis"
            desc="Algorithms match food macros directly against your remaining daily targets."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-health-600" />}
            title="Dietary Safe"
            desc="Strict filtering ensures recommendations comply with allergies and medical conditions."
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-health-600" />}
            title="Goal Aligned"
            desc="Whether building muscle or losing weight, recommendations prioritize what you need."
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors duration-300"
    >
      <div className="w-12 h-12 rounded-lg bg-health-50 dark:bg-health-900/30 flex items-center justify-center mb-4 border border-health-100 dark:border-health-800/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
