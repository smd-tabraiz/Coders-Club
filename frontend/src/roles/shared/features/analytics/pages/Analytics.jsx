import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { HiOutlineUsers, HiOutlineCalendar, HiOutlineCurrencyRupee, HiArrowUpRight } from 'react-icons/hi2';
import api from '../../../../../api/axios';
import Card from '../../../../../components/ui/Card';
import Spinner from '../../../../../components/ui/Spinner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const Analytics = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState({ totalMembers: 0, activeMembers: 0, totalEvents: 0, revenue: 0 });
  const [growthData, setGrowthData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, growthRes, eventRes, revenueRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/member-growth'),
        api.get('/analytics/events'),
        api.get('/analytics/revenue')
      ]);

      setOverview(overviewRes.data.data);
      setGrowthData(growthRes.data.data);
      setEventData(eventRes.data.data);
      setRevenueData(revenueRes.data.data);
    } catch (err) {
      console.error('Failed to load real-time analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'member');
  if (!hasAccess) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 font-bold">Access Denied. Admins & Members only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Members', val: overview.totalMembers, icon: HiOutlineUsers, desc: '+12% from last month', color: 'primary' },
    { label: 'Active Members', val: overview.activeMembers, icon: HiOutlineUsers, desc: '80.6% activity rate', color: 'secondary' },
    { label: 'Events Conducted', val: overview.totalEvents, icon: HiOutlineCalendar, desc: '3 categories covered', color: 'accent' },
    { label: 'Revenue Generated', val: `₹${overview.revenue.toLocaleString()}`, icon: HiOutlineCurrencyRupee, desc: 'Manual checks pending', color: 'emerald' }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Analytics Panel</h1>
        <p className="text-sm text-slate-500">Track registrations growth rates, event participants stats, and revenue trends</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.label} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase">{card.label}</span>
              <div className={`p-2.5 rounded-lg bg-${card.color === 'emerald' ? 'emerald' : 'primary'}/10 text-${card.color === 'emerald' ? 'emerald' : 'primary'}-500 dark:text-${card.color === 'emerald' ? 'emerald' : 'primary'}-400 text-xl`}>
                <card.icon />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{card.val}</h3>
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <HiArrowUpRight className="text-emerald-500" /> {card.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recharts Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Member Growth Graph */}
        <Card className="space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white">Member Growth</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="members" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Event Registrations bar graph */}
        <Card className="space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white">Registrations by Event</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="registrations" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Trends Area Graph */}
        <Card className="space-y-6 md:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-white font-poppins">Revenue Stream Trends</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#06B6D4" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
