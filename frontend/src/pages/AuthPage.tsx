// import { useState } from "react";
// import { Leaf, ShoppingBag } from "lucide-react";
// import { cn } from "@/utils/cn";
// import { GREEN } from "@/utils/constants";
// import { useAuth } from "@/context/AuthContext";

// export function AuthPage() {
//   const { setPage, setRole } = useAuth();
//   const [mode, setMode] = useState<"login" | "register">("login");
//   const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">("farmer");

//   const handleSubmit = () => {
//     setRole(selectedRole);
//     setPage(selectedRole === "farmer" ? "farmer-dashboard" : "buyer-dashboard");
//   };

//   return (
//     <div className="h-screen grid grid-cols-2 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
//       {/* Left panel */}
//       <div className="relative flex flex-col items-center justify-center p-12 overflow-hidden" style={{ background: GREEN }}>
//         <div className="absolute inset-0">
//           <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=900&fit=crop&auto=format" alt="Farm landscape at golden hour" className="w-full h-full object-cover opacity-20" />
//         </div>
//         <div className="relative z-10 text-center">
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F4A261" }}>
//               <Leaf className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-3xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AgriNexus</span>
//           </div>
//           <p className="text-xl text-white/80 font-medium mb-3">From Farm to Market, Digitally.</p>
//           <p className="text-sm text-white/50 max-w-xs leading-relaxed">Join 12,000+ farmers and buyers transforming agriculture across Kenya.</p>
//           <div className="mt-10 grid grid-cols-3 gap-6">
//             {[["12K+", "Farmers"], ["8K+", "Buyers"], ["KSh 2B+", "Transacted"]].map(([v, l]) => (
//               <div key={l} className="text-center">
//                 <p className="text-2xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</p>
//                 <p className="text-xs text-white/40 mt-1">{l}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right panel */}
//       <div className="flex flex-col items-center justify-center p-12 bg-white overflow-y-auto [scrollbar-width:none]">
//         <div className="w-full max-w-sm">
//           <h2 className="text-2xl font-black mb-1 text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//             {mode === "login" ? "Welcome back" : "Create account"}
//           </h2>
//           <p className="text-sm text-muted-foreground mb-6">
//             {mode === "login" ? "Sign in to your AgriNexus account" : "Start your agricultural journey today"}
//           </p>
//           <div className="flex gap-1 bg-muted rounded-xl p-1 mb-7">
//             {(["login", "register"] as const).map((m) => (
//               <button key={m} onClick={() => setMode(m)} className={cn("flex-1 py-2 rounded-lg text-sm font-semibold transition-all", mode === m ? "bg-white shadow text-foreground" : "text-muted-foreground")}>
//                 {m === "login" ? "Sign In" : "Register"}
//               </button>
//             ))}
//           </div>

