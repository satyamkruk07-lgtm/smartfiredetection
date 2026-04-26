import React from 'react';
import { Activity, Cpu, Cloud, Monitor, Navigation, ShieldCheck, Bell, Lock, Zap, ChevronRight } from 'lucide-react';

const workflowSteps = [
  {
    number: 1,
    title: 'SENSORS',
    icon: Activity,
    color: 'text-green-500',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/5',
    points: ['Temperature (DHT22)', 'Gas (MQ-2)', 'Smoke Detection', 'Motion Detection']
  },
  {
    number: 2,
    title: 'ESP32',
    icon: Cpu,
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    points: ['Collects data from sensors', 'Processes the data', 'Sends data to the cloud', 'Wi-Fi Connectivity']
  },
  {
    number: 3,
    title: 'CLOUD (FIREBASE)',
    icon: Cloud,
    color: 'text-orange-500',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/5',
    points: ['Real-time data storage', 'Data synchronization', 'Secure and scalable', 'Real-time updates']
  },
  {
    number: 4,
    title: 'DASHBOARD',
    icon: Monitor,
    color: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    points: ['Real-time visualization', '2D/3D building map', 'Alerts and notifications', 'Drone status monitoring']
  },
  {
    number: 5,
    title: 'DRONE ACTION',
    icon: Navigation,
    color: 'text-tech-cyan',
    borderColor: 'border-tech-cyan/30',
    bgColor: 'bg-tech-cyan/5',
    points: ['Receives command', 'Autonomous navigation', 'Guides people to safety', 'Returns to docking station']
  }
];

const features = [
  { icon: ShieldCheck, title: 'REAL-TIME MONITORING', desc: 'Continuous data monitoring for fast response' },
  { icon: Bell, title: 'INSTANT ALERTS', desc: 'Immediate notifications on fire detection' },
  { icon: Lock, title: 'SECURE & RELIABLE', desc: 'Cloud storage ensures data safety' },
  { icon: Navigation, title: 'SMART RESCUE', desc: 'Drone assists in safe evacuation' }
];

export default function WorkflowSteps() {
  return (
    <div className="space-y-16">
      {/* Workflow Diagram */}
      <div className="relative">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-black tracking-tighter text-white">DEVELOPMENT WORKFLOW</h2>
          <div className="flex flex-wrap justify-center items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className="text-green-500">Sensors</span>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-blue-500">ESP32</span>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-orange-500">Cloud (Firebase)</span>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-purple-500">Dashboard</span>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-tech-cyan">Drone Action</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => (
            <div 
              key={step.title}
              className={`relative glass p-6 rounded-2xl border ${step.borderColor} ${step.bgColor} group hover:scale-[1.02] transition-all duration-300`}
            >
              {/* Step Number */}
              <div className={`absolute top-4 left-4 w-6 h-6 rounded-full ${step.color} bg-white/10 flex items-center justify-center text-[10px] font-black border border-current`}>
                {step.number}
              </div>

              <div className="mt-8 space-y-4">
                <div className={`flex justify-center mb-6`}>
                  <div className={`p-4 rounded-2xl bg-white/5 ${step.color}`}>
                    <step.icon size={32} />
                  </div>
                </div>
                
                <h3 className={`text-center text-xs font-black tracking-widest uppercase ${step.color}`}>
                  {step.title}
                </h3>

                <ul className="space-y-2">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[9px] text-white/60 font-medium leading-tight">
                      <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${step.color.replace('text', 'bg')}`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/5">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-4 group">
            <div className="p-3 bg-tech-blue/10 rounded-xl text-tech-cyan group-hover:scale-110 transition-transform">
              <feature.icon size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-1">
                {feature.title}
              </h4>
              <p className="text-[9px] text-muted-foreground leading-relaxed uppercase font-bold tracking-tight">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
