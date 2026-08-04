import { useState } from "react";
import { User, Bell, Lock, Save, Globe } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { GREEN } from "@/utils/constants";
import { cn } from "@/utils/cn";

type Tab = "profile" | "notifications" | "security";

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border overflow-x-auto [scrollbar-width:none]">
          <button 
            onClick={() => setActiveTab("profile")}
            className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors", activeTab === "profile" ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground")}
            style={activeTab === "profile" ? { borderColor: GREEN, color: GREEN } : {}}
          >
            <User className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Profile Details
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors", activeTab === "notifications" ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground")}
            style={activeTab === "notifications" ? { borderColor: GREEN, color: GREEN } : {}}
          >
            <Bell className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors", activeTab === "security" ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground")}
            style={activeTab === "security" ? { borderColor: GREEN, color: GREEN } : {}}
          >
            <Lock className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Security & Password
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground font-display">Personal Information</h3>
                <p className="text-sm text-muted-foreground mt-1">Update your basic profile information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Full Name</label>
                  <input type="text" defaultValue={user?.full_name} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-foreground">Location / County</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" defaultValue={user?.county} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground font-display">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage what alerts you receive and how.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Order Updates", desc: "Get notified when order statuses change" },
                  { title: "Market Alerts", desc: "Receive alerts for high demand or price shifts" },
                  { title: "AI Assistant Summaries", desc: "Weekly digests from your AgriNexus AI" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ backgroundColor: GREEN }}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground font-display">Change Password</h3>
                <p className="text-sm text-muted-foreground mt-1">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-3">
            {saved && (
              <span className="text-sm font-medium text-emerald-600 animate-in fade-in">
                Settings saved successfully!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: GREEN }}
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
