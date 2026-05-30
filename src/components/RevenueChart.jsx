import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RevenueChart({ data, currency = 'USD' }) {
  if (!data || data.length === 0) return null;

  // Format big numbers dynamically
  const formatValue = (value) => {
    const prefix = currency === 'USD' ? '$' : '';
    const suffix = currency !== 'USD' ? ` ${currency}` : '';

    if (Math.abs(value) >= 1e12) return `${prefix}${(value / 1e12).toFixed(1)}T${suffix}`;
    if (Math.abs(value) >= 1e9) return `${prefix}${(value / 1e9).toFixed(1)}B${suffix}`;
    if (Math.abs(value) >= 1e6) return `${prefix}${(value / 1e6).toFixed(1)}M${suffix}`;
    if (Math.abs(value) >= 1e3) return `${prefix}${(value / 1e3).toFixed(1)}K${suffix}`;
    return `${prefix}${value}${suffix}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-white font-mono">{formatValue(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#666" 
            tick={{ fill: '#888', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#666" 
            tickFormatter={formatValue}
            tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2A2A2A' }} />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="var(--color-accent)" fillOpacity={0.8 + (index * 0.1)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
