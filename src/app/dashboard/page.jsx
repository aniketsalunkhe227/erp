// app/dashboard/page.js
'use client'; // This is essential for client components in Next.js App Router

import { useState, useEffect } from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import { ShoppingCart, CreditCard, Package, Users, Clock, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  // State for theme
  const [theme, setTheme] = useState('light');
  
  // Effect to initialize theme from localStorage
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get the theme from localStorage or default to 'light'
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      
      // Apply the theme class to the document
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Stats data
  const stats = [
    { title: "Total Orders", value: "246", icon: <ShoppingCart className="h-6 w-6" />, color: "blue" },
    { title: "Monthly Revenue", value: "$24,500", icon: <CreditCard className="h-6 w-6" />, color: "green" },
    { title: "Products", value: "185", icon: <Package className="h-6 w-6" />, color: "purple" },
    { title: "Customers", value: "324", icon: <Users className="h-6 w-6" />, color: "yellow" },
  ];
  
  // Activities data
  const activities = [
    { 
      title: 'New Order #1042', 
      description: 'Customer: John Doe - $126.50',
      time: '15m ago',
      icon: <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    },
    { 
      title: 'Inventory Update', 
      description: 'Product ID: P78 - Stock reduced by 5',
      time: '2h ago',
      icon: <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    },
    { 
      title: 'New Expense Added', 
      description: 'Utilities - $245.00',
      time: '4h ago',
      icon: <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
    },
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto transition-colors duration-200 
                    dark:bg-gray-900 min-h-screen ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
                    hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? 
            <Moon className="h-5 w-5" /> : 
            <Sun className="h-5 w-5" />
          }
        </button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 
                        border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h2>
          {/* This would be a chart/table in production */}
          <div className="h-64 mt-4 flex items-center justify-center border border-dashed 
                          border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Order chart will be displayed here</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 
                        border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
            {activities.map((activity) => (
              <ActivityItem 
                key={activity.title}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                icon={activity.icon}
              />
            ))}
          </div>
          
          <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 
                           dark:text-blue-400 dark:hover:text-blue-300">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}