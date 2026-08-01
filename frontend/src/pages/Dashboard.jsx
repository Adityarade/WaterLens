import React, { useState, useEffect } from 'react';
import { Droplet, Thermometer, TrendingUp, BrainCircuit, CalendarCheck, ArrowRight, Sun, CloudRain, Sprout, Map } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const mockChartData = [
  { time: '00:00', moisture: 45, predicted: 44, threshold: 35 },
  { time: '04:00', moisture: 43, predicted: 42, threshold: 35 },
  { time: '08:00', moisture: 40, predicted: 39, threshold: 35 },
  { time: '12:00', moisture: 36, predicted: 34, threshold: 35 }, // Below threshold
  { time: '16:00', moisture: 48, predicted: 45, threshold: 35 }, // After irrigation
  { time: '20:00', moisture: 46, predicted: 44, threshold: 35 },
];

const heroImages = [
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2000&auto=format&fit=crop", // Indian farmer in field
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2000&auto=format&fit=crop", // Smart Irrigation/Watering
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop", // Aerial green fields
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop", // Lush green field
  "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2000&auto=format&fit=crop", // Farming equipment/crops
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop", // Plants/Agritech
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [optimizerData, setOptimizerData] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [chartData, setChartData] = useState(mockChartData);
  const [profileName, setProfileName] = useState("");
  const { t } = useI18n();

  // Fetch stats initially and then every 3 seconds to simulate real-time updates
  useEffect(() => {
    const fetchStats = () => {
      fetch(`${API_BASE_URL}/api/stats`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(console.error);
    };

    const fetchSensors = () => {
      fetch(`${API_BASE_URL}/api/sensors/live`)
        .then(res => res.json())
        .then(data => {
           if (data && data.length > 0) {
             const mapped = data.map(d => ({
               time: d.timestamp,
               moisture: d.moisture,
               predicted: d.moisture > 40 ? d.moisture - 2 : d.moisture + 1,
               threshold: 35
             }));
             setChartData(mapped);
           }
        })
        .catch(console.error);
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.fullName) setProfileName(data.fullName.split(" ")[0]);
        } else {
          const saved = localStorage.getItem('waterlens_profile');
          if (saved) {
            const data = JSON.parse(saved);
            if (data.fullName) setProfileName(data.fullName.split(" ")[0]);
          }
        }
      } catch (err) {
        const saved = localStorage.getItem('waterlens_profile');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.fullName) setProfileName(data.fullName.split(" ")[0]);
        }
      }
    };

    fetchStats();
    fetchSensors();
    fetchProfile();
    const statsInterval = setInterval(fetchStats, 3000); // Real-time polling
    const sensorsInterval = setInterval(fetchSensors, 5000); // Live IoT polling

    return () => {
      clearInterval(statsInterval);
      clearInterval(sensorsInterval);
    };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/harvest-optimizer`)
      .then(r => r.json())
      .then(data => setOptimizerData(data))
      .catch(e => {
        console.warn("Could not load harvest data, using fallback", e);
        setOptimizerData({
          optimal_day: "Friday (in 4 days)",
          roi_increase: "+12.4%",
          reasoning: "A heavy rainstorm is predicted for Saturday. Harvesting on Friday maximizes yield weight while avoiding potential waterlogging damage.",
          chart_data: [
            { day: "Today", profit: 80 },
            { day: "Wed", profit: 85 },
            { day: "Thu", profit: 92 },
            { day: "Optimal (Fri)", profit: 100 },
            { day: "Sat (Rain)", profit: 40 },
            { day: "Sun", profit: 55 },
          ]
        });
      });

    fetch(`${API_BASE_URL}/api/early-warnings`)
      .then(r => r.json())
      .then(data => setWarnings(data))
      .catch(e => {
        console.warn("Could not load warnings data, using fallback", e);
        setWarnings([
          {
            id: "warn_01",
            risk_level: "critical",
            type: "disease",
            title: "High Risk: Early Blight",
            probability: 85,
            trigger: "Humidity > 85% + Temp > 25°C",
            action: "Recommend preemptive copper fungicide spray on Zone 1 Tomatoes within 48h."
          },
          {
            id: "warn_02",
            risk_level: "moderate",
            type: "pest",
            title: "Aphid Migration",
            probability: 40,
            trigger: "Warm south winds detected",
            action: "Deploy natural predators (Ladybugs) or apply neem oil to Zone 2 borders."
          }
        ]);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500); // Slide every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  const displayStats = [
    { label: t('stat_moisture'), value: stats ? `${stats.avg_moisture}%` : '42%', change: stats?.moisture_trend || '+2%', trend: 'up', icon: <Droplet />, color: 'bg-emerald-500' },
    { label: t('stat_water'), value: stats ? `${stats.water_saved.toLocaleString()} Gal` : '1.2M Gal', change: stats?.water_saved_trend || '+14%', trend: 'up', icon: <TrendingUp />, color: 'bg-teal-500' },
    { label: t('stat_heat'), value: stats ? `${stats.current_temp}°C` : '28°C', change: stats?.temp_trend || 'Low', trend: 'down', icon: <Thermometer />, color: 'bg-cyan-500' },
    { label: t('stat_ai'), value: stats ? `${stats.rl_confidence}%` : '96%', change: stats?.rl_confidence_trend || '+1%', trend: 'up', icon: <BrainCircuit />, color: 'bg-lime-500' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* ----------------- HERO SECTION ----------------- */}
      <div className="relative w-full min-h-[280px] md:h-[340px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex items-end p-5 sm:p-8 md:p-12 border border-white">
        
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={bgIndex}
            src={heroImages[bgIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 mix-blend-overlay" />
        
        {/* Slide Indicator Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 z-20">
          Slide {bgIndex + 1}/{heroImages.length}
        </div>
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full border border-emerald-400/50 shadow-sm">
                Live Analysis
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/30 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full border border-white/20 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                System Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {t('hero_welcome')}{profileName ? ` ${profileName}` : ""}
            </h1>
            <p className="text-emerald-50 font-medium text-xs sm:text-base md:text-lg mt-2 max-w-2xl text-shadow-sm leading-relaxed">
              {t('hero_desc')}
            </p>
          </div>
          
          <div className="flex gap-2.5 sm:gap-3 w-full md:w-auto mt-2 md:mt-0">
            <Link to="/crop-health" className="flex-1 md:flex-none bg-white text-emerald-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" /> Quick Scan
            </Link>
            <Link to="/map" className="flex-1 md:flex-none bg-black/30 backdrop-blur-md border border-white/30 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-black/50 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Map className="w-4 h-4 sm:w-5 sm:h-5" /> Farm Map
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {displayStats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel-heavy p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden group hover:shadow-xl transition-all border border-white"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${stat.color}`} />
            
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-black/5 ${stat.color}`}>
                {React.cloneElement(stat.icon, { className: "w-4 h-4 sm:w-6 sm:h-6" })}
              </div>
              <div className={`flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
                <ArrowRight className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${stat.trend === 'up' ? '-rotate-45' : 'rotate-45'}`} />
              </div>
            </div>
            
            <div>
              <h3 className="text-slate-500 font-bold text-[11px] sm:text-sm tracking-wide uppercase mb-0.5 sm:mb-1">{stat.label}</h3>
              <div className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel-heavy p-5 sm:p-6 rounded-3xl md:rounded-[2rem] flex flex-col border border-white shadow-lg min-h-[340px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <div>
              <h3 className="font-black text-slate-800 text-base sm:text-lg">{t('chart_moisture_title')}</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">{t('chart_moisture_desc')}</p>
            </div>
            <select className="bg-white/70 border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 rounded-xl px-3 py-1.5 sm:py-2 outline-none focus:border-emerald-400 shadow-sm w-full sm:w-auto">
              <option>Zone 1 (North)</option>
              <option>Zone 2 (South)</option>
              <option>Zone 3 (Greenhouse)</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                
                <Area type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="#14b8a6" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={3} />
                <Area type="monotone" dataKey="moisture" stroke="#10b981" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Harvest Optimizer Widget */}
        <div className="glass-panel-heavy p-5 sm:p-6 rounded-3xl md:rounded-[2rem] flex flex-col border border-white shadow-lg relative overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl text-white shadow-lg shadow-emerald-500/30">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm sm:text-base">{t('opt_title')}</h3>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{t('opt_desc')}</p>
            </div>
          </div>

          {!optimizerData ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">{t('opt_analyzing')}</div>
          ) : (
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-end gap-2 mb-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{optimizerData.optimal_day.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-emerald-600 mb-1 bg-emerald-100 px-2 py-0.5 rounded-lg">{optimizerData.roi_increase} ROI</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                  {optimizerData.reasoning}
                </p>
              </div>

              <div className="h-28 sm:h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={optimizerData.chart_data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="profit" radius={[6, 6, 6, 6]}>
                      {optimizerData.chart_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.day.includes('Optimal') ? '#10b981' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Early Warning System Row */}
      <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Predictive Early Warnings</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">AI Forecasted Risks & Mitigation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warnings.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-slate-400 font-bold">Scanning for upcoming risks...</div>
          ) : (
            warnings.map(warn => (
              <div key={warn.id} className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${warn.risk_level === 'critical' ? 'bg-rose-50/50 border-rose-200' : 'bg-amber-50/50 border-amber-200'}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full pointer-events-none ${warn.risk_level === 'critical' ? 'bg-rose-500/20' : 'bg-amber-500/20'}`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={`text-lg font-black ${warn.risk_level === 'critical' ? 'text-rose-700' : 'text-amber-700'}`}>{warn.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${warn.risk_level === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                      {warn.probability}% Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-600">
                    <CloudRain className="w-4 h-4 text-slate-400" /> Trigger: {warn.trigger}
                  </div>
                  <div className="mt-auto pt-4 border-t border-black/5 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm mt-1">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {warn.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
