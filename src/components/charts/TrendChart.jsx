import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getLastNDays, formatDate } from '../../utils/dateUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const WeeklyTrendChart = ({ expenses, income }) => {
  const last7Days = getLastNDays(7);
  
  const expenseData = last7Days.map(date => {
    return expenses
      .filter(expense => expense.date === date)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  });

  const incomeData = last7Days.map(date => {
    return income
      .filter(inc => inc.date === date)
      .reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  });

  const data = {
    labels: last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Trend (Last 7 Days)',
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export const MonthlyComparisonChart = ({ expenses, income }) => {
  // Get last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  const expenseData = months.map(({ year, month }) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
      })
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  });

  const incomeData = months.map(({ year, month }) => {
    return income
      .filter(inc => {
        const incomeDate = new Date(inc.date);
        return incomeDate.getFullYear() === year && incomeDate.getMonth() === month;
      })
      .reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  });

  const data = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Comparison (Last 6 Months)',
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export const NetWorthTrendChart = ({ expenses, income }) => {
  const last30Days = getLastNDays(30);
  
  let cumulativeBalance = 0;
  const netWorthData = last30Days.map(date => {
    const dayExpenses = expenses
      .filter(expense => expense.date === date)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    const dayIncome = income
      .filter(inc => inc.date === date)
      .reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    
    cumulativeBalance += (dayIncome - dayExpenses);
    return cumulativeBalance;
  });

  const data = {
    labels: last30Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Net Worth Trend',
        data: netWorthData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Net Worth Trend (Last 30 Days)',
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Net Worth: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};
