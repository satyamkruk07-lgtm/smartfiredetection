import React from 'react';
import { Search, Monitor, Disc as Drone, ShieldCheck, ChevronRight } from 'lucide-react';

const steps = [
  { icon: Search, label: 'Fire Detection', description: 'Multi-sensor thermal scans' },
  { icon: Monitor, label: 'Dashboard Update', description: 'Real-time hazard mapping' },
  { icon: Drone, label: 'Drone Activation', description: 'Autonomous pathfinding' },
  { icon: ShieldCheck, label: 'Safe Guidance', description: 'Rescue path visualization' },
];

export default function WorkflowSteps() {
  return (
    <div className="flex items-center justify-between gap-4 py-6 px-8 glass rounded-2xl">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="flex-1 flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-xl bg-tech-blue/20 border border-tech-cyan/20 flex items-center justify-center text-tech-cyan group-hover:scale-110 group-hover:bg-tech-blue/40 transition-all duration-300 shadow-[0_0_15px_rgba(94,222,255,0.1)]">
              <step.icon size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-tech-cyan transition-colors">{step.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="text-tech-cyan/20 animate-pulse" size={20} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
