import React, { useState } from 'react';
import { Map, AlertTriangle, Droplet, Sprout, Leaf, Flame, Thermometer, Info, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n';

export default function FarmMap() {
  const { t } = useI18n();
  const [mapMode, setMapMode] = useState('ndvi');
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = {
    zone1: {
      name: t('map_zone1'),
      status: "Healthy / High Vigor",
      thermalStatus: t('map_thermal_cool'),
      moisture: "78%",
      temperature: "24°C",
      action: "Optimal condition. No immediate watering required."
    },
    zone2: {
      name: t('map_zone2'),
      status: "Moisture Stress / Warning",
      thermalStatus: t('map_thermal_hot'),
      moisture: "38%",
      temperature: "34°C",
      action: "High thermal stress. Scheduled for drip cycle at 06:00 PM."
    },
    zone3: {
      name: t('map_zone3'),
      status: "Irrigating / Moderate",
      thermalStatus: t('map_thermal_optimal'),
      moisture: "62%",
      temperature: "28°C",
      action: "Automated valve #3 active. Target moisture: 70%."
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-5xl mx-auto w-full">
      {/* Header with Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Map className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            {t('map_title')}
          </h2>
          <p className="text-slate-500 text-xs sm:text-base font-medium mt-1">{t('map_desc')}</p>
        </div>
        
        {/* Toggle Pills */}
        <div className="flex gap-2 bg-white/70 p-1 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <button 
            onClick={() => setMapMode('ndvi')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${mapMode === 'ndvi' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('map_live_ndvi')}
          </button>
          <button 
            onClick={() => setMapMode('thermal')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${mapMode === 'thermal' ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('map_thermal')}
          </button>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="glass-panel-heavy p-2 sm:p-4 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-white relative overflow-hidden h-[380px] sm:h-[480px] md:h-[580px] flex">
        
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f233481079e?q=80&w=2000&auto=format&fit=crop" 
            alt="Farm Aerial View" 
            className={`w-full h-full object-cover mix-blend-luminosity transition-opacity duration-1000 ${mapMode === 'thermal' ? 'opacity-90' : 'opacity-80'}`}
          />
          <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-overlay ${mapMode === 'thermal' ? 'bg-indigo-900/50' : 'bg-emerald-950/40'}`} />
        </div>

        {/* Zones Overlay */}
        <div className="relative z-10 w-full h-full p-2 sm:p-4">
          
          {/* Zone 1: Healthy / Cool */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setSelectedZone('zone1')}
            className={`absolute top-[8%] left-[6%] sm:top-[10%] sm:left-[10%] w-[46%] sm:w-[40%] h-[36%] sm:h-[35%] border-2 rounded-2xl cursor-pointer transition-all backdrop-blur-[2px] flex items-center justify-center group active:scale-95 ${
              selectedZone === 'zone1' ? 'ring-4 ring-white shadow-2xl scale-[1.02]' : ''
            } ${mapMode === 'thermal' ? 'bg-blue-500/35 border-blue-400 hover:bg-blue-500/50' : 'bg-emerald-500/35 border-emerald-400 hover:bg-emerald-500/50'}`}
          >
            <div className="bg-white/95 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-800">
              {mapMode === 'thermal' ? <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /> : <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />}
              <span>{mapMode === 'thermal' ? t('map_thermal_cool') : t('map_zone1')}</span>
            </div>
          </motion.div>

          {/* Zone 2: Warning / Hot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setSelectedZone('zone2')}
            className={`absolute top-[18%] right-[6%] sm:top-[20%] sm:right-[12%] w-[38%] sm:w-[32%] h-[28%] sm:h-[26%] border-2 rounded-2xl cursor-pointer transition-all backdrop-blur-[2px] flex items-center justify-center group active:scale-95 ${
              selectedZone === 'zone2' ? 'ring-4 ring-white shadow-2xl scale-[1.02]' : ''
            } ${mapMode === 'thermal' ? 'bg-rose-500/45 border-rose-400 hover:bg-rose-500/60' : 'bg-amber-500/40 border-amber-400 hover:bg-amber-500/50'}`}
          >
            <div className="bg-white/95 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-800">
              {mapMode === 'thermal' ? <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" /> : <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />}
              <span>{mapMode === 'thermal' ? t('map_thermal_hot') : t('map_zone2')}</span>
            </div>
          </motion.div>

          {/* Zone 3: Irrigating / Mild */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setSelectedZone('zone3')}
            className={`absolute bottom-[10%] left-[20%] sm:bottom-[15%] sm:left-[25%] w-[52%] sm:w-[45%] h-[32%] sm:h-[30%] border-2 rounded-2xl cursor-pointer transition-all backdrop-blur-[2px] flex items-center justify-center group active:scale-95 ${
              selectedZone === 'zone3' ? 'ring-4 ring-white shadow-2xl scale-[1.02]' : ''
            } ${mapMode === 'thermal' ? 'bg-emerald-500/35 border-emerald-400 hover:bg-emerald-500/50' : 'bg-teal-500/35 border-teal-400 hover:bg-teal-500/50'}`}
          >
            <div className="bg-white/95 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-800">
              {mapMode === 'thermal' ? <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />}
              <span>{mapMode === 'thermal' ? t('map_thermal_optimal') : t('map_zone3')}</span>
            </div>
          </motion.div>

        </div>

        {/* Legend Overlay (Compact on mobile) */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1.5 sm:gap-2.5 z-20 max-w-[160px] sm:max-w-none">
          <h4 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">{t('map_legend')}</h4>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" /> <span className="truncate">{t('map_vigor')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
            <div className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" /> <span className="truncate">{t('map_moisture')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
            <div className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" /> <span className="truncate">{t('map_risk')}</span>
          </div>
        </div>

        {/* Tap on Zone Instructions badge */}
        {!selectedZone && (
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 z-20 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tap any zone for details</span>
          </div>
        )}

        {/* Selected Zone Detail Popup */}
        <AnimatePresence>
          {selectedZone && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 left-3 sm:left-auto sm:w-80 bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-100 z-30 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{zones[selectedZone].name}</h4>
                  <p className="text-[11px] font-bold text-emerald-600">{zones[selectedZone].status}</p>
                </div>
                <button 
                  onClick={() => setSelectedZone(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase">Moisture</span>
                  <div className="text-base text-slate-800">{zones[selectedZone].moisture}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase">Temp</span>
                  <div className="text-base text-slate-800">{zones[selectedZone].temperature}</div>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                {zones[selectedZone].action}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
