// import { Bell } from "lucide-react";
// import { GREEN, AMBER } from "@/utils/constants";
// import { useAuth } from "@/context/AuthContext";

// interface TopbarProps {
//   title: string;
// }
// export function Topbar({ title }: TopbarProps) {
//   const { role, user } = useAuth();

//   const initials = user?.full_name
//     ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
//     : "??";

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
//             {initials}
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-foreground leading-tight">{user?.full_name ?? "User"}</p>
//             <p className="text-xs text-muted-foreground capitalize leading-tight">{role}</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { GREEN, AMBER } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { role, user } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const firstName = user?.full_name?.split(" ")[0] ?? "User";

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/50 bg-background/80 px-8 backdrop-blur-xl">

      {/* Left */}
      <div className="space-y-1">
        <h1
          className="text-2xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-yellow-500" />

          <span>
            Welcome back,
            <span className="ml-1 font-semibold text-foreground">
              {firstName}
            </span>
          </span>

          <span className="opacity-40">•</span>

          <CalendarDays className="h-4 w-4" />

          <span>{today}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">

          <Bell className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />

          <span
            className="absolute right-2 top-2 flex h-3 w-3"
          >
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: AMBER }}
            />

            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ background: AMBER }}
            />
          </span>
        </button>

        {/* Profile */}
        <button className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">

          {/* Avatar */}
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, #34d399)`,
            }}
          >
            {initials}

            {/* Online */}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-card bg-emerald-500" />
          </div>

          {/* User */}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-none text-foreground">
              {user?.full_name ?? "User"}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium capitalize text-emerald-600">
                {role}
              </span>

              <span className="text-xs text-muted-foreground">
                Online
              </span>
            </div>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground transition group-hover:rotate-180" />
        </button>
      </div>
    </header>
  );
}
