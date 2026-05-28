# NutriAI System Technical Documentation
**Version:** 1.0.0
**Date:** May 2026
**Status:** Production Ready

---

## 1. Executive Summary
NutriAI is a comprehensive, AI-powered nutritional recommendation system. The platform analyzes a user's macronutrient targets, caloric goals, pre-existing medical conditions, and dietary preferences to generate highly tailored, safe food recommendations in milliseconds. 

The system operates on a decoupled client-server architecture:
*   **Backend:** High-performance Python backend powered by FastAPI, implementing a strict algorithmic recommendation engine.
*   **Frontend:** Modern, responsive Single Page Application (SPA) built with React, Vite, Tailwind CSS, and Framer Motion for premium UI/UX aesthetics.

---

## 2. System Architecture

The project is split into two independent services that communicate via a RESTful API layer over HTTP/JSON.

### 2.1 Backend Architecture (FastAPI)
*   **Web Framework:** FastAPI (Uvicorn server) for asynchronous, fast endpoint resolution.
*   **Core Logic:** Modularized into `services/` containing the core recommendation algorithms and filtering logic.
*   **Data Layer:** In-memory processing of a large nutritional dataset (`candidate_foods.py`), allowing ultra-low latency lookups without database overhead.

### 2.2 Frontend Architecture (React / Vite)
*   **Build Tool:** Vite (for Lightning-fast HMR and optimized production builds).
*   **Framework:** React 18 using functional components and React Hooks (`useState`, `useEffect`).
*   **Styling:** Tailwind CSS with a custom design token system (using a custom `health` color palette) and glassmorphism UI elements.
*   **Animations:** Framer Motion (`<motion.div>`) for advanced micro-interactions, layout transitions, and fluid entering/exiting animations.

---

## 3. Data Variety & Sourcing
The intelligence of NutriAI relies heavily on the local, statically-typed JSON/Dictionary dataset housed in `candidate_foods.py`. This dataset contains hundreds of meticulously classified food items, allowing the algorithm to pull from a highly diverse spectrum of macronutrient sources.

### 3.1 Data Categories
The database is structured to ensure recommendations never become monotonous. It includes:
*   **High-Protein Sources:** Raw/cooked meats (chicken, beef, lamb, turkey, venison), comprehensive seafood (cod, salmon, squid, oysters, lobster), and plant-based proteins (tofu, tempeh, lentils).
*   **Carbohydrate Sources:** Starches (rice, potatoes, oats), grains (quinoa, bread, pasta), and legumes.
*   **Fats & Dairy:** Oils, nuts, seeds, milk, cheeses, and yogurts.
*   **Fruits & Vegetables:** A massive index of micronutrient-dense produce ranging from dark leafy greens to exotic fruits.
*   **Specialty & Ultra-Processed:** Complex dishes (curries, stews, burgers, pizza) designed to simulate realistic eating habits or "cheat meals."

### 3.2 Data Granularity
Each item in the database contains strict per-serving or per-100g nutritional vectors:
*   `calories`: Base energy calculation.
*   `protein_g`, `carbs_g`, `fat_g`: The primary macros used by the scoring engine to calculate the Euclidean distance to the user's optimal macro targets.
*   `category`: A rigid string identifier used by the strict-filtering system to instantly cull dangerous or unwanted foods.

---

## 4. Backend Implementation Details

### 4.1 The Recommendation Engine (`recommendation_service.py`)
The main orchestrator (`get_recommendations`) performs the following pipeline:
1.  **Ingestion:** Receives a `UserContextRequest` schema validating user data (Goals, Calories, Conditions, Preferences).
2.  **Filtering Phase:** Passes the entire food database through `filter_unsafe_foods()`. This is a *strict inclusion* phase.
3.  **Scoring Phase:** Valid foods are passed to `score_food()`. The engine calculates a dynamic match percentage based on how well the food's macros (Protein, Carbs, Fat) align with the user's current macronutrient deficit.
4.  **Sorting & Thresholding:** Foods are sorted by highest score. Foods failing to meet the strict `MIN_SCORE_THRESHOLD` (0.75) are culled to prevent hallucinations.

### 4.2 Strict Dietary Filtering (`recommendation_helpers.py`)
To prevent dangerous recommendations (e.g., milk for vegans, bread for celiacs), the system utilizes a **Dual-Validation Filter**:
1.  **Category Validation:** Checks the database-defined `category` against allowed lists.
2.  **String-Matching Validation:** Parses the `food_name` string against extensive keyword arrays (`_is_dairy_or_egg_by_name`, `_is_meat_by_name`). This prevents poorly-categorized foods from bypassing safety checks for vegans/vegetarians.
*   *Boolean Logic:* Condition arrays and Preference arrays are dynamically merged so safety rules are enforced regardless of where the user inputs them.

---

## 5. Frontend Implementation Details

