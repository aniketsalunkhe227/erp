// pages/packages/index.jsx
"use client"
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Filter, Sun, Moon } from 'lucide-react';
import PackageCard from '../../components/PackageCard';

// Import sample data (in production, you'd fetch this from an API)
import sampleData from './data.json'; 

export default function Packages() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  
  // Simulate loading the data
  useEffect(() => {
    setPackages([sampleData]); // In production, this would be an API call
    setMounted(true);
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Filter packages based on search query
  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not mounted yet (for SSR), render a placeholder
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-black"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-lg bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            <span className="text-[#F14479]">Discover</span> Packages
          </h1>
          
          {/* Theme toggle button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-gray-200" /> : <Moon size={20} className="text-gray-700" />}
          </button>
        </div>
      </header>
      
      {/* Search and filter bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F14479] transition-all duration-300"
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Package grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* In production, you'd map through actual packages */}
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={index} packageData={pkg} />
            ))}
            {/* Add duplicate cards to fill the grid (just for demo) */}
            {[...Array(7)].map((_, index) => (
              <PackageCard key={`duplicate-${index}`} packageData={filteredPackages[0]} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-500 dark:text-gray-400">No packages found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}