import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_map: "Farm Map",
    nav_market: "Market Rates",
    nav_schemes: "Govt Schemes",
    nav_agent: "RL Agent",
    nav_crop_health: "Crop Health",
    nav_profile: "Profile",
    nav_settings: "Settings",
    nav_logout: "Log out",

    // Header
    status_online: "System Online",
    notifications: "Notifications",
    no_alerts: "No new alerts",
    ai_assistant: "AI Assistant",

    // Dashboard Hero
    hero_live: "Live Dashboard",
    hero_welcome: "Good Morning,",
    hero_desc: "Your farm is operating at 96% efficiency. The AI has paused Zone 3 watering due to anticipated rainfall tonight.",
    btn_weather: "Weather Map",
    btn_report: "Generate Report",

    // Dashboard Stats
    stat_moisture: "Avg Soil Moisture",
    stat_water: "Water Saved (30d)",
    stat_heat: "Heat Stress Risk",
    stat_ai: "AI Confidence",

    // Dashboard Charts
    chart_moisture_title: "Soil Moisture vs Prediction",
    chart_moisture_desc: "24-hour historical & forecast",
    opt_title: "Harvest Optimizer",
    opt_desc: "AI Market & Weather Sync",
    opt_analyzing: "Analyzing Markets...",

    // Profile
    profile_title: "Farmer Profile",
    profile_desc: "Manage your personal details and farm parameters.",
    profile_photo: "Profile Photo",
    profile_name: "Full Name",
    profile_farm: "Farm Name",
    profile_location: "Location",
    profile_size: "Total Size",
    profile_crops: "Primary Crops",
    profile_save: "Save Profile",

    // Settings
    settings_title: "System Settings",
    settings_desc: "Configure AI autonomy and alert thresholds.",
    settings_auto: "Autonomous Irrigation",
    settings_auto_desc: "Allow AI to control water valves automatically",
    settings_strict: "Water Conservation Strictness",
    settings_strict_desc: "Balances crop yield with water savings",
    settings_alerts: "Critical Alerts Only",
    settings_alerts_desc: "Only notify for major stress events",
    settings_save: "Save Preferences",

    // RL Agent
    agent_title: "RL Agent Monitor",
    agent_desc: "Watch the Reinforcement Learning model adapt to farm conditions in real-time.",
    agent_status: "Agent Status:",
    agent_btn_pause: "Pause Agent",
    agent_btn_start: "Start Agent",
    agent_logs: "Live Decision Logs",
    agent_memory: "Experience Replay Memory",

    // Crop Health
    crop_title: "AI Crop Diagnostician",
    crop_desc: "Upload photos or describe symptoms to get instant treatment plans.",
    crop_upload: "Upload Image",
    crop_placeholder: "Describe the symptoms... (e.g. Yellowing edges on lower leaves of tomato plants)",
    crop_btn_analyze: "Analyze Symptoms",
    crop_analyzing: "AI Analyzing...",
    crop_results: "Analysis Results",
    crop_diag: "Accurate Diagnosis",
    crop_measures: "Primary Preventive Measures",

    // Market Rates
    market_title: "Market Intelligence",
    market_desc: "Real-time Mandi rates analyzed by AI to maximize your selling profit.",
    market_live: "Live APMC Data - ",
    market_today: "Today's Commodity Rates",
    market_price_unit: "Prices per Quintal (₹)",
    market_fetching: "Fetching live market data...",
    market_min: "Min:",
    market_max: "Max:",
    market_ai_rec: "AI Recommendation",

    // Govt Schemes
    schemes_title: "State Govt & Krishi Schemes",
    schemes_desc: "Stay updated with the latest government subsidies, announcements, and direct benefit transfers.",
    schemes_state: " State",
    schemes_portal: "Official Portal",
    schemes_fetching: "Fetching government schemes...",
    schemes_active: "Active Status",
    schemes_open: "Open",
    schemes_subsidy: "Subsidy Available",
    schemes_deadline: "Deadline",

    // Farm Map
    map_title: "Drone & Satellite Mapper",
    map_desc: "Precision agriculture NDVI heatmaps and zone management.",
    map_live_ndvi: "Live NDVI",
    map_thermal: "Thermal",
    map_thermal_cool: "Cool / Moist",
    map_thermal_hot: "Hot Spot / Dry",
    map_thermal_optimal: "Optimal Temp",
    map_zone1: "Zone 1 (Healthy)",
    map_zone2: "Zone 2 (Drought Stress)",
    map_zone3: "Zone 3 (Blight Risk)",
    map_legend: "Map Legend",
    map_vigor: "High Vigor (Healthy)",
    map_moisture: "Low Moisture (Stress)",
    map_risk: "Disease/Pest Risk",

    // Voice Assistant
    voice_nav_market: "Navigating to Market Intelligence.",
    voice_nav_schemes: "Navigating to Government Schemes.",
    voice_nav_map: "Navigating to Farm Drone and Satellite Map.",
    voice_nav_crop_health: "Navigating to AI Crop Diagnostician.",
    voice_nav_agent: "Navigating to RL Autonomous Agent Monitor.",
    voice_nav_dashboard: "Navigating to Main Dashboard.",
    voice_nav_profile: "Navigating to Farmer Profile.",
    voice_nav_settings: "Navigating to System Settings.",

    // Dropdown Menu
    menu_user: "User",
    menu_manager: "Farm Manager",
    menu_profile: "My Profile",
    menu_settings: "Settings",
    menu_logout: "Logout"
  },
  es: {
    // Navigation
    nav_dashboard: "Panel",
    nav_map: "Mapa de Granja",
    nav_market: "Tasas de Mercado",
    nav_schemes: "Esquemas Estatales",
    nav_agent: "Agente RL",
    nav_crop_health: "Salud del Cultivo",
    nav_profile: "Perfil",
    nav_settings: "Ajustes",
    nav_logout: "Cerrar sesión",

    // Header
    status_online: "Sistema en Línea",
    notifications: "Notificaciones",
    no_alerts: "No hay alertas",
    ai_assistant: "Asistente IA",

    // Dashboard Hero
    hero_live: "Panel en Vivo",
    hero_welcome: "¡Buenos días!",
    hero_desc: "Su granja está operando al 96% de eficiencia. La IA ha pausado el riego en la Zona 3 debido a las lluvias previstas.",
    btn_weather: "Mapa del Clima",
    btn_report: "Generar Reporte",

    // Dashboard Stats
    stat_moisture: "Humedad Promedio",
    stat_water: "Agua Ahorrada (30d)",
    stat_heat: "Riesgo de Calor",
    stat_ai: "Confianza IA",

    // Dashboard Charts
    chart_moisture_title: "Humedad del Suelo vs Predicción",
    chart_moisture_desc: "Historial y pronóstico de 24 horas",
    opt_title: "Optimizador de Cosecha",
    opt_desc: "Sincronización de Mercado y Clima",
    opt_analyzing: "Analizando Mercados...",

    // Profile
    profile_title: "Perfil del Granjero",
    profile_desc: "Gestione sus detalles personales y parámetros de la granja.",
    profile_photo: "Foto de perfil",
    profile_name: "Nombre completo",
    profile_farm: "Nombre de la granja",
    profile_location: "Ubicación",
    profile_size: "Tamaño total",
    profile_crops: "Cultivos principales",
    profile_save: "Guardar perfil",

    // Settings
    settings_title: "Configuración del Sistema",
    settings_desc: "Configure la autonomía de la IA y umbrales de alerta.",
    settings_auto: "Riego Autónomo",
    settings_auto_desc: "Permitir que la IA controle las válvulas de agua",
    settings_strict: "Estrictez de Conservación de Agua",
    settings_strict_desc: "Equilibra el rendimiento con el ahorro de agua",
    settings_alerts: "Solo Alertas Críticas",
    settings_alerts_desc: "Notificar solo para eventos de estrés mayor",
    settings_save: "Guardar Preferencias",

    // RL Agent
    agent_title: "Monitor del Agente RL",
    agent_desc: "Observe el modelo de aprendizaje por refuerzo adaptarse en tiempo real.",
    agent_status: "Estado del Agente:",
    agent_btn_pause: "Pausar Agente",
    agent_btn_start: "Iniciar Agente",
    agent_logs: "Registros de Decisiones",
    agent_memory: "Memoria de Repetición",

    // Crop Health
    crop_title: "Diagnóstico IA de Cultivos",
    crop_desc: "Suba fotos o describa síntomas para planes de tratamiento.",
    crop_upload: "Subir Imagen",
    crop_placeholder: "Describa los síntomas... (ej. Bordes amarillos en tomates)",
    crop_btn_analyze: "Analizar Síntomas",
    crop_analyzing: "IA Analizando...",
    crop_results: "Resultados",
    crop_diag: "Diagnóstico Exacto",
    crop_measures: "Medidas Preventivas Primarias",

    // Market Rates
    market_title: "Inteligencia de Mercado",
    market_desc: "Tasas de Mandi en tiempo real analizadas por IA para maximizar sus ganancias.",
    market_live: "Datos APMC en vivo - ",
    market_today: "Tasas de Productos de Hoy",
    market_price_unit: "Precios por Quintal (₹)",
    market_fetching: "Obteniendo datos de mercado en vivo...",
    market_min: "Mín:",
    market_max: "Máx:",
    market_ai_rec: "Recomendación IA",

    // Govt Schemes
    schemes_title: "Subsidios y Esquemas Estatales",
    schemes_desc: "Manténgase actualizado con los últimos subsidios gubernamentales y transferencias directas.",
    schemes_state: " Estado",
    schemes_portal: "Portal Oficial",
    schemes_fetching: "Obteniendo esquemas...",
    schemes_active: "Estado Activo",
    schemes_open: "Abierto",
    schemes_subsidy: "Subsidio Disponible",
    schemes_deadline: "Fecha Límite",

    // Farm Map
    map_title: "Mapeador de Drones y Satélites",
    map_desc: "Mapas de calor NDVI de agricultura de precisión y gestión de zonas.",
    map_live_ndvi: "NDVI en vivo",
    map_thermal: "Térmico",
    map_thermal_cool: "Fresco / Húmedo",
    map_thermal_hot: "Punto Caliente / Seco",
    map_thermal_optimal: "Temp Óptima",
    map_zone1: "Zona 1 (Saludable)",
    map_zone2: "Zona 2 (Estrés hídrico)",
    map_zone3: "Zona 3 (Riesgo de plaga)",
    map_legend: "Leyenda del mapa",
    map_vigor: "Alto vigor (Saludable)",
    map_moisture: "Baja humedad (Estrés)",
    map_risk: "Riesgo de enfermedad/plaga",

    // Voice Assistant
    voice_nav_market: "Navegando a Inteligencia de Mercado.",
    voice_nav_schemes: "Navegando a Esquemas del Gobierno.",
    voice_nav_map: "Navegando al Mapa Satelital y Dron.",
    voice_nav_crop_health: "Navegando al Diagnóstico IA de Cultivos.",
    voice_nav_agent: "Navegando al Monitor del Agente RL.",
    voice_nav_dashboard: "Navegando al Panel Principal.",
    voice_nav_profile: "Navegando al Perfil del Granjero.",
    voice_nav_settings: "Navegando a Configuración del Sistema.",

    // Dropdown Menu
    menu_user: "Usuario",
    menu_manager: "Gerente de Granja",
    menu_profile: "Mi Perfil",
    menu_settings: "Configuración",
    menu_logout: "Cerrar sesión"
  },
  mr: {
    // Navigation
    nav_dashboard: "डॅशबोर्ड",
    nav_map: "शेताचा नकाशा",
    nav_market: "बाजार भाव",
    nav_schemes: "सरकारी योजना",
    nav_agent: "आरएल एजंट (RL Agent)",
    nav_crop_health: "पिकांचे आरोग्य",
    nav_profile: "प्रोफाइल",
    nav_settings: "सेटिंग्ज",
    nav_logout: "लॉग आउट",

    // Header
    status_online: "सिस्टम ऑनलाइन",
    notifications: "सूचना",
    no_alerts: "कोणत्याही नवीन सूचना नाहीत",
    ai_assistant: "एआय सहाय्यक",

    // Dashboard Hero
    hero_live: "लाइव्ह डॅशबोर्ड",
    hero_welcome: "सुप्रभात,",
    hero_desc: "तुमचे शेत ९६% कार्यक्षमतेवर चालत आहे. आज रात्रीच्या पावसाच्या शक्यतेमुळे AI ने झोन ३ मधील पाणी देणे थांबवले आहे.",
    btn_weather: "हवामानाचा नकाशा",
    btn_report: "अहवाल तयार करा",

    // Dashboard Stats
    stat_moisture: "सरासरी मातीतील ओलावा",
    stat_water: "पाण्याची बचत (३० दिवस)",
    stat_heat: "उष्णतेचा धोका",
    stat_ai: "AI विश्वास",

    // Dashboard Charts
    chart_moisture_title: "मातीतील ओलावा विरुद्ध अंदाज",
    chart_moisture_desc: "२४ तासांचा इतिहास आणि अंदाज",
    opt_title: "पीक ऑप्टिमायझर",
    opt_desc: "AI बाजार आणि हवामान सिंक",
    opt_analyzing: "बाजार विश्लेषण करत आहे...",

    // Profile
    profile_title: "शेतकरी प्रोफाइल",
    profile_desc: "तुमचे वैयक्तिक तपशील आणि शेतीचे मापदंड व्यवस्थापित करा.",
    profile_photo: "प्रोफाइल फोटो",
    profile_name: "पूर्ण नाव",
    profile_farm: "शेताचे नाव",
    profile_location: "ठिकाण",
    profile_size: "एकूण आकार",
    profile_crops: "मुख्य पिके",
    profile_save: "प्रोफाइल जतन करा",

    // Settings
    settings_title: "सिस्टम सेटिंग्ज",
    settings_desc: "AI स्वायत्तता आणि अलर्ट कॉन्फिगर करा.",
    settings_auto: "स्वयंचलित सिंचन",
    settings_auto_desc: "AI ला पाणी स्वयंचलितपणे नियंत्रित करू द्या",
    settings_strict: "पाणी संवर्धन कडकपणा",
    settings_strict_desc: "पाणी बचत आणि पीक उत्पादन यात संतुलन",
    settings_alerts: "फक्त गंभीर सूचना",
    settings_alerts_desc: "फक्त प्रमुख धोक्यांसाठी सूचित करा",
    settings_save: "सेटिंग्ज जतन करा",

    // RL Agent
    agent_title: "RL एजंट मॉनिटर",
    agent_desc: "AI मॉडेल शेतीच्या परिस्थितीशी कसे जुळवून घेते ते पहा.",
    agent_status: "एजंट स्थिती:",
    agent_btn_pause: "एजंट थांबवा",
    agent_btn_start: "एजंट सुरू करा",
    agent_logs: "थेट निर्णय नोंदी",
    agent_memory: "अनुभव रिप्ले मेमरी",

    // Crop Health
    crop_title: "AI पीक निदान",
    crop_desc: "उपचार योजना मिळवण्यासाठी फोटो अपलोड करा किंवा लक्षणे सांगा.",
    crop_upload: "फोटो अपलोड करा",
    crop_placeholder: "लक्षणे सांगा... (उदा. टोमॅटोच्या पानांवर पिवळे डाग)",
    crop_btn_analyze: "लक्षणांचे विश्लेषण करा",
    crop_analyzing: "AI विश्लेषण करत आहे...",
    crop_results: "विश्लेषण परिणाम",
    crop_diag: "अचूक निदान",
    crop_measures: "प्राथमिक प्रतिबंधात्मक उपाय",

    // Market Rates
    market_title: "बाजार बुद्धिमत्ता",
    market_desc: "तुमचा नफा वाढवण्यासाठी AI द्वारे विश्लेषण केलेले रिअल-टाइम मंडी दर.",
    market_live: "थेट APMC डेटा - ",
    market_today: "आजचे कमोडिटी दर",
    market_price_unit: "दर प्रति क्विंटल (₹)",
    market_fetching: "थेट बाजार डेटा आणत आहे...",
    market_min: "किमान:",
    market_max: "कमाल:",
    market_ai_rec: "AI शिफारस",

    // Govt Schemes
    schemes_title: "राज्य सरकार आणि कृषी योजना",
    schemes_desc: "नवीनतम सरकारी अनुदाने आणि घोषणांसह अद्ययावत रहा.",
    schemes_state: " राज्य",
    schemes_portal: "अधिकृत पोर्टल",
    schemes_fetching: "सरकारी योजना आणत आहे...",
    schemes_active: "सक्रिय स्थिती",
    schemes_open: "उघडा",
    schemes_subsidy: "अनुदान उपलब्ध",
    schemes_deadline: "अंतिम मुदत",

    // Farm Map
    map_title: "ड्रोन आणि सॅटेलाइट मॅपर",
    map_desc: "प्रिसिजन अॅग्रीकल्चर NDVI हीटमॅप्स आणि झोन व्यवस्थापन.",
    map_live_ndvi: "थेट NDVI",
    map_thermal: "थर्मल",
    map_thermal_cool: "थंड / ओलसर",
    map_thermal_hot: "गरम जागा / कोरडे",
    map_thermal_optimal: "इष्टतम तापमान",
    map_zone1: "झोन १ (निरोगी)",
    map_zone2: "झोन २ (दुष्काळ ताण)",
    map_zone3: "झोन ३ (करपा धोका)",
    map_legend: "नकाशा सूची",
    map_vigor: "उच्च जोम (निरोगी)",
    map_moisture: "कमी ओलावा (ताण)",
    map_risk: "रोग/कीड धोका",

    // Voice Assistant
    voice_nav_market: "बाजार भाव पानावर जात आहे.",
    voice_nav_schemes: "सरकारी योजना पानावर जात आहे.",
    voice_nav_map: "शेताचा नकाशा पानावर जात आहे.",
    voice_nav_crop_health: "पीक आरोग्य आणि निदान पानावर जात आहे.",
    voice_nav_agent: "आरएल सिंचन एजंट पानावर जात आहे.",
    voice_nav_dashboard: "मुख्य डॅशबोर्डवर जात आहे.",
    voice_nav_profile: "शेतकरी प्रोफाइल पानावर जात आहे.",
    voice_nav_settings: "सिस्टम सेटिंग्ज पानावर जात आहे.",

    // Dropdown Menu
    menu_user: "वापरकर्ता",
    menu_manager: "शेत व्यवस्थापक",
    menu_profile: "माझी प्रोफाईल",
    menu_settings: "सेटिंग्ज",
    menu_logout: "लॉगआउट"
  },
  hi: {
    // Navigation
    nav_dashboard: "डैशबोर्ड",
    nav_map: "खेत का नक्शा",
    nav_market: "बाजार भाव",
    nav_schemes: "सरकारी योजनाएं",
    nav_agent: "आरएल एजेंट (RL Agent)",
    nav_crop_health: "फसल स्वास्थ्य",
    nav_profile: "प्रोफ़ाइल",
    nav_settings: "सेटिंग्स",
    nav_logout: "लॉग आउट",

    // Header
    status_online: "सिस्टम ऑनलाइन",
    notifications: "सूचनाएं",
    no_alerts: "कोई नई सूचना नहीं",
    ai_assistant: "एआई सहायक",

    // Dashboard Hero
    hero_live: "लाइव डैशबोर्ड",
    hero_welcome: "सुप्रभात,",
    hero_desc: "आपका खेत 96% दक्षता पर काम कर रहा है। आज रात बारिश की आशंका के कारण एआई ने ज़ोन 3 में सिंचाई रोक दी है।",
    btn_weather: "मौसम मानचित्र",
    btn_report: "रिपोर्ट तैयार करें",

    // Dashboard Stats
    stat_moisture: "औसत मिट्टी की नमी",
    stat_water: "पानी की बचत (30 दिन)",
    stat_heat: "गर्मी का जोखिम",
    stat_ai: "एआई विश्वास",

    // Dashboard Charts
    chart_moisture_title: "मिट्टी की नमी बनाम भविष्यवाणी",
    chart_moisture_desc: "24 घंटे का इतिहास और पूर्वानुमान",
    opt_title: "फसल अनुकूलक",
    opt_desc: "एआई बाजार और मौसम सिंक",
    opt_analyzing: "बाजार का विश्लेषण...",

    // Profile
    profile_title: "किसान प्रोफ़ाइल",
    profile_desc: "अपने व्यक्तिगत विवरण और खेत के मापदंडों का प्रबंधन करें।",
    profile_photo: "प्रोफ़ाइल फोटो",
    profile_name: "पूरा नाम",
    profile_farm: "खेत का नाम",
    profile_location: "स्थान",
    profile_size: "कुल आकार",
    profile_crops: "मुख्य फसलें",
    profile_save: "प्रोफ़ाइल सहेजें",

    // Settings
    settings_title: "सिस्टम सेटिंग्स",
    settings_desc: "एआई स्वायत्तता और अलर्ट कॉन्फ़िगर करें।",
    settings_auto: "स्वायत्त सिंचाई",
    settings_auto_desc: "एआई को स्वचालित रूप से पानी नियंत्रित करने दें",
    settings_strict: "जल संरक्षण सख्ती",
    settings_strict_desc: "पानी की बचत और फसल उपज में संतुलन",
    settings_alerts: "केवल गंभीर अलर्ट",
    settings_alerts_desc: "केवल प्रमुख खतरों के लिए सूचित करें",
    settings_save: "सेटिंग्स सहेजें",

    // RL Agent
    agent_title: "आरएल एजेंट मॉनिटर",
    agent_desc: "देखें कि एआई मॉडल खेत की स्थिति के अनुकूल कैसे होता है।",
    agent_status: "एजेंट स्थिति:",
    agent_btn_pause: "एजेंट रोकें",
    agent_btn_start: "एजेंट शुरू करें",
    agent_logs: "लाइव निर्णय लॉग",
    agent_memory: "अनुभव रीप्ले मेमोरी",

    // Crop Health
    crop_title: "एआई फसल निदान",
    crop_desc: "उपचार योजना प्राप्त करने के लिए तस्वीरें अपलोड करें या लक्षण बताएं।",
    crop_upload: "फोटो अपलोड करें",
    crop_placeholder: "लक्षण बताएं... (जैसे टमाटर के पत्तों पर पीले धब्बे)",
    crop_btn_analyze: "लक्षणों का विश्लेषण करें",
    crop_analyzing: "एआई विश्लेषण कर रहा है...",
    crop_results: "विश्लेषण परिणाम",
    crop_diag: "सटीक निदान",
    crop_measures: "प्राथमिक निवारक उपाय",

    // Market Rates
    market_title: "बाजार बुद्धिमत्ता",
    market_desc: "आपका मुनाफा बढ़ाने के लिए एआई द्वारा विश्लेषण किए गए रीयल-टाइम मंडी दर।",
    market_live: "लाइव APMC डेटा - ",
    market_today: "आज के कमोडिटी दर",
    market_price_unit: "कीमतें प्रति क्विंटल (₹)",
    market_fetching: "लाइव मार्केट डेटा प्राप्त किया जा रहा है...",
    market_min: "न्यूनतम:",
    market_max: "अधिकतम:",
    market_ai_rec: "एआई अनुशंसा",

    // Govt Schemes
    schemes_title: "राज्य सरकार और कृषि योजनाएं",
    schemes_desc: "नवीनतम सरकारी सब्सिडी, घोषणाओं और प्रत्यक्ष लाभ हस्तांतरण के साथ अद्यतित रहें।",
    schemes_state: " राज्य",
    schemes_portal: "आधिकारिक पोर्टल",
    schemes_fetching: "सरकारी योजनाएं प्राप्त की जा रही हैं...",
    schemes_active: "सक्रिय स्थिति",
    schemes_open: "खुला है",
    schemes_subsidy: "सब्सिडी उपलब्ध",
    schemes_deadline: "समय सीमा",

    // Farm Map
    map_title: "ड्रोन और सैटेलाइट मैपर",
    map_desc: "सटीक कृषि NDVI हीटमैप और ज़ोन प्रबंधन।",
    map_live_ndvi: "लाइव NDVI",
    map_thermal: "थर्मल",
    map_thermal_cool: "ठंडा / नम",
    map_thermal_hot: "गर्म स्थान / सूखा",
    map_thermal_optimal: "इष्टतम तापमान",
    map_zone1: "ज़ोन 1 (स्वस्थ)",
    map_zone2: "ज़ोन 2 (सूखे का तनाव)",
    map_zone3: "ज़ोन 3 (रोग का जोखिम)",
    map_legend: "नक्शा संकेत",
    map_vigor: "उच्च शक्ति (स्वस्थ)",
    map_moisture: "कम नमी (तनाव)",
    map_risk: "रोग/कीट जोखिम",

    // Voice Assistant
    voice_nav_market: "बाजार भाव पेज पर जा रहे हैं।",
    voice_nav_schemes: "सरकारी योजनाओं के पेज पर जा रहे हैं।",
    voice_nav_map: "खेत के नक्शे पर जा रहे हैं।",
    voice_nav_crop_health: "फसल स्वास्थ्य एवं निदान पेज पर जा रहे हैं।",
    voice_nav_agent: "आरएल सिंचाई एजेंट मॉनिटर पर जा रहे हैं।",
    voice_nav_dashboard: "मुख्य डैशबोर्ड पर जा रहे हैं।",
    voice_nav_profile: "किसान प्रोफ़ाइल पर जा रहे हैं।",
    voice_nav_settings: "सिस्टम सेटिंग्स पर जा रहे हैं।",

    // Dropdown Menu
    menu_user: "उपयोगकर्ता",
    menu_manager: "खेत प्रबंधक",
    menu_profile: "मेरी प्रोफाइल",
    menu_settings: "सेटिंग्स",
    menu_logout: "लॉग आउट"
  }
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
