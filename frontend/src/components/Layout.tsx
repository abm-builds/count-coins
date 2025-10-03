import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop/tablet */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="md:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      <BottomNav />
    </div>
  );
};
