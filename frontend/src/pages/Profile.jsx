import React, { useState } from 'react';
import { User, MapPin, Leaf, Camera, Save, Sprout, Tent } from 'lucide-react';
import { useI18n } from '../i18n';
import { API_BASE_URL } from '../config';

export default function Profile() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    fullName: "",
    farmName: "",
    location: "",
    farmSize: "",
    primaryCrops: "",
    photoUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          localStorage.setItem('waterlens_profile', JSON.stringify(data));
        } else {
          const saved = localStorage.getItem('waterlens_profile');
          if (saved) setProfile(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Backend offline, loading profile from localStorage:", err);
        const saved = localStorage.getItem('waterlens_profile');
        if (saved) setProfile(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...profile };
    delete payload.id;

    // Always persist to local storage as fallback/instant save
    localStorage.setItem('waterlens_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage('Profile saved successfully!');
      } else {
        setMessage('Profile saved locally (Backend returned error)');
      }
    } catch (err) {
      console.warn("Backend offline, saved locally:", err);
      setMessage('Profile saved successfully!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;
    
    // Clear locally
    localStorage.removeItem('waterlens_profile');
    setProfile({
      fullName: "",
      farmName: "",
      location: "",
      farmSize: "",
      primaryCrops: "",
      photoUrl: ""
    });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage('Profile deleted successfully.');
      } else {
        setMessage('Profile deleted locally (Backend error).');
      }
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.warn("Backend offline, deleted locally:", err);
      setMessage('Profile deleted locally.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const fileInputRef = React.useRef(null);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-500">Loading profile...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Heavy Glass Panel */}
      <div className="glass-panel-heavy p-4 sm:p-8 rounded-3xl md:rounded-[2rem] border border-white shadow-2xl relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start relative z-10">
          
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0 mx-auto md:mx-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">{t('profile_photo')}</span>
          </div>

          {/* Form Section */}
          <form className="flex-1 w-full flex flex-col gap-5 sm:gap-6" onSubmit={handleSave}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{t('profile_title')}</h2>
              <p className="text-slate-500 text-xs sm:text-base font-medium mt-1">{t('profile_desc')}</p>
            </div>
            
            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs sm:text-sm border border-emerald-200">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-1 sm:mt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2"><User className="w-4 h-4 text-emerald-500"/> {t('profile_name')}</label>
                <input 
                  type="text" name="fullName" value={profile.fullName} onChange={handleChange} required
                  className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2"><Tent className="w-4 h-4 text-teal-500"/> {t('profile_farm')}</label>
                <input 
                  type="text" name="farmName" value={profile.farmName} onChange={handleChange} required
                  className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500"/> {t('profile_location')}</label>
                <input 
                  type="text" name="location" value={profile.location} onChange={handleChange} required
                  className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-600"/> {t('profile_size')}</label>
                <input 
                  type="text" name="farmSize" value={profile.farmSize} onChange={handleChange} required
                  className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2"><Leaf className="w-4 h-4 text-teal-600"/> {t('profile_crops')}</label>
                <input 
                  type="text" name="primaryCrops" value={profile.primaryCrops} onChange={handleChange} required
                  className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium"
                  placeholder="e.g. Corn, Soybeans, Wheat..."
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-4">
              <button type="button" onClick={handleDelete} className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2">
                Delete Profile
              </button>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95">
                <Save className="w-4 h-4 sm:w-5 sm:h-5" /> {t('profile_save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
