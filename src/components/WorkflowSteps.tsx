
import React from 'react';
import { Search, Monitor, Disc as Drone, ShieldCheck, ChevronRight, Flame } from 'lucide-react';

const steps = [
  { icon: Flame, label: 'Detection', description: 'Thermal sensor trigger' },
  { icon: Monitor, label: 'Mapping', description: 'AI Path Calculation' },
  { icon: Drone, label: 'Deployment', description: 'Drone unit activation' },
  { icon: ShieldCheck, label: 'Safe Exit', description: 'Guided evacuation' },
];

export default function WorkflowSteps() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 glass rounded-3xl border-white/5">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="flex-1 flex flex-col items-center text-center gap-4 group cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-tech-blue/5 border border-tech-cyan/20 flex items-center justify-center text-tech-cyan group-hover:scale-110 group-hover:bg-tech-blue/20 group-hover:glow-border transition-all duration-500">
              <step.icon size={28} />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-tech-cyan transition-colors">{step.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-1 max-w-[100px]">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="hidden md:flex flex-col items-center gap-1 opacity-20">
              <ChevronRight className="text-tech-cyan animate-pulse" size={24} />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-tech-cyan to-transparent" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
