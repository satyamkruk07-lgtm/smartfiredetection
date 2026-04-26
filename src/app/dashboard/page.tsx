
"use client"

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, Bell, Search, Activity, Cpu, Navigation, Flame, CheckCircle, Wind, Thermometer, Droplets, Battery } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import ThreeBuilding from '@/components/ThreeBuilding';
import * as THREE from 'three';

const mockRooms = [
  { id: '101', pos: [-4, 0, -4] as [number, number, number], status: 'safe' as const, label: 'Room 101' },
  { id: '102', pos: [0, 0, -4] as [number, number, number], status: 'smoke' as const, label: 'Room 102' },
  { id: '103', pos: [4, 0, -4] as [number, number, number], status: 'safe' as const, label: 'Room 103' },
  { id: '104', pos: [-4, 0, 0] as [number, number, number], status: 'fire' as const, label: 'Room 104' },
  { id: '105', pos: [0, 0, 0] as [number, number, number], status: 'safe' as const, label: 'Room 105' },
  { id: '106', pos: [4, 0, 0] as [number, number, number], status: 'safe' as const, label: 'Room 106' },
  { id: '107', pos: [-4, 0, 4] as [number, number, number], status: 'safe' as const, label: 'Room 107' },
  { id: '108', pos: [0, 0, 4] as [number, number, number], status: 'smoke' as const, label: 'Room 108' },
  { id: '109', pos: [4, 0, 4] as [number, number, number], status: 'safe' as const, label: 'Room 109' },
];

const dronePathMock = [
  new THREE.Vector3(8, 4, 8), // Starting high
  new THREE.Vector3(0, 3, 4),
  new THREE.Vector3(-4, 3, 0), // Near fire
  new THREE.Vector3(0, 3, 0),
  new THREE.Vector3(8, 3, 0),  // Exit
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#05070a] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Dynamic Status Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0c0e]/60 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${sysStatus === 'FIRE DETECTED' ? 'bg-red-500 animate-pulse' : 'bg-tech-cyan'}`} />
              <div className="text-xs font-black uppercase tracking-[0.2em]">
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
            <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all border-white/5">
              <Bell size={18} className="text-tech-cyan" />
            </button>
            <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-full border-white/10">
               <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" className="w-6 h-6 rounded-full" />
               <span className="text-[10px] font-bold uppercase">CMD. STRICKLAND</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
          
          {/* Central 3D Panel */}
          <div className="flex-[3] relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0c0e] shadow-2xl flex flex-col">
            <div className="absolute top-8 left-8 z-10 space-y-3 pointer-events-none">
              <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-3 border-tech-cyan/20">
                <Navigation size={16} className="text-tech-cyan animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">Tactical Map 3D</span>
              </div>
              <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-3 border-red-500/30">
                <Flame size={16} className="text-red-500" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500">Hazard Detected</span>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 z-10">
              <div className="glass p-4 rounded-3xl border-white/10 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[10px] uppercase font-bold text-white/70">Fire Zone</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-[10px] uppercase font-bold text-white/70">Smoke Alert</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] uppercase font-bold text-white/70">Safe Area</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[radial-gradient(circle_at_center,_rgba(31,102,173,0.05)_0%,_transparent_80%)]">
              {mounted && (
                <ThreeBuilding rooms={mockRooms} dronePath={dronePathMock} />
              )}
            </div>
          </div>

          {/* Right Information Panel */}
          <aside className="lg:w-[320px] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* ALERT BOX */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-red-500 rounded-[2.5rem] blur-xl opacity-20 animate-pulse" />
              <div className="relative glass p-6 rounded-[2.5rem] border-red-500/50 bg-red-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/40">
                    <AlertTriangle size={24} className="animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black text-red-500 tracking-widest bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30 uppercase">Priority Alpha</span>
                </div>
                <h4 className="text-xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">FIRE DETECTED</h4>
                <p className="text-xs text-red-200 font-medium mb-5 leading-relaxed">Structural integrity at 64% in Sector 104. Autonomous response initiated.</p>
                <button className="w-full py-4 bg-red-500 text-white text-[11px] font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl uppercase tracking-[0.2em]">
                  Override Protocol
                </button>
              </div>
            </div>

            {/* SENSOR STATUS */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-tech-cyan/60 ml-2">Internal Telemetry</h3>
              <div className="grid gap-3">
                <div className="glass p-4 rounded-3xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
                      <Thermometer size={18} />
                    </div>
                    <span className="text-xs font-bold text-white/70">Temperature</span>
                  </div>
                  <span className="text-lg font-black text-red-500">78.6°C</span>
                </div>
                <div className="glass p-4 rounded-3xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500">
                      <Wind size={18} />
                    </div>
                    <span className="text-xs font-bold text-white/70">Smoke Density</span>
                  </div>
                  <span className="text-lg font-black text-yellow-500 uppercase">High</span>
                </div>
                <div className="glass p-4 rounded-3xl border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-tech-cyan">
                      <Droplets size={18} />
                    </div>
                    <span className="text-xs font-bold text-white/70">Gas Concentration</span>
                  </div>
                  <span className="text-lg font-black text-white">350 ppm</span>
                </div>
              </div>
            </div>

            {/* DRONE STATUS */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-tech-cyan/60 ml-2">Response Units</h3>
              <div className="glass p-5 rounded-[2.5rem] border-tech-cyan/20 bg-tech-cyan/5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-tech-cyan/20 rounded-xl text-tech-cyan">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white">Drone 01</div>
                      <div className="text-[10px] text-tech-cyan font-bold uppercase tracking-widest">Autonomous</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-tech-cyan text-black text-[9px] font-black rounded-full uppercase">Active</div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-white/50">
                      <span>Battery Status</span>
                      <span>78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-tech-cyan shadow-[0_0_10px_#5EDEFF]" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation size={14} className="text-tech-cyan" />
                      <span className="text-[10px] font-bold text-white/60 uppercase">En Route</span>
                    </div>
                    <span className="text-[10px] font-mono text-tech-cyan">ETA: 02:14</span>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </main>
      </div>
      
      {/* Scanline Effect overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[9999] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
