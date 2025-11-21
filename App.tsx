import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, History, User, Settings, LayoutDashboard } from 'lucide-react';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { SupportChat } from './components/SupportChat';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Book' },
    { path: '/history', icon: History, label: 'Trips' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/admin', icon: LayoutDashboard, label: 'Admin' }, // Typically hidden for normal users, shown here for demo
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#121212] border-t border-[#2A2A2A] pb-safe pt-2 px-6 flex justify-between items-center z-40 md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive ? 'text-[#FFD300]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#121212] border-r border-[#2A2A2A] flex-col p-6 z-40">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#FFD300]">Jamhuri</h1>
        <p className="text-gray-400 text-xs tracking-widest uppercase">Transfers Kenya</p>
      </div>
      
      <div className="flex flex-col gap-4">
        {[
          { path: '/', icon: Home, label: 'Book a Ride' },
          { path: '/history', icon: History, label: 'My Trips' },
          { path: '/profile', icon: User, label: 'Profile' },
          { path: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
        ].map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              isActive ? 'bg-[#FFD300] text-black font-bold' : 'text-gray-400 hover:bg-[#1E1E1E] hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFD300] selection:text-black pb-24 md:pb-0 md:pl-64">
        <DesktopNav />
        
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        <BottomNav />
        <SupportChat />
      </div>
    </HashRouter>
  );
};

export default App;