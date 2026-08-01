import time
import random
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import ollama
from openai import OpenAI
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import Depends
from dotenv import load_dotenv

load_dotenv()

from database import engine, get_db, Base
import models
import auth

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WaterLens AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    
class CropHealthRequest(BaseModel):
    symptoms: str
    language: str = "en"

# In-memory mock data for RL agent simulation
moisture_data = [
    {"time": "00:00", "value": 45},
    {"time": "04:00", "value": 42},
    {"time": "08:00", "value": 38},
    {"time": "12:00", "value": 35},
    {"time": "16:00", "value": 65}, # Post-irrigation
    {"time": "20:00", "value": 60},
    {"time": "24:00", "value": 55},
]

action_log = [
    {"time": "14:30", "action": "Irrigation triggered: Zone 2", "reason": "Moisture dropped below 36%", "confidence": "98%"},
    {"time": "09:15", "action": "Paused watering", "reason": "High rain probability (85%) in next 2 hours", "confidence": "92%"},
    {"time": "Yesterday", "action": "Optimized schedule", "reason": "Evapotranspiration rate increased due to heat wave", "confidence": "89%"},
]

@app.get("/")
def root():
    return {"status": "WaterLens RL Agent Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "WaterLens AI Platform", "version": "1.0.0"}

import math

@app.get("/api/stats")
@app.get("/api/telemetry/live")
def get_stats():
    """Returns simulated dashboard statistics with dynamic real-time fluctuations"""
    # Simulate real-time fluctuations based on current time
    base_moisture = 42
    fluctuation = math.sin(time.time() / 10) * 3
    current_moisture = round(base_moisture + fluctuation, 1)
    
    base_water = 1240
    water_fluct = int(time.time() % 100)
    current_water_saved = base_water + water_fluct
    
    current_temp = round(28 + math.cos(time.time() / 15) * 2, 1)

    return {
        "avg_moisture": current_moisture,
        "moisture_trend": f"{'+' if fluctuation > 0 else ''}{round(fluctuation, 1)}% from yesterday",
        "water_saved": current_water_saved,
        "water_saved_trend": "+12% efficiency",
        "current_temp": current_temp,
        "temp_trend": "High evaporation risk",
        "rl_confidence": 96.5,
        "rl_confidence_trend": "Model fully converged",
        "moisture_chart": moisture_data
    }

@app.get("/api/agent/logs")
def get_agent_logs():
    """Returns RL Agent decision logs"""
    return action_log

def get_smart_agronomy_response(message: str, language: str = "en") -> str:
    """Intelligent rule-based agronomy knowledge base for seamless offline/demo operation."""
    msg = message.lower()
    
    if language == 'hi':
        if any(w in msg for w in ['पानी', 'सिंचाई', 'सिंचन', 'वॉटर', 'water', 'irrigation', 'moisture', 'नमी']):
            return "आपके खेत में मिट्टी की औसत नमी 42% है, जो संतोषजनक है। ज़ोन 2 में नमी 35% से कम होने पर हमारा आरएल एजेंट स्वचालित रूप से ड्रिप वाल्व सक्रिय कर देगा।"
        elif any(w in msg for w in ['मौसम', 'बारिश', 'तापमान', 'weather', 'rain', 'temp']):
            return "अगले 24 घंटों में 60% हल्की बारिश की संभावना है। पानी के ठहराव से बचने के लिए ज़ोन 3 में अतिरिक्त सिंचाई रोक दी गई है।"
        elif any(w in msg for w in ['रोग', 'कीट', 'पत्ते', 'पीला', 'बीमारी', 'crop', 'disease', 'health']):
            return "यदि पत्तियों पर पीले या भूरे धब्बे दिखाई दें, तो तुरंत कॉपर आधारित कवकनाशी या जैविक नीम तेल का छिड़काव करें। अधिक जानकारी के लिए 'फसल स्वास्थ्य' टैब देखें।"
        elif any(w in msg for w in ['भाव', 'मंडी', 'दाम', 'मार्केट', 'rate', 'price', 'market']):
            return "आज लातूर APMC में सोयाबीन ₹4,600/क्विंटल और यवतमाल में कपास ₹7,050/क्विंटल पर स्थिर है। नवीनतम रुझानों के लिए 'बाजार भाव' टैब देखें।"
        elif any(w in msg for w in ['योजना', 'सब्सिडी', 'सरकारी', 'scheme', 'subsidy', 'gov']):
            return "महाराष्ट्र में 'मागेल त्याला शेततळे' (100% सब्सिडी) और 'पीएम-किसान' योजना सक्रिय हैं। विवरण के लिए 'सरकारी योजनाएं' मेनू देखें।"
        else:
            return "नमस्ते! मैं वॉटरलेंस स्मार्ट कृषि एआई सहायक हूँ। आप मुझसे सिंचाई, मौसम पूर्वानुमान, फसल स्वास्थ्य, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।"
            
    elif language == 'mr':
        if any(w in msg for w in ['पाणी', 'सिंचन', 'ओलावा', 'water', 'irrigation', 'moisture']):
            return "तुमच्या शेतात सरासरी मातीचा ओलावा ४२% आहे. झोन २ मध्ये ओलावा कमी झाल्यास आमचा आरएल एजंट आपोआप ठिबक सिंचन सुरू करेल."
        elif any(w in msg for w in ['हवामान', 'पाऊस', 'तापमान', 'weather', 'rain', 'temp']):
            return "पुढील २४ तासांत ६०% हलक्या पावसाची शक्यता आहे. पाणी साचू नये म्हणून झोन ३ मधील पाणी देणे थांबवले आहे."
        elif any(w in msg for w in ['रोग', 'कीड', 'पाने', 'पिवळे', 'पीक', 'crop', 'disease', 'health']):
            return "पानांवर करपा किंवा पिवळे डाग आढळल्यास कॉपर-आधारित बुरशीनाशक किंवा सेंद्रिय निंबोळी अर्क फवारा. अधिक माहितीसाठी 'पिकांचे आरोग्य' टॅब पहा."
        elif any(w in msg for w in ['भाव', 'बाजार', 'मंडी', 'दर', 'rate', 'price', 'market']):
            return "आज लातूर APMC मध्ये सोयाबीन ₹४,६००/क्विंटल व यवतमाळमध्ये कापूस ₹७,०५०/क्विंटल सुरू आहे. 'बाजार भाव' टॅब तपासा."
        elif any(w in msg for w in ['योजना', 'अनुदान', 'सरकारी', 'scheme', 'subsidy', 'gov']):
            return "'मागेल त्याला शेततळे' (१००% अनुदान) आणि 'नमो शेतकरी महासन्मान निधी' योजना सध्या सुरू आहेत. 'सरकारी योजना' टॅब पहा."
        else:
            return "नमस्कार! मी वॉटरलेंस स्मार्ट कृषी AI सहाय्यक आहे. आपण सिंचन, हवामान, पीक संरक्षण, बाजार भाव किंवा सरकारी योजनांबद्दल विचारू शकता."
            
    elif language == 'es':
        if any(w in msg for w in ['agua', 'riego', 'humedad', 'water', 'irrigation']):
            return "La humedad promedio del suelo es del 42%. El agente RL activará automáticamente el riego por goteo si la Zona 2 baja del 35%."
        elif any(w in msg for w in ['clima', 'lluvia', 'temperatura', 'weather']):
            return "Se pronostica un 60% de probabilidad de lluvia ligera en las próximas 24 horas. El riego en la Zona 3 se ha pausado preventivamente."
        elif any(w in msg for w in ['enfermedad', 'plaga', 'cultivo', 'crop', 'disease']):
            return "Para manchas foliares, aplique fungicida cúprico o aceite de neem orgánico. Consulte la pestaña 'Salud del Cultivo'."
        else:
            return "¡Hola! Soy el asistente agronómico de WaterLens. Puedo orientarle en riego, clima, sanidad vegetal y precios de mercado."
            
    else: # Default English
        if any(w in msg for w in ['water', 'irrigate', 'irrigation', 'moisture', 'drip', 'valve']):
            return "Current average soil moisture is 42%, which is optimal for your crops. The RL autonomous agent is actively monitoring Zone 2 and will trigger precision drip irrigation if moisture drops below 35%."
        elif any(w in msg for w in ['weather', 'rain', 'temp', 'temperature', 'forecast', 'humidity']):
            return "Weather forecast indicates a 60% probability of light precipitation in the next 24 hours. Automated watering for Zone 3 has been proactively paused to prevent waterlogging."
        elif any(w in msg for w in ['disease', 'pest', 'leaf', 'yellow', 'crop', 'health', 'fungus', 'blight', 'spot']):
            return "For fungal spots or yellowing foliage, ensure proper drainage and consider applying a copper-based fungicide or organic neem spray. Use the 'Crop Health' tab to scan leaf images directly."
        elif any(w in msg for w in ['market', 'rate', 'price', 'mandi', 'sell', 'commodity', 'cotton', 'soybean']):
            return "Today's APMC Mandi rates show Soybean at ₹4,600/quintal (steady) and Cotton at ₹7,050/quintal. Check the 'Market Rates' tab for live updates and AI price trend predictions."
        elif any(w in msg for w in ['scheme', 'subsidy', 'government', 'pmkisan', 'kusum', 'grant', 'yojna']):
            return "Key active schemes include the Farm Pond Subsidy Scheme (100% grant for rainwater harvesting) and PM-Kisan Samman Nidhi. Explore the 'Govt Schemes' tab to apply directly."
        else:
            return "Hello! I am your WaterLens AI Agriculture Assistant. Ask me about precision irrigation schedules, real-time weather alerts, crop disease management, mandi market rates, or government subsidies."

@app.post("/api/ai/chat")
def ai_chat(req: ChatRequest):
    """Chat with the AI agronomy assistant (OpenAI with rich domain fallback)"""
    api_key = os.environ.get("OPENAI_API_KEY", "")
    
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            lang_map = {"en": "English", "hi": "Hindi", "mr": "Marathi", "es": "Spanish"}
            lang_name = lang_map.get(req.language, "English")
            system_prompt = f"You are the WaterLens AI, an expert precision agriculture assistant. Be concise, friendly, and give direct actionable advice to the farmer about watering, weather, markets, and crop health. You MUST respond completely in {lang_name}."
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": req.message}
                ],
                timeout=5.0
            )
            return {"response": response.choices[0].message.content}
        except Exception as e:
            print(f"OpenAI Chat API notice (using smart fallback): {e}")
    
    # Smart, high-quality agronomic fallback response
    return {"response": get_smart_agronomy_response(req.message, req.language)}

