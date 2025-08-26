import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus, Target, Edit2, Trash2, Calendar, PiggyBank, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const Savings = () => {
  const { state, actions } = useApp();
  const { savingsGoals } = state;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Emergency'
  });

  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const categories = [
    'Emergency',
    'Travel',
    'Education',
    'House',
    'Car',
    'Investment',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingGoal) {
      actions.updateSavingsGoal({
        ...editingGoal,
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0)
      });
      toast.success('Savings goal updated successfully');
      setEditingGoal(null);
    } else {
      actions.addSavingsGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0)
      });
      toast.success('Savings goal added successfully');
    }

    resetForm();
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      actions.deleteSavingsGoal(id);
      toast.success('Savings goal deleted successfully');
    }
  };

  const handleAddMoney = (goalId) => {
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      const newAmount = goal.currentAmount + parseFloat(addMoneyAmount);
      actions.updateSavingsGoal({
        ...goal,
        currentAmount: newAmount
      });
      toast.success(`Added ${formatCurrency(parseFloat(addMoneyAmount))} to ${goal.title}`);
    }

    setAddMoneyAmount('');
    setShowAddMoneyForm(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Emergency'
    });
    setEditingGoal(null);
    setShowAddForm(false);
  };

  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTargets > 0 ? (totalSavings / totalTargets) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your savings progress and achieve your financial goals
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Savings Goal
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Saved</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalSavings)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Target</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalTargets)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Progress</h3>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Math.round(overallProgress)}%
          </p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.length > 0 ? (
          savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;
            const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card relative overflow-hidden"
              >
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-bl-lg">
                    Completed!
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-primary-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      of {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  {goal.deadline && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : 'Overdue'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(goal.deadline)}
                      </p>
                    </div>
                  )}
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => setShowAddMoneyForm(goal.id)}
                    className="w-full btn-primary text-sm py-2"
                  >
                    Add Money
                  </button>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <PiggyBank className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No savings goals yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start by creating your first savings goal
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Savings Goal
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingGoal ? 'Update' : 'Add'} Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Money to Goal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={addMoneyAmount}
                    onChange={(e) => setAddMoneyAmount(e.target.value)}
                    className="input-field"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMoneyForm(null);
                      setAddMoneyAmount('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddMoney(showAddMoneyForm)}
                    className="btn-primary"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;
