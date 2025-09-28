import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Message, Classification } from '../types';
import { ShieldCheckIcon, ExclamationTriangleIcon, InboxStackIcon, ChartPieIcon } from './icons/Icons';

interface DashboardProps {
    messages: Message[];
}

const COLORS = {
    [Classification.NOT_SPAM]: '#22d3ee', // cyan-400
    [Classification.SPAM]: '#f87171',      // red-400
};

const Dashboard: React.FC<DashboardProps> = ({ messages }) => {
    const stats = useMemo(() => {
        const totalMessages = messages.length;
        const spamCount = messages.filter(m => m.classification === Classification.SPAM).length;
        const notSpamCount = totalMessages - spamCount;
        const spamPercentage = totalMessages > 0 ? (spamCount / totalMessages) * 100 : 0;

        return {
            totalMessages,
            spamCount,
            notSpamCount,
            spamPercentage,
        };
    }, [messages]);

    const chartData = [
        { name: 'Inbox', value: stats.notSpamCount },
        { name: 'Spam', value: stats.spamCount },
    ];
    
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Messages Scanned" 
                    value={stats.totalMessages.toString()} 
                    icon={<InboxStackIcon className="h-8 w-8 text-white"/>}
                    color="bg-blue-500"
                />
                <StatCard 
                    title="Spam Messages Blocked" 
                    value={stats.spamCount.toString()}
                    icon={<ExclamationTriangleIcon className="h-8 w-8 text-white"/>}
                    color="bg-red-500"
                />
                <StatCard 
                    title="Spam Percentage" 
                    value={`${stats.spamPercentage.toFixed(1)}%`}
                    icon={<ChartPieIcon className="h-8 w-8 text-white"/>}
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                    <ShieldCheckIcon className="h-7 w-7 mr-3 text-cyan-400"/>
                    Message Classification Overview
                </h2>
                {messages.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="bold">
                                                {value}
                                            </text>
                                        );
                                    }}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Spam' ? COLORS[Classification.SPAM] : COLORS[Classification.NOT_SPAM]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#374151', // gray-700
                                        borderColor: '#4b5563', // gray-600
                                        borderRadius: '0.5rem',
                                    }}
                                    labelStyle={{ color: '#d1d5db' }} // gray-300
                                />
                                <Legend iconSize={12} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-72 flex items-center justify-center text-gray-400">
                        <p>No messages scanned yet. Simulate a new message to see data here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl shadow-lg flex items-center justify-between ${color}`}>
        <div>
            <p className="text-sm text-white opacity-80">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
            {icon}
        </div>
    </div>
);


export default Dashboard;