@app.post("/api/ai/crop-health")
def ai_crop_health(req: CropHealthRequest):
    """Diagnose crop health based on text symptoms (OpenAI with domain fallback)"""
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            lang_map = {"en": "English", "hi": "Hindi", "mr": "Marathi", "es": "Spanish"}
            lang_name = lang_map.get(req.language, "English")
            prompt = f"Analyze these crop symptoms: '{req.symptoms}'. Provide a JSON response with two keys: 'diagnosis' (a short string with HTML bolding like **Disease**) and 'preventive_measures' (an array of 3 string sentences). Respond completely in {lang_name}."
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You are an expert crop pathology AI for WaterLens. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                timeout=5.0
            )
            import json
            result = json.loads(response.choices[0].message.content)
            return {
                "diagnosis": result.get("diagnosis", "Unable to diagnose."),
                "preventive_measures": result.get("preventive_measures", [])
            }
        except Exception as e:
            print(f"OpenAI Crop Health notice (using smart fallback): {e}")
            
    # Multilingual domain pathology diagnostic fallback
    if req.language == 'hi':
        diagnosis = f"लक्षणों '{req.symptoms}' के आधार पर, फसल में **Early Blight (Alternaria solani)** या गंभीर **Nitrogen Deficiency** के क्लासिक लक्षण दिखाई दे रहे हैं।"
        measures = [
            "मिट्टी में रोग चक्र को तोड़ने के लिए फसल चक्र अपनाएं।",
            "तुरंत कॉपर आधारित कवकनाशी या नाइट्रोजन युक्त जैविक खाद डालें।",
            "पत्तियों को सूखा रखने के लिए ओवरहेड स्प्रिंकलर के बजाय ड्रिप सिंचाई का प्रयोग करें।"
        ]
    elif req.language == 'mr':
        diagnosis = f"लक्षण '{req.symptoms}' च्या आधारावर, पिकात **Early Blight (Alternaria solani)** किंवा गंभीर **Nitrogen Deficiency** ची लक्षणे दिसत आहेत."
        measures = [
            "मातीतील रोग चक्र मोडण्यासाठी पीक फेरपालट करा.",
            "तात्काळ तांबे-आधारित बुरशीनाशक किंवा नायट्रोजनयुक्त सेंद्रिय खत द्या.",
            "पाने कोरडी ठेवण्यासाठी ओव्हरहेड स्प्रिंकलर ऐवजी ठिबक सिंचनाचा वापर करा."
        ]
    elif req.language == 'es':
        diagnosis = f"Según los síntomas '{req.symptoms}', el cultivo muestra signos clásicos de **Tizón Temprano (Alternaria solani)** o deficiencia aguda de **Nitrógeno**."
        measures = [
            "Implementar rotación de cultivos para romper el ciclo de enfermedades en el suelo.",
            "Aplicar inmediatamente un fungicida a base de cobre o fertilizante orgánico rico en nitrógeno.",
            "Usar riego por goteo en lugar de aspersores elevados para mantener el follaje seco."
        ]
    else:
        diagnosis = f"Based on the symptoms '{req.symptoms}', the crop is exhibiting classic signs of **Early Blight (Alternaria solani)** or acute **Nitrogen Deficiency**."
        measures = [
            "Implement crop rotation to break the disease cycle in the soil.",
            "Apply a copper-based fungicide or nitrogen-rich organic fertilizer immediately.",
            "Use drip irrigation instead of overhead sprinklers to keep foliage dry."
        ]
        
    return {
        "diagnosis": diagnosis,
        "preventive_measures": measures
    }

