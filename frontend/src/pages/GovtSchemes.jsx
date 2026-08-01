import React, { useState, useEffect } from 'react';
import { Landmark, FileText, CheckCircle2, ArrowUpRight, ShieldCheck, MapPin, ChevronDown } from 'lucide-react';
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

const STATE_PORTALS = {
  "Andhra Pradesh": "https://apagrisnet.gov.in/",
  "Arunachal Pradesh": "https://agri.arunachal.gov.in/",
  "Assam": "https://diragri.assam.gov.in/",
  "Bihar": "https://state.bihar.gov.in/krishi/",
  "Chhattisgarh": "https://agriportal.cg.nic.in/",
  "Goa": "https://agri.goa.gov.in/",
  "Gujarat": "https://agri.gujarat.gov.in/",
  "Haryana": "https://agriharyana.gov.in/",
  "Himachal Pradesh": "https://hpagrisnet.gov.in/",
  "Jharkhand": "https://sugam.jharkhand.gov.in/",
  "Karnataka": "https://raitamitra.karnataka.gov.in/",
  "Kerala": "https://keralaagriculture.gov.in/",
  "Madhya Pradesh": "https://mpkrishi.mp.gov.in/",
  "Maharashtra": "https://mahadbt.maharashtra.gov.in/",
  "Manipur": "https://agrimanipur.gov.in/",
  "Meghalaya": "https://megagriculture.gov.in/",
  "Mizoram": "https://agriculturemizoram.nic.in/",
  "Nagaland": "https://agriculture.nagaland.gov.in/",
  "Odisha": "https://agriodisha.nic.in/",
  "Punjab": "https://agri.punjab.gov.in/",
  "Rajasthan": "https://agriculture.rajasthan.gov.in/",
  "Sikkim": "https://sikkim.gov.in/departments/agriculture-department",
  "Tamil Nadu": "https://www.tnagrisnet.tn.gov.in/",
  "Telangana": "https://agri.telangana.gov.in/",
  "Tripura": "https://agri.tripura.gov.in/",
  "Uttar Pradesh": "https://upagriculture.com/",
  "Uttarakhand": "https://agriculture.uk.gov.in/",
  "West Bengal": "https://matirkatha.net/",
  "default": "https://agricoop.nic.in/"
};

export default function GovtSchemes() {
  const { t } = useI18n();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('Maharashtra');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/govt-schemes?state=${selectedState}`)
      .then(res => res.json())
      .then(data => {
        setSchemes(data);
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
      <div className="relative w-full min-h-[200px] md:h-[240px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex items-end p-5 sm:p-8 md:p-12 border border-white">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-500" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590494165264-1ebe36c284f7?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-30 object-cover" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3 relative group cursor-pointer" tabIndex={0}>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-full border border-white/20 shadow-sm flex items-center gap-1 hover:bg-white/30 transition-colors">
                <MapPin className="w-3 h-3" /> {selectedState}{t('schemes_state')} <ChevronDown className="w-3 h-3" />
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
              {t('schemes_title')}
            </h1>
            <p className="text-orange-50 font-medium text-xs sm:text-base md:text-lg mt-1 sm:mt-2 max-w-2xl text-shadow-sm">
              {t('schemes_desc')}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <a 
              href={STATE_PORTALS[selectedState] || STATE_PORTALS["default"]} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 md:flex-none bg-white text-orange-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5" /> {t('schemes_portal')}
            </a>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-white shadow-xl min-h-[400px]">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('schemes_active')}</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('schemes_subsidy')}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 font-bold">{t('schemes_fetching')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {schemes.map((scheme, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={scheme.id} 
                className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-colors" />
                
                <div>
                  <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                    <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${scheme.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {scheme.status}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 flex items-center gap-1">
                      {t('schemes_deadline')}: <strong className="text-slate-600">{scheme.deadline}</strong>
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-xl font-black text-slate-800 mb-1 sm:mb-2">{scheme.title}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-orange-600">
                    <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {scheme.department}
                  </div>
                  
                  <p className="text-slate-600 font-medium mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    {scheme.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 text-xs sm:text-sm font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Verified
                  </div>
                  <a href={scheme.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                    Apply Now <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
