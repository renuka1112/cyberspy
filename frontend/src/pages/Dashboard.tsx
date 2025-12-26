import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Lock, 
  TrendingUp 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const mockChartData = [
  { name: '00:00', threats: 400 },
  { name: '04:00', threats: 300 },
  { name: '08:00', threats: 600 },
  { name: '12:00', threats: 800 },
  { name: '16:00', threats: 500 },
  { name: '20:00', threats: 900 },
  { name: '23:59', threats: 700 },
];

const mockPieData = [
  { name: 'DDoS', value: 400 },
  { name: 'Malware', value: 300 },
  { name: 'Phishing', value: 300 },
  { name: 'SQLi', value: 200 },
];

const COLORS = ['#00f2ff', '#ff003c', '#bc00ff', '#fdf500'];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-morphism p-6 rounded-2xl border-l-4"
    style={{ borderLeftColor: color }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}>
        <Icon size={24} style={{ color }} />
      </div>
      {trend && (
        <span className={`text-xs font-mono ${trend > 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-gray-400 text-sm mb-1">{title}</div>
    <div className="text-2xl font-bold font-mono tracking-tight">
      <Counter value={value} />
    </div>
  </motion.div>
);

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count.toLocaleString()}</>;
};

import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    global_threats: 842931,
    active_attacks: 142,
    threats_blocked: 762102,
    networks_secured: 48
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/dashboard/stats');
        setStats(res.data);
      } catch (e) {
        console.log("Using mock stats");
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">Operations Dashboard</h1>
          <p className="text-gray-400">Real-time global threat intelligence monitor</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-cyber-blue font-mono mb-1">SYSTEM TIME</div>
          <div className="text-xl font-mono text-white">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Global Threats" value={stats.global_threats} icon={Globe} color="#00f2ff" trend={12.5} />
        <StatCard title="Active Attacks" value={stats.active_attacks} icon={Activity} color="#ff003c" trend={-4.2} />
        <StatCard title="Threats Blocked" value={stats.threats_blocked} icon={Shield} color="#00ff9f" trend={8.1} />
        <StatCard title="Networks Secured" value={stats.networks_secured} icon={Lock} color="#bc00ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-morphism p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-cyber-blue" />
              Threat Timeline (24h)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Line type="monotone" dataKey="threats" stroke="#00f2ff" strokeWidth={3} dot={{ r: 4, fill: '#00f2ff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="glass-morphism p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-white mb-6">Attack Type Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Feed */}
        <div className="glass-morphism rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white border-opacity-5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
            <span className="px-3 py-1 bg-cyber-red bg-opacity-10 text-cyber-red text-xs rounded-full animate-pulse border border-cyber-red border-opacity-20 font-mono">LIVE MONITORING</span>
          </div>
          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5 hover:border-opacity-20 transition-all cursor-default"
              >
                <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-cyber-red shadow-[0_0_8px_#ff003c]' : 'bg-cyber-yellow shadow-[0_0_8px_#fdf500]'}`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Potential {i % 2 === 0 ? 'DDoS' : 'SQL Injection'} detected</div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Source: 192.168.1.{100 + i} | Target: External Gateway</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-400">12:4{i}:05</div>
                  <div className={`text-[10px] font-bold uppercase ${i % 3 === 0 ? 'text-cyber-red' : 'text-cyber-yellow'}`}>
                    {i % 3 === 0 ? 'CRITICAL' : 'WARNING'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className="glass-morphism p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-white mb-6">Attack Severity Levels</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Critical', value: 45, fill: '#ff003c' },
                { name: 'High', value: 80, fill: '#ff7b00' },
                { name: 'Medium', value: 120, fill: '#fdf500' },
                { name: 'Low', value: 250, fill: '#00ff9f' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
