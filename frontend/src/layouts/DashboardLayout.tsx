import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
