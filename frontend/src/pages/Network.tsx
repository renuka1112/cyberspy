import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Mail, 
  Link2, 
  QrCode, 
  Lock,
  Unlock,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

import axios from 'axios';

const NetworkSecurity = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [vpnActive, setVpnActive] = useState(false);
  const [networks, setNetworks] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'checking' | 'safe' | 'danger'>('idle');

  const startScan = async () => {
    setIsScanning(true);
    setNetworks([]);
    try {
      const res = await axios.get('http://localhost:8000/api/network/scan');
      setNetworks(res.data);
    } catch (e) {
      console.error("Scan failed", e);
    } finally {
      setIsScanning(false);
    }
  };

  const checkUrl = () => {
    if (!url) return;
    setUrlStatus('checking');
    setTimeout(() => {
      setUrlStatus(url.includes('evil') ? 'danger' : 'safe');
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">Network Security Scanner</h1>
        <p className="text-gray-400">Wireless landscape auditing and proactive defense</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* WiFi Discovery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-morphism p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Wifi size={24} className="text-cyber-blue" />
                WiFi Landscape
              </h3>
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="px-6 py-2 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 rounded-xl text-cyber-blue font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw size={18} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'SCANNING...' : 'SCAN NETWORKS'}
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode='popLayout'>
                {isScanning ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 flex flex-col items-center justify-center relative"
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-cyber-blue"
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{ width: 400, height: 400, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                      />
                    ))}
                    <Wifi size={48} className="text-cyber-blue animate-pulse mb-4" />
                    <p className="text-cyber-blue font-mono tracking-widest uppercase text-sm">Auditing Spectrum...</p>
                  </motion.div>
                ) : (
                  networks.map((net, idx) => (
                    <motion.div
                      key={net.ssid}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5 flex items-center gap-6 group hover:border-cyber-blue hover:border-opacity-30 transition-all"
                    >
                      <div className={`p-4 rounded-xl ${
                        net.status === 'Trusted' ? 'bg-cyber-green bg-opacity-10 text-cyber-green' : 
                        net.status === 'Warning' ? 'bg-cyber-yellow bg-opacity-10 text-cyber-yellow' :
                        'bg-cyber-red bg-opacity-10 text-cyber-red'
                      }`}>
                        <Wifi size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-bold">{net.ssid}</span>
                          <span className="text-xs font-mono text-gray-500 uppercase">{net.security}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${net.signal}%` }}
                               className={`h-full ${net.signal > 80 ? 'bg-cyber-green' : net.signal > 50 ? 'bg-cyber-yellow' : 'bg-cyber-red'}`}
                             />
                          </div>
                          <span className="text-xs font-mono text-gray-400">{net.signal}%</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        net.status === 'Trusted' ? 'text-cyber-green border border-cyber-green' : 
                        net.status === 'Warning' ? 'text-cyber-yellow border border-cyber-yellow' :
                        'text-cyber-red border border-cyber-red'
                      }`}>
                        {net.status}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              {!isScanning && networks.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-gray-700">
                  <Wifi size={48} className="mb-4 opacity-20" />
                  <p className="italic">Click Scan to begin network discovery</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Link Checker */}
            <div className="glass-morphism p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Link2 size={20} className="text-cyber-blue" />
                Fraud Link Detection
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter URL to verify..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyber-blue transition-colors pr-12"
                  />
                  <button onClick={checkUrl} className="absolute right-2 top-2 p-2 text-cyber-blue hover:text-white transition-colors">
                    <Search size={20} />
                  </button>
                </div>
                <AnimatePresence mode='wait'>
                  {urlStatus === 'checking' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-5 animate-pulse">
                      <div className="w-5 h-5 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-400">Analyzing domain reputation...</span>
                    </motion.div>
                  )}
                  {urlStatus === 'safe' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 bg-cyber-green bg-opacity-10 rounded-2xl border border-cyber-green border-opacity-20">
                      <ShieldCheck className="text-cyber-green" />
                      <div>
                        <div className="text-sm font-bold text-white uppercase">Domain Safe</div>
                        <div className="text-[10px] text-cyber-green">No malicious indicators found.</div>
                      </div>
                    </motion.div>
                  )}
                  {urlStatus === 'danger' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 bg-cyber-red bg-opacity-10 rounded-2xl border border-cyber-red border-opacity-20">
                      <ShieldAlert className="text-cyber-red" />
                      <div>
                        <div className="text-sm font-bold text-white uppercase">Phishing Detected</div>
                        <div className="text-[10px] text-cyber-red">This domain is flagged for credential theft.</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* QR Scanner */}
            <div className="glass-morphism p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <QrCode size={20} className="text-cyber-purple" />
                Secure QR Audit
              </h3>
              <div className="h-40 border-2 border-dashed border-white border-opacity-10 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white bg-opacity-5 hover:bg-opacity-10 cursor-pointer transition-all group">
                <QrCode size={40} className="text-gray-600 group-hover:text-cyber-purple transition-colors" />
                <p className="text-xs text-gray-500 font-mono">UPLOAD QR IMAGE</p>
              </div>
              <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
                Scanning a QR code can trigger hidden actions. CyberSpy audits the payload before your device executes it.
              </p>
            </div>
          </div>
        </div>

        {/* Protection Panel */}
        <div className="space-y-8">
          <div className="glass-morphism p-6 rounded-3xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lock size={20} className="text-cyber-blue" />
                  VPN Shield
                </h3>
                <button 
                  onClick={() => setVpnActive(!vpnActive)}
                  className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${vpnActive ? 'bg-cyber-blue' : 'bg-gray-700'}`}
                >
                  <motion.div 
                    animate={{ x: vpnActive ? 28 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5">
                   {vpnActive ? <Lock className="text-cyber-blue" /> : <Unlock className="text-cyber-red" />}
                   <div>
                      <div className="text-sm font-bold text-white uppercase">
                        {vpnActive ? 'Tunnel Active' : 'Unprotected'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vpnActive ? 'AES-256-GCM / WireGuard' : 'Local IP exposed'}
                      </div>
                   </div>
                </div>
                {vpnActive && (
                   <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-2">
                        <span>Connection Speed</span>
                        <span>842 Mbps</span>
                      </div>
                      <div className="h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '85%' }}
                           className="h-full bg-cyber-blue shadow-neon-blue"
                         />
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div className="glass-morphism p-6 rounded-3xl">
             <h3 className="text-lg font-semibold text-white mb-6">Threat Notifications</h3>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-cyber-blue bg-opacity-10 flex items-center justify-center text-cyber-blue">
                      <Smartphone size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="text-sm font-medium text-white">SMS Alerts</div>
                      <div className="text-xs text-gray-500">+1 (555) ••• ••82</div>
                   </div>
                   <button className="text-[10px] font-bold text-cyber-blue hover:underline uppercase">EDIT</button>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-cyber-purple bg-opacity-10 flex items-center justify-center text-cyber-purple">
                      <Mail size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="text-sm font-medium text-white">Email Reports</div>
                      <div className="text-xs text-gray-500">sec-ops@cyberspy.ai</div>
                   </div>
                   <button className="text-[10px] font-bold text-cyber-blue hover:underline uppercase">EDIT</button>
                </div>
             </div>
             <button className="w-full mt-8 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all uppercase tracking-widest">
                SEND TEST ALERT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSecurity;
