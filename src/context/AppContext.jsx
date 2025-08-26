import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getLocalStorage, setLocalStorage, sampleExpenses, sampleIncome, sampleSavingsGoals } from '../utils/storage';

// Create context
const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  expenses: [],
  income: [],
  savingsGoals: [],
  theme: 'light',
  isAuthenticated: false
};

// Action types
const actionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  SET_INCOME: 'SET_INCOME',
  ADD_INCOME: 'ADD_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',
  SET_SAVINGS_GOALS: 'SET_SAVINGS_GOALS',
  ADD_SAVINGS_GOAL: 'ADD_SAVINGS_GOAL',
  UPDATE_SAVINGS_GOAL: 'UPDATE_SAVINGS_GOAL',
  DELETE_SAVINGS_GOAL: 'DELETE_SAVINGS_GOAL',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload, isAuthenticated: true };
    case actionTypes.LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    case actionTypes.SET_EXPENSES:
      return { ...state, expenses: action.payload };
    case actionTypes.ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    case actionTypes.UPDATE_EXPENSE:
      return { ...state, expenses: state.expenses.map(exp => exp.id === action.payload.id ? action.payload : exp) };
    case actionTypes.DELETE_EXPENSE:
      return { ...state, expenses: state.expenses.filter(exp => exp.id !== action.payload) };
    case actionTypes.SET_INCOME:
      return { ...state, income: action.payload };
    case actionTypes.ADD_INCOME:
      return { ...state, income: [...state.income, action.payload] };
    case actionTypes.DELETE_INCOME:
      return { ...state, income: state.income.filter(inc => inc.id !== action.payload) };
    case actionTypes.SET_SAVINGS_GOALS:
      return { ...state, savingsGoals: action.payload };
    case actionTypes.ADD_SAVINGS_GOAL:
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
    case actionTypes.UPDATE_SAVINGS_GOAL:
      return { ...state, savingsGoals: state.savingsGoals.map(goal => goal.id === action.payload.id ? action.payload : goal) };
    case actionTypes.DELETE_SAVINGS_GOAL:
      return { ...state, savingsGoals: state.savingsGoals.filter(goal => goal.id !== action.payload) };
    case actionTypes.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: newTheme };
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = getLocalStorage('expenseUser');
    const savedExpenses = getLocalStorage('expenses') || [];
    const savedIncome = getLocalStorage('income') || [];
    const savedSavingsGoals = getLocalStorage('savingsGoals') || [];
    const savedTheme = getLocalStorage('theme') || 'light';

    if (savedUser) dispatch({ type: actionTypes.SET_USER, payload: savedUser });
    dispatch({ type: actionTypes.SET_EXPENSES, payload: savedExpenses });
    dispatch({ type: actionTypes.SET_INCOME, payload: savedIncome });
    dispatch({ type: actionTypes.SET_SAVINGS_GOALS, payload: savedSavingsGoals });
    dispatch({ type: actionTypes.SET_THEME, payload: savedTheme });
  }, []);

  // Save to localStorage
  useEffect(() => { if (state.user) setLocalStorage('expenseUser', state.user); }, [state.user]);
  useEffect(() => setLocalStorage('expenses', state.expenses), [state.expenses]);
  useEffect(() => setLocalStorage('income', state.income), [state.income]);
  useEffect(() => setLocalStorage('savingsGoals', state.savingsGoals), [state.savingsGoals]);
  useEffect(() => {
    setLocalStorage('theme', state.theme);
    if (state.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.theme]);

  // Actions
  const actions = {
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    logout: () => {
      dispatch({ type: actionTypes.LOGOUT });
      localStorage.removeItem('expenseUser');
    },
    toggleTheme: () => dispatch({ type: actionTypes.TOGGLE_THEME }),
    loginDemo: () => {
      const demoUser = { id: 'demo', name: 'Demo User', email: 'demo@expensetracker.com', avatar: null };
      dispatch({ type: actionTypes.SET_USER, payload: demoUser });
      if (state.expenses.length === 0) dispatch({ type: actionTypes.SET_EXPENSES, payload: sampleExpenses });
      if (state.income.length === 0) dispatch({ type: actionTypes.SET_INCOME, payload: sampleIncome });
      if (state.savingsGoals.length === 0) dispatch({ type: actionTypes.SET_SAVINGS_GOALS, payload: sampleSavingsGoals });
    },
    addExpense: (expense) => dispatch({ type: actionTypes.ADD_EXPENSE, payload: { ...expense, id: Date.now(), createdAt: new Date().toISOString() } }),
    updateExpense: (expense) => dispatch({ type: actionTypes.UPDATE_EXPENSE, payload: expense }),
    deleteExpense: (id) => dispatch({ type: actionTypes.DELETE_EXPENSE, payload: id }),
    addIncome: (income) => dispatch({ type: actionTypes.ADD_INCOME, payload: { ...income, id: Date.now(), createdAt: new Date().toISOString() } }),
    deleteIncome: (id) => dispatch({ type: actionTypes.DELETE_INCOME, payload: id }),
    addSavingsGoal: (goal) => dispatch({ type: actionTypes.ADD_SAVINGS_GOAL, payload: { ...goal, id: Date.now(), createdAt: new Date().toISOString() } }),
    updateSavingsGoal: (goal) => dispatch({ type: actionTypes.UPDATE_SAVINGS_GOAL, payload: goal }),
    deleteSavingsGoal: (id) => dispatch({ type: actionTypes.DELETE_SAVINGS_GOAL, payload: id })
  };

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>;
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
