// import { Bell } from "lucide-react";
// import { GREEN, AMBER } from "@/utils/constants";
// import { useAuth } from "@/context/AuthContext";

// interface TopbarProps {
//   title: string;
// }

// const PROFILES = {
//   farmer: { initials: "WN", name: "Wanjiku Njoroge" },
//   buyer:  { initials: "JO", name: "James Omondi"   },
// };

// export function Topbar({ title }: TopbarProps) {
//   const { role } = useAuth();
//   const profile = PROFILES[role as "farmer" | "buyer"] ?? PROFILES.farmer;

//   return (
//     <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
//       <h1 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//         {title}
//       </h1>
//       <div className="flex items-center gap-3">
//         <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
//           <Bell className="w-4 h-4 text-muted-foreground" />
//           <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
//         </button>
//         <div className="flex items-center gap-2 pl-2 border-l border-border">
//           <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: GREEN }}>
//             {profile.initials}
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-foreground leading-tight">{profile.name}</p>
//             <p className="text-xs text-muted-foreground capitalize leading-tight">{role}</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import { Bell } from "lucide-react";
import { GREEN, AMBER } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { role, user } = useAuth();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
      <h1 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: GREEN }}>
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">{user?.full_name ?? "User"}</p>
            <p className="text-xs text-muted-foreground capitalize leading-tight">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}