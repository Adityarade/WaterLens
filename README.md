# 🌾 WaterLens: AI-Powered Smart Agriculture & Precision Irrigation Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/Platform-Desktop%20%2B%20Mobile%20PWA-5A0FC8.svg?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **WaterLens** is a full-stack, enterprise-grade precision agriculture and autonomous irrigation platform engineered to empower modern farmers, agronomists, and agricultural researchers. It combines **Reinforcement Learning (RL) irrigation agents**, **Computer Vision crop health diagnostics**, **interactive thermal/NDVI farm zoning**, **live APMC Mandi market rates**, **government scheme intelligence**, and a **multilingual AI conversational voice & text assistant** (English, हिन्दी, मराठी).

---

## 📱 Mobile & Desktop (PWA) Ready

WaterLens is fully responsive and built with **Progressive Web App (PWA)** standards:
- 📱 **Install on Android / iOS / Tablet / Desktop**: One-click installation from browser with custom manifest & service worker caching.
- ⚡ **Mobile-First UX**: Ergonomic bottom navigation bar, swipeable slide-up menu drawer, responsive floating AI voice/chat triggers.
- 🌐 **Offline Resilience**: Automatic fallback to local offline mode if the backend or network is temporarily unreachable.
- 🖧 **LAN / Wi-Fi Device Access**: Run once on your computer and open seamlessly on any mobile phone on the same Wi-Fi network.

---

## 🌟 Key Features

### 1. 🤖 Autonomous RL Irrigation Agent
- Simulates soil moisture dynamics, crop evapotranspiration, and weather forecasts.
- Custom **Gymnasium** reinforcement learning environment trained to maximize crop yield while conserving up to 40% water.
- Live reward telemetry, action tracking, and automatic valve actuator simulation.

### 2. 🌿 AI Crop Doctor & Leaf Pathology Diagnostics
- Upload or scan crop leaf photos for instant disease detection and pest identification.
- Provides botanical diagnosis, confidence scores, organic remedies, and chemical treatment guidelines.

### 3. 🗺️ Thermal & NDVI Farm Zoning Maps
- Interactive satellite imagery overlay displaying NDVI (vegetation vigor) and thermal surface stress.
- Zone-by-zone moisture metrics, soil temperature tracking, and recommended localized irrigation actions.

### 4. 📈 Live APMC Mandi Market Prices
- Real-time commodity price tracking across agricultural produce (Wheat, Cotton, Soybeans, Onions, Sugarcane).
- Daily price changes, minimum/maximum range indicators, and trend analytics.

### 5. 🏛️ Government Schemes & Subsidies Explorer
- Curated database of central and state agricultural welfare schemes (PM-KUSUM, PM Krishi Sinchayee, Sub-Mission on Agricultural Mechanization).
- Direct application links, eligibility criteria, and subsidy coverage breakdowns.

### 6. 🎙️ Multilingual AI Voice & Chat Assistant
- Natural conversational AI powered by LLM integration (OpenAI GPT-4o-mini or local Ollama).
- High-quality Web Speech API voice synthesis and speech-to-text recognition.
- Seamless, complete interface translation in **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.

---

## 🏗️ System Architecture & Tech Stack

```
WaterLens/
├── api/                    # FastAPI Backend
│   ├── main.py             # App initialization, CORS, and routing
│   ├── models.py           # SQLAlchemy database schemas
│   ├── routers/            # Modular API endpoints
│   │   ├── auth.py         # JWT authentication & user sessions
│   │   ├── profile.py      # Farmer & soil profile management
│   │   ├── chat.py         # LLM chat streaming & assistance
│   │   ├── crop_health.py  # Image pathology & diagnostics
│   │   ├── telemetry.py    # IoT sensors, NDVI & thermal data
│   │   ├── market.py       # APMC Mandi commodity rates
│   │   └── schemes.py      # Government agriculture schemes
│   └── rl/                 # Reinforcement learning environment
├── frontend/               # React 18 + Vite Frontend
│   ├── public/             # PWA icons, manifest.json, sw.js
│   ├── src/
│   │   ├── components/     # Reusable UI widgets (VoiceAssistant, ChatInterface)
│   │   ├── pages/          # Full-page views (Dashboard, RLAgent, FarmMap, etc.)
│   │   ├── config.js       # Dynamic host resolution (window.location.hostname)
│   │   ├── i18n.jsx        # Complete multilingual translation dictionaries
│   │   └── App.jsx         # Navigation, responsive layout & PWA handlers
├── requirements.txt        # Python backend dependencies
├── start_project.bat       # 1-Click Windows bootstrapper
└── start_project.sh        # 1-Click Linux / macOS bootstrapper
```

---

## 🚀 Quick Start Guide (1-Click Run)

### Option A: Windows (Automatic)
Simply double-click `start_project.bat` or run:
```cmd
start_project.bat
```
*This launches both the FastAPI backend and Vite frontend in separate dedicated terminal windows.*

### Option B: macOS / Linux (Automatic)
Grant execute permissions and run the startup script:
```bash
chmod +x start_project.sh
./start_project.sh
```

---

## 🛠️ Manual Installation (Clean Setup)

If you prefer to run the components manually in two terminal tabs:

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Backend Setup (Terminal 1)
```bash
# Navigate to backend directory
cd api

# (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- 📖 **Interactive Swagger API Documentation:** Open [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup (Terminal 2)
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server with network exposure
npm run dev -- --host
```
- 🌐 **Web & Mobile Application:** Open [http://localhost:5173](http://localhost:5173)

---

## 📱 How to Access on Mobile Phone via Wi-Fi

1. Make sure your computer and mobile phone are connected to the same Wi-Fi network.
2. In your computer's terminal, Vite will display your Network IP (e.g., `http://192.168.1.X:5173`).
3. Open that URL in Chrome or Safari on your phone.
4. Tap the **"Install App"** button in the header or drawer to add WaterLens directly to your phone's home screen!

---

## ⚙️ Environment Configuration (Optional)

Create a `.env` file in the `api/` directory if you wish to configure live OpenAI integration:
```env
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_jwt_secret_key_here
```
*(Note: WaterLens includes built-in offline smart responses and fallbacks, ensuring 100% functionality even without an OpenAI API key!)*

---

## 🧪 Production Verification & Build

To test production bundle compilation:
```bash
cd frontend
npm run build
```
Build output is saved to `frontend/dist/` with 0 errors.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
