import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { BarChart3, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { ExpenseBarChart, ExpensePieChart } from '../components/charts/ExpenseChart';
import { WeeklyTrendChart, MonthlyComparisonChart, NetWorthTrendChart } from '../components/charts/TrendChart';
import { formatCurrency, getCurrentMonth, getMonthRange, isDateInRange } from '../utils/dateUtils';

const Analytics = () => {
  const { state } = useApp();
  const { expenses, income } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Filter data based on selected period
  const getFilteredData = () => {
    if (selectedPeriod === 'all') {
      return { expenses, income };
    }
    
    const monthOffset = selectedPeriod === 'current' ? 0 : -1;
    const range = getMonthRange(monthOffset);
    
    return {
      expenses: expenses.filter(expense => isDateInRange(expense.date, range.start, range.end)),
      income: income.filter(inc => isDateInRange(inc.date, range.start, range.end))
    };
  };

  const { expenses: filteredExpenses, income: filteredIncome } = getFilteredData();

  // Calculate summary stats
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalIncome = filteredIncome.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const avgDailyExpense = filteredExpenses.length > 0 ? totalExpenses / 30 : 0; // Approximate

  const StatCard = ({ title, value, icon: Icon, color = "primary", subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${
            color === 'success' ? 'text-green-600 dark:text-green-400' :
            color === 'danger' ? 'text-red-600 dark:text-red-400' :
            'text-gray-900 dark:text-white'
          }`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          color === 'success' ? 'bg-green-100 dark:bg-green-900' :
          color === 'danger' ? 'bg-red-100 dark:bg-red-900' :
          'bg-primary-100 dark:bg-primary-900'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'success' ? 'text-green-600 dark:text-green-400' :
            color === 'danger' ? 'text-red-600 dark:text-red-400' :
            'text-primary-600 dark:text-primary-400'
          }`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed insights into your financial data
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select-field"
          >
            <option value="all">All Time</option>
            <option value="current">Current Month</option>
            <option value="previous">Previous Month</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingUp}
          color="danger"
          subtitle={`${filteredExpenses.length} transactions`}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="success"
          subtitle={`${filteredIncome.length} entries`}
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          icon={BarChart3}
          color={netBalance >= 0 ? "success" : "danger"}
          subtitle={netBalance >= 0 ? "Surplus" : "Deficit"}
        />
        <StatCard
          title="Avg Daily Expense"
          value={formatCurrency(avgDailyExpense)}
          icon={Calendar}
          subtitle="Last 30 days"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expenses by Category
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ExpenseBarChart expenses={filteredExpenses} title="" />
        </motion.div>

        {/* Expense Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expense Distribution
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ExpensePieChart expenses={filteredExpenses} title="" />
        </motion.div>
      </div>

      {/* Trend Charts */}
      <div className="space-y-6">
        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Trend Analysis
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <WeeklyTrendChart expenses={expenses} income={income} />
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Comparison
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <MonthlyComparisonChart expenses={expenses} income={income} />
        </motion.div>

        {/* Net Worth Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Net Worth Trend
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <NetWorthTrendChart expenses={expenses} income={income} />
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Spending Pattern</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {netBalance >= 0 
                ? "You're maintaining a positive balance this period." 
                : "Consider reducing expenses to improve your balance."}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Top Category</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {filteredExpenses.length > 0 
                ? `Most spending in ${filteredExpenses.reduce((prev, current) => 
                    (prev.amount > current.amount) ? prev : current).category}`
                : "No expenses recorded yet."}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Recommendation</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {avgDailyExpense > 50 
                ? "Consider setting daily spending limits to control expenses."
                : "Your daily spending is well controlled."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
