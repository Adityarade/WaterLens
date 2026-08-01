# 🌸 WaterLens Frontend Documentation

The frontend is a modern **Single Page Application (SPA) & Progressive Web App (PWA)** built with **React 18**, **Vite**, and **Tailwind CSS**.

---

## 🏗️ Component & State Structure

```
App.jsx (Root Routing & Layout Controller)
 ├── I18nProvider (Global language context: EN, HI, MR, ES)
 ├── Dynamic API Config (window.location.hostname resolution)
 │
 ├── Desktop View:
 │   └── Responsive Sidebar Navigation
 │
 ├── Mobile View:
 │   ├── Top App Bar (Language switcher & Profile badge)
 │   ├── Fixed Touch Bottom Navigation (Home, Map, Mandi, Schemes, More)
 │   └── Slide-up Drawer Modal (Crop Doctor, RL Agent, Settings)
 │
 ├── Floating Global Widgets:
 │   ├── VoiceAssistant.jsx (Web Speech Recognition & Voice Synthesis)
 │   └── ChatInterface.jsx (AI Chatbot with quick-action suggestion pills)
 │
 └── Pages:
     ├── Dashboard.jsx (Hero, Live Sensors, Quick Alerts, Action Cards)
     ├── FarmMap.jsx (Multispectral NDVI & Thermal Zone Map)
     ├── CropHealth.jsx (Direct Camera Capture & Disease Diagnostics)
     ├── RLAgent.jsx (Gymnasium Reinforcement Learning Telemetry)
     ├── MarketRates.jsx (APMC Mandi Rates & AI Price Forecasting)
     ├── GovtSchemes.jsx (Government Schemes & Direct Subsidies)
     ├── Profile.jsx (Farmer Identity, Crop Selection & Soil Type)
     └── Settings.jsx (IoT Calibration, Notifications, Dark Mode)
```

---

## 🌐 Dynamic Host Resolution (`src/config.js`)

To ensure smooth access across desktop, laptop, and mobile devices connected on the same Wi-Fi network without hardcoding localhost:

```javascript
const host = window.location.hostname || 'localhost';
export const API_BASE_URL = `http://${host}:8000`;
```

---

## 🌍 Multilingual State Management (`src/i18n.jsx`)

The application supports real-time language switching across **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**, and **Español**.

- All page labels, statistics, form inputs, button titles, and AI conversation responses adapt immediately without requiring page reloads.
- Voice commands in native languages ("बाजार भाव", "सरकारी योजना", "पीक रोग") trigger instant client-side route navigation.
