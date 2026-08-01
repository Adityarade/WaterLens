# 📱 Progressive Web App (PWA) & Offline Architecture

WaterLens is engineered as an installable **Progressive Web App (PWA)**, bridging the gap between web platforms and native mobile applications without requiring App Store or Google Play Store downloads.

---

## 🚀 Key PWA Capabilities

1. **1-Tap Device Installation**:
   - Android, iOS, Windows, macOS, and Linux devices automatically detect the web app manifest and provide an **"Install App"** prompt.
   - Installed apps launch in standalone fullscreen mode without browser navigation chrome.

2. **Service Worker Offline Caching (`public/sw.js`)**:
   - Uses a **Cache-First** strategy for core static assets (HTML, CSS, JS, SVG icons, brand images).
   - Uses a **Network-First with Fallback** strategy for API endpoints (`/api/*`), ensuring fresh sensor updates when connected while serving cached agronomic emergency guidelines when offline in the field.

3. **Mobile-First Touch Ergonomics**:
   - Bottom navigation touch bar for thumb-friendly one-handed usage.
   - Slide-up modal drawers for auxiliary features (Settings, Crop Doctor, RL Agent).
   - High-contrast outdoor readability mode with dark & light theme support.

---

## 🛠️ Service Worker Registration Flow

```javascript
// main.jsx
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker Registered successfully.'))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
```
