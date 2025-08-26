// Local Storage Helper Functions
export const getLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return null;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};

// Sample data for demo mode
export const sampleExpenses = [
  {
    id: 1,
    amount: 25.50,
    category: 'Food',
    description: 'Lunch at cafe',
    date: '2024-01-15',
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    amount: 60.00,
    category: 'Transport',
    description: 'Gas for car',
    date: '2024-01-14',
    paymentMethod: 'Debit Card'
  },
  {
    id: 3,
    amount: 15.99,
    category: 'Entertainment',
    description: 'Movie ticket',
    date: '2024-01-13',
    paymentMethod: 'Cash'
  },
  {
    id: 4,
    amount: 120.00,
    category: 'Shopping',
    description: 'Groceries',
    date: '2024-01-12',
    paymentMethod: 'Credit Card'
  },
  {
    id: 5,
    amount: 45.00,
    category: 'Health',
    description: 'Pharmacy',
    date: '2024-01-11',
    paymentMethod: 'Debit Card'
  }
];

export const sampleIncome = [
  {
    id: 1,
    amount: 3500.00,
    source: 'Salary',
    description: 'Monthly salary',
    date: '2024-01-01'
  },
  {
    id: 2,
    amount: 500.00,
    source: 'Freelance',
    description: 'Web development project',
    date: '2024-01-10'
  }
];

export const sampleSavingsGoals = [
  {
    id: 1,
    title: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
    deadline: '2024-12-31',
    category: 'Emergency'
  },
  {
    id: 2,
    title: 'Vacation',
    targetAmount: 2000,
    currentAmount: 800,
    deadline: '2024-06-30',
    category: 'Travel'
  }
];

// Categories for expenses
export const expenseCategories = [
  { value: 'Food', label: 'Food & Dining', color: 'bg-orange-500' },
  { value: 'Transport', label: 'Transportation', color: 'bg-blue-500' },
  { value: 'Entertainment', label: 'Entertainment', color: 'bg-purple-500' },
  { value: 'Shopping', label: 'Shopping', color: 'bg-pink-500' },
  { value: 'Health', label: 'Health & Fitness', color: 'bg-green-500' },
  { value: 'Bills', label: 'Bills & Utilities', color: 'bg-red-500' },
  { value: 'Education', label: 'Education', color: 'bg-indigo-500' },
  { value: 'Travel', label: 'Travel', color: 'bg-teal-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' }
];

// Income sources
export const incomeSources = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Other'
];

// Payment methods
export const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Digital Wallet',
  'Other'
];
