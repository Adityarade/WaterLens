# ⚙️ WaterLens Backend Documentation

The backend service is built with **FastAPI** (Python 3.10+), providing high-throughput async endpoints, database ORM integration with **SQLAlchemy**, and intelligent fallback mechanisms for agricultural services.

---

## 🏗️ Architecture Overview

```
Client (Desktop / Mobile PWA)
           │
     REST / JSON
           │
           ▼
┌────────────────────────────────────────────────────────┐
│               FastAPI Application Engine               │
│                                                        │
│  ├── CORS Middleware (Cross-Origin LAN support)        │
│  ├── JWT Authentication & User Session Management      │
│  ├── IoT Telemetry Ingestion & Sensor Streaming        │
│  ├── RL Irrigation Environment & Decision Engine       │
│  ├── Multilingual AI Chat & Smart Agronomy Fallback    │
│  └── APMC Mandi & Government Schemes Connectors        │
└────────────────────────────────────────────────────────┘
           │
      SQLAlchemy ORM
           │
           ▼
┌────────────────────────────────────────────────────────┐
│                 SQLite Database Store                  │
│  - users (Farmer profiles & crop settings)             │
│  - sensor_logs (Moisture, Temp, Humidity, Rain)        │
│  - crop_diagnostics (Leaf scan history & remedies)     │
└────────────────────────────────────────────────────────┘
```

---

## 📡 Key REST Endpoints

### 1. System & Health
- `GET /health`
  - Returns service status and API version.
  - Response: `{"status": "ok", "app": "WaterLens AI Platform", "version": "1.0.0"}`

### 2. IoT Telemetry & Sensors
- `POST /api/sensors/ingest`
  - Ingests IoT hardware sensor telemetry from ESP32 / Arduino nodes.
  - Payload: `{ "soil_moisture": 42.5, "temperature": 28.0, "humidity": 65.0, "rain_forecast": 0.0 }`
- `GET /api/sensors/live`
  - Returns historical sensor telemetry logs for dashboard chart rendering.

### 3. AI Conversational Assistant
- `POST /api/ai/chat`
  - Processes natural language queries in English, Hindi, Marathi, and Spanish.
  - Automatically queries OpenAI GPT-4o-mini or routes to the local **Smart Agronomy Engine** when offline.
  - Payload: `{ "message": "शेतातील ओलावा कसा तपासावा?", "language": "mr" }`

### 4. Crop Pathology Diagnostics
- `POST /api/ai/crop-health`
  - Diagnoses leaf symptoms and provides treatment schedules.
  - Payload: `{ "symptoms": "yellow spots on tomato leaf", "language": "en" }`

### 5. Market Rates & Government Schemes
- `GET /api/market/rates?state=Maharashtra`
  - Returns daily APMC Mandi commodity rates (Soybeans, Cotton, Onion, Wheat) with AI hold/sell advice.
- `GET /api/schemes?state=Maharashtra`
  - Returns state and central agricultural subsidy schemes (PM-KUSUM, Magel Tyala Shet Tale).

---

## 🛡️ Zero-Crash Smart Agronomy Engine

WaterLens contains a deterministic agronomic fallback engine (`get_smart_agronomy_response`) that provides intelligent multi-lingual answers even when third-party LLM APIs are unreachable or when running completely offline in the field.
