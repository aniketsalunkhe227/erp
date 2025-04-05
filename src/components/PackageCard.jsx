// components/PackageCard.jsx
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Heart, Calendar, Clock, Star } from 'lucide-react';

const PackageCard = ({ packageData }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image container with gradient overlay */}
      <div className="relative h-48 sm:h-60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <img 
          src={`/images/${packageData.mainImage}`} 
          alt={packageData.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Like button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
        >
          <Heart 
            size={20} 
            fill={isLiked ? "#F14479" : "none"} 
            color={isLiked ? "#F14479" : "white"} 
            className="transition-all duration-300"
          />
        </button>
        
        {/* Destinations tag */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-1">
          {packageData.destinations.map((dest, idx) => (
            <span 
              key={idx} 
              className="text-xs font-medium py-1 px-2 rounded-full bg-white/20 backdrop-blur-sm text-white"
            >
              {dest.city}
            </span>
          ))}
        </div>
        
        {/* Rating */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center bg-white/20 backdrop-blur-sm rounded-full py-1 px-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-xs font-medium text-white">{packageData.averageRating}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">{packageData.name}</h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {packageData.description.substring(0, 100)}...
        </p>
        
        {/* Package details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Calendar size={16} className="mr-1" />
            <span className="text-xs">{packageData.duration.days} Days</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock size={16} className="mr-1" />
            <span className="text-xs">{packageData.duration.nights} Nights</span>
          </div>
          
          <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {packageData.difficulty}
            </span>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Starting from</span>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-[#F14479] dark:text-[#F14479]">
                ₹{packageData.basicPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">per person</span>
            </div>
          </div>
          
          <Link href={`/packages/${packageData.slug}`} className="group">
            <button className="px-4 py-2 rounded-full bg-[#F14479] text-white text-sm font-medium shadow-lg shadow-[#F14479]/20 hover:shadow-[#F14479]/30 transition-all duration-300 active:scale-95">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;