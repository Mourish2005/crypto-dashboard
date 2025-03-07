import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface Props {
  data: ChartData[];
  isPositive: boolean;
}

export const MiniChart: React.FC<Props> = ({ data, isPositive }) => {
  const gradientColor = isPositive ? '#22c55e' : '#ef4444';
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke={gradientColor}
          fillOpacity={1}
          fill={`url(#gradient-${isPositive})`}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};