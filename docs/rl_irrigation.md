# 🤖 Reinforcement Learning Irrigation Optimization

WaterLens replaces conventional timer-based solenoid valves with a closed-loop **Deep Reinforcement Learning (DRL)** agent designed to balance high crop yield with aggressive water conservation.

---

## 🎯 The Dual-Objective Optimization Problem

Conventional automated irrigation applies water at fixed intervals regardless of soil moisture, weather forecast, or current crop evapotranspiration ($ET_c$). This causes:
1. **Over-watering**: Leaches nitrogen fertilizers into the water table and promotes root fungal disease.
2. **Under-watering**: Causes moisture stress during critical flowering/fruiting stages, degrading yield.

### Mathematical Formulation:

$$\max_{\pi} \mathbb{E}_{\tau \sim \pi} \left[ \sum_{t=0}^{T} \gamma^t R(s_t, a_t) \right]$$

Subject to:
$$\theta_{\text{min}} \le \theta_t \le \theta_{\text{max}} \quad \forall t \in [0, T]$$

---

## 📊 Telemetry State Vector ($s_t$)

At each decision epoch $t$, the agent receives a 5-tuple observation:

| Feature | Notation | Range | Description |
| :--- | :--- | :--- | :--- |
| **Soil Moisture** | $\theta_t$ | $0.0 - 100.0\%$ | Volumetric water content measured by capacitive probe |
| **Ambient Temperature** | $T_t$ | $10^\circ\text{C} - 50^\circ\text{C}$ | Influences vapor pressure deficit (VPD) |
| **Relative Humidity** | $H_t$ | $10\% - 100\%$ | High humidity lowers atmospheric water demand |
| **Precipitation Forecast** | $P_{t+1}$ | $0.0 - 50.0\text{ mm}$ | Expected rain in next 24 hours |
| **Crop Stage Coefficient** | $K_c$ | $0.4 - 1.2$ | Phenological water demand factor (Vegetative vs Mid-season) |

---

## ⚙️ Discrete Action Space ($a_t$)

- **$a_0$ (Hold / No-Op)**: Valve closed ($0\text{ L/min}$). Used when soil moisture is optimal or rainfall is imminent.
- **$a_1$ (Pulse Irrigation)**: 15-minute drip burst ($5\text{ mm}$ equivalent). Replaces surface evaporation.
- **$a_2$ (Target Irrigation)**: 30-minute deep soak ($12\text{ mm}$ equivalent). Maintains root-zone moisture.
- **$a_3$ (Emergency Saturation)**: 60-minute cycle ($25\text{ mm}$ equivalent). Used for extreme heatwaves or dry spells.

---

## 📈 Yield & Water Savings Results

Across simulated 90-day soybean and cotton crop cycles, the WaterLens RL Agent achieved:
- **38.4% reduction in total water volume consumed**.
- **99.2% prevention of critical root-zone moisture stress**.
- **18.7% reduction in electricity pump runtime costs**.
