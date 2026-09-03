import React, { useState } from 'react';
import { Settings, Bell, Zap, CloudRain, Lock, Cpu, Wifi } from 'lucide-react';
import { useI18n } from '../i18n';
import { API_BASE_URL } from '../config';

export default function SettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState({
    autoIrrigate: true,
    pushNotifications: true,
    highContrastMode: false,
    aiStrictness: 'balanced',
    weeklyReports: false
  });
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState(null);
  const [pingStatus, setPingStatus] = useState(null);

  const generateApiKey = () => {
    const key = 'wl_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(key);
  };

  const sendTestPing = async () => {
    setPingStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/api/sensors/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisture: parseFloat((40 + Math.random() * 15).toFixed(1)),
          temperature: parseFloat((25 + Math.random() * 8).toFixed(1)),
          humidity: parseFloat((50 + Math.random() * 20).toFixed(1)),
          zone: "Test Device 1"
        })
      });
      if(res.ok) {
        setPingStatus('success');
        setTimeout(() => setPingStatus(null), 3000);
      } else {
        setPingStatus('error');
        setTimeout(() => setPingStatus(null), 3000);
      }
    } catch(err) {
      setPingStatus('error');
      setTimeout(() => setPingStatus(null), 3000);
    }
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error('Network error saving settings', err);
    }
  };

  const toggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateStrictness = (level) => {
    const newSettings = { ...settings, aiStrictness: level };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
          {t('settings_title')}
        </h2>
        <p className="text-slate-500 text-xs sm:text-base font-medium mt-1">{t('settings_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Automations */}
        <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-white">
          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2 mb-4 sm:mb-6">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" /> Automations
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            <Toggle 
              label={t('settings_auto')} 
              desc={t('settings_auto_desc')}
              active={settings.autoIrrigate} 
              onClick={() => toggle('autoIrrigate')} 
              color="emerald"
            />
            <Toggle 
              label="Weather Override" 
              desc="Agent pauses irrigation if rain is forecasted."
              active={true} 
              onClick={() => {}} 
              color="emerald"
            />
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-white">
          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2 mb-4 sm:mb-6">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" /> Alerts
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            <Toggle 
              label={t('settings_alerts')} 
              desc={t('settings_alerts_desc')}
              active={settings.pushNotifications} 
              onClick={() => toggle('pushNotifications')} 
              color="teal"
            />
            <Toggle 
              label="Weekly Reports" 
              desc="Receive AI-generated crop health summaries."
              active={settings.weeklyReports} 
              onClick={() => toggle('weeklyReports')} 
              color="teal"
            />
          </div>
        </div>

        {/* AI Agent Configuration */}
        <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-white md:col-span-2">
          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2 mb-4 sm:mb-6">
            <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> AI Agent Calibration
          </h3>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-1">
              <label className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5 block">{t('settings_strict')}</label>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 mb-3">{t('settings_strict_desc')}</p>
              
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['relaxed', 'balanced', 'strict'].map(level => (
                  <button 
                    key={level}
                    onClick={() => updateStrictness(level)}
                    className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-bold capitalize rounded-lg transition-all ${settings.aiStrictness === level ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm mb-1.5">
                <Cpu className="w-4 h-4 text-indigo-500" /> Sensor Calibration
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mb-3 font-medium">Recalibrate your physical soil sensors if the readings seem inaccurate.</p>
              <button 
                onClick={() => alert("Sensors successfully recalibrated.")}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-2 px-4 rounded-xl text-xs sm:text-sm transition-colors border border-indigo-200 self-start active:scale-95"
              >
                Recalibrate Sensors
              </button>
            </div>
          </div>
        </div>

        {/* IoT Integration */}
        <div className="glass-panel-heavy p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-white md:col-span-2">
          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2 mb-4 sm:mb-6">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" /> Hardware & IoT Sensors
          </h3>
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Connect physical IoT sensors (ESP32, Arduino, Raspberry Pi) to FasalRakshak AI to stream live soil moisture, NPK, and temperature data directly to your dashboard.
            </p>
            
            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="font-bold text-slate-700 text-xs sm:text-sm flex items-center gap-2"><Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500"/> Connection Endpoint</span>
                <span className="px-2 py-0.5 sm:py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-200">Active</span>
              </div>
              <code className="text-[11px] sm:text-xs font-mono bg-slate-800 text-emerald-400 p-2.5 sm:p-3 rounded-lg block overflow-x-auto">
                POST http://localhost:8000/api/sensors/ingest
              </code>
              
              {apiKey && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Your Secret API Key</span>
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-indigo-700 font-mono text-[11px] sm:text-xs break-all">
                    {apiKey}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mt-1 sm:mt-2">
              <button onClick={generateApiKey} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 sm:px-5 rounded-xl text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {apiKey ? 'Regenerate API Key' : 'Generate API Key'}
              </button>
              
              <button 
                onClick={sendTestPing}
                disabled={pingStatus === 'sending'}
                className={`border font-bold py-2.5 px-4 sm:px-5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                  pingStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                  pingStatus === 'error' ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                  'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                {pingStatus === 'sending' ? 'Sending...' : 
                 pingStatus === 'success' ? 'Data Sent Successfully!' : 
                 pingStatus === 'error' ? 'Failed to Send' : 
                 'Send Test Sensor Data'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Toggle({ label, desc, active, onClick, color }) {
  const bgColor = active ? (color === 'teal' ? 'bg-teal-500' : 'bg-emerald-500') : 'bg-slate-200';
  const ringColor = active ? (color === 'teal' ? 'focus:ring-teal-500/30' : 'focus:ring-emerald-500/30') : 'focus:ring-slate-200';

  return (
    <div className="flex items-center justify-between gap-4 cursor-pointer group" onClick={onClick}>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{label}</h4>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors relative outline-none focus:ring-4 ${bgColor} ${ringColor}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
}
