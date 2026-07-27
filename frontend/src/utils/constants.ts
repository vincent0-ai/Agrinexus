export const GREEN = "#2D6A4F";
export const AMBER = "#F4A261";
export const GEMINI_BLUE = "#4285F4";
export const DEEPSEEK_PURPLE = "#7C3AED";

export const USE_MOCK = false; // set false to hit live PHP API
const rawApiUrl = import.meta.env?.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL).replace(/^["']|["']$/g, '').trim() : "";
export const API_BASE_URL = rawApiUrl || "/api";

export const FARMER_NAV = [
  { id: "farmer-dashboard",    label: "Overview",           iconName: "LayoutDashboard" },
  { id: "product-management",  label: "My Products",        iconName: "Package"         },
  { id: "orders",              label: "Orders",             iconName: "ShoppingCart"    },
  { id: "iot-monitor",         label: "IoT Farm Monitor",   iconName: "Cpu"             },
  { id: "weather",             label: "Weather Forecast",   iconName: "CloudSun"        },
  { id: "ai-market",           label: "AI Market Analysis", iconName: "TrendingUp"      },
  { id: "ai-assistant",        label: "AI Assistant",       iconName: "Bot"             },
];

export const BUYER_NAV = [
  { id: "buyer-dashboard",  label: "Overview",         iconName: "LayoutDashboard" },
  { id: "product-listing",  label: "Browse Products",  iconName: "Package"         },
  { id: "orders",           label: "My Orders",        iconName: "ShoppingCart"    },
  { id: "product-listing",  label: "Saved Farmers",    iconName: "Heart"           },
];
