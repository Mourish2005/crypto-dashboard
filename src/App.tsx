import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CryptoCard } from './components/CryptoCard';
import { PriceChart } from './components/PriceChart';
import { Coins, Search, RefreshCw } from 'lucide-react';
import type { CryptoData, ChartData } from './types';

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCryptos = async () => {
    try {
      setIsRefreshing(true);
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            sparkline: true,
            price_change_percentage: '24h'
          }
        }
      );
      setCryptos(response.data);
      
      // Update main chart data
      const selected = response.data.find(c => c.id === selectedCrypto);
      if (selected) {
        const chartData = selected.sparkline_in_7d.price.map((price, index) => ({
          timestamp: new Date(Date.now() - (168 - index) * 3600000).toISOString(),
          price,
        }));
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Coins className="text-purple-400 h-8 w-8 mr-3" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchCryptos}
              className="p-2 rounded-lg bg-purple-600 text-white"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              >
                <RefreshCw size={20} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <PriceChart data={chartData} />
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredCryptos.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;