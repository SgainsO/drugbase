import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './space-theme.css';
import LandingPage from './pages/LandingPage';
import ContentPage from './pages/ContentPage';
import DevPage from './pages/DevPage';
import SpaceLoader from './components/SpaceLoader';

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <SpaceLoader />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/dev" element={<DevPage />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
