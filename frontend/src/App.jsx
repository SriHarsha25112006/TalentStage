import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientNavbar from './components/ClientNavbar';
import FreelancerNavbar from './components/FreelancerNavbar';
import BothNavbar from './components/BothNavbar';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Community from './pages/Community';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Portfolio from './pages/Dashboard/Portfolio';
import Skills from './pages/Dashboard/Skills';
import PostProject from './pages/Dashboard/PostProject';
import Contracts from './pages/Dashboard/Contracts';
import Earnings from './pages/Dashboard/Earnings';
import Payments from './pages/Dashboard/Payments';

function App() {
  const { user } = useAuth();

  const renderNavbar = () => {
    if (!user) return <Navbar />;
    if (user.role === 'Client') return <ClientNavbar />;
    if (user.role === 'Freelancer') return <FreelancerNavbar />;
    return <BothNavbar />;
  };

  // Smart dashboard redirect based on role
  const DashboardRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'Client') return <Navigate to="/freelancers" replace />;
    return <Navigate to="/freelancer/portfolio" replace />;
  };

  return (
    <>
      {renderNavbar()}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/freelancers" element={<Explore />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={user ? <DashboardRedirect /> : <Login />} />
          <Route path="/signup" element={user ? <DashboardRedirect /> : <Signup />} />

          {/* Freelancer Routes */}
          <Route path="/freelancer/portfolio" element={user ? <Portfolio /> : <Navigate to="/login" replace />} />
          <Route path="/freelancer/skills" element={user ? <Skills /> : <Navigate to="/login" replace />} />
          <Route path="/freelancer/contracts" element={user ? <Contracts /> : <Navigate to="/login" replace />} />
          <Route path="/freelancer/earnings" element={user ? <Earnings /> : <Navigate to="/login" replace />} />

          {/* Client Routes */}
          <Route path="/client/post-project" element={user ? <PostProject /> : <Navigate to="/login" replace />} />
          <Route path="/client/contracts" element={user ? <Contracts /> : <Navigate to="/login" replace />} />
          <Route path="/client/payments" element={user ? <Payments /> : <Navigate to="/login" replace />} />

          {/* Dashboard redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