### 5.1 UI/UX Design System
*   **Palette:** Deep slate dark modes (`slate-800`, `slate-900`) contrasted with vibrant green accents (`health-400` to `health-600`) to evoke vitality and freshness.
*   **Responsive Layout:** Fully optimized for mobile, tablet, and desktop (utilizing Tailwind's `md:` and `lg:` breakpoints).

### 5.2 Landing Page (`LandingPage.jsx`)
*   **Dynamic Visuals:** Utilizes the Pixabay API to dynamically fetch 3 high-quality editorial images of healthy food on load.
*   **Masonry Layout:** Implements a custom absolute-positioned, overlapping image grid with hover-elevation animations. Borders are perfectly color-matched to the brand (`border-health-500`).

### 5.3 Dashboard UI (`DashboardPage.jsx`)
*   **Interactive Form:** Users can toggle their profile settings dynamically via a sliding side-panel.
*   **Pagination:** Implemented a pure client-side pagination system (12 items per page) to prevent DOM overloading, complete with "Previous/Next" navigation.
*   **Smart Podium:** The top 3 AI-ranked foods are separated into a visually distinct "Top Picks" tier, exclusively pinned to the first page.

### 5.4 Multi-Format Report Export
The frontend features a powerful, zero-backend export engine grouped in a sleek header component:
*   **PDF Generation (`jsPDF` & `jspdf-autotable`):** Programmatically constructs a beautifully formatted PDF document.
*   **CSV Export:** Compiles data into a comma-separated format for direct import into Excel.
*   **TXT Export:** Generates a clean, lightweight text summary using Blob APIs.

---

## 6. Project Development Methodology & Timeline

The project was executed in a rapid, agile methodology, moving from core logic to UX polishing through the following deliberate steps:

### Step 1: Initial System Audit & Codebase Navigation
*   **Action:** Analyzed the legacy Python files (`main.py`, `candidate_foods.py`) and existing React frontend.
*   **Outcome:** Mapped out the data flow from the FastAPI router to the React components. Identified that the initial filtering logic was relying solely on categories, which was leading to hallucinations.

### Step 2: Overhauling the Recommendation Algorithms
*   **Action:** Rewrote `filter_unsafe_foods` in `recommendation_helpers.py`.
*   **Implementation:** Developed the **Dual-Validation** system. We introduced string-matching algorithms (`_is_dairy_or_egg_by_name`, `_is_meat_by_name`) and unified the validation logic so that both `preferences` and `conditions` arrays trigger the same strict safety rules (e.g., ensuring "Vegan" completely eliminates all meat, dairy, and eggs).
*   **Tuning:** Raised the AI `MIN_SCORE_THRESHOLD` to 0.75 to ensure only high-quality macros are recommended.

### Step 3: Frontend Feature Expansion (Pagination & Exports)
*   **Action:** Restructured the `DashboardPage.jsx` component.
*   **Implementation:** 
    *   Removed arbitrary limits from the backend API, allowing it to return the full array of matches.
    *   Implemented frontend pagination (12 items per page) to handle the massive datasets efficiently.
    *   Built the Export Engine. Started with a `.txt` download, then upgraded to a multi-format (PDF, CSV, TXT) export suite using `jsPDF`.

### Step 4: UI/UX Premium Polish & Integration
*   **Action:** Elevated the visual aesthetics to a production-ready standard.
*   **Implementation:** 
    *   Integrated the **Pixabay API** into the Landing Page to fetch high-quality editorial images dynamically.
    *   Built a custom staggered masonry layout using `Framer Motion` for these images.
    *   Standardized the color palette, applying `health-500` green to borders, gradients, and buttons to create a cohesive brand identity.
    *   Optimized layout padding, margins, and font scaling so the entire application perfectly fits within a standard 13"-15" laptop viewport without scroll-fatigue.

---

## 7. Full Project Directory Structure

\`\`\`text
nutrition_system/
├── api/
│   └── main.py                     # FastAPI Application Entrypoint & Endpoints
├── app/
│   ├── constants.py                # System-wide dietary categories and keywords
│   ├── schemas.py                  # Pydantic models for API validation
│   └── services/
│       ├── recommendation_helpers.py # Dual-validation filtering & macro scoring
│       └── recommendation_service.py # Orchestration and thresholding logic
├── frontend/
│   ├── package.json                # React/Vite dependencies (jsPDF, Lucide, Framer)
│   ├── index.html                  # HTML entry point
│   ├── tailwind.config.js          # Custom theme configuration (health palette)
│   └── src/
│       ├── App.jsx                 # React Router / Layout Wrapper
│       ├── api/client.js           # Axios wrapper for FastAPI communication
│       ├── components/             # Reusable UI (Cards, Trackers, Forms)
│       └── pages/
│           ├── LandingPage.jsx     # Hero section with Pixabay API integration
│           └── DashboardPage.jsx   # Core application logic, pagination, & exports
├── candidate_foods.py              # Local nutritional JSON/Dict database
├── mock_user_contexts.py           # Pre-configured testing profiles
└── requirements.txt                # Python backend dependencies
\`\`\`
