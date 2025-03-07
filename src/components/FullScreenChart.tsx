import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoData, ChartData } from '../types';

interface Props {
  crypto: CryptoData;
  onClose: () => void;
}

export const FullScreenChart: React.FC<Props> = ({ crypto, onClose }) => {
  const isPositive = crypto.price_change_percentage_24h > 0;
  const chartData = crypto.sparkline_in_7d.price.map((price, index) => ({
    timestamp: new Date(Date.now() - (168 - index) * 3600000).toISOString(),
    price,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl w-full max-w-6xl p-8 relative"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </motion.button>

        <div className="flex items-center mb-8">
          <motion.img
            src={crypto.image}
            alt={crypto.name}
            className="w-12 h-12 mr-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <div>
            <h2 className="text-3xl font-bold text-white">{crypto.name}</h2>
            <div className="flex items-center mt-2">
              <span className="text-gray-400 mr-4">{crypto.symbol.toUpperCase()}</span>
              <motion.div
                className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="ml-1">{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Current Price</p>
            <p className="text-2xl font-bold text-white">${crypto.current_price.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Market Cap</p>
            <p className="text-2xl font-bold text-white">${crypto.market_cap.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">24h High</p>
            <p className="text-2xl font-bold text-white">${crypto.high_24h?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">24h Low</p>
            <p className="text-2xl font-bold text-white">${crypto.low_24h?.toLocaleString()}</p>
          </div>
        </div>

        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
              <YAxis
                stroke="#ffffff"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
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
      </motion.div>
    </motion.div>
  );
};