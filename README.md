# 🌾 WaterLens

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/Adityarade/WaterLens)
[![Platform](https://img.shields.io/badge/Platform-Desktop%20%7C%20Mobile%20%7C%20PWA-purple.svg)](https://web.dev/progressive-web-apps/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)

---

## 📋 Table of Contents

- [Description](#-description)
- [Demo Video](#-demo-video)
- [Features](#-features)
- [Detailed Documentation](#-detailed-documentation)
- [Key Features Documentation](#-key-features-documentation)
- [User Journey](#-user-journey)
- [Project Structure](#-project-structure)
- [Built With](#-built-with)
- [Installation & Setup](#-installation--setup)

---

## 📚 Description

**WaterLens** is an intelligent precision agriculture and autonomous irrigation platform engineered to empower modern farmers, agronomists, and agricultural researchers. It combines **Reinforcement Learning (RL) irrigation agents**, **Computer Vision crop health diagnostics**, **interactive thermal & NDVI farm zoning**, **live APMC Mandi market rates**, **government scheme intelligence**, and a **multilingual AI conversational voice & text assistant** (supporting English, हिन्दी, and मराठी). Whether deployed on desktop workstations or on mobile devices right in the field, WaterLens guides farmers through optimal water management, disease prevention, and financial subsidy maximization.

---

## 📖 Detailed Documentation

- 🧠 **[ML & RL Engine Documentation](docs/ml_engine.md)** - Deep dive into Reinforcement Learning, Evapotranspiration physics, and Water Conservation reward functions.
- 🌿 **[Crop Doctor CV Documentation](docs/crop_doctor.md)** - How leaf pathology image recognition & diagnostics work.
- ⚙️ **[Backend Documentation](docs/backend.md)** - API architecture, SQLite schemas, and smart agronomy endpoints.
- 🌸 **[Frontend Documentation](docs/frontend.md)** - UI components, PWA setup, and multilingual i18n logic.

---

## 🔑 Key Features Documentation

- 🤖 **[RL Irrigation Optimization](docs/rl_irrigation.md)** - Mathematical formulation of closed-loop soil moisture control.
- 🗺️ **[Thermal & NDVI Farm Zoning](docs/ndvi_mapping.md)** - Multispectral vegetation vigor and crop water stress calculations.
- 🎙️ **[Multilingual Voice Engine](docs/voice_engine.md)** - Web Speech API & client-side NLP intent recognition.
- 📱 **[PWA & Offline Architecture](docs/pwa_offline.md)** - Service Worker caching and home-screen installation.

---

## 🎥 Demo Video

See WaterLens in Action!

📺 **[Watch Demo Video](#)** *(Coming soon)*

*Experience the power of autonomous reinforcement learning irrigation, live drone NDVI thermal mapping, and multilingual AI diagnostics.*

---

## ✨ Features

- 🤖 **Autonomous RL Irrigation Agent**: Simulates soil moisture dynamics, crop evapotranspiration, and weather forecasts with a custom Gymnasium reinforcement learning environment to optimize water consumption by up to 40%.
- 🌿 **AI Crop Doctor & Leaf Pathology**: Instant disease detection, pest identification, and treatment recommendations from uploaded or live-scanned leaf images.
- 🗺️ **Thermal & NDVI Farm Zoning**: Interactive satellite and drone imagery overlay displaying vegetation vigor (NDVI) and thermal stress zones with localized soil moisture telemetry.
- 📈 **Live APMC Mandi Rates**: Real-time commodity price tracking across agricultural produce (Soybeans, Cotton, Onion, Wheat, Rice) with trend analytics and hold/sell AI advice.
- 🏛️ **Government Schemes & Subsidies**: Curated database of state and central agricultural welfare schemes (PM-KUSUM, Magel Tyala Shet Tale, PM-Kisan) with eligibility checkers and direct links.
- 🎙️ **Multilingual AI Voice & Chat Assistant**: Natural conversational AI voice & chat interface supporting **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with zero-crash smart agronomic fallback intelligence.
- 📱 **Desktop & Mobile PWA Experience**: Fast, responsive Progressive Web App with 1-click home-screen installation on Android, iOS, tablets, and desktop computers.

---

## 🗺️ User Journey

**Profile Setup → NDVI Farm Zoning → RL Irrigation Recommendation → AI Crop Disease Scan → Live Mandi Advisory**

The journey transforms agricultural decision-making from guesswork into a data-driven precision science. Farmers start by configuring their farm location, soil profile, and crop parameters. The system monitors live soil moisture and NDVI vegetation index, while the autonomous RL agent determines optimal valve actuation timings. If disease appears in the field, the farmer snaps a photo with the mobile camera for immediate pathology analysis and checks real-time APMC Mandi prices to determine the most profitable harvest sale window.

---

## 📁 Project Structure

```
WaterLens/
├── 🌸 frontend/                   # React Application (Vite + Tailwind CSS + PWA)
│   ├── public/                    # PWA Manifest, Service Worker & App Icons
│   │   ├── manifest.json          # Progressive Web App configuration
│   │   ├── sw.js                  # Service Worker for offline caching
│   │   └── favicon.svg            # WaterLens brand asset
│   ├── src/
│   │   ├── components/            # Reusable UI components (VoiceAssistant, ChatInterface)
│   │   ├── pages/                 # Dashboard, FarmMap, CropHealth, RLAgent, MarketRates, GovtSchemes, Profile
│   │   ├── config.js              # Dynamic API host resolution for LAN & mobile access
│   │   ├── i18n.jsx               # Complete multilingual dictionary (EN, HI, MR, ES)
│   │   ├── App.jsx                # Responsive layout, mobile bottom bar & drawer navigation
│   │   └── main.jsx               # React entrypoint & service worker registration
│   ├── package.json               # Frontend dependencies and build scripts
│   └── vite.config.js             # Vite bundler configuration
│
├── ⚙️ backend/                     # Python Backend (FastAPI + SQLAlchemy)
│   ├── main.py                    # REST Endpoints, AI fallbacks, CORS & IoT ingestion
│   ├── auth.py                    # JWT authentication & user session management
│   ├── database.py                # Database connection & session setup
│   ├── models.py                  # SQLAlchemy schemas (Users, Sensors, Diagnostics)
│   ├── waterlens.db               # SQLite database seed
│   └── .env.example               # Environment variables configuration template
│
├── 📚 docs/                         # Comprehensive Technical Deep-Dives
│   ├── ml_engine.md                # RL & Evapotranspiration physics math formulation
│   ├── crop_doctor.md              # Computer vision leaf diagnostics & remedies
│   ├── backend.md                  # FastAPI REST endpoints & smart fallback architecture
│   ├── frontend.md                 # React SPA & PWA component hierarchy
│   ├── rl_irrigation.md            # Closed-loop Q-learning/PPO moisture control
│   ├── ndvi_mapping.md             # Thermal and NDVI multispectral zoning calculations
│   ├── voice_engine.md             # Multilingual speech recognition & synthesis
│   └── pwa_offline.md              # Service worker offline caching & installation
│
├── 📜 requirements.txt            # Python backend dependencies
├── 🚀 start_project.bat           # 1-Click launcher for Windows
├── 🚀 start_project.sh            # 1-Click launcher for macOS / Linux
├── 📄 LICENSE                     # MIT Open-Source License
└── 📖 README.md                   # Complete repository documentation
```

---

## 🛠️ Built With

- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Backend API**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Database**: [SQLite](https://sqlite.org/) with [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- **AI & ML**: Custom [Gymnasium](https://gymnasium.farama.org/) Reinforcement Learning Environment & [OpenAI GPT-4o-mini](https://platform.openai.com/)
- **Voice & Localization**: Native Web Speech Recognition / Synthesis API + Contextual i18n
- **Deployment & Mobile**: Progressive Web App (PWA) with Service Worker caching

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 2. Quick Start (1-Click Run)

#### Option A: Windows (Automatic)
Double-click `start_project.bat` or run:
```cmd
start_project.bat
```

#### Option B: macOS / Linux (Automatic)
Grant permissions and execute:
```bash
chmod +x start_project.sh
./start_project.sh
```

---

### 3. Manual Step-by-Step Setup

#### Backend Setup (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- 📖 **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev -- --host
```
- 🌐 **Web & Mobile Application**: [http://localhost:5173](http://localhost:5173)

---

### 📱 Mobile Phone Access (via Wi-Fi)
1. Ensure computer and mobile device are connected to the same Wi-Fi network.
2. Open the Network URL displayed in the Vite terminal (e.g., `http://192.168.X.X:5173`) on your phone browser.
3. Tap **"Install App"** in the top bar or menu drawer to add WaterLens to your home screen.

---

## 📄 License
Distributed under the [MIT License](LICENSE).
