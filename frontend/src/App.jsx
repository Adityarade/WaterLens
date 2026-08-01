import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Droplet, Search, ChevronDown, Activity, BrainCircuit, Leaf, Droplets, Target, ShieldAlert, LineChart, FileText, Settings, User, X, MessageSquare, Globe, Map, Landmark, TrendingUp, LogOut, Download, Smartphone, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import ChatInterface from './components/ChatInterface';
import VoiceAssistant from './components/VoiceAssistant';

import Dashboard from './pages/Dashboard';
import RLAgent from './pages/RLAgent';
import CropHealth from './pages/CropHealth';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import FarmMap from './pages/FarmMap';
import GovtSchemes from './pages/GovtSchemes';
import MarketRates from './pages/MarketRates';
import { useI18n } from './i18n';
import { API_BASE_URL } from './config';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [authStage, setAuthStage] = useState('login'); // login | welcome | dashboard

  if (authStage === 'login') return <LoginScreen onLogin={() => setAuthStage('welcome')} />;
  if (authStage === 'welcome') return <WelcomeScreen onFinish={() => setAuthStage('dashboard')} />;
  
  return <DashboardLayout onLogout={() => setAuthStage('login')} />;
}

function Raindrops() {
  const drops = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {drops.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 0] }}
          transition={{
            duration: 1 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute w-0.5 h-6 bg-gradient-to-b from-emerald-400/0 to-emerald-500/60 rounded-full"
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (!res.ok) throw new Error(await res.text());
        } catch (fetchErr) {
          console.warn("Backend offline during signup, proceeding locally:", fetchErr);
        }
        setMode('signin');
        setError('Registration successful! Please sign in.');
      } else {
        try {
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);

          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            onLogin();
            return;
          }
        } catch (fetchErr) {
          console.warn("Backend offline during login, proceeding with offline mode:", fetchErr);
        }
        
        // Fallback for offline or demo login
        localStorage.setItem('token', 'demo_offline_access_token');
        onLogin();
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black/10">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-heavy w-full max-w-md p-8 rounded-3xl relative z-10 flex flex-col items-center border border-white"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 text-white">
          <Droplet className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight text-emerald-600">WaterLens</h1>
        <p className="text-slate-500 font-medium text-center mb-6">
          {mode === 'signin' ? 'Sign in to access your smart farm dashboard' : 'Create an account to start optimizing'}
        </p>

        {error && (
          <div className={`w-full p-3 rounded-xl mb-4 text-sm font-bold ${error.includes('successful') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
            {error}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            try {
              // Create demo Google account if not exists
              await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'google@demo.com', password: 'googlepassword123' })
              }).catch(() => {});
              
              const formData = new URLSearchParams();
              formData.append('username', 'google@demo.com');
              formData.append('password', 'googlepassword123');

              const res = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
              }).catch(() => null);
              
              if (res && res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.access_token);
              } else {
                localStorage.setItem('token', 'google_demo_offline_token');
              }
              onLogin();
            } catch (err) {
              localStorage.setItem('token', 'google_demo_offline_token');
              onLogin();
            } finally {
              setLoading(false);
            }
          }}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-sm text-slate-500 font-medium">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-emerald-500 font-bold hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function WelcomeScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-emerald-900/10">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
      <Raindrops />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 text-white">
          <Droplet className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight text-center">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">WaterLens</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-medium">Initializing your intelligent farm dashboard...</p>
        
        <div className="mt-12 w-48 h-1.5 bg-slate-200/50 rounded-full overflow-hidden border border-white">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.3, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
      </motion.div>
    </div>
  );
}

function DashboardLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Check if running as installed standalone PWA
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }
    const promptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', promptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', promptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setInstallModalOpen(true);
    }
  };

  // Re-fetch profile when returning to the app or when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setProfileData(data);
            localStorage.setItem('waterlens_profile', JSON.stringify(data));
          }
        } catch (err) {
          console.warn("Failed to fetch profile in header", err);
          const saved = localStorage.getItem('waterlens_profile');
          if (saved) setProfileData(JSON.parse(saved));
        }
      }
    };
    
    fetchProfile();
    window.addEventListener('focus', fetchProfile);
    window.addEventListener('profileUpdated', fetchProfile);
    return () => {
      window.removeEventListener('focus', fetchProfile);
      window.removeEventListener('profileUpdated', fetchProfile);
    };
  }, []);

  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Activity className="w-5 h-5" />, label: t('nav_dashboard'), path: "/" },
    { icon: <Map className="w-5 h-5" />, label: t('nav_map'), path: "/map" },
    { icon: <LineChart className="w-5 h-5" />, label: t('nav_market'), path: "/market-rates" },
    { icon: <Landmark className="w-5 h-5" />, label: t('nav_schemes'), path: "/govt-schemes" },
    { icon: <BrainCircuit className="w-5 h-5" />, label: t('nav_agent'), path: "/agent" },
    { icon: <Leaf className="w-5 h-5" />, label: t('nav_crop_health'), path: "/crop-health" },
    { icon: <User className="w-5 h-5" />, label: t('nav_profile'), path: "/profile" },
    { icon: <Settings className="w-5 h-5" />, label: t('nav_settings'), path: "/settings" },
  ];

  // Mobile Bottom Bar Primary Tabs
  const mobileNavItems = [
    { icon: <Activity className="w-5 h-5" />, label: t('nav_dashboard'), path: "/" },
    { icon: <Map className="w-5 h-5" />, label: t('nav_map'), path: "/map" },
    { icon: <Leaf className="w-6 h-6" />, label: t('nav_crop_health'), path: "/crop-health", highlight: true },
    { icon: <LineChart className="w-5 h-5" />, label: t('nav_market'), path: "/market-rates" },
  ];

  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/alerts`)
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(console.error);
  }, []);

  const userDisplayName = profileData && profileData.fullName && profileData.fullName !== 'Google' ? profileData.fullName : 'Aditya';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative bg-slate-50 text-slate-800">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (Visible on md and up) */}
      {/* ========================================================================= */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex glass-panel border-r border-slate-200/50 flex-col transition-all duration-300 ease-in-out relative z-20 shrink-0"
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50">
          {sidebarOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-800">Water<span className="text-emerald-600">Lens</span></span>
            </motion.div>
          ) : (
            <div className="w-full flex justify-center text-emerald-600">
              <Droplet className="w-6 h-6" />
            </div>
          )}
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group font-bold",
                location.pathname === item.path ? "bg-white shadow-sm border border-emerald-100 text-emerald-600" : "hover:bg-white/50 border border-transparent text-slate-500 hover:text-slate-800"
              )}>
              <div>
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200/50">
            <button onClick={onLogout} className="w-full py-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              {t('nav_logout')}
            </button>
          </div>
        )}
      </motion.aside>

      {/* ========================================================================= */}
      {/* 2. MAIN APP CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto overflow-x-hidden z-10">
        
        {/* MOBILE TOP HEADER (md:hidden) */}
        <header className="flex md:hidden h-16 px-4 items-center justify-between glass-panel border-b border-slate-200/60 sticky top-0 z-30 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Droplet className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-800">Water<span className="text-emerald-600">Lens</span></span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>

          <div className="flex items-center gap-2">
            {/* Install PWA Button (Mobile) */}
            <button 
              onClick={handleInstallClick}
              title="Install WaterLens App"
              className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 text-xs font-bold shadow-sm active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Install</span>
            </button>

            {/* Language Selector Pill */}
            <div className="flex items-center bg-white/80 border border-slate-200 rounded-full px-2 py-1 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent font-bold text-xs text-slate-700 outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="mr">MR</option>
              </select>
            </div>

            {/* Notifications Button */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-black/5 relative text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />}
            </button>

            {/* Profile Avatar trigger for Mobile Drawer */}
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/20 border border-white"
            >
              {userInitial}
            </button>
          </div>
        </header>

        {/* DESKTOP TOP HEADER (hidden md:flex) */}
        <header className="hidden md:flex h-20 px-8 items-center justify-between glass-panel border-b border-slate-200/50 sticky top-0 z-30 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.label || t('nav_dashboard')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Install PWA Button (Desktop) */}
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalled ? "App Installed" : "Install App"}</span>
            </button>

            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-600">{t('status_online')}</span>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full pl-3 pr-2 py-1 shadow-sm gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-black/5 relative text-slate-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[2px]">
                   <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                     <span>
                       {userInitial}
                     </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 glass-panel-heavy rounded-2xl shadow-2xl border border-white overflow-hidden z-50 flex flex-col"
                  >
                    <div className="p-4 border-b border-slate-100 bg-white/50 flex flex-col">
                      <span className="font-bold text-slate-800">
                        {userDisplayName}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {profileData && profileData.farmName ? profileData.farmName : t('menu_manager')}
                      </span>
                    </div>
                    <div className="p-2 flex flex-col">
                      <button 
                        onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-600 font-semibold transition-colors text-sm"
                      >
                        <User className="w-4 h-4 text-emerald-600" /> {t('menu_profile')}
                      </button>
                      <button 
                        onClick={() => { setProfileMenuOpen(false); navigate('/settings'); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-600 font-semibold transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4 text-slate-500" /> {t('menu_settings')}
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={() => {
                          setProfileMenuOpen(false);
                          localStorage.removeItem('token');
                          localStorage.removeItem('waterlens_profile');
                          onLogout();
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" /> {t('menu_logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Global Notifications Modal */}
        <AnimatePresence>
          {notificationsOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 md:top-20 right-4 md:right-32 w-[calc(100vw-2rem)] sm:w-80 glass-panel-heavy rounded-2xl shadow-2xl border border-white overflow-hidden z-50"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/70">
                <span className="font-bold text-slate-800">{t('notifications')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{alerts.length} New</span>
                  <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-[320px] overflow-y-auto p-2 flex flex-col gap-2">
                {alerts.map(alert => (
                  <div key={alert.id} className={cn(
                    "p-3 rounded-xl border",
                    alert.type === 'warning' ? "bg-emerald-50 border-emerald-100" : "bg-teal-50 border-teal-100"
                  )}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("font-bold text-sm", alert.type === 'warning' ? "text-emerald-700" : "text-teal-700")}>{alert.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600">{alert.message}</p>
                  </div>
                ))}
                {alerts.length === 0 && <div className="p-4 text-center text-sm font-medium text-slate-500">{t('no_alerts')}</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content Body */}
        <div className="p-4 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<FarmMap />} />
            <Route path="/market-rates" element={<MarketRates />} />
            <Route path="/govt-schemes" element={<GovtSchemes />} />
            <Route path="/agent" element={<RLAgent />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (md:hidden) */}
      {/* ========================================================================= */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 justify-around items-center shadow-lg">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.highlight) {
            return (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center -mt-5 relative group focus:outline-none"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-active:scale-95",
                  isActive 
                    ? "bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/40 ring-4 ring-white" 
                    : "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30 ring-2 ring-white"
                )}>
                  {item.icon}
                </div>
                <span className={cn(
                  "text-[10px] font-bold mt-1",
                  isActive ? "text-emerald-600 font-extrabold" : "text-slate-500"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 relative",
                isActive ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                isActive ? "bg-emerald-50" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More Drawer Trigger Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150",
            mobileDrawerOpen ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <div className="p-1 rounded-lg">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            Menu
          </span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 4. MOBILE SLIDE-UP DRAWER (md:hidden) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Slide-up Sheet */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl border-t border-slate-200 z-50 p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto md:hidden"
            >
              {/* Drawer Handle */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-2" />

              {/* User Profile Card */}
              <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20">
                    {userInitial}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">{userDisplayName}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{profileData?.farmName || t('menu_manager')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links Grid */}
              <div className="flex flex-col gap-2">
                {/* Install App Quick Action in Mobile Drawer */}
                <button 
                  onClick={() => { setMobileDrawerOpen(false); handleInstallClick(); }}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  <div className="p-2 rounded-xl bg-white/20 text-white">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-extrabold">{isInstalled ? "App Installed on Device" : "Install WaterLens App"}</div>
                    <div className="text-[11px] font-medium text-emerald-100">Add to Home Screen for fast offline access</div>
                  </div>
                </button>

                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mt-1">All Features</span>
                
                <button 
                  onClick={() => { setMobileDrawerOpen(false); navigate('/govt-schemes'); }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 text-sm border border-slate-100 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div>{t('nav_schemes')}</div>
                    <div className="text-[11px] font-medium text-slate-400">Govt subsidies & announcements</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setMobileDrawerOpen(false); navigate('/agent'); }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 text-sm border border-slate-100 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-lime-50 text-lime-600">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div>{t('nav_agent')}</div>
                    <div className="text-[11px] font-medium text-slate-400">Autonomous irrigation AI</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setMobileDrawerOpen(false); navigate('/profile'); }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 text-sm border border-slate-100 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div>{t('nav_profile')}</div>
                    <div className="text-[11px] font-medium text-slate-400">Manage crop & farm profile</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setMobileDrawerOpen(false); navigate('/settings'); }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 text-sm border border-slate-100 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div>{t('nav_settings')}</div>
                    <div className="text-[11px] font-medium text-slate-400">System & IoT hardware configs</div>
                  </div>
                </button>
              </div>

              {/* Language Switcher Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Language / भाषा</span>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setLang('en')}
                    className={cn(
                      "py-2.5 rounded-xl font-bold text-xs border transition-colors",
                      lang === 'en' ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLang('hi')}
                    className={cn(
                      "py-2.5 rounded-xl font-bold text-xs border transition-colors",
                      lang === 'hi' ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    हिन्दी
                  </button>
                  <button 
                    onClick={() => setLang('mr')}
                    className={cn(
                      "py-2.5 rounded-xl font-bold text-xs border transition-colors",
                      lang === 'mr' ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    मराठी
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={() => {
                  setMobileDrawerOpen(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('waterlens_profile');
                  onLogout();
                }}
                className="w-full py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('menu_logout')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. PWA INSTALL MODAL / INSTRUCTIONS */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {installModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInstallModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">Install WaterLens App</h3>
                      <p className="text-xs text-slate-500 font-medium">Use like a native app on Mobile or Desktop</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInstallModalOpen(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                    <p><strong className="text-slate-800">Android / Chrome:</strong> Tap the 3-dot menu at the top right of Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                    <p><strong className="text-slate-800">iPhone / Safari:</strong> Tap the <strong>Share</strong> button (box with arrow) at the bottom and select <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                    <p><strong className="text-slate-800">PC / Laptop:</strong> Click the <strong>Install</strong> icon in your browser's address bar (next to the bookmark star).</p>
                  </div>
                </div>

                <button 
                  onClick={() => setInstallModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Got it!
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. FLOATING AI CHAT & VOICE ASSISTANTS (Ergonomically positioned for Mobile & Desktop) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex items-end gap-3">
        
        {/* Voice Assistant Floating Trigger */}
        <VoiceAssistant />

        {/* AI Chat Assistant */}
        <div className="relative">
          <AnimatePresence>
            {chatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed md:absolute bottom-20 md:bottom-16 right-4 md:right-0 w-[calc(100vw-2rem)] max-w-sm sm:w-84 h-[440px] max-h-[70vh] glass-panel-heavy border border-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden origin-bottom-right z-50"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-teal-50/70">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-teal-600" />
                    <span className="font-bold text-slate-800">{t('ai_assistant')}</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
                  <ChatInterface />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform"
          >
            {chatOpen ? <X className="text-white w-5 h-5 md:w-6 md:h-6" /> : <MessageSquare className="text-white w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
