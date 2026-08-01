# 🌿 AI Crop Doctor & Leaf Pathology Diagnostics

The **AI Crop Doctor** is a computer vision and agronomic diagnostics module that allows farmers to photograph crop leaves using their mobile phone camera or upload images to detect diseases, pest infestations, and nutritional deficiencies.

---

## 🔍 Diagnostic Pipeline

```
Mobile Camera Snap / Leaf Photo Upload
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│             Image Preprocessing & Normalization        │
│  - Rescaling (224x224 RGB)                             │
│  - Color Histogram & Lesion Contrast Enhancement       │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│             Deep Vision Classification Engine          │
│  - Convolutional Neural Network / Vision Transformer   │
│  - Multi-class Disease & Symptom Extraction            │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│             Agronomic Knowledge Base Synthesis         │
│  - Botanical Diagnosis & Pathogen Identification       │
│  - Organic Bio-Remedies (Neem Oil, Trichoderma, etc.)  │
│  - Chemical Fungicide / Pesticide Dosage               │
│  - Multilingual Translation (EN / HI / MR)             │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Supported Crops & Pathologies

| Crop | Disease / Deficiency | Visual Symptoms | Treatment Recommendation |
| :--- | :--- | :--- | :--- |
| **Tomato** | Early Blight (*Alternaria solani*) | Concentric rings with yellow halos on lower leaves | Spray Mancozeb (2g/L) or Copper Oxychloride; prune infected leaves. |
| **Cotton** | Bacterial Blight / Angular Leaf Spot | Angular water-soaked lesions turning dark brown | Streptocycline (1g in 10L water) + Copper Oxychloride (30g). |
| **Soybean** | Yellow Mosaic Virus | Irregular yellow patches on leaf lamina; stunting | Control whitefly vectors with Imidacloprid (0.5ml/L); remove infected plants. |
| **Sugarcane**| Red Rot (*Colletotrichum falcatum*) | Red discoloration with white cross-bands on midrib | Seed cane treatment with Carbendazim (1g/L); ensure field drainage. |
| **Wheat** | Leaf Rust (*Puccinia triticina*) | Orange-brown powdery pustules on leaf surface | Propiconazole 25 EC (1ml/L); avoid excessive nitrogen application. |
| **Onion** | Purple Blotch (*Alternaria porri*) | Small water-soaked lesions developing purple centers | Mancozeb (2.5g/L) mixed with sticker agent. |

---

## 📱 Mobile-First Camera Integration
- Utilizes HTML5 `<input type="file" accept="image/*" capture="environment" />` for direct camera triggering on mobile phones.
- Client-side image compression ensures fast uploads even on rural 2G/3G network connections.
- Offline emergency diagnostics catalog delivers instant first-aid recommendations if network connectivity is severed.