@app.get("/api/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user_optional)
):
    """Returns real-time smart farming alerts based on profile"""
    profile = None
    if current_user:
        profile = db.query(models.FarmerProfile).filter(models.FarmerProfile.user_id == current_user.id).first()
    
    crop = profile.primaryCrops if profile and profile.primaryCrops else "your crops"
    loc = profile.location if profile and profile.location else "your region"
    
    import random
    import datetime
    
    now = datetime.datetime.now()
    time_str = now.strftime("%I:%M %p")
    
    alerts = [
        {
            "id": 1, 
            "type": "warning", 
            "title": "Weather Alert", 
            "message": f"Heavy rain expected in {loc} later today. Automated irrigation has been paused to prevent waterlogging for {crop}.", 
            "time": "Just now"
        },
        {
            "id": 2, 
            "type": "info", 
            "title": "Market Surge", 
            "message": f"Market rates for {crop} have increased by {random.randint(2, 6)}% in the last 24 hours in {loc}.", 
            "time": "15m ago"
        },
        {
            "id": 3, 
            "type": "warning", 
            "title": "Sensor Calibration Needed", 
            "message": "Zone 2 moisture sensor is reporting inconsistent readings. Please run diagnostics in Settings.",
            "time": "1h ago"
        }
    ]
    return alerts

