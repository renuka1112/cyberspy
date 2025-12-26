import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Globe as GlobeIcon, Map as MapIcon, Shield, Zap } from 'lucide-react';

const AttackMap = () => {
  const globeEl = useRef();
  const [attacks, setAttacks] = useState<any[]>([]);
  const [hoverData, setHoverData] = useState<any>(null);
  const [stats, setStats] = useState({ total: 12849, rate: 42 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newAttack = {
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        color: ['#ff003c', '#00f2ff', '#fdf500'][Math.floor(Math.random() * 3)],
        type: ['DDoS', 'Malware', 'SQLi', 'Brute Force'][Math.floor(Math.random() * 4)],
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
      };
      
      setAttacks(prev => [...prev.slice(-20), newAttack]);
      setStats(prev => ({ total: prev.total + 1, rate: Math.floor(Math.random() * 20) + 30 }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-cyber-black overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        arcsData={attacks}
        arcColor={'color'}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={1000}
        arcStroke={0.5}
        pointsData={attacks.map(a => ({ lat: a.endLat, lng: a.endLng, color: a.color }))}
        pointColor="color"
        pointRadius={0.5}
        pointAltitude={0}
      />

      {/* Overlays */}
      <div className="absolute top-8 left-8 z-20 space-y-4">
        <div className="glass-morphism p-6 rounded-2xl border-l-4 border-cyber-blue w-64">
           <div className="text-xs text-cyber-blue font-mono mb-1 tracking-widest uppercase">Global Attack Rate</div>
           <div className="text-3xl font-bold text-white font-mono">{stats.rate} <span className="text-sm font-normal text-gray-500 uppercase tracking-tighter">Attacks/Sec</span></div>
           <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                 <motion.div 
                    animate={{ width: `${(stats.rate / 60) * 100}%` }}
                    className="h-full bg-cyber-blue shadow-neon-blue" 
                 />
              </div>
           </div>
        </div>

        <div className="glass-morphism p-4 rounded-2xl w-64 space-y-3">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
             <Crosshair size={14} className="text-cyber-red" />
             Live Vectors
           </h3>
           <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {attacks.slice().reverse().map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono p-2 bg-white bg-opacity-5 rounded">
                   <span className="text-cyber-red">{a.ip}</span>
                   <span className="text-white opacity-50">→</span>
                   <span className="text-cyber-blue">{a.type}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 glass-morphism px-8 py-4 rounded-full flex items-center gap-8 border-white border-opacity-10">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyber-red shadow-[0_0_8px_#ff003c]"></div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">High Severity</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyber-yellow shadow-[0_0_8px_#fdf500]"></div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Medium Severity</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyber-blue shadow-[0_0_8px_#00f2ff]"></div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">System Block</span>
         </div>
      </div>

      <div className="absolute top-8 right-8 z-20 glass-morphism p-6 rounded-2xl w-80">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Threat Intelligence</h3>
            <Shield size={20} className="text-cyber-green" />
         </div>
         <div className="space-y-4">
            <div className="p-4 rounded-xl bg-cyber-red bg-opacity-5 border border-cyber-red border-opacity-20">
               <div className="text-xs font-bold text-cyber-red uppercase mb-1">Active Outbreak</div>
               <div className="text-sm text-white font-medium mb-1">LockBit 3.0 Variant detected in SEA</div>
               <div className="text-[10px] text-gray-500">Affecting Financial Institutions and Healthcare.</div>
            </div>
            <div className="p-4 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10">
               <div className="text-xs font-bold text-cyber-yellow uppercase mb-1">Botnet Activity</div>
               <div className="text-sm text-white font-medium mb-1">Mirai cluster surge in South America</div>
               <div className="text-[10px] text-gray-500">IoT devices targeting port 23/2323.</div>
            </div>
         </div>
         
         <div className="mt-8 pt-6 border-t border-white border-opacity-10">
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-[10px] text-gray-500 uppercase font-mono">Total Threats Blocked</div>
                  <div className="text-2xl font-bold text-white font-mono">{stats.total.toLocaleString()}</div>
               </div>
               <div className="p-2 rounded-lg bg-cyber-green bg-opacity-10 text-cyber-green">
                  <Zap size={16} />
               </div>
            </div>
         </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-2">
         <button className="p-3 bg-cyber-blue text-cyber-black rounded-xl shadow-neon-blue hover:scale-110 transition-all">
            <GlobeIcon size={20} />
         </button>
         <button className="p-3 glass-morphism text-white rounded-xl hover:bg-white hover:bg-opacity-10 transition-all">
            <MapIcon size={20} />
         </button>
      </div>
    </div>
  );
};

export default AttackMap;
