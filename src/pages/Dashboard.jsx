import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency, getCurrentMonth, getMonthRange, isDateInRange } from '../utils/dateUtils';
import { expenseCategories } from '../utils/storage';

const Dashboard = () => {
  const { state } = useApp();
  const { expenses, income, savingsGoals } = state;

  // Calculate current month data
  const currentMonthRange = getMonthRange(0);
  const currentMonthExpenses = expenses.filter(expense => 
    isDateInRange(expense.date, currentMonthRange.start, currentMonthRange.end)
  );
  const currentMonthIncome = income.filter(inc => 
    isDateInRange(inc.date, currentMonthRange.start, currentMonthRange.end)
  );

  // Calculate totals
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalIncome = currentMonthIncome.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + parseFloat(goal.currentAmount), 0);

  // Calculate category breakdown
  const categoryBreakdown = expenseCategories.map(category => {
    const categoryExpenses = currentMonthExpenses.filter(expense => expense.category === category.value);
    const total = categoryExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length
    };
  }).filter(category => category.total > 0);

  // Recent transactions
  const recentTransactions = [...expenses, ...income.map(inc => ({ ...inc, type: 'income' }))]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => (
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
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {trendValue}
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview for {getCurrentMonth()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="danger"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          icon={DollarSign}
          color={netBalance >= 0 ? "success" : "danger"}
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSavings)}
          icon={PiggyBank}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((category, index) => (
                <div key={category.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(category.total)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.count} transaction{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No expenses this month
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description || transaction.source || 'Transaction'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No transactions yet
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Savings Goals Progress */}
      {savingsGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Savings Goals Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
