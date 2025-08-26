import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, Shield } from 'lucide-react';
import AuthForms from '../components/auth/AuthForms';

const Login = () => {

  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Track Expenses",
      description: "Monitor your daily spending with detailed categorization"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Income Management",
      description: "Record and track multiple income sources"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Analytics",
      description: "Beautiful charts and insights into your finances"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data stays on your device with local storage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-6"
            >
              <Wallet className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Modern Expense
              <span className="text-primary-600 block">Tracker</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Take control of your finances with our intuitive and powerful expense tracking platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-2">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <AuthForms />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
