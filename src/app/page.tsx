"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Play } from 'lucide-react';
import ThreeBuilding from '@/components/ThreeBuilding';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoRooms = [
    { id: '101', pos: [-3, 0, -3] as [number, number, number], status: 'safe' as const, label: '101' },
    { id: '102', pos: [0, 0, -3] as [number, number, number], status: 'safe' as const, label: '102' },
    { id: '103', pos: [3, 0, -3] as [number, number, number], status: 'smoke' as const, label: '103' },
    { id: '104', pos: [-3, 0, 0] as [number, number, number], status: 'safe' as const, label: '104' },
    { id: '105', pos: [0, 0, 0] as [number, number, number], status: 'fire' as const, label: '105' },
    { id: '106', pos: [3, 0, 0] as [number, number, number], status: 'safe' as const, label: '106' },
    { id: '107', pos: [-3, 0, 3] as [number, number, number], status: 'safe' as const, label: '107' },
    { id: '108', pos: [0, 0, 3] as [number, number, number], status: 'safe' as const, label: '108' },
    { id: '109', pos: [3, 0, 3] as [number, number, number], status: 'safe' as const, label: '109' },
  ];

  return (
    <main className="relative min-h-screen bg-[#111417] selection:bg-tech-cyan selection:text-black">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tech-blue rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tech-cyan rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
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
          <Link href="#" className="hover:text-white transition-colors">Technology</Link>
          <Link href="#" className="hover:text-white transition-colors">Solutions</Link>
          <Link href="#" className="hover:text-white transition-colors">Emergency Protocol</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-tech-blue text-white rounded-full flex items-center gap-2 hover:bg-tech-cyan hover:text-black transition-all duration-300">
            Enterprise Dashboard <ChevronRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 py-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-cyan/10 border border-tech-cyan/20 text-tech-cyan text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-tech-cyan animate-pulse" />
            Next-Gen Emergency Response
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-tech-cyan/50">
            Smart Fire <br /> Detection & <br /> Rescue System
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
            Real-time monitoring paired with autonomous drone response. 
            Calculating safe paths and providing life-saving guidance within seconds.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/dashboard" className="px-8 py-4 bg-tech-cyan text-black font-bold rounded-xl shadow-[0_0_25px_rgba(94,222,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
              Launch Dashboard
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-all duration-300">
              <Play size={18} fill="currentColor" /> Watch Live Demo
            </button>
          </div>
          <div className="flex items-center gap-6 pt-8 text-muted-foreground grayscale opacity-60">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">99.9%</span>
              <span className="text-[10px] uppercase tracking-widest">Accuracy</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">&lt;2s</span>
              <span className="text-[10px] uppercase tracking-widest">Response Time</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">400%</span>
              <span className="text-[10px] uppercase tracking-widest">Range</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-square lg:aspect-auto h-[600px] rounded-3xl overflow-hidden glass border-tech-cyan/20 glow-border">
          {mounted && <ThreeBuilding rooms={demoRooms} />}
          <div className="absolute top-6 left-6 p-4 glass rounded-xl border-white/10">
            <div className="text-[10px] text-tech-cyan uppercase font-bold tracking-[0.2em] mb-1">Status</div>
            <div className="text-xl font-bold">Active Simulation</div>
          </div>
          <div className="absolute bottom-6 right-6 p-4 glass rounded-xl border-white/10 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Threat Level</div>
              <div className="text-lg font-bold text-red-500">CRITICAL</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        </div>
      </section>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1F66AD 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </main>
  );
}
