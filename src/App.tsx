import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Medications from './components/Medications';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';

// Helper function to get the current page from the URL path
const getPageFromPath = () => {
  // It takes the part after the "/", e.g., "/dashboard" -> "dashboard"
  // If it's just "/", it defaults to "dashboard"
  return window.location.pathname.substring(1) ;
};


function App() {
  const { user, loading } = useAuth();
  // ✅ 1. Initialize state directly from the URL
  const [currentPage, setCurrentPage] = useState(getPageFromPath());
  const [isPasswordReset, setIsPasswordReset] = useState(false);


  useEffect(() => {
    // This effect handles the back/forward browser buttons
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
    };

    window.addEventListener('popstate', handlePopState);

    // This part handles the password reset link
    if (window.location.hash.includes('type=recovery')) {
      setIsPasswordReset(true);
    }
    
    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Empty array ensures this runs only once on mount

  
  // ✅ 2. Create a new navigation handler
  const handleNavigate = (page) => {
    // First, update the React state
    setCurrentPage(page);
    // Then, update the browser URL without a page refresh
    window.history.pushState({}, '', `/${page}`);
  };


  if (isPasswordReset) {
    return <ResetPassword />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* ... loading spinner ... */}
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'appointments':
        return <Appointments />;
      case 'medications':
        return <Medications />;
      case 'profile':
        return <Profile />;
      default: // 'dashboard' and any other case
        return <Dashboard />;
    }
  };

  return (
    // ✅ 3. Pass the new navigation handler to your Layout
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;