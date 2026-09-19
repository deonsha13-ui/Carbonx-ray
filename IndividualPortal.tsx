import React, { useState } from 'react';
import { Upload, Activity, TrendingDown, Leaf, AlertCircle, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { IndividualResultData, AppUsageItem } from '../types';
import { calculateDigitalFootprint } from '../utils/calculations';
import { analyzeScreenTime, fileToBase64 } from '../services/geminiService';

const IndividualPortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IndividualResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const base64 = await fileToBase64(file);
      const result = await analyzeScreenTime(base64);
      processResults(result.apps);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Try the demo data or check your API key.");
    } else {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      const demoApps: AppUsageItem[] = [
        { name: 'ChatGPT', category: 'AI Queries', hours: 2, minutes: 30 },
        { name: 'Netflix', category: '4K Streaming', hours: 3, minutes: 12 },
        { name: 'Instagram', category: 'Social Media', hours: 2, minutes: 25 },
        { name: 'Valorant', category: 'Gaming', hours: 1, minutes: 48 },
        { name: 'Zoom', category: 'Video Calls', hours: 2, minutes: 6 },
      ];
      processResults(demoApps);
    }, 1500);
  };

  const processResults = (apps: AppUsageItem[]) => {
    const breakdown = calculateDigitalFootprint(apps);
    const totalCO2 = breakdown.reduce((sum, item) => sum + item.co2Emissions, 0);
    
    // Roughly 20g CO2 to charge a smartphone (assumption for comparison)
    const phoneCharges = Math.round(totalCO2 / 20);

    setData({
      totalCO2: parseFloat(totalCO2.toFixed(1)),
      breakdown,
      comparison: `Equivalent to charging ${phoneCharges} smartphones`
    });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 pb-2">
          Digital Shadow Scanner
        </h1>
        <p className="text-xl text-gray-400 font-light">
          Reveal the hidden carbon footprint of your digital life
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto">
        {!data && !loading && (
          <div className="glass-card rounded-3xl p-10 text-center border-dashed border-2 border-cyan-500/30 hover:border-cyan-400 transition-colors group">
            <div className="mb-6 flex justify-center">
              <div className="p-6 rounded-full bg-cyan-500/10 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Screen Time Screenshot</h3>
            <p className="text-gray-500 mb-8">Supports iOS & Android Digital Wellbeing screens</p>
            
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all">
                Select File
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <button onClick={loadDemoData} className="text-sm font-bold text-green-400 hover:text-green-300 flex items-center justify-center gap-2 mx-auto uppercase tracking-wider transition-all hover:tracking-widest">
                <Smartphone className="w-4 h-4" /> Load Demo Data
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
             <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
             <p className="text-cyan-400 animate-pulse font-bold text-lg">Analyzing Screenshot...</p>
             <p className="text-gray-500 text-sm mt-2">Extracting app usage via Gemini Vision</p>
          </div>
        )}

        {/* Error State */}
        {error && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 justify-center">
                <AlertCircle className="w-5 h-5" />
                {error}
                <button onClick={loadDemoData} className="underline hover:text-red-300 ml-2">Try Demo</button>
            </div>
        )}
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-8 animate-slide-up">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-cyan-400 hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg"><Activity className="w-6 h-6 text-cyan-400"/></div>
                <span className="text-xs text-gray-500 font-mono">DAILY ESTIMATE</span>
              </div>
              <h4 className="text-gray-400 text-sm">Total Carbon Footprint</h4>
              <p className="text-4xl font-bold text-white mt-1">{data.totalCO2}<span className="text-xl text-gray-500 ml-1">g</span></p>
            </div>

            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-green-400 hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg"><TrendingDown className="w-6 h-6 text-green-400"/></div>
                <span className="text-xs text-gray-500 font-mono">POTENTIAL</span>
              </div>
              <h4 className="text-gray-400 text-sm">Reduction Potential</h4>
              <p className="text-4xl font-bold text-white mt-1">32<span className="text-xl text-gray-500 ml-1">%</span></p>
            </div>

            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-magenta-500 hover:scale-105 transition-transform duration-300" style={{borderLeftColor: '#d946ef'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#d946ef]/10 rounded-lg"><Leaf className="w-6 h-6 text-[#d946ef]"/></div>
                <span className="text-xs text-gray-500 font-mono">IMPACT</span>
              </div>
              <h4 className="text-gray-400 text-sm">Real-World Impact</h4>
              <p className="text-lg font-bold text-white mt-2 leading-tight">{data.comparison}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>
                Digital Hotspots Heatmap
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.breakdown} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      {data.breakdown.map((entry, index) => (
                        <linearGradient key={`grad-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.5} vertical={false} />
                    <XAxis 
                        dataKey="category" 
                        stroke="#525252" 
                        tick={{fill: '#a3a3a3', fontSize: 11, fontWeight: 500}} 
                        tickLine={false} 
                        axisLine={true}
                        interval={0}
                        angle={0}
                        textAnchor="middle"
                        dy={10}
                        height={40}
                    />
                    <YAxis 
                        stroke="#525252" 
                        tick={{fill: '#a3a3a3', fontSize: 11}} 
                        tickLine={false} 
                        axisLine={false}
                        label={{ value: 'CO2 (g)', angle: -90, position: 'insideLeft', fill: '#666', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                        cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                        contentStyle={{ 
                          backgroundColor: '#0a0a0a', 
                          borderColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '12px', 
                          color: '#fff',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 600 }}
                        labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                    />
                    <Bar dataKey="co2Emissions" radius={[6, 6, 0, 0]} animationDuration={1500}>
                      {data.breakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index})`}
                          stroke={entry.color}
                          strokeWidth={1}
                          strokeOpacity={0.5}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Actions */}
            <div className="glass-card p-8 rounded-2xl border border-[#d946ef]/30 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#d946ef]">
                Smart Actions
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/50 transition-colors cursor-pointer">
                  <p className="text-sm">🌙 Enable Dark Mode</p>
                  <p className="text-xs text-gray-400 mt-1">15% reduction in display energy</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/50 transition-colors cursor-pointer">
                  <p className="text-sm">📉 Limit 4K Streaming</p>
                  <p className="text-xs text-gray-400 mt-1">Switching to 1080p saves 28g CO2/hour</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/50 transition-colors cursor-pointer">
                  <p className="text-sm">⏰ AI Query Limits</p>
                  <p className="text-xs text-gray-400 mt-1">Reduce 200g CO2/day by batching prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualPortal;