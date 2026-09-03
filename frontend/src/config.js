// Dynamic API Configuration for FasalRakshak AI
// Automatically adapts to local machine, LAN/Wi-Fi mobile testing, or cloud deployments.

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    // If deployed on Vercel or cloud provider without explicit API URL, use same-origin relative path
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      return '';
    }
    // If accessed from a mobile phone / tablet on the same Wi-Fi network:
    return `http://${hostname}:8000`;
  }
  
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
