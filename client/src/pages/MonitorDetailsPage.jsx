import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMonitorAnalytics } from '../hooks/useAnalytics';
import { MetricCard } from '../components/analytics/MetricCard';
import { UptimeBar } from '../components/analytics/UptimeBar';
import { LatencyChart } from '../components/analytics/LatencyChart';
import { IncidentHistory } from '../components/analytics/IncidentHistory';
import { useIncidents } from '../hooks/useIncidents';
import { ArrowLeft, Activity, Clock, ServerCrash } from 'lucide-react';

export const MonitorDetailsPage = () => {
    const { id } = useParams();
    const { data: analytics, isLoading, isError, error } = useMonitorAnalytics(id);
    const { data: incidents, isLoading: isIncidentsLoading } = useIncidents(id);

    if (isLoading) {
        return (
            <div className="p-8 max-w-6xl mx-auto flex justify-center items-center h-64">
                <div className="text-2xl font-black uppercase flex items-center gap-3">
                    <Activity className="animate-spin" size={32} />
                    Loading Analytics...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="bg-red-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                    <ServerCrash size={48} />
                    <div>
                        <h2 className="text-2xl font-black uppercase">Failed to load analytics</h2>
                        <p className="font-bold">{error?.response?.data?.message || error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    const isUp = analytics.currentStatus === 'UP';

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
                <div>
                    <Link to="/dashboard" className="inline-flex items-center gap-2 font-bold hover:underline mb-4">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{analytics.monitorName}</h1>
                        <div className={`px-4 py-1 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isUp ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`}>
                            {analytics.currentStatus}
                        </div>
                    </div>
                    <a href={analytics.monitorUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                        {analytics.monitorUrl}
                    </a>
                </div>
                <div className="text-sm font-bold bg-white border-2 border-black px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Clock size={16} /> Last checked: {new Date(analytics.lastCheckedAt).toLocaleString()}
                </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="24H Uptime" 
                    value={analytics.uptime24h?.toFixed(2) || '0.00'} 
                    suffix="%" 
                    bgColor="bg-[#a7f3d0]" 
                />
                <MetricCard 
                    label="7D Uptime" 
                    value={analytics.uptime7d?.toFixed(2) || '0.00'} 
                    suffix="%" 
                    bgColor="bg-[#FFF6A3]" 
                />
                <MetricCard 
                    label="30D Uptime" 
                    value={analytics.uptime30d?.toFixed(2) || '0.00'} 
                    suffix="%" 
                    bgColor="bg-[#fde68a]" 
                />
                <MetricCard 
                    label="Avg Latency (24H)" 
                    value={analytics.avgLatencyMs24h?.toFixed(0) || '0'} 
                    suffix="ms" 
                    bgColor="bg-[#e0e7ff]" 
                />
            </div>

            {/* Uptime Bar */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <UptimeBar data={analytics.dailyUptime} />
            </div>

            {/* Latency Chart */}
            <LatencyChart data={analytics.latencySeries} />
            
            {/* Incident History */}
            {!isIncidentsLoading && <IncidentHistory incidents={incidents} />}
            
        </div>
    );
};
