import React from 'react';
import { Thermometer, Wind, Droplets } from 'lucide-react';

interface SensorProps {
  temp: number;
  smoke: number;
  gas: number;
}

export default function SensorData({ temp, smoke, gas }: SensorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-tech-cyan/70">Sensor Status</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="glass p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
            <Thermometer size={18} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Temperature</div>
            <div className="text-lg font-bold">{temp}°C</div>
          </div>
        </div>

        <div className="glass p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
            <Wind size={18} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Smoke Level</div>
            <div className="text-lg font-bold">{smoke}%</div>
          </div>
        </div>

        <div className="glass p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
            <Droplets size={18} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Gas Level</div>
            <div className="text-lg font-bold">{gas} ppm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
