import Signup from './pages/misc/Signup'
import React, { useState, useEffect } from 'react'
import Home from './pages/home/Home'
import PageLoader from './pages/home/PageLoader'
import Navbar from './pages/misc/Navbar'
import MapView from './components/map/MapView'
import Login from './pages/misc/Login'
import AmbulanceDashboard from './pages/ambulance/AmbulanceDashboard'
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import TrafficDashboard from './pages/traffic/TrafficDashboard'
import PublicDashboard from './pages/public/PublicDashboard'
import ControlRoomDashboard from './pages/controlroom/ControlRoomDashboard'
import RoleDashboard from './pages/misc/RoleDashboard'
// ClickSpark import removed

const DASHBOARD_FOR_ROLE = {
  ambulance: 'ambulance-dashboard',
  hospital: 'hospital-dashboard',
  traffic: 'traffic-dashboard',
  public: 'public-dashboard',
  control_room: 'controlroom-dashboard',
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on first load
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gn_user')) || null; } catch { return null; }
  });
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('gn_user'));
      const saved = localStorage.getItem('gn_page');
      // Only restore dashboard pages; reject map/home/login on reload
      if (user && saved && saved.endsWith('-dashboard')) return saved;
    } catch { }
    return 'home';
  });
  const [selectedRole, setSelectedRole] = useState(null);

  // Persist session whenever user or page changes
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('gn_user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('gn_user');
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (currentPage.endsWith('-dashboard')) {
      localStorage.setItem('gn_page', currentPage);
    } else if (currentPage === 'home' || currentPage === 'login') {
      localStorage.removeItem('gn_page');
    }
  }, [currentPage]);

  const handleLoginSuccess = (dashboard, user) => {
    setLoggedInUser(user);
    setCurrentPage(dashboard);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('home');
    localStorage.removeItem('gn_user');
    localStorage.removeItem('gn_page');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage('map');
  };

  return (
    <>
      {currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'map' && currentPage !== 'home' && !currentPage.endsWith('-dashboard') && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} onRoleSelect={handleRoleSelect} />
      )}
      <PageLoader onLoadComplete={() => setIsLoading(false)} />
      <div style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
        <Home onGetStarted={() => setCurrentPage('map')} setCurrentPage={setCurrentPage} />
      </div>
      {currentPage === 'map' && (
        <MapView role={selectedRole || loggedInUser?.role} user={loggedInUser} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      )}
      {currentPage === 'login' && (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 relative">
          <button
            className="absolute top-6 left-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-emerald-400/30 text-white text-2xl font-extrabold shadow-xl transition-all duration-200 border border-white/20 group"
            style={{ backdropFilter: 'blur(10px)' }}
            onClick={() => setCurrentPage('home')}
            aria-label="Back to Home"
          >
            <span className="relative flex items-center justify-center w-full h-full">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-emerald-400/30 blur-lg opacity-0 group-hover:opacity-80 transition-all duration-300 animate-pulse" />
              <span className="relative z-10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                  <path d="M15.75 19.25L8.75 12.25L15.75 5.25" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </button>
          <div className="w-full max-w-md rounded-2xl shadow-2xl p-8" style={{ background: 'rgba(20,20,30,0.98)', border: '1px solid #222' }}>
            <Login onLoginSuccess={handleLoginSuccess} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )}
      {currentPage === 'ambulance-dashboard' && (
        <AmbulanceDashboard
          user={loggedInUser}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'hospital-dashboard' && (
        <HospitalDashboard
          user={loggedInUser}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'traffic-dashboard' && (
        <TrafficDashboard
          user={loggedInUser}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'public-dashboard' && (
        <PublicDashboard
          user={loggedInUser}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'controlroom-dashboard' && (
        <ControlRoomDashboard
          user={loggedInUser}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'signup' && (
        <Signup onBack={() => setCurrentPage('home')} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default App
