import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Heart, Calendar, Clock, Star, Users, Flame , MapPin, Tag } from "lucide-react";

const PackageCard = ({ packageData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // TikTok-like animation effect on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Instagram-like heart animation
  const handleLikeClick = () => {
    if (!isLiked) {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    }
    setIsLiked(!isLiked);
  };

  // Double-tap to like (Instagram style)
  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    }
  };

  // Add random tags that might be relevant to a holiday package
  const tags = [
    { label: "Family Friendly", color: "bg-blue-100 text-blue-600" },
    { label: "Hot Deal", color: "bg-red-100 text-red-600" },
    { label: "Best Seller", color: "bg-green-100 text-green-600" },
    { label: "Last Minute", color: "bg-orange-100 text-orange-600" },
  ];
  
  // Select a random tag for demo purposes
  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  
  // Trending indicator for packages with high demand
  const isTrending = packageData.averageRating > 4.5;
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Image with hover effect and double-tap like */}
      <div 
        className="relative h-48 overflow-hidden group"
        onDoubleClick={handleDoubleClick}
      >
        <img 
          src={packageData.mainImage} 
          alt={packageData.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Heart animation button */}
        <button 
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-xl transition-all"
        >
          <Heart 
            size={16} 
            fill={isLiked ? "#F14479" : "none"} 
            stroke={isLiked ? "#F14479" : "white"} 
            strokeWidth={2}
            className={`transition-all ${isLiked ? "scale-100" : "scale-90"}`}
          />
        </button>

        {/* Instagram-style big heart animation on double-tap or like */}
        {isLikeAnimating && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Heart 
              size={64} 
              fill="#F14479" 
              stroke="none"
              className="animate-like-instagram"
            />
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/30 backdrop-blur-xl rounded-full py-1 px-2">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">{packageData.averageRating}</span>
        </div>
        
        {/* Tag badge */}
        <div className={`absolute bottom-3 left-3 z-10 flex items-center gap-1 ${randomTag.color} rounded-full py-1 px-2`}>
          <Tag size={12} />
          <span className="text-xs font-medium">{randomTag.label}</span>
        </div>
        
        {/* Trending badge if applicable */}
        {isTrending && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-white/30 backdrop-blur-xl rounded-full py-1 px-2 text-white">
            <Flame size={12} className="text-white" />
            <span className="text-xs font-medium">Trending</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        {/* Title and location */}
        <div className="mb-2">
          <h3 className="font-medium text-gray-800 dark:text-white">{packageData.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
            <MapPin size={12} />
            {packageData.destinations.slice(0, 2).map((dest, idx) => (
              <span key={idx} className="text-xs">
                {dest.city}{idx < Math.min(packageData.destinations.length - 1, 1) && ', '}
              </span>
            ))}
            {packageData.destinations.length > 2 && (
              <span className="text-xs">+{packageData.destinations.length - 2}</span>
            )}
          </div>
        </div>

        {/* Duration, difficulty and capacity */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 flex-wrap gap-y-2">
          <div className="flex items-center mr-3">
            <Calendar size={12} className="mr-1" />
            <span>{packageData.duration.days}D/{packageData.duration.nights}N</span>
          </div>

          <div className="flex items-center mr-3">
            <Users size={12} className="mr-1" />
            <span>2-8 people</span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
            <span className="text-xs">{packageData.difficulty}</span>
          </div>
        </div>

        {/* Quick highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {["Meals Included", "Guide", "Transport"].map((item, i) => (
            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
              {item}
            </span>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
            <div className="flex items-baseline">
              <span className="text-base font-medium text-[#F14479]">
                ₹{packageData.basicPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/person</span>
            </div>
          </div>

          <Link href={`/packages/test`}>
            <button className="px-4 py-2 rounded-full bg-[#F14479] text-white text-xs font-medium transition-transform hover:scale-105 active:scale-95">
              View Details
            </button>
          </Link>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx global>{`
        .animate-like-instagram {
          animation: likeAnimation 1s ease-in-out forwards;
        }
        
        @keyframes likeAnimation {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          15% {
            opacity: 1;
            transform: scale(1.2);
          }
          30% {
            transform: scale(0.95);
          }
          45% {
            transform: scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PackageCard;