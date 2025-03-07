import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { CryptoData } from '../types';
import { MiniChart } from './MiniChart';
import { FullScreenChart } from './FullScreenChart';

interface Props {
  crypto: CryptoData;
}

export const CryptoCard: React.FC<Props> = ({ crypto }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isPositive = crypto.price_change_percentage_24h > 0;

  const chartData = crypto.sparkline_in_7d.price.map((price, index) => ({
    timestamp: new Date(Date.now() - (168 - index) * 3600000).toISOString(),
    price,
  }));

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFullScreen(true)}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-700 cursor-pointer"
      >
        <motion.div
          className="flex justify-between items-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="flex items-center">
            <motion.img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 mr-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm mr-2">{crypto.symbol.toUpperCase()}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </motion.div>
          </div>
        </motion.div>
        
        <div className="mt-4">
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            ${crypto.current_price.toLocaleString()}
          </motion.p>
          <motion.div
            className={`flex items-center mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="ml-1">{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="h-[150px] mb-4">
                <MiniChart data={chartData} isPositive={isPositive} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white">${crypto.market_cap.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Volume</p>
                  <p className="text-white">${crypto.total_volume.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h High</p>
                  <p className="text-white">${crypto.high_24h?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Low</p>
                  <p className="text-white">${crypto.low_24h?.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <FullScreenChart
            crypto={crypto}
            onClose={() => setIsFullScreen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};