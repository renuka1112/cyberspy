import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  FileJson, 
  FileSpreadsheet, 
  FileText as FilePdf,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Analytics = () => {
  const attackTypeData = [
    { name: 'Brute Force', value: 450, fill: '#00f2ff' },
    { name: 'DDoS', value: 890, fill: '#ff003c' },
    { name: 'Malware', value: 320, fill: '#bc00ff' },
    { name: 'Phishing', value: 610, fill: '#fdf500' },
    { name: 'SQL Injection', value: 150, fill: '#00ff9f' },
    { name: 'XSS', value: 240, fill: '#ff7b00' },
  ];

  const regionalData = [
    { name: 'North America', attacks: 12000, blocked: 11500 },
    { name: 'Europe', attacks: 9500, blocked: 9100 },
    { name: 'Asia', attacks: 15000, blocked: 14200 },
    { name: 'South America', attacks: 4500, blocked: 4200 },
    { name: 'Africa', attacks: 2100, blocked: 2000 },
  ];

  const industryData = [
    { name: 'Finance', value: 35 },
    { name: 'Healthcare', value: 25 },
    { name: 'Gov', value: 20 },
    { name: 'Tech', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#00f2ff', '#ff003c', '#bc00ff', '#fdf500', '#00ff9f'];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">Security Analytics</h1>
          <p className="text-gray-400">Consolidated intelligence and trend forensics</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-xl text-sm text-gray-400 hover:text-white transition-all border border-white border-opacity-5">
              <Calendar size={18} />
              LAST 30 DAYS
           </button>
           <button className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-xl text-sm text-gray-400 hover:text-white transition-all border border-white border-opacity-5">
              <Filter size={18} />
              FILTERS
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Attack Type Breakdown */}
         <div className="glass-morphism p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
               <TrendingUp size={20} className="text-cyber-blue" />
               Attack Type Distribution
            </h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackTypeData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                     />
                     <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Regional Analytics */}
         <div className="glass-morphism p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
               <AlertTriangle size={20} className="text-cyber-red" />
               Regional Success Ratio
            </h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={regionalData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                     <XAxis dataKey="name" stroke="#666" fontSize={10} />
                     <YAxis stroke="#666" fontSize={10} />
                     <Tooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }} />
                     <Area type="monotone" dataKey="attacks" stroke="#ff003c" fill="rgba(255, 0, 60, 0.1)" />
                     <Area type="monotone" dataKey="blocked" stroke="#00ff9f" fill="rgba(0, 255, 159, 0.1)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Industry Pie */}
         <div className="glass-morphism p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-8">Targeted Industries</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={industryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {industryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
               {industryData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                     <span className="text-xs text-gray-500 uppercase font-mono">{item.name} {item.value}%</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Predictive Analytics (Scatter) */}
         <div className="glass-morphism p-8 rounded-3xl lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
               Predictive Attack Cluster
            </h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                     <XAxis type="number" dataKey="x" name="Frequency" stroke="#666" fontSize={10} />
                     <YAxis type="number" dataKey="y" name="Severity" stroke="#666" fontSize={10} />
                     <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }} />
                     <Scatter name="Threat Clusters" data={[
                        { x: 10, y: 30, z: 200, fill: '#00f2ff' },
                        { x: 20, y: 50, z: 260, fill: '#00f2ff' },
                        { x: 40, y: 80, z: 400, fill: '#ff003c' },
                        { x: 70, y: 40, z: 150, fill: '#bc00ff' },
                        { x: 50, y: 20, z: 100, fill: '#fdf500' },
                     ]} />
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-600 mt-6 font-mono uppercase tracking-widest text-center">
               Neural prediction engine indicates high probability of DDoS in UTC+8 cluster.
            </p>
         </div>
      </div>

      {/* Reports Panel */}
      <div className="glass-morphism p-8 rounded-3xl">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h3 className="text-xl font-bold text-white mb-2">Intelligence Export</h3>
               <p className="text-gray-500 text-sm">Download formatted security reports for audit and compliance.</p>
            </div>
            <div className="flex gap-4">
               <button className="flex flex-col items-center gap-2 p-4 glass-morphism rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all group border border-white border-opacity-5">
                  <FileSpreadsheet className="text-cyber-green group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-gray-400">CSV DATA</span>
               </button>
               <button className="flex flex-col items-center gap-2 p-4 glass-morphism rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all group border border-white border-opacity-5">
                  <FilePdf className="text-cyber-red group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-gray-400">PDF REPORT</span>
               </button>
               <button className="flex flex-col items-center gap-2 p-4 glass-morphism rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all group border border-white border-opacity-5">
                  <FileJson className="text-cyber-yellow group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-gray-400">JSON API</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
