import React from 'react';
import { LayoutDashboard, Map, Activity, Disc as Drone, Bell, FileText, Settings, Shield } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Map, label: 'Building Map' },
  { icon: Activity, label: 'Sensors' },
  { icon: Drone, label: 'Drones' },
  { icon: Bell, label: 'Alerts' },
  { icon: FileText, label: 'Reports' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-white/5 h-screen flex flex-col bg-[#111417]/50 backdrop-blur-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-tech-blue rounded-lg glow-border">
          <Shield className="text-tech-cyan" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tighter leading-none">AEGIS</h1>
          <p className="text-[10px] text-tech-cyan uppercase tracking-[0.2em] font-medium">Prime Path</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group ${
              item.active 
                ? 'bg-tech-blue/20 text-tech-cyan border border-tech-cyan/20' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} className={item.active ? 'text-tech-cyan' : 'group-hover:text-white'} />
            <span className="font-medium">{item.label}</span>
            {item.label === 'Alerts' && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="glass p-4 rounded-xl border-white/5 text-[10px] text-muted-foreground">
          <p className="uppercase tracking-widest mb-1">System Version</p>
          <p className="font-mono">v2.4.0-STABLE</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-green-500 uppercase tracking-tighter font-bold">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
