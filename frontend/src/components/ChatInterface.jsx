import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ChatInterface() {
  const { lang } = useI18n();
  
  const getInitialGreeting = (currentLang) => {
    switch (currentLang) {
      case 'hi':
        return "नमस्ते! मैं आपका वॉटरलेंस एआई सहायक हूँ। आज मैं आपके खेत प्रबंधन में क्या सहायता कर सकता हूँ?";
      case 'mr':
        return "नमस्कार! मी आपला वॉटरलेंस AI सहाय्यक आहे. आज आपल्या शेतीच्या नियोजनात मी कशी मदत करू शकतो?";
      case 'es':
        return "¡Hola! Soy tu asistente de IA de WaterLens. ¿Cómo puedo ayudarte a gestionar tu granja hoy?";
      default:
        return "Hello! I'm your WaterLens AI assistant. How can I help you optimize your farm today?";
    }
  };

  const getQuickSuggestions = (currentLang) => {
    switch (currentLang) {
      case 'hi':
        return [
          "💧 मिट्टी की नमी और सिंचाई स्थिति",
          "🌦️ 24 घंटे का मौसम पूर्वानुमान",
          "🌱 पत्तियों के पीले धब्बे का उपचार",
          "📈 आज के मंडी भाव और मूल्य"
        ];
      case 'mr':
        return [
          "💧 मातीचा ओलावा आणि सिंचन स्थिती",
          "🌦️ २४ तासांचा हवामान अंदाज",
          "🌱 पिकावरील रोगाचे उपाय व फवारणी",
          "📈 आजचे बाजार भाव"
        ];
      case 'es':
        return [
          "💧 Estado del riego y humedad",
          "🌦️ Pronóstico del clima 24h",
          "🌱 Diagnóstico de salud del cultivo",
          "📈 Precios de mercado hoy"
        ];
      default:
        return [
          "💧 Check soil moisture & irrigation",
          "🌦️ 24-hour weather forecast",
          "🌱 Yellow leaf disease remedies",
          "📈 Today's APMC mandi rates"
        ];
    }
  };

  const [messages, setMessages] = useState([
    { role: 'ai', content: getInitialGreeting(lang) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // When language changes, update greeting if no conversation yet
    if (messages.length <= 1) {
      setMessages([{ role: 'ai', content: getInitialGreeting(lang) }]);
    }
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMessage.content, language: lang })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      console.error(err);
      const errorMsg = lang === 'hi' ? "माफ़ कीजिए, सर्वर से संपर्क करने में समस्या आई।" : lang === 'mr' ? "क्षमस्व, सर्व्हरशी संपर्क करण्यात अडचण आली." : "Sorry, I am having trouble connecting to the server right now.";
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const suggestions = getQuickSuggestions(lang);

  return (
    <div className="flex flex-col h-full gap-2 text-slate-800">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar pb-2">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'ai' 
                ? 'bg-emerald-50 text-slate-800 border border-emerald-100 rounded-tl-sm shadow-sm' 
                : 'bg-emerald-600 text-white self-end rounded-tr-sm max-w-[85%] shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tl-sm self-start flex items-center gap-2 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span className="text-xs text-emerald-700 font-medium tracking-wider">
              {lang === 'hi' ? 'एआई सोच रहा है...' : lang === 'mr' ? 'AI विचार करत आहे...' : 'AI is thinking...'}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      {messages.length < 4 && (
        <div className="flex flex-wrap gap-1.5 py-1">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(suggestion)}
              disabled={isLoading}
              className="text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 px-2.5 py-1 rounded-full transition-all border border-slate-200 hover:border-emerald-300 text-left disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-auto flex gap-2 pt-1">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={lang === 'hi' ? "मुझसे कुछ भी पूछें..." : lang === 'mr' ? "काहीही विचारा..." : "Ask me anything about your farm..."}
          className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          disabled={isLoading}
        />
        <button 
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 transition-colors text-white rounded-full px-4 py-2 text-sm font-bold disabled:opacity-50 flex items-center gap-1 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
