import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface Props {
  data: ChartData[];
}

export const PriceChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[400px] w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            stroke="#ffffff" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis stroke="#ffffff" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};