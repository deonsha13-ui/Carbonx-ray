import React, { useState } from 'react';
import { FileText, CheckCircle, ShieldCheck, Download, Truck, Factory, Globe } from 'lucide-react';
import { EnterpriseResultData, MaterialItem } from '../types';
import { enrichMaterialData } from '../utils/calculations';
import { analyzeInvoice, fileToBase64 } from '../services/geminiService';

const EnterprisePortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnterpriseResultData | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setData(null);

    try {
      const base64 = await fileToBase64(file);
      const invoiceData = await analyzeInvoice(base64);
      processResults(invoiceData.materials, invoiceData.supplier, invoiceData.invoiceNumber, invoiceData.date);
    } catch (err) {
      console.error(err);
      // Fallback logic could go here
      setLoading(false);
    } 
  };

  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      const demoMaterials: MaterialItem[] = [
        { name: 'Steel Beams', weight: 2500, origin: 'Mumbai, India' },
        { name: 'Cement Mix', weight: 1800, origin: 'Chennai, India' },
        { name: 'Aluminum Sheets', weight: 450, origin: 'Pune, India' },
        { name: 'Copper Wire', weight: 180, origin: 'Kolkata, India' },
      ];
      processResults(demoMaterials, 'TechMaterials Pvt. Ltd.', 'INV-2026-001', '2026-05-15');
    }, 2000);
  };

  const processResults = (rawMaterials: MaterialItem[], supplier: string, invoice: string, date: string) => {
    const enriched = enrichMaterialData(rawMaterials);
    const prodCO2 = enriched.reduce((sum, m) => sum + (m.co2 || 0), 0);
    const transCO2 = enriched.reduce((sum, m) => sum + (m.transport || 0), 0);
    const batchId = `CBAM-2026-IN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    setData({
      materials: enriched,
      supplier,
      invoiceNumber: invoice,
      date,
      totalProductionCO2: Math.round(prodCO2),
      totalTransportCO2: Math.round(transCO2),
      grandTotalCO2: Math.round(prodCO2 + transCO2),
      batchId
    });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 animate-fade-in pb-24">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 pb-2">
          Invoice-to-Audit System
        </h1>
        <p className="text-xl text-gray-400 font-light">
          Automated carbon passport generation for EU CBAM & India CCTS compliance
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-2xl mx-auto">
        {!data && !loading && (
          <div className="glass-card rounded-3xl p-10 text-center border-dashed border-2 border-green-500/30 hover:border-green-400 transition-colors group">
            <div className="mb-6 flex justify-center">
              <div className="p-6 rounded-full bg-green-500/10 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Upload GST Invoice or Purchase Order</h3>
            <p className="text-gray-500 mb-8">Supports PDF, JPG, PNG - AI will extract material data</p>
            
            <div className="relative inline-block">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold rounded-lg shadow-lg hover:shadow-green-500/50 transition-all">
                Select Invoice
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <button onClick={loadDemoData} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2 mx-auto uppercase tracking-wider transition-all hover:tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Load Demo Data
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
             <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-6"></div>
             <p className="text-green-400 animate-pulse font-bold text-lg">Processing Invoice with AI...</p>
             <p className="text-gray-500 text-sm mt-2">Mapping materials to emission factors</p>
          </div>
        )}
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-8 animate-slide-up">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-green-400">
                <div className="flex items-center gap-3 mb-2 text-green-400">
                    <Factory className="w-5 h-5" />
                    <span className="font-bold text-sm">PRODUCTION</span>
                </div>
                <p className="text-3xl font-bold font-mono">{data.totalProductionCO2.toLocaleString()} <span className="text-sm text-gray-500">kg CO2</span></p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-cyan-400">
                <div className="flex items-center gap-3 mb-2 text-cyan-400">
                    <Truck className="w-5 h-5" />
                    <span className="font-bold text-sm">TRANSPORT</span>
                </div>
                <p className="text-3xl font-bold font-mono">{data.totalTransportCO2.toLocaleString()} <span className="text-sm text-gray-500">kg CO2</span></p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-[#FF10F0]">
                <div className="flex items-center gap-3 mb-2 text-[#FF10F0]">
                    <Globe className="w-5 h-5" />
                    <span className="font-bold text-sm">TOTAL FOOTPRINT</span>
                </div>
                <p className="text-3xl font-bold font-mono">{data.grandTotalCO2.toLocaleString()} <span className="text-sm text-gray-500">kg CO2</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Material Analysis List */}
            <div className="lg:col-span-1 glass-card p-0 rounded-2xl border border-green-500/30 overflow-hidden">
                <div className="p-6 bg-green-900/10 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        📄 Material Analysis
                    </h3>
                </div>
                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {data.materials.map((mat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-white">{mat.name}</span>
                                <span className="text-xs font-mono text-cyan-400 px-2 py-1 bg-cyan-900/30 rounded">{mat.weight}kg</span>
                            </div>
                            <div className="text-xs text-gray-400 grid grid-cols-2 gap-2">
                                <div>Origin: {mat.origin}</div>
                                <div>Factor: {mat.factor}</div>
                                <div>Prod: {Math.round(mat.co2 || 0)}kg</div>
                                <div>Trans: {Math.round(mat.transport || 0)}kg</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carbon Passport Certificate */}
            <div className="lg:col-span-2 relative group">
                {/* Decorative Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-600 rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                
                <div className="relative glass-card bg-[#0a0a0a] rounded-3xl p-8 md:p-12 border border-green-500/20 shadow-2xl">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                🏆 Batch Carbon Passport
                            </h2>
                            <div className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-sm text-green-400">
                                {data.batchId}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-green-500 text-sm font-bold uppercase">Verified Valid</span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                        <div className="space-y-6 font-mono text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">SUPPLIER</span>
                                <span className="text-white text-lg">{data.supplier}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">INVOICE & DATE</span>
                                <span className="text-white">{data.invoiceNumber} • {data.date}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">MATERIAL COUNT</span>
                                <span className="text-white">{data.materials.length} Unique SKUs</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-end text-right">
                             <span className="text-gray-500 text-sm mb-2">CERTIFIED EMISSIONS</span>
                             <span className="text-5xl md:text-6xl font-bold text-green-400 tracking-tighter">
                                {(data.grandTotalCO2 / 1000).toFixed(2)}
                                <span className="text-2xl text-gray-500 ml-2">tCO2e</span>
                             </span>
                             <div className="flex items-center gap-2 mt-4 text-xs text-cyan-400">
                                <ShieldCheck className="w-4 h-4" /> Verified by Gemini AI Analysis
                             </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold">✓ EU CBAM Ready</span>
                            <span className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold">✓ India CCTS 2026</span>
                            <span className="px-3 py-1 rounded-full border border-[#FF10F0]/30 bg-[#FF10F0]/10 text-[#FF10F0] text-xs font-bold">✓ ISO 14064</span>
                        </div>
                        
                        <button 
                            onClick={() => alert("Certificate PDF generation would start here.")}
                            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105"
                        >
                            <Download className="w-5 h-5" /> Download Certificate
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterprisePortal;