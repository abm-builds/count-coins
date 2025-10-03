import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, Target, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface LandingPageProps {
  onComplete: () => void;
}

export const LandingPage = ({ onComplete }: LandingPageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(3);
  const { theme } = useTheme();

  const features = [
    {
      icon: Coins,
      title: "Track Every Coin",
      description: "Monitor your income and expenses with precision",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Budgeting",
      description: "AI-powered insights for better financial decisions",
      color: "text-green-500"
    },
    {
      icon: Target,
      title: "Achieve Goals",
      description: "Set and track your savings targets",
      color: "text-blue-500"
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Beautiful charts to understand your spending",
      color: "text-purple-500"
    }
  ];

  // Skip button countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      setSkipEnabled(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Skip countdown animation
  useEffect(() => {
    if (!skipEnabled) {
      const countdownTimer = setInterval(() => {
        setSkipCountdown((prev) => {
          if (prev <= 1) {
            setSkipEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [skipEnabled]);

  // Auto-advance to features
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-complete after showing features
  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const handleSkip = () => {
    if (skipEnabled) {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className={`fixed inset-0 z-50 flex flex-col ${
            isDark 
              ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50'
          } overflow-hidden`}
        >
          {/* Skip Button - Fixed Position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={!skipEnabled}
              className={`text-xs sm:text-sm ${
                skipEnabled 
                  ? 'text-white/80 hover:text-white hover:bg-white/10' 
                  : 'text-white/40 cursor-not-allowed'
              } transition-all duration-300`}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {skipEnabled ? 'Skip' : `Skip (${skipCountdown})`}
            </Button>
          </motion.div>

          {/* Main Content - Scrollable Container */}
          <div className="flex-1 flex flex-col justify-center items-center px-3 sm:px-4 py-4 sm:py-8 min-h-0 overflow-y-auto">
            <div className="w-full max-w-xs sm:max-w-sm mx-auto text-center space-y-4 sm:space-y-6">
              {/* Logo and App Name */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="CountCoins Logo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${
                    isDark 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  }`}>
                    CountCoins
                  </h1>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    isDark ? 'text-white/80' : 'text-slate-600'
                  }`}>
                    Your Personal Finance Companion
                  </p>
                </div>
              </motion.div>

              {/* Features Animation - Compact Grid */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-2 sm:space-y-3"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 ${
                        isDark ? 'bg-white/5' : 'bg-white/30'
                      } backdrop-blur-sm rounded-xl shadow-lg border ${
                        isDark ? 'border-white/10' : 'border-white/20'
                      }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        isDark ? 'bg-white/10' : 'bg-white/20'
                      }`}>
                        <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className={`font-semibold text-xs sm:text-sm ${
                          isDark ? 'text-white' : 'text-slate-800'
                        } truncate`}>
                          {feature.title}
                        </h3>
                        <p className={`text-xs ${
                          isDark ? 'text-white/70' : 'text-slate-600'
                        } leading-tight sm:leading-relaxed line-clamp-2`}>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="pt-2 sm:pt-4"
              >
                <div className="flex justify-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        isDark ? 'bg-white/60' : 'bg-slate-400'
                      }`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  isDark ? 'text-white/60' : 'text-slate-500'
                }`}>
                  Loading your financial dashboard...
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};