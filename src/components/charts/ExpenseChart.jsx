import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { expenseCategories } from '../../utils/storage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ExpenseBarChart = ({ expenses, title = "Expenses by Category" }) => {
  // Calculate category totals
  const categoryTotals = expenseCategories.map(category => {
    const total = expenses
      .filter(expense => expense.category === category.value)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    return { ...category, total };
  }).filter(category => category.total > 0);

  const data = {
    labels: categoryTotals.map(cat => cat.label),
    datasets: [
      {
        label: 'Amount ($)',
        data: categoryTotals.map(cat => cat.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 255, 1)',
        ],
        borderWidth: 1,
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
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold',
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

export const ExpensePieChart = ({ expenses, title = "Expense Distribution" }) => {
  const categoryTotals = expenseCategories.map(category => {
    const total = expenses
      .filter(expense => expense.category === category.value)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    return { ...category, total };
  }).filter(category => category.total > 0);

  const data = {
    labels: categoryTotals.map(cat => cat.label),
    datasets: [
      {
        data: categoryTotals.map(cat => cat.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCD56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C7C7C7',
          '#5362FF',
          '#FF63FF',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Pie data={data} options={options} />
    </div>
  );
};
