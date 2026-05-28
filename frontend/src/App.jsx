import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UserGuidePage from './pages/UserGuidePage';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('dark'); // Defaulting to dark as requested

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-health-50 dark:bg-slate-900 selection:bg-health-200 dark:selection:bg-health-800 selection:text-health-900 dark:selection:text-health-100 transition-colors duration-300">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-grow pt-16">
        {currentPage === 'landing' ? (
          <LandingPage onGetStarted={() => setCurrentPage('dashboard')} />
        ) : currentPage === 'guide' ? (
          <UserGuidePage />
        ) : (
          <DashboardPage />
        )}
      </main>
    </div>
  );
}

export default App;
