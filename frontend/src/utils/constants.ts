export const GREEN = "#2D6A4F";
export const AMBER = "#F4A261";

export const USE_MOCK = false; // set false to hit live PHP API
export const API_BASE_URL = "http://localhost/agrinexus";

export const FARMER_NAV = [
  { id: "farmer-dashboard",    label: "Overview",           iconName: "LayoutDashboard" },
  { id: "product-management",  label: "My Products",        iconName: "Package"         },
  { id: "orders",              label: "Orders",             iconName: "ShoppingCart"    },
  { id: "iot-monitor",         label: "IoT Farm Monitor",   iconName: "Cpu"             },
  { id: "weather",             label: "Weather Forecast",   iconName: "CloudSun"        },
  { id: "ai-market",           label: "AI Market Analysis", iconName: "TrendingUp"      },
];

export const BUYER_NAV = [
  { id: "buyer-dashboard",  label: "Overview",         iconName: "LayoutDashboard" },
  { id: "product-listing",  label: "Browse Products",  iconName: "Package"         },
  { id: "orders",           label: "My Orders",        iconName: "ShoppingCart"    },
  { id: "product-listing",  label: "Saved Farmers",    iconName: "Heart"           },
];
