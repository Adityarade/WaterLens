# 🎙️ Multilingual AI Voice & Audio Engine

The **WaterLens Voice Engine** enables hands-free operation in agricultural fields, allowing farmers who are actively working or wearing gloves to navigate the application, inspect sensor readings, and consult the AI assistant purely via voice commands in their native languages.

---

## 🗣️ Supported Languages & Audio Synthesis

| Language | Recognition Code | TTS Voice Matching | Typical Regional Use |
| :--- | :--- | :--- | :--- |
| **English** | `en-US` / `en-IN` | English (India / Natural) | Agronomists & Researchers |
| **हिन्दी (Hindi)** | `hi-IN` | Google हिन्दी / Microsoft Swara | Central & North India |
| **मराठी (Marathi)** | `mr-IN` | Google मराठी / Marathi Natural | Maharashtra & Western Ghats |
| **Español** | `es-ES` / `es-MX` | Google Español / Microsoft Sabina | Global Agricultural Regions |

---

## ⚡ Client-Side NLP & Fast Route Interception

To deliver instantaneous response times without network latency, spoken input is evaluated against a client-side intent matching matrix before routing to external LLMs:

```javascript
// Sample Intent Matching Rules in VoiceAssistant.jsx
if (text.includes("बाजार भाव") || text.includes("market") || text.includes("mandi")) {
    navigate("/market-rates");
    speak("Opening live APMC Mandi rates.");
} else if (text.includes("योजना") || text.includes("scheme") || text.includes("अनुदान")) {
    navigate("/govt-schemes");
    speak("Showing government agricultural schemes and subsidies.");
} else if (text.includes("पीक") || text.includes("disease") || text.includes("डॉक्टर")) {
    navigate("/crop-health");
    speak("Opening AI Crop Doctor diagnostics.");
}
```

---

## 🛡️ Clean Speech Synthesis
- Raw LLM and agronomic responses often contain markdown asterisks, hash headers, and emojis.
- The voice synthesis pipeline automatically strips all formatting tags (`text.replace(/[#*`_~]/g, '')`) before audio pronunciation, ensuring fluid, natural speech.
