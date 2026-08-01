import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { API_BASE_URL } from '../config';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [processing, setProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      const langMap = { "en": "en-US", "hi": "hi-IN", "mr": "mr-IN", "es": "es-ES" };
      recognition.lang = langMap[lang] || 'en-US';

      recognition.onstart = () => {
        setListening(true);
        setTranscript("");
        finalTranscriptRef.current = "";
        setResponse("");
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }
        setTranscript(interimTranscript);
        finalTranscriptRef.current = interimTranscript;
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        if (finalTranscriptRef.current) {
          processCommand(finalTranscriptRef.current);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const processCommand = async (text) => {
    if (!text) return;
    setProcessing(true);
    
    const lowerText = text.toLowerCase();
    
    // Client-side NLP Navigation Interception
    if (lowerText.includes("market") || lowerText.includes("rate") || lowerText.includes("price") || lowerText.includes("mandi") || lowerText.includes("बाजार") || lowerText.includes("भाव") || lowerText.includes("मंडी") || lowerText.includes("mercado") || lowerText.includes("tasas")) {
      const msg = t('voice_nav_market');
      setResponse(msg);
      navigate("/market-rates");
      speak(msg);
      finishProcessing();
      return;
    }
    
    if (lowerText.includes("scheme") || lowerText.includes("government") || lowerText.includes("subsidy") || lowerText.includes("योजना") || lowerText.includes("सरकारी") || lowerText.includes("अनुदान") || lowerText.includes("esquema") || lowerText.includes("gobierno")) {
      const msg = t('voice_nav_schemes');
      setResponse(msg);
      navigate("/govt-schemes");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("map") || lowerText.includes("drone") || lowerText.includes("satellite") || lowerText.includes("zone") || lowerText.includes("ndvi") || lowerText.includes("thermal") || lowerText.includes("नक्शा") || lowerText.includes("जमीन") || lowerText.includes("mapa")) {
      const msg = t('voice_nav_map');
      setResponse(msg);
      navigate("/farm-map");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("crop") || lowerText.includes("health") || lowerText.includes("disease") || lowerText.includes("leaf") || lowerText.includes("doctor") || lowerText.includes("रोग") || lowerText.includes("पीक") || lowerText.includes("फसल") || lowerText.includes("बीमारी")) {
      const msg = t('voice_nav_crop_health');
      setResponse(msg);
      navigate("/crop-health");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("agent") || lowerText.includes("reinforcement") || lowerText.includes("irrigation") || lowerText.includes("सिंचन") || lowerText.includes("पाणी") || lowerText.includes("पानी") || lowerText.includes("riego")) {
      const msg = t('voice_nav_agent');
      setResponse(msg);
      navigate("/rl-agent");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("profile") || lowerText.includes("farmer") || lowerText.includes("प्रोफाइल") || lowerText.includes("शेतकरी") || lowerText.includes("किसान") || lowerText.includes("perfil")) {
      const msg = t('voice_nav_profile');
      setResponse(msg);
      navigate("/profile");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("setting") || lowerText.includes("config") || lowerText.includes("सेटिंग्ज") || lowerText.includes("सेटिंग्स") || lowerText.includes("ajustes")) {
      const msg = t('voice_nav_settings');
      setResponse(msg);
      navigate("/settings");
      speak(msg);
      finishProcessing();
      return;
    }

    if (lowerText.includes("dashboard") || lowerText.includes("home") || lowerText.includes("overview") || lowerText.includes("डॅशबोर्ड") || lowerText.includes("डैशबोर्ड") || lowerText.includes("मुख्य") || lowerText.includes("panel")) {
      const msg = t('voice_nav_dashboard');
      setResponse(msg);
      navigate("/");
      speak(msg);
      finishProcessing();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text, language: lang })
      });
      const data = await res.json();
      setResponse(data.response);
      speak(data.response);
    } catch (err) {
      console.error(err);
      const fallbackMsg = lang === 'hi' ? "माफ़ कीजिए, सर्वर से जुड़ने में समस्या आ रही है।" : lang === 'mr' ? "क्षमस्व, सर्व्हरशी कनेक्ट करण्यात अडचण येत आहे." : "Sorry, I am having trouble connecting to the server.";
      setResponse(fallbackMsg);
      speak(fallbackMsg);
    } finally {
      finishProcessing();
    }
  };

  const speak = (msg) => {
    if (!msg) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Strip markdown stars/hashes for spoken audio clarity
        const cleanMsg = msg.replace(/[*#_`[\]]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanMsg);
        
        const langMap = { "en": "en-US", "hi": "hi-IN", "mr": "mr-IN", "es": "es-ES" };
        utterance.lang = langMap[lang] || 'en-US';
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes(langMap[lang]) && v.name.includes('Female')) 
                            || voices.find(v => v.lang.includes(langMap[lang]))
                            || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis notice:", e);
      }
    }
  };

  const finishProcessing = () => {
    setProcessing(false);
    setTimeout(() => {
      setTranscript("");
      setResponse("");
    }, 12000); 
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Your browser does not support Speech Recognition. Try using Google Chrome.");
        return;
      }
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {(listening || transcript || response || processing) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-16 right-0 sm:bottom-2 sm:right-14 w-[calc(100vw-3rem)] max-w-xs sm:w-64 glass-panel-heavy p-4 rounded-2xl shadow-2xl border border-white flex flex-col gap-2 origin-bottom-right z-50"
          >
            {listening && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Listening...
              </div>
            )}
            
            {processing && (
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                Processing command...
              </div>
            )}

            {transcript && (
              <p className="text-slate-700 font-medium text-sm italic border-l-2 border-emerald-400 pl-2">
                "{transcript}"
              </p>
            )}

            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mt-1 text-sm font-bold text-emerald-700 shadow-sm"
              >
                {response}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 z-50 relative ${
          listening ? 'bg-rose-500 shadow-rose-500/30' : 'bg-slate-800 shadow-slate-800/30'
        }`}
      >
        {listening ? <MicOff className="text-white w-6 h-6" /> : <Mic className="text-white w-6 h-6" />}
      </button>
    </div>
  );
}
