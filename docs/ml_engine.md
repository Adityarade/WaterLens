# 🧠 ML & RL Engine Documentation - WaterLens Intelligence Layer

The **WaterLens Intelligence Layer** is the autonomous decision-making engine powering precision irrigation and crop optimization. Rather than relying on static timer-based watering, WaterLens employs mathematical soil physics combined with Reinforcement Learning (RL) agents.

---

## 🚀 Core Architecture

```
Telemetry (Moisture, Temp, Humidity, Weather)
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│             WaterLens RL Environment (Gymnasium)       │
│                                                        │
│  State: [Moisture_t, Temp_t, ET0, Rain_Forecast, Soil] │
│  Action: [Valve Actuator: 0=Off, 1=Light, 2=Deep]      │
│  Reward: + Yield Gain - Water Waste Penalty            │
└────────────────────────────────────────────────────────┘
                   │
                   ▼
       Optimal Irrigation Schedule & Actuation
```

---

## 1. 📐 Soil Physics & Evapotranspiration Modeling

The environment simulates continuous soil water balance using the **FAO-56 Penman-Monteith** evapotranspiration equation:

$$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$

### Soil Moisture Transition Function:
$$\theta_{t+1} = \theta_t + I_t + P_t - ET_c - D_t - RO_t$$

Where:
- $\theta_t$: Current volumetric soil water content (%)
- $I_t$: Irrigation applied by RL agent (mm)
- $P_t$: Precipitation / Rainfall forecast (mm)
- $ET_c = K_c \times ET_0$: Crop evapotranspiration adjusted for crop stage
- $D_t$: Deep percolation loss beyond root zone
- $RO_t$: Surface runoff

---

## 2. 🎯 Reinforcement Learning Reward Formulation

The RL Agent is trained to solve the dual optimization problem: **Maximize Crop Yield while Minimizing Water Consumption**.

### Reward Function:
$$R_t = R_{\text{health}}(\theta_t) - \lambda_{\text{water}} \cdot I_t - \lambda_{\text{stress}} \cdot \max(0, \theta_{\text{crit}} - \theta_t)^2$$

- **Optimal Moisture Zone ($\theta_{\text{opt}} \approx 40\% - 60\%$)**: Positive reward for keeping moisture in the sweet spot for root aeration and nutrient uptake.
- **Water Penalty ($\lambda_{\text{water}} = 0.15$)**: Discourages over-irrigation and reduces electricity/pumping costs.
- **Drought Stress Penalty ($\lambda_{\text{stress}} = 0.50$)**: Severe exponential penalty if moisture drops below wilting point ($\theta < 25\%$).

---

## 3. 🔬 State & Action Space

### Observation Space (5-Dimensional Continuous):
1. **Soil Moisture Content ($\theta$)**: $0.0 - 100.0\%$
2. **Ambient Temperature ($T$)**: $10^\circ\text{C} - 50^\circ\text{C}$
3. **Relative Humidity ($H$)**: $10\% - 100\%$
4. **Rainfall Forecast (Next 24h)**: $0.0 - 50.0\text{ mm}$
5. **Crop Growth Stage Factor ($K_c$)**: $0.4 - 1.2$

### Action Space (Discrete):
- `Action 0`: **Do Not Irrigate** (Valve closed)
- `Action 1`: **Low Irrigation Pulse** (15 minutes / 5 mm)
- `Action 2`: **Standard Irrigation** (30 minutes / 12 mm)
- `Action 3`: **Deep Irrigation** (60 minutes / 25 mm)

---

## 4. 🛡️ Fallback & Heuristic Safety Constraints
Even during offline execution or RL policy warmup, a deterministic safety wrapper guarantees that valves are automatically overridden if:
- Soil moisture exceeds $75\%$ (preventing root hypoxia and fungal disease).
- Rain forecast in the next 6 hours exceeds $15\text{ mm}$ (preventing nutrient leaching and water wastage).
