import React from 'react';
import { Battery, MapPin, Activity } from 'lucide-react';

interface DroneProps {
  name: string;
  battery: number;
  status: 'Active' | 'Charging' | 'Standby';
  location: string;
}

export default function DroneStatus({ name, battery, status, location }: DroneProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-tech-cyan/70">Autonomous Drone</h3>
      <div className="glass p-4 rounded-xl border-tech-cyan/20 glow-border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm font-bold text-tech-cyan">{name}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Unit-07 Tactical</div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'Active' ? 'bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50' : 'bg-muted text-muted-foreground'}`}>
            {status}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <Battery size={14} className={battery < 20 ? 'text-red-500' : 'text-green-500'} />
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${battery}%` }} 
              />
            </div>
            <span className="font-mono">{battery}%</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <MapPin size={14} className="text-tech-cyan" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{location}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Activity size={14} className="text-tech-cyan" />
            <span className="text-muted-foreground">Telemetry:</span>
            <span className="font-medium">Active Pathfinding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
