"use client"

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, Bell, Search, Activity, Cpu } from 'lucide-react';
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
  new THREE.Vector3(0, 5, 0),
  new THREE.Vector3(-3, 1, 0),
  new THREE.Vector3(8, 0, 0),
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#111417]">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#111417]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse glow-border-red" />
              <div className="text-sm font-bold text-red-500 uppercase tracking-widest animate-pulse">FIRE ALERT DETECTED</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Search size={14} className="text-tech-cyan" />
              <span>Scanning sector: <span className="text-white font-mono">B-12A</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
              <Activity size={16} className="text-tech-cyan" />
              <div className="text-xs">
                <div className="text-[10px] text-muted-foreground uppercase leading-none mb-1">Network Load</div>
                <div className="font-mono leading-none">12% Usage</div>
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
        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          
          {/* Central 3D Panel */}
          <div className="flex-[3] relative rounded-3xl overflow-hidden glass border-white/5 flex flex-col">
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-tech-cyan/20">
                <Cpu size={16} className="text-tech-cyan" />
                <span className="text-sm font-bold tracking-tight">System: AEGIS CORE V2</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-sm font-bold tracking-tight">Main Power Grid: STABLE</span>
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-b from-transparent to-[#1F66AD]/5">
              {mounted && (
                <ThreeBuilding rooms={mockRooms} dronePath={dronePathMock} />
              )}
            </div>

            {/* Workflow Footer (Nested) */}
            <div className="p-4 bg-gradient-to-t from-[#111417] to-transparent">
              <WorkflowSteps />
            </div>
          </div>

          {/* Right Information Panel */}
          <aside className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
            {/* Alert Card */}
            {alertVisible && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-red-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative glass p-5 rounded-2xl border-red-500/50 glow-border-red">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-red-500 text-white rounded-lg animate-bounce">
                      <AlertTriangle size={20} />
                    </div>
                    <button onClick={() => setAlertVisible(false)} className="text-muted-foreground hover:text-white">
                      <Info size={16} />
                    </button>
                  </div>
                  <h4 className="text-lg font-bold text-red-500 mb-1 leading-tight tracking-tight uppercase">Emergency Detected</h4>
                  <p className="text-sm text-white/80 font-medium mb-3">Fire identified in <span className="font-bold text-red-500 underline decoration-red-500/50 underline-offset-4">ROOM 104</span>. Structural integrity critical.</p>
                  <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-[10px] text-red-200 font-mono">
                    TIMESTAMP: 2024-05-21 14:22:04<br />
                    PRIORITY: ALPHA-1
                  </div>
                  <button className="w-full mt-4 py-2.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors shadow-lg">
                    EVACUATE NOW
                  </button>
                </div>
              </div>
            )}

            {/* Sensor Status */}
            <SensorData temp={78} smoke={65} gas={420} />

            {/* Drone Status */}
            <DroneStatus name="DRAKE-01" battery={84} status="Active" location="Sector 4 En-Route" />

            {/* Quick Actions */}
            <div className="mt-auto space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emergency Protocols</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 glass rounded-xl text-[10px] font-bold uppercase tracking-widest text-tech-cyan hover:bg-tech-blue/20 transition-all border-tech-cyan/20">
                  Seal Vent
                </button>
                <button className="p-3 glass rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all border-red-500/20">
                  Flood CO2
                </button>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Decorative scan lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[9999] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