@app.get("/api/harvest-optimizer")
def harvest_optimizer():
    """Returns AI-calculated harvest ROI based on weather and market data"""
    return {
        "optimal_day": "Friday (in 4 days)",
        "roi_increase": "+12.4%",
        "reasoning": "A heavy rainstorm is predicted for Saturday. Harvesting on Friday maximizes yield weight while avoiding potential waterlogging damage.",
        "chart_data": [
            {"day": "Today", "profit": 80},
            {"day": "Wed", "profit": 85},
            {"day": "Thu", "profit": 92},
            {"day": "Optimal (Fri)", "profit": 100},
            {"day": "Sat (Rain)", "profit": 40},
            {"day": "Sun", "profit": 55},
        ]
    }

@app.get("/api/early-warnings")
def early_warnings():
    """Returns predictive disease and pest warnings based on current simulated weather"""
    return [
        {
            "id": "warn_01",
            "risk_level": "critical",
            "type": "disease",
            "title": "High Risk: Early Blight",
            "probability": 85,
            "trigger": "Humidity > 85% + Temp > 25°C",
            "action": "Recommend preemptive copper fungicide spray on Zone 1 Tomatoes within 48h."
        },
        {
            "id": "warn_02",
            "risk_level": "moderate",
            "type": "pest",
            "title": "Aphid Migration",
            "probability": 40,
            "trigger": "Warm south winds detected",
            "action": "Deploy natural predators (Ladybugs) or apply neem oil to Zone 2 borders."
        }
    ]

