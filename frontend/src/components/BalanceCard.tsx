import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { motion } from "framer-motion";

export const BalanceCard = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="p-6 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 opacity-90" />
              <p className="text-sm font-medium opacity-90">Total Balance</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              💰
            </motion.div>
          </div>
          
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.h2>
          
          <div className="flex gap-4">
            <motion.div 
              className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-xs font-medium opacity-90">Income</span>
              </div>
              <p className="text-lg font-semibold">
                ₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-300" />
                <span className="text-xs font-medium opacity-90">Expenses</span>
              </div>
              <p className="text-lg font-semibold">
                ₹{totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};