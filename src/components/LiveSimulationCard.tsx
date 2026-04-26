
"use client"

import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Navigation, Users } from 'lucide-react';

export default function LiveSimulationCard() {
  const [status, setStatus] = useState('FIRE DETECTED');
  const [detail, setDetail] = useState('Room 104');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = [
      { status: 'FIRE DETECTED', detail: 'Room 104', icon: Flame, color: 'text-red-500' },
      { status: 'PATH FOUND', detail: 'Evacuation Route Secure', icon: CheckCircle2, color: 'text-green-500' },
      { status: 'DRONE EN ROUTE', detail: 'Tactical Unit-07 Active', icon: Navigation, color: 'text-tech-cyan' },
      { status: 'EVACUATION LIVE', detail: 'Guiding Occupants', icon: Users, color: 'text-yellow-500' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % sequence.length;
      setStatus(sequence[i].status);
      setDetail(sequence[i].detail);
      setProgress(0);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="glass p-6 rounded-2xl border-white/10 glow-border flex flex-col md:flex-row items-center gap-8 backdrop-blur-2xl">
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${status === 'FIRE DETECTED' ? 'animate-pulse' : ''}`}>
           {status === 'FIRE DETECTED' && <Flame className="text-red-500" />}
           {status === 'PATH FOUND' && <CheckCircle2 className="text-green-500" />}
           {status === 'DRONE EN ROUTE' && <Navigation className="text-tech-cyan" />}
           {status === 'EVACUATION LIVE' && <Users className="text-yellow-500" />}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status Report</div>
          <div className={`text-lg font-bold tracking-tight ${status === 'FIRE DETECTED' ? 'text-red-500' : 'text-white'}`}>{status}</div>
          <div className="text-xs text-white/60 font-medium">{detail}</div>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
           <span>Processing Node A-7</span>
           <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
           <div 
             className="h-full bg-tech-cyan transition-all duration-300 shadow-[0_0_10px_#5EDEFF]" 
             style={{ width: `${progress}%` }} 
           />
        </div>
      </div>

      <div className="flex items-center gap-6 border-l border-white/10 pl-8 hidden lg:flex">
         <div className="text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Threat</div>
            <div className="text-lg font-bold text-red-500">ALPHA</div>
         </div>
         <div className="text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Responders</div>
            <div className="text-lg font-bold text-white">04</div>
         </div>
      </div>
    </div>
  );
}
