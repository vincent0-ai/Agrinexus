import { useState } from "react";
import { User, Bell, Lock, Save, Globe } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { GREEN } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { api } from "@/services/api";

type Tab = "profile" | "notifications" | "security";

const COUNTIES = [
  'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay', 
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 
  'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 
  'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
].sort();

export function SettingsPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Profile State
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [county, setCounty] = useState(user?.county ?? "");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    setSaved(false);
    try {
      const res = await api.put("/auth/me", { full_name: fullName, email, county });
      if (res.success) {
        setUser(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(res.message || "Failed to update profile");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSaved(false);
    try {
      const res = await api.put("/auth/password", { current_password: currentPassword, new_password: newPassword });
      if (res.success) {
        setSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(res.message || "Failed to update password");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleSave = () => {
    if (activeTab === "profile") handleSaveProfile();
    else if (activeTab === "password") handleSavePassword();
    else if (activeTab === "security") handleSavePassword();
    else handleSaveNotifications();
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border overflow-x-auto [scrollbar-width:none]">
          <button 
            onClick={() => { setActiveTab("profile"); setErrorMsg(""); }}
            className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors", activeTab === "profile" ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground")}
            style={activeTab === "profile" ? { borderColor: GREEN, color: GREEN } : {}}
          >
            <User className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Profile Details
          </button>
          <button 
            onClick={() => { setActiveTab("notifications"); setErrorMsg(""); }}
            className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors", activeTab === "notifications" ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground")}
            style={activeTab === "notifications" ? { borderColor: GREEN, color: GREEN } : {}}
          >
            <Bell className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            Notifications
          </button>
          <button 
            onClick={() => { setActiveTab("security"); setErrorMsg(""); }}
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
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-foreground">Location / County</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select value={county} onChange={e => setCounty(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all appearance-none">
                      <option value="" disabled>Select a county</option>
                      {COUNTIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
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
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-4">
            {errorMsg && (
              <span className="text-sm font-medium text-red-500 flex-1">
                {errorMsg}
              </span>
            )}
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