//           {mode === "login" ? (
//             <div className="space-y-4">
//               {[["Email Address", "email", "farmer@example.com"], ["Password", "password", "••••••••"]].map(([label, type, ph]) => (
//                 <div key={label as string}>
//                   <label className="block text-sm font-bold text-foreground mb-1.5">{label}</label>
//                   <input type={type as string} placeholder={ph as string} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
//                 </div>
//               ))}
//               <div className="text-right"><a href="#" className="text-xs font-medium" style={{ color: GREEN }}>Forgot password?</a></div>
//               <div>
//                 <p className="text-xs font-semibold text-muted-foreground mb-2">Sign in as:</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   {(["farmer", "buyer"] as const).map((r) => (
//                     <button key={r} onClick={() => setSelectedRole(r)} className={cn("py-3.5 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-1.5 transition-all", selectedRole === r ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-emerald-300")} style={selectedRole === r ? { background: GREEN, borderColor: GREEN } : {}}>
//                       {r === "farmer" ? <Leaf className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
//                       <span className="capitalize">{r}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <button onClick={handleSubmit} className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90" style={{ background: GREEN }}>Sign In</button>
//               <p className="text-xs text-center text-muted-foreground">
//                 Don&apos;t have an account? <button onClick={() => setMode("register")} className="font-bold" style={{ color: GREEN }}>Create one</button>
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-bold text-foreground mb-1.5">Full Name</label>
//                 <input type="text" placeholder="Wanjiku Njoroge" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-foreground mb-1.5">Email Address</label>
//                 <input type="email" placeholder="farmer@example.com" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div><label className="block text-sm font-bold text-foreground mb-1.5">Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" /></div>
//                 <div><label className="block text-sm font-bold text-foreground mb-1.5">Confirm</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none" /></div>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-foreground mb-2">I am a:</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   {(["farmer", "buyer"] as const).map((r) => (
//                     <button key={r} onClick={() => setSelectedRole(r)} className={cn("py-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-2 transition-all", selectedRole === r ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-emerald-300")} style={selectedRole === r ? { background: GREEN } : {}}>
//                       {r === "farmer" ? <Leaf className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
//                       <span className="capitalize">{r}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <button onClick={handleSubmit} className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90" style={{ background: GREEN }}>Create Account</button>
//               <p className="text-xs text-center text-muted-foreground">
//                 Already have an account? <button onClick={() => setMode("login")} className="font-bold" style={{ color: GREEN }}>Sign in</button>
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Leaf, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import { GREEN } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">("farmer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [county, setCounty] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    if (!res.success) setError(res.message ?? "Login failed");
    setLoading(false);
  };

  const handleRegister = async () => {
    setError("");
    if (!fullName || !regEmail || !regPassword || !regConfirm || !county) {
      setError("Please fill in all fields");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const res = await register({
      full_name: fullName,
      email: regEmail,
      password: regPassword,
      role: selectedRole,
      county,
    });
    if (!res.success) setError(res.message ?? "Registration failed");
    setLoading(false);
  };

  return (
    <div className="h-screen grid grid-cols-2 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left panel */}
      <div className="relative flex flex-col items-center justify-center p-12 overflow-hidden" style={{ background: GREEN }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=900&fit=crop&auto=format" alt="Farm landscape at golden hour" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F4A261" }}>
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AgriNexus</span>
          </div>
          <p className="text-xl text-white/80 font-medium mb-3">From Farm to Market, Digitally.</p>
          <p className="text-sm text-white/50 max-w-xs leading-relaxed">Join 12,000+ farmers and buyers transforming agriculture across Kenya.</p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[["12K+", "Farmers"], ["8K+", "Buyers"], ["KSh 2B+", "Transacted"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</p>
                <p className="text-xs text-white/40 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center p-12 bg-white overflow-y-auto [scrollbar-width:none]">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-black mb-1 text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Sign in to your AgriNexus account" : "Start your agricultural journey today"}
          </p>

          <div className="flex gap-1 bg-muted rounded-xl p-1 mb-7">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} className={cn("flex-1 py-2 rounded-lg text-sm font-semibold transition-all", mode === m ? "bg-white shadow text-foreground" : "text-muted-foreground")}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div className="text-right">
                <a href="#" className="text-xs font-medium" style={{ color: GREEN }}>Forgot password?</a>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Sign in as:</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["farmer", "buyer"] as const).map((r) => (
                    <button key={r} onClick={() => setSelectedRole(r)} className={cn("py-3.5 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-1.5 transition-all", selectedRole === r ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-emerald-300")} style={selectedRole === r ? { background: GREEN, borderColor: GREEN } : {}}>
                      {r === "farmer" ? <Leaf className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: GREEN }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account? <button onClick={() => setMode("register")} className="font-bold" style={{ color: GREEN }}>Create one</button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Wanjiku Njoroge"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">County</label>
                <input
                  type="text"
                  placeholder="e.g. Nairobi, Nakuru, Kisumu"
                  value={county}
                  onChange={e => setCounty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Confirm</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">I am a:</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["farmer", "buyer"] as const).map((r) => (
                    <button key={r} onClick={() => setSelectedRole(r)} className={cn("py-4 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-2 transition-all", selectedRole === r ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-emerald-300")} style={selectedRole === r ? { background: GREEN } : {}}>
                      {r === "farmer" ? <Leaf className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: GREEN }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <p className="text-xs text-center text-muted-foreground">
                Already have an account? <button onClick={() => setMode("login")} className="font-bold" style={{ color: GREEN }}>Sign in</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}