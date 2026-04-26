
"use client"

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, Bell, Search, Activity, Cpu, Navigation, Flame, CheckCircle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import SensorData from '@/components/dashboard/SensorData';
import DroneStatus from '@/components/dashboard/DroneStatus';
import WorkflowSteps from '@/components/WorkflowSteps';
import ThreeBuilding from '@/components/ThreeBuilding';
import * as THREE from 'three';

const mockRooms = [
  { id: '101', pos: [-3, 0, -3] as [number, number, number], status: 'safe' as const, label: 'Room 101' },
  { id: '102', pos: [0, 0, -3] as [number, number, number], status: 'safe' as const, label: 'Room 102' },
  { id: '103', pos: [3, 0, -3] as [number, number, number], status: 'safe' as const, label: 'Room 103' },
  { id: '104', pos: [-3, 0, 0] as [number, number, number], status: 'fire' as const, label: 'Room 104' },
  { id: '105', pos: [0, 0, 0] as [number, number, number], status: 'smoke' as const, label: 'Room 105' },
  { id: '106', pos: [3, 0, 0] as [number, number, number], status: 'safe' as const, label: 'Room 106' },
  { id: '107', pos: [-3, 0, 3] as [number, number, number], status: 'safe' as const, label: 'Room 107' },
  { id: '108', pos: [0, 0, 3] as [number, number, number], status: 'safe' as const, label: 'Room 108' },
  { id: '109', pos: [3, 0, 3] as [number, number, number], status: 'safe' as const, label: 'Room 109' },
];

const dronePathMock = [
  new THREE.Vector3(5, 4, 5),
  new THREE.Vector3(-3, 1, 0), // At the fire
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(8, 1, 0),  // To the exit
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [sysStatus, setSysStatus] = useState('MONITORING');

  useEffect(() => {
    setMounted(true);
    const statuses = ['FIRE DETECTED', 'DRONE ACTIVATED', 'PATH CALCULATED', 'EVACUATION LIVE'];
    let i = 0;
    const interval = setInterval(() => {
        setSysStatus(statuses[i]);
        i = (i + 1) % statuses.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c0e]">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Dynamic Status Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0c0e]/80 backdrop-blur-2xl z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${sysStatus === 'FIRE DETECTED' ? 'bg-red-500 animate-ping' : 'bg-tech-cyan shadow-[0_0_10px_#5EDEFF]'} `} />
              <div className={`text-sm font-black uppercase tracking-widest ${sysStatus === 'FIRE DETECTED' ? 'text-red-500 animate-pulse' : 'text-tech-cyan'}`}>
                SYSTEM: {sysStatus}
              </div>
            </div>
            <div className="w-px h-6 bg-white/10 hidden md:block" />
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Activity size={14} className="text-tech-cyan" />
              <span>LIVE FEED: <span className="text-white font-mono">SECTOR_ALPHA_7</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-4">
                <div className="glass px-4 py-2 rounded-lg border-white/5 flex items-center gap-3">
                    <Navigation size={14} className="text-tech-cyan" />
                    <span className="text-[10px] font-mono uppercase text-white/70">Drone 01 Locked</span>
                </div>
             </div>
            <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#111417]" />
            </button>
            <div className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 lg:p-6 gap-6">
          
          {/* Central 3D Panel (THE HERO AREA) */}
          <div className="flex-[3] relative rounded-[2rem] overflow-hidden glass border-white/5 flex flex-col shadow-2xl">
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-tech-cyan/20">
                <Cpu size={16} className="text-tech-cyan" />
                <span className="text-[11px] font-bold tracking-widest uppercase">AEGIS CORE ACTIVE</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-red-500/20">
                <Flame size={16} className="text-red-500 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-red-500">Hazard: LEVEL 4</span>
              </div>
            </div>

            <div className="flex-1 bg-[radial-gradient(circle_at_center,_rgba(31,102,173,0.1)_0%,_transparent_70%)]">
              {mounted && (
                <ThreeBuilding rooms={mockRooms} dronePath={dronePathMock} />
              )}
            </div>

            {/* Workflow Footer Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0c0e] via-[#0a0c0e]/80 to-transparent">
              <WorkflowSteps />
            </div>
          </div>

          {/* Right Information Panel */}
          <aside className="lg:w-80 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
            {/* Alert Card */}
            {alertVisible && (
              <div className="relative group shrink-0">
                <div className="absolute -inset-0.5 bg-red-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                <div className="relative glass p-6 rounded-3xl border-red-500/50 glow-border-red">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-red-500 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                      <AlertTriangle size={24} className="animate-bounce" />
                    </div>
                    <button onClick={() => setAlertVisible(false)} className="text-muted-foreground hover:text-white">
                      <Info size={18} />
                    </button>
                  </div>
                  <h4 className="text-xl font-black text-red-500 mb-1 leading-tight tracking-tighter uppercase">EMERGENCY ALERT</h4>
                  <p className="text-sm text-white/90 font-medium mb-4">Critical fire event in <span className="font-bold text-red-500 underline decoration-red-500/50 underline-offset-4">ROOM 104</span>. Structural integrity failing.</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] text-red-300 font-mono">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>Drone Unit 01: En-Route</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-red-300 font-mono">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>Evac Path: Calculated</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-red-500 text-white text-sm font-black rounded-xl hover:bg-red-600 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    INITIATE EVACUATION
                  </button>
                </div>
              </div>
            )}

            {/* Sensor Status */}
            <SensorData temp={82} smoke={74} gas={520} />

            {/* Drone Status */}
            <DroneStatus name="AEGIS-VULT-01" battery={92} status="Active" location="Sector 4 Fire Zone" />

            {/* Emergency Protocols */}
            <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Protocols</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest text-tech-cyan hover:bg-tech-blue/20 transition-all border-tech-cyan/20">
                  Vent Seal
                </button>
                <button className="py-3 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all border-red-500/20">
                  CO2 Flood
                </button>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Futuristic Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[9999] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
