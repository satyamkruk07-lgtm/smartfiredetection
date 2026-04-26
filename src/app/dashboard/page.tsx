
"use client"

import React, { useState, useEffect } from 'react';
import { Activity, Bell, Flame, Navigation, Thermometer, Wind, Droplets, Cpu, AlertTriangle, FileText, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import Sidebar, { DashboardSection } from '@/components/dashboard/Sidebar';
import ThreeBuilding from '@/components/ThreeBuilding';
import DroneBay from '@/components/DroneBay';
import SensorShowcase from '@/components/SensorShowcase';
import * as THREE from 'three';

const mockRooms = [
  { id: '101', pos: [-6, 0, -6] as [number, number, number], status: 'safe' as const, label: 'Sector 101' },
  { id: '102', pos: [0, 0, -6] as [number, number, number], status: 'smoke' as const, label: 'Storage A' },
  { id: '103', pos: [6, 0, -6] as [number, number, number], status: 'safe' as const, label: 'Sector 103' },
  { id: '104', pos: [-6, 0, 0] as [number, number, number], status: 'fire' as const, label: 'Lab 104' },
  { id: '105', pos: [0, 0, 0] as [number, number, number], status: 'safe' as const, label: 'Hub Center' },
  { id: '106', pos: [6, 0, 0] as [number, number, number], status: 'safe' as const, label: 'Exit Hall' },
  { id: '107', pos: [-6, 0, 6] as [number, number, number], status: 'safe' as const, label: 'Sector 107' },
  { id: '108', pos: [0, 0, 6] as [number, number, number], status: 'smoke' as const, label: 'Server Room' },
  { id: '109', pos: [6, 0, 6] as [number, number, number], status: 'safe' as const, label: 'Sector 109' },
];

const dronePathMock = [
  new THREE.Vector3(6, 4, 6),
  new THREE.Vector3(0, 4, 6),
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(-6, 4, 0),
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(0, 4, -6),
  new THREE.Vector3(6, 4, -6),
  new THREE.Vector3(6, 4, 0),
  new THREE.Vector3(10, 4, 0),
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>('Dashboard');
  const [sysStatus, setSysStatus] = useState('MONITORING');

  useEffect(() => {
    setMounted(true);
    const statuses = ['FIRE DETECTED', 'DRONE ACTIVATED', 'PATH CALCULATED', 'EVACUATION LIVE'];
    let i = 0;
    const interval = setInterval(() => {
        setSysStatus(statuses[i]);
        i = (i + 1) % statuses.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
      case 'Building Map':
        return (
          <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0c0e] shadow-2xl flex flex-col group">
            <div className="absolute top-8 left-8 z-10 space-y-3 pointer-events-none">
              <div className="glass px-5 py-2.5 rounded-xl flex items-center gap-3 border-tech-cyan/20">
                <Navigation size={16} className="text-tech-cyan animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">Tactical Building Map</span>
              </div>
              <div className="glass px-5 py-2.5 rounded-xl flex items-center gap-3 border-red-500/30">
                <Flame size={16} className="text-red-500" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500">Live Hazard Matrix</span>
              </div>
            </div>
            <div className="flex-1 bg-[radial-gradient(circle_at_center,_rgba(31,102,173,0.08)_0%,_transparent_80%)]">
              {mounted && <ThreeBuilding rooms={mockRooms} dronePath={dronePathMock} />}
            </div>
          </div>
        );
      
      case 'Sensors':
        return (
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="h-[45%] glass rounded-[2rem] border-white/5 overflow-hidden relative group bg-[#080a0c]">
               <div className="absolute top-8 left-8 z-10 space-y-2">
                  <div className="glass px-4 py-2 rounded-xl border-tech-cyan/20 flex items-center gap-3">
                    <Activity size={16} className="text-tech-cyan animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-white">IoT Hardware - Real-time Visualization</span>
                  </div>
                  <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">ESP32 • DHT22 • MQ-2 Matrix</div>
               </div>
               <SensorShowcase />
            </div>
            <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                <Activity className="text-tech-cyan" size={24} /> Telemetry Matrix
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Ambient Temp (DHT22)', val: '78.6°C', icon: Thermometer, color: 'text-red-500' },
                  { label: 'Aerosol Density (DHT22)', val: '92%', icon: Wind, color: 'text-yellow-500' },
                  { label: 'Gas Concentration (MQ-2)', val: '350 ppm', icon: Droplets, color: 'text-tech-cyan' },
                  { label: 'O2 Saturation (MQ-2)', val: '18.4%', icon: Activity, color: 'text-blue-500' },
                  { label: 'Thermal Flux (DHT22)', val: '1.2 kW/m²', icon: Flame, color: 'text-orange-500' },
                  { label: 'ESP32 Connectivity', val: '99.9%', icon: Cpu, color: 'text-green-500' },
                ].map((s, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                        <s.icon size={24} />
                      </div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Live Node</span>
                    </div>
                    <div className="text-xs font-bold text-white/50 uppercase mb-1">{s.label}</div>
                    <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Drones':
        return (
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="h-1/2 glass rounded-[2rem] border-white/5 overflow-hidden relative group bg-[#080a0c]">
               <div className="absolute top-8 left-8 z-10 space-y-2">
                  <div className="glass px-4 py-2 rounded-xl border-tech-cyan/20 flex items-center gap-3">
                    <Cpu size={16} className="text-tech-cyan animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-white">Hangar Bay 07 - Diagnostics</span>
                  </div>
                  <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Autonomous Tactical Units</div>
               </div>
               <DroneBay />
            </div>
            <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                <ShieldCheck className="text-tech-cyan" size={24} /> Operational Conditions
              </h2>
              <div className="grid gap-6">
                {[
                  { id: 1, name: 'Unit-01 (Specter)', status: 'Active', battery: 78, task: 'Evacuation Guidance' },
                  { id: 2, name: 'Unit-02 (Wraith)', status: 'Charging', battery: 42, task: 'Recharging Protocol' },
                  { id: 3, name: 'Unit-03 (Ghost)', status: 'Standby', battery: 100, task: 'Ready for Deployment' },
                ].map((d) => (
                  <div key={d.id} className="glass p-6 rounded-3xl border-white/10 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center relative overflow-hidden ${d.status === 'Active' ? 'bg-tech-cyan/10 border-tech-cyan/20 text-tech-cyan' : d.status === 'Charging' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                         <Cpu size={24} />
                      </div>
                      <div>
                        <div className="text-lg font-black uppercase text-white">{d.name}</div>
                        <div className="text-[10px] text-tech-cyan font-bold uppercase tracking-widest">{d.task}</div>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1 text-[9px] text-white/50 font-bold uppercase">
                             <Activity size={12} className={d.status === 'Active' ? 'text-green-500' : 'text-white/20'} /> Core Integrity 100%
                           </div>
                           <div className="flex items-center gap-1 text-[9px] text-white/50 font-bold uppercase">
                             <Thermometer size={12} className="text-tech-cyan" /> 32.4°C
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <div className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Active' ? 'bg-tech-cyan text-black' : d.status === 'Charging' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>
                        {d.status}
                      </div>
                      <div className="flex items-center justify-end gap-3">
                         <span className="text-xs font-black text-white/60">{d.battery}%</span>
                         <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${d.battery < 30 ? 'bg-red-500' : 'bg-tech-cyan'}`} style={{ width: `${d.battery}%` }} />
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Alerts':
        return (
          <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
              <Bell className="text-red-500" size={32} /> Incident Log
            </h2>
            <div className="space-y-4">
              {[
                { type: 'CRITICAL', msg: 'Flashover Protocol in Sector 104', time: '14:22:01', color: 'border-red-500/50 bg-red-500/5' },
                { type: 'WARNING', msg: 'Smoke Threshold Exceeded in Server Room', time: '14:20:45', color: 'border-yellow-500/50 bg-yellow-500/5' },
                { type: 'SYSTEM', msg: 'Drone Unit-01 Initialized', time: '14:19:12', color: 'border-tech-cyan/50 bg-tech-cyan/5' },
                { type: 'SYSTEM', msg: 'Evacuation Path Calculated', time: '14:18:30', color: 'border-white/20 bg-white/5' },
              ].map((a, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border flex items-center justify-between ${a.color}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${a.type === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70'}`}>
                      {a.type}
                    </div>
                    <div className="text-sm font-bold text-white/90">{a.msg}</div>
                  </div>
                  <div className="text-[10px] font-mono text-white/40">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Reports':
        return (
          <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
              <FileText className="text-tech-cyan" size={32} /> Analytics Engine
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-center justify-center text-center">
                 <div className="text-6xl font-black text-tech-cyan mb-2">09</div>
                 <div className="text-xs font-black uppercase tracking-widest text-white/40">Active Rooms</div>
              </div>
              <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-center justify-center text-center">
                 <div className="text-6xl font-black text-red-500 mb-2">01</div>
                 <div className="text-xs font-black uppercase tracking-widest text-white/40">Critical Hazards</div>
              </div>
              <div className="col-span-2 glass p-8 rounded-[2rem] border-white/5">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Evacuation Efficiency</h3>
                    <span className="text-xl font-black text-tech-cyan">94%</span>
                 </div>
                 <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                    <div className="h-full bg-gradient-to-r from-tech-cyan to-blue-600 rounded-full shadow-[0_0_15px_rgba(94,222,255,0.4)]" style={{ width: '94%' }} />
                 </div>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
              <SettingsIcon className="text-white/60" size={32} /> System Configuration
            </h2>
            <div className="max-w-xl space-y-6">
              {[
                { label: 'System Autonomous Power', desc: 'Allows AI to initiate drone protocols without manual confirmation.', checked: true },
                { label: 'Global Alert Audio', desc: 'Activates high-decibel structural sirens during critical events.', checked: true },
                { label: 'Real-time Telemetry Broadcast', desc: 'Streams sensor data to external rescue services.', checked: false },
                { label: 'Manual Drone Override', desc: 'Enables joystick control for response units.', checked: false },
              ].map((s, idx) => (
                <div key={idx} className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{s.label}</div>
                    <div className="text-xs text-white/40 leading-tight">{s.desc}</div>
                  </div>
                  <div className={`w-12 h-6 rounded-full border border-white/20 p-1 cursor-pointer transition-colors ${s.checked ? 'bg-tech-cyan/30' : 'bg-white/5'}`}>
                    <div className={`w-4 h-4 rounded-full transition-transform ${s.checked ? 'translate-x-6 bg-tech-cyan shadow-[0_0_8px_#5EDEFF]' : 'translate-x-0 bg-white/20'}`} />
                  </div>
                </div>
              ))}
              <button className="w-full py-4 bg-tech-cyan text-black font-black uppercase text-xs rounded-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-tech-cyan/20">
                Save System Config
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#05070a] text-white">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Dynamic Status Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0c0e]/60 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${sysStatus === 'FIRE DETECTED' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-tech-cyan shadow-[0_0_10px_#5EDEFF]'}`} />
              <div className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {sysStatus}
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              <Activity size={14} className="text-tech-cyan" />
              <span>Alpha Sector 07 <span className="text-white ml-2">Live Feed</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all border-white/5 relative">
              <Bell size={18} className="text-tech-cyan" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            </button>
            <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-full border-white/10">
               <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" className="w-6 h-6 rounded-full border border-tech-cyan/30" />
               <span className="text-[10px] font-bold uppercase tracking-tighter text-white">CMD. STRICKLAND</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
          
          {/* Main Dynamic Panel */}
          {renderContent()}

          {/* Right Information Panel - Persistent Context */}
          <aside className="lg:w-[340px] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
            
            {/* ALERT BOX */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-red-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity animate-pulse" />
              <div className="relative glass p-6 rounded-[2rem] border-red-500/50 bg-red-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/40">
                    <AlertTriangle size={24} className="animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black text-red-500 tracking-widest bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30 uppercase">Priority Alpha</span>
                </div>
                <h4 className="text-xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">FIRE DETECTED</h4>
                <div className="flex items-center gap-2 mb-4">
                   <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold text-white/70 uppercase">Room 104</span>
                   <span className="px-2 py-0.5 bg-red-500/20 rounded text-[9px] font-bold text-red-400 uppercase tracking-tighter">Extreme Temp</span>
                </div>
                <p className="text-xs text-red-200/70 font-medium mb-6 leading-relaxed">Structural integrity at 64% in Laboratory 104. Autonomous response protocol Aegis-7 initiated.</p>
                <button className="w-full py-4 bg-red-500 text-white text-[11px] font-black rounded-xl hover:bg-red-600 transition-all shadow-xl uppercase tracking-[0.2em] active:scale-95">
                  Manual Override
                </button>
              </div>
            </div>

            {/* QUICK TELEMETRY */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-tech-cyan/60 ml-2">Quick Stats</h3>
              <div className="grid gap-3">
                <div className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
                      <Thermometer size={18} />
                    </div>
                    <span className="text-xs font-bold text-white/70">78.6°C</span>
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Internal</span>
                </div>
                <div className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-tech-cyan/10 rounded-xl text-tech-cyan group-hover:scale-110 transition-transform">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-xs font-bold text-white/70">94%</span>
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Safe Exit</span>
                </div>
              </div>
            </div>

            {/* DRONE STATUS */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-tech-cyan/60 ml-2">Active Units</h3>
              <div className="glass p-5 rounded-[2rem] border-tech-cyan/20 bg-tech-cyan/5 group transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-tech-cyan/20 rounded-xl text-tech-cyan shadow-[0_0_10px_rgba(94,222,255,0.2)]">
                      <Cpu size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white">Unit-01</div>
                      <div className="text-[9px] text-tech-cyan font-bold uppercase tracking-widest opacity-80">En Route</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-tech-cyan text-black text-[9px] font-black rounded-full uppercase">Active</div>
                </div>
                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-tech-cyan shadow-[0_0_10px_#5EDEFF]" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-tech-cyan">
                    <span>Battery</span>
                    <span>78%</span>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </main>
      </div>
      
      {/* Tactical Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[9999] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
