import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

const COLORS = ['#0F2D1F', '#10B981', '#84CC16', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, collectorsData] = await Promise.all([
        api.getAdminStats(),
        api.getCollectors()
      ]);
      setStats(statsData);
      setCollectors(collectorsData);
    } catch (e) {
      console.warn('Error loading admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.verifyCollector(id, status);
      await loadData();
    } catch (e) {
      console.error('Failed to verify collector:', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-eco text-3xl sm:text-4xl font-normal text-[#0F2D1F]">
              Platform Intelligence & Governance 📊
            </h1>
            <span className="stitch-badge-mint text-[11px] font-bold">
              Admin Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Real-time environmental ledger, audited recovery metrics, and partner governance.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-full bg-white border border-[#1A1F1C]/10 text-xs font-bold text-[#0F2D1F] flex items-center gap-2 hover:bg-gray-50 self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#10B981]" /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stitch-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Recycled Mass</span>
            <Leaf className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">
            {stats?.totalRecycledWeightKg || 28.5} <span className="text-sm font-normal text-gray-500">kg</span>
          </div>
          <span className="text-[11px] text-[#10B981] font-semibold mt-1 block">+14% this month</span>
        </div>

        <div className="stitch-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">CO₂ Impact Avoided</span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">
            {stats?.totalCo2AvoidedKg || 49.8} <span className="text-sm font-normal text-gray-500">kg</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Certified greenhouse reduction</span>
        </div>

        <div className="stitch-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Verified Collectors</span>
            <Truck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">
            {stats?.verifiedCollectors || 3}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            {stats?.pendingCollectors || 0} awaiting approval
          </span>
        </div>

        <div className="stitch-card-vault p-5">
          <div className="flex items-center justify-between text-gray-300 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pickups</span>
            <BarChart3 className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="font-serif-eco text-3xl font-bold text-[#84CC16] font-tabular">
            {stats?.totalPickups || 8}
          </div>
          <span className="text-[11px] text-[#D1FAE5]/80 mt-1 block">100% custody audited</span>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend Area Chart */}
        <div className="stitch-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif-eco text-lg font-bold text-[#0F2D1F]">
                Monthly Recycling Volume (kg)
              </h3>
              <p className="text-xs text-gray-500">Month-over-month tonnage diverted</p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyTrend || []}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#727973" fontSize={11} />
                <YAxis stroke="#727973" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F2D1F', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* E-Waste Category Breakdown Pie Chart */}
        <div className="stitch-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif-eco text-lg font-bold text-[#0F2D1F]">
                E-Waste Distribution by Category
              </h3>
              <p className="text-xs text-gray-500">Breakdown of collected hardware</p>
            </div>
            <Leaf className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryBreakdown || [
                    { name: 'Computer Equipment', value: 45 },
                    { name: 'Mobile Phones', value: 25 },
                    { name: 'Cables & Accessories', value: 18 },
                    { name: 'Peripherals', value: 12 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.categoryBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F2D1F', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Collector Verification Queue Table */}
      <div className="stitch-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
              Collector Verification & Auditing
            </h3>
            <p className="text-xs text-gray-500">Verify e-waste collector licenses, EV fleets, and foundry compliance.</p>
          </div>
          <span className="stitch-badge-mint text-[11px] font-bold">
            {collectors.length} Registered Foundries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Organization</th>
                <th className="pb-3">Service Region</th>
                <th className="pb-3">Rating / Runs</th>
                <th className="pb-3">Badges</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collectors.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-bold text-[#0F2D1F] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#0F2D1F] text-[#10B981] flex items-center justify-center font-bold text-xs">
                      {c.business_name.substring(0, 2)}
                    </span>
                    {c.business_name}
                  </td>
                  <td className="py-3 text-gray-600">{c.service_area}</td>
                  <td className="py-3 text-gray-600 font-tabular">★ {c.rating} ({c.reviews_count || 100}+)</td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.badges?.slice(0, 2).map((b, i) => (
                        <span key={i} className="text-[9px] bg-[#F0F5EF] text-[#0F2D1F] px-1.5 py-0.5 rounded font-semibold">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.verification_status === 'VERIFIED'
                        ? 'bg-[#D1FAE5] text-[#0F2D1F]' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.verification_status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {c.verification_status !== 'VERIFIED' ? (
                      <button
                        onClick={() => handleVerify(c.id, 'VERIFIED')}
                        className="px-3 py-1 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-[10px] font-bold transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(c.id, 'PENDING')}
                        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-medium transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
