import React, { useState, useEffect } from 'react';
import { Activity, Play, Square, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function RLAgent() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [agentStatus, setAgentStatus] = useState('active');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/agent/logs`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(e => {
        console.warn("Could not fetch agent logs, using fallback", e);
        setLogs([
          { time: "14:30", action: "Irrigation triggered: Zone 2", reason: "Moisture dropped below 36%", confidence: "98%" },
          { time: "09:15", action: "Paused watering", reason: "High rain probability (85%) in next 2 hours", confidence: "92%" },
          { time: "Yesterday", action: "Optimized schedule", reason: "Evapotranspiration rate increased due to heat wave", confidence: "89%" }
        ]);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel-heavy p-4 sm:p-6 rounded-3xl gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('agent_title')}</h2>
          <p className="text-slate-500 text-xs sm:text-base mt-1 font-medium">{t('agent_desc')}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setAgentStatus('active')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${agentStatus === 'active' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('agent_btn_start')}
          </button>
          <button 
            onClick={() => setAgentStatus('paused')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${agentStatus === 'paused' ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('agent_btn_pause')}
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all"
          >
            <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Config
          </button>
        </div>
      </div>

      <div className="glass-panel-heavy rounded-3xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          {t('agent_logs')}
        </h3>
        
        <div className="flex flex-col gap-4">
          {logs.map((log, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800">{log.action}</h4>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{log.time}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium mb-3">{log.reason}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Confidence:</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: log.confidence }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{log.confidence}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {logs.length === 0 && <div className="text-slate-500 text-center py-10 font-medium">No actions logged yet.</div>}
        </div>
      </div>
    </div>
  );
}