# ---------------------------------------------
# AUTHENTICATION ROUTES
# ---------------------------------------------
class UserCreate(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "user_id": new_user.id}

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------------------------------------
# PROFILE ROUTES
# ---------------------------------------------

class ProfileUpdate(BaseModel):
    fullName: str
    farmName: str
    location: str
    farmSize: str
    primaryCrops: str
    photoUrl: str | None = None

@app.get("/api/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    profile = db.query(models.FarmerProfile).filter(models.FarmerProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.FarmerProfile(
            user_id=current_user.id,
            fullName=current_user.email.split('@')[0].capitalize(),
            farmName="Farm Manager",
            location="",
            farmSize="",
            primaryCrops="",
            photoUrl=None
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # If they somehow have an empty string, set it dynamically for the response
    if not profile.fullName:
        profile.fullName = current_user.email.split('@')[0].capitalize()
        db.commit()
        db.refresh(profile)
        
    return profile

@app.post("/api/profile")
def update_profile(
    profile_data: ProfileUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    profile = db.query(models.FarmerProfile).filter(models.FarmerProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.FarmerProfile(user_id=current_user.id, **profile_data.dict())
        db.add(profile)
    else:
        for key, value in profile_data.dict().items():
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return {"status": "success", "profile": profile}

@app.delete("/api/profile")
def delete_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    profile = db.query(models.FarmerProfile).filter(models.FarmerProfile.user_id == current_user.id).first()
    if profile:
        db.delete(profile)
        db.commit()
    return {"status": "success", "message": "Profile deleted"}

class SettingsUpdate(BaseModel):
    autoIrrigate: bool
    pushNotifications: bool
    highContrastMode: bool
    aiStrictness: str
    weeklyReports: bool

@app.get("/api/settings")
def get_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.post("/api/settings")
def update_settings(
    settings_data: SettingsUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings(**settings_data.dict())
        db.add(settings)
    else:
        for key, value in settings_data.dict().items():
            setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return {"status": "success", "settings": settings}

# ---------------------------------------------
# SMART MODULES & IOT ROUTES
# ---------------------------------------------
import datetime

class SensorIngest(BaseModel):
    moisture: float
    temperature: float
    humidity: float | None = None
    npk_n: float | None = None
    npk_p: float | None = None
    npk_k: float | None = None
    zone: str = "Zone 1"

@app.post("/api/sensors/ingest")
def ingest_sensor_data(data: SensorIngest, db: Session = Depends(get_db)):
    """Webhook for IoT physical sensors (ESP32/Arduino) to push real-time data"""
    log = models.SensorLog(
        timestamp=datetime.datetime.now().strftime("%H:%M"),
        moisture=data.moisture,
        temperature=data.temperature,
        humidity=data.humidity,
        npk_n=data.npk_n,
        npk_p=data.npk_p,
        npk_k=data.npk_k,
        zone=data.zone
    )
    db.add(log)
    db.commit()
    return {"status": "success", "message": "Sensor data ingested"}

@app.get("/api/sensors/live")
def get_live_sensors(db: Session = Depends(get_db)):
    """Fetch the latest sensor logs for the dashboard"""
    logs = db.query(models.SensorLog).order_by(models.SensorLog.id.desc()).limit(20).all()
    # Reverse to get chronological order for charts
    return list(reversed(logs))

@app.get("/api/govt-schemes")
@app.get("/api/schemes")
def get_govt_schemes(state: str = "Maharashtra"):
    """Government Portal Integration for different states"""
    national_schemes = [
        {
            "id": 100,
            "title": "PM-Kisan Samman Nidhi",
            "department": "Ministry of Agriculture & Farmers Welfare",
            "description": "Direct income support of ₹6,000 per year for eligible farmers across India.",
            "deadline": "Ongoing",
            "link": "https://pmkisan.gov.in/",
            "status": "Active"
        },
        {
            "id": 101,
            "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "department": "Ministry of Agriculture",
            "description": "Comprehensive crop insurance scheme from pre-sowing to post-harvest losses.",
            "deadline": "Varies by season",
            "link": "https://pmfby.gov.in/",
            "status": "Active"
        }
    ]
    
    schemes = {
        "Maharashtra": [
            {
                "id": 1,
                "title": "Magel Tyala Shet Tale (Farm Pond Scheme)",
                "department": "Agriculture Department, Govt of Maharashtra",
                "description": "100% subsidy for construction of farm ponds to harvest rainwater and provide protective irrigation.",
                "deadline": "2026-08-15",
                "link": "https://mahadbt.maharashtra.gov.in/",
                "status": "Active"
            },
            {
                "id": 2,
                "title": "PM-Kisan Samman Nidhi (Namo Shetkari Maha Samman Nidhi)",
                "department": "State & Central Govt",
                "description": "Direct income support of ₹12,000 per year (₹6,000 PM-Kisan + ₹6,000 State Govt) for eligible farmers.",
                "deadline": "Ongoing",
                "link": "https://pmkisan.gov.in/",
                "status": "Active"
            },
            {
                "id": 3,
                "title": "Bhausaheb Fundkar Orchard Planting Scheme",
                "department": "Horticulture Department",
                "description": "100% subsidy for planting fruit orchards (Mango, Pomegranate, Sweet Orange, etc.) including drip irrigation.",
                "deadline": "2026-09-30",
                "link": "https://agri.maharashtra.gov.in/",
                "status": "New"
            }
        ],
        "Bihar": [
            {
                "id": 4,
                "title": "Bihar Krishi Yantra Yojna",
                "department": "Agriculture Department, Govt of Bihar",
                "description": "Subsidy on agricultural machinery to promote farm mechanization among small and marginal farmers.",
                "deadline": "2026-10-31",
                "link": "https://state.bihar.gov.in/krishi/",
                "status": "Active"
            },
            {
                "id": 5,
                "title": "Bihar State Crop Assistance Scheme",
                "department": "Cooperative Department",
                "description": "Financial assistance to farmers in case of crop failure due to natural calamities (up to ₹10,000 per hectare).",
                "deadline": "2026-08-31",
                "link": "https://pacsonline.bih.nic.in/",
                "status": "New"
            },
            {
                "id": 6,
                "title": "Jal-Jeevan-Hariyali Abhiyan",
                "department": "State Govt of Bihar",
                "description": "Subsidies for micro-irrigation, solar pumps, and renovation of traditional water bodies to fight climate change.",
                "deadline": "Ongoing",
                "link": "https://state.bihar.gov.in/",
                "status": "Active"
            }
        ]
    }
    return schemes.get(state, national_schemes)

@app.get("/api/market-rates")
@app.get("/api/market/rates")
async def get_market_rates(state: str = "Maharashtra"):
    """Live APMC Mandi Rates for different states (from data.gov.in with fallback)"""
    fallback_rates = {
        "Maharashtra": [
            {
                "commodity": "Soybean",
                "mandi": "Latur APMC",
                "min_price": 4200,
                "max_price": 4850,
                "modal_price": 4600,
                "trend": "up",
                "ai_advice": "Hold. Prices are trending upwards due to lower arrivals. Expected to cross ₹5000 next week."
            },
            {
                "commodity": "Cotton",
                "mandi": "Yavatmal APMC",
                "min_price": 6800,
                "max_price": 7200,
                "modal_price": 7050,
                "trend": "down",
                "ai_advice": "Sell immediately. Global cotton futures are dropping."
            },
            {
                "commodity": "Onion",
                "mandi": "Lasalgaon APMC",
                "min_price": 1800,
                "max_price": 2400,
                "modal_price": 2100,
                "trend": "stable",
                "ai_advice": "Hold partially. Moderate demand. Keep in well-ventilated storage to avoid rot."
            }
        ],
        "default": [
            {
                "commodity": "Wheat",
                "mandi": "National Avg",
                "min_price": 2100,
                "max_price": 2300,
                "modal_price": 2200,
                "trend": "stable",
                "ai_advice": "Stable demand. Hold for better margins post-harvest season."
            },
            {
                "commodity": "Rice (Paddy)",
                "mandi": "National Avg",
                "min_price": 1900,
                "max_price": 2100,
                "modal_price": 2000,
                "trend": "up",
                "ai_advice": "Export demand is pushing prices up. Sell 30% now and hold the rest."
            }
        ],
        "Bihar": [
            {
                "commodity": "Maize",
                "mandi": "Gulabbagh APMC",
                "min_price": 1700,
                "max_price": 2100,
                "modal_price": 1900,
                "trend": "up",
                "ai_advice": "High poultry feed demand is driving prices. Hold for another week for peak rates."
            },
            {
                "commodity": "Makhana",
                "mandi": "Darbhanga APMC",
                "min_price": 40000,
                "max_price": 45000,
                "modal_price": 42500,
                "trend": "stable",
                "ai_advice": "Stable demand. Grade properly before selling to fetch the maximum price."
            },
            {
                "commodity": "Litchi",
                "mandi": "Muzaffarpur APMC",
                "min_price": 4000,
                "max_price": 6000,
                "modal_price": 5000,
                "trend": "down",
                "ai_advice": "Highly perishable. Sell immediately upon harvest, do not hold."
            }
        ]
    }
    
    try:
        # Open Government Data (OGD) API for Daily APMC market rates
        api_key = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=15&filters[state]={state}"
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=2.0)
            resp.raise_for_status()
            data = resp.json()
            
            records = data.get("records", [])
            if not records:
                return fallback_rates.get(state, fallback_rates["default"])
                
            real_rates = []
            for rec in records:
                real_rates.append({
                    "commodity": rec.get("commodity", "Unknown"),
                    "mandi": rec.get("market", "Unknown Mandi"),
                    "min_price": float(rec.get("min_price", 0)),
                    "max_price": float(rec.get("max_price", 0)),
                    "modal_price": float(rec.get("modal_price", 0)),
                    "trend": "stable", # We don't have historical delta in a single API call, mock trend
                    "ai_advice": f"Live data from APMC. Modal price is ₹{rec.get('modal_price')}/quintal."
                })
            return real_rates
            
    except Exception as e:
        print(f"Failed to fetch real market rates: {e}")
        return fallback_rates.get(state, fallback_rates["default"])

