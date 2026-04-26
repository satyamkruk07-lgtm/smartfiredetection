
"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Play, Flame, Navigation, Cpu, Eye, Activity, AlertCircle } from 'lucide-react';
import LiveSimulationCard from '@/components/LiveSimulationCard';
import WorkflowSteps from '@/components/WorkflowSteps';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial alert effect
    const timer = setTimeout(() => setShowAlert(true), 500);
    const hideTimer = setTimeout(() => setShowAlert(false), 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const features = [
    { icon: Eye, title: 'Real-time Detection', desc: 'Instant thermal & gas analysis.' },
    { icon: Navigation, title: 'Smart Path Planning', desc: 'AI-calculated evacuation routes.' },
    { icon: Cpu, title: 'Drone Assistance', desc: 'Autonomous units lead the way.' },
    { icon: Activity, title: 'Live Monitoring', desc: '24/7 structural integrity checks.' },
  ];

  return (
    <main className="relative min-h-screen bg-[#0a0c0e] selection:bg-tech-cyan selection:text-black overflow-x-hidden">
      {/* Alert Overlay Effect */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
          <div className="relative glass p-6 rounded-2xl border-red-500/50 glow-border-red flex items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="p-3 bg-red-500 rounded-full animate-bounce">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <div className="text-red-500 font-bold text-xl uppercase tracking-tighter">Emergency Detected</div>
              <div className="text-white/80 text-sm">Room 104 • Structural Critical</div>
            </div>
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tech-blue rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tech-cyan rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-tech-blue rounded-lg shadow-[0_0_15px_rgba(31,102,173,0.4)]">
            <Shield className="text-tech-cyan" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter">AEGIS <span className="text-tech-cyan">PRIME</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="px-6 py-2.5 bg-tech-blue/10 border border-tech-cyan/20 text-tech-cyan rounded-full flex items-center gap-2 hover:bg-tech-cyan/20 transition-all duration-300">
            Launch Console <ChevronRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-8 py-24 min-h-[60vh] justify-center">
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-cyan/10 border border-tech-cyan/20 text-tech-cyan text-[10px] uppercase font-bold tracking-widest mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-tech-cyan animate-pulse" />
            Active Surveillance System
          </div>
          <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-tech-cyan/50">
            Smart Fire <br /> Detection & <br /> <span className="text-tech-cyan">Rescue System</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time fire detection with autonomous drone guidance. Protecting lives through AI-driven emergency response.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/dashboard" className="px-8 py-4 bg-red-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
              <Activity size={18} /> View Live Dashboard
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-all duration-300">
              <Play size={18} fill="currentColor" /> Start Simulation
            </button>
          </div>
        </div>
      </section>

      {/* Live Simulation Card (Floating beneath hero) */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-8">
        <LiveSimulationCard />
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass p-8 rounded-2xl border-white/5 hover:border-tech-cyan/30 transition-all duration-500 hover:glow-border group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-tech-blue/10 border border-tech-cyan/10 flex items-center justify-center text-tech-cyan mb-6 group-hover:scale-110 group-hover:bg-tech-blue/20 transition-transform">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-tech-cyan transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Workflow Animated */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <h2 className="text-center text-xs font-bold uppercase tracking-[0.4em] text-tech-cyan/50 mb-12">Emergency Workflow</h2>
        <WorkflowSteps />
      </section>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[99] bg-[length:100%_2px,3px_100%]" />
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1F66AD 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </main>
  );
}
