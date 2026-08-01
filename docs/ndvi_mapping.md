# 🗺️ Thermal & NDVI Farm Zoning Engine

WaterLens provides precision agricultural zoning by computing vegetation vigor and surface thermal stress across discrete agricultural sub-plots.

---

## 🛰️ Multispectral Remote Sensing Indices

### 1. Normalized Difference Vegetation Index (NDVI)

$$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$

- **Range**: $-1.0 \text{ to } +1.0$
- **Interpretation**:
  - $\text{NDVI} > 0.65$: Dense, healthy green biomass (High chlorophyll).
  - $0.35 \le \text{NDVI} \le 0.65$: Moderate vegetation cover or early vegetative growth.
  - $\text{NDVI} < 0.35$: Stressed crop, sparse canopy, or bare soil.

### 2. Thermal Surface Stress Index (CWSI - Crop Water Stress Index)

$$\text{CWSI} = \frac{(T_c - T_a) - (T_c - T_a)_{\text{lower}}}{(T_c - T_a)_{\text{upper}} - (T_c - T_a)_{\text{lower}}}$$

Where:
- $T_c$: Canopy temperature measured by infrared thermal sensor
- $T_a$: Ambient air temperature
- $(T_c - T_a)_{\text{lower}}$: Baseline canopy temperature under non-water-stressed conditions (fully transpiring)
- $(T_c - T_a)_{\text{upper}}$: Baseline canopy temperature when stomata are fully closed (severe water stress)

---

## 📍 Interactive Farm Map Features

1. **Polygon Sub-Plot Zoning**: Divides the farm into discrete quadrants (e.g. Zone A - North Field, Zone B - Drip Block, Zone C - Orchard).
2. **Dynamic Heatmap Shading**: Color-codes zones from vibrant green (Optimal) to amber (Warning) to red (Critical Stress).
3. **Localized Valve Telemetry**: Clicking or tapping any zone on desktop or mobile brings up instant moisture levels, canopy temperature, and one-tap localized valve activation.
