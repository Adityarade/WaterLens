import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, BrainCircuit, Activity, LineChart, Banknote, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import { API_BASE_URL } from '../config';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function MarketRates() {
  const { t } = useI18n();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('Maharashtra');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/market-rates?state=${selectedState}`)
      .then(res => res.json())
      .then(data => {
        setRates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedState]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="relative w-full min-h-[190px] md:h-[240px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex items-end p-5 sm:p-8 md:p-12 border border-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-700" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611095973763-414019e72400?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 object-cover" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3 relative group cursor-pointer" tabIndex={0}>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-indigo-500/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-full border border-indigo-400/50 shadow-sm flex items-center gap-1 hover:bg-indigo-500/100 transition-colors">
                <Activity className="w-3 h-3" /> {t('market_live')}{selectedState} <ChevronDown className="w-3 h-3" />
              </span>
              <select 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {t('market_title')}
            </h1>
            <p className="text-indigo-100 font-medium text-xs sm:text-base md:text-lg mt-1 sm:mt-2 max-w-2xl text-shadow-sm">
              {t('market_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-white shadow-xl min-h-[400px]">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner">
            <LineChart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('market_today')}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('market_price_unit')}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 font-bold">{t('market_fetching')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rates.map((rate, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col"
              >
                <div className="p-4 sm:p-6 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-2xl font-black text-slate-800">{rate.commodity}</h3>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                      <MapPin className="w-3 h-3" /> {rate.mandi}
                    </span>
                  </div>
                  
                  <div className="flex items-end gap-2 mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">₹{rate.modal_price}</span>
                    <span className={`flex items-center text-xs sm:text-sm font-bold mb-1 ${rate.trend === 'up' ? 'text-emerald-500' : rate.trend === 'down' ? 'text-rose-500' : 'text-slate-500'}`}>
                      {rate.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> : rate.trend === 'down' ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 rotate-180" /> : <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />}
                      {rate.trend.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-slate-500">
                    <div>{t('market_min')} <strong className="text-slate-700">₹{rate.min_price}</strong></div>
                    <div>{t('market_max')} <strong className="text-slate-700">₹{rate.max_price}</strong></div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 bg-indigo-50/50 flex-1 flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 font-black text-xs sm:text-sm uppercase tracking-wider">
                    <BrainCircuit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('market_ai_rec')}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {rate.ai_advice}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
