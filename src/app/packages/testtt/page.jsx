"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { 
  CalendarDays, MapPin, Clock, Users, Star, 
  Heart, Share2, ChevronDown, ChevronUp, 
  Info, ArrowRight, CheckCircle, Camera, Coffee, Car , ChevronRight
} from 'lucide-react';

// Import package data
import packageData from '../data.json';

export default function PackageDetailPage() {
  // State management
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packageData.pricingOptions[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openItinerary, setOpenItinerary] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Scroll listener for header effects
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Format date function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  // Generate star ratings component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                        ${i === Math.floor(rating) && rating % 1 > 0 ? 'text-yellow-400 fill-yellow-400 opacity-50' : ''}`}
          />
        ))}
      </div>
    );
  };

  // Format price with discount
  const formatPrice = (price, discount = 0) => {
    const discountedPrice = price - (price * discount / 100);
    return (
      <div className="flex items-center">
        <span className="text-xl font-bold text-[#F14479]">₹{discountedPrice.toLocaleString()}</span>
        {discount > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 line-through">₹{price.toLocaleString()}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 font-sans">
      {/* Floating Header for Mobile - appears when scrolled */}
      {isMobile && isScrolled && (
        <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg z-50 p-4 shadow-md animate-slide-down transition-all duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">{packageData.name}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 active:scale-95 transition-all"
              >
                <Heart size={18} fill={isFavorite ? "#F14479" : "none"} color={isFavorite ? "#F14479" : "currentColor"} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 active:scale-95 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with improved animations */}
      <div className="relative h-80 sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-b-3xl">
        <Image
          src={`${packageData.mainImage}`}
          alt={packageData.name}
          layout="fill"
          objectFit="cover"
          className="brightness-95 hover:scale-105 transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 lg:p-12">
          <div className="flex items-center space-x-2 mb-2 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <MapPin size={18} className="text-[#F14479]" />
            <span className="text-white text-sm font-medium">{packageData.destinations.map(d => d.city).join(' • ')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            {packageData.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-white animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock size={14} className="mr-2" />
              <span className="text-sm">{packageData.duration.days} days, {packageData.duration.nights} nights</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star size={14} className="mr-2 text-yellow-400" />
              <span className="text-sm">{packageData.averageRating} rating</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Users size={14} className="mr-2" />
              <span className="text-sm">Max {selectedPackage.maxGuests} guests</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - larger and more visible */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-all duration-300 active:scale-90 shadow-lg"
            aria-label="Add to favorites"
          >
            <Heart
              size={20}
              fill={isFavorite ? "#F14479" : "none"}
              color={isFavorite ? "#F14479" : "white"}
              className="transition-colors duration-200"
            />
          </button>
          <button 
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-all duration-300 active:scale-90 shadow-lg"
            aria-label="Share"
          >
            <Share2 size={20} color="white" />
          </button>
        </div>
      </div>

      {/* Booking Card - Sticky for mobile only */}
      {isMobile && (
        <div className="sticky top-16 z-40 -mt-6 mx-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-800 animate-slide-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Starting from</p>
                <p className="text-xl font-bold text-[#F14479]">₹{selectedPackage.price.toLocaleString()}<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/person</span></p>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-[#F14479] text-white font-medium shadow-lg shadow-[#F14479]/20 hover:shadow-[#F14479]/30 transition-all duration-300 active:scale-95">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="flex flex-col lg:flex-row lg:space-x-8 relative">
          {/* Left Column - Package Details */}
          <div className="w-full lg:w-2/3">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 p-1 mb-6 overflow-x-auto no-scrollbar">
                {['Overview', 'Itinerary', 'Gallery', 'Reviews', 'FAQs'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `py-2.5 px-4 text-sm font-medium rounded-lg whitespace-nowrap focus:outline-none transition-all duration-300 ${
                        selected
                          ? 'bg-white dark:bg-gray-800 text-[#F14479] shadow'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-[#F14479]'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              
              <Tab.Panels className="mt-2">
                {/* Overview Tab */}
                <Tab.Panel className="animate-fade-in space-y-8">
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-medium prose-h2:text-2xl prose-h3:text-xl" 
                    dangerouslySetInnerHTML={{ __html: packageData.richTextDescription }} 
                  />
                  
                  {/* Highlights Section - Card style */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Info size={18} className="inline mr-2 text-[#F14479]" />
                      Highlights
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={16} className="mt-1 mr-2 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* What's Included/Excluded - Two column cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">What's Included</h3>
                      <ul className="space-y-2">
                        {packageData.inclusions.slice(0, 5).map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle size={14} className="mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                        {packageData.inclusions.length > 5 && (
                          <li className="text-sm text-[#F14479] font-medium mt-2">+ {packageData.inclusions.length - 5} more included</li>
                        )}
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Not Included</h3>
                      <ul className="space-y-2">
                        {packageData.exclusions.slice(0, 5).map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                            <ChevronRight size={14} className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                        {packageData.exclusions.length > 5 && (
                          <li className="text-sm text-[#F14479] font-medium mt-2">+ {packageData.exclusions.length - 5} more excluded</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Additional Services - Card grid with icons */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enhance Your Trip</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packageData.additionalServices.map((service, index) => {
                        // Determine icon based on service name
                        let ServiceIcon = Info;
                        if (service.name.includes('Photography')) ServiceIcon = Camera;
                        if (service.name.includes('Cooking')) ServiceIcon = Coffee;
                        if (service.name.includes('Car')) ServiceIcon = Car;
                        
                        return (
                          <div
                            key={index}
                            className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center mb-3">
                              <div className="p-2 rounded-full bg-[#F14479]/10 text-[#F14479] mr-3">
                                <ServiceIcon size={18} />
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#F14479]">₹{service.price.toLocaleString()}</span>
                              <button className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Add
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Itinerary Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your 7-Day Journey</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Experience the best of Kashmir with our carefully crafted itinerary</p>
                    
                    {/* Timeline style itinerary */}
                    <div className="relative space-y-1 mt-8">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="relative">
                          {/* Timeline line */}
                          {index < packageData.itinerary.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          
                          {/* Day card */}
                          <div className="mb-8 ml-12 relative">
                            {/* Circle marker */}
                            <div className="absolute -left-12 border-4 border-white dark:border-gray-900 bg-[#F14479] text-white font-bold rounded-full h-8 w-8 flex items-center justify-center text-xs">
                              {day.day}
                            </div>
                            
                            <div className={`border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${openItinerary === index ? 'shadow-md' : ''}`}>
                              <button
                                onClick={() => setOpenItinerary(openItinerary === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors duration-300"
                              >
                                <span className="font-medium text-gray-900 dark:text-white">{day.title}</span>
                                {openItinerary === index ? (
                                  <ChevronUp size={18} className="text-gray-500" />
                                ) : (
                                  <ChevronDown size={18} className="text-gray-500" />
                                )}
                              </button>
                              
                              {openItinerary === index && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 animate-expand">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{day.description}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Today's Activities</h4>
                                      <ul className="space-y-1">
                                        {day.activities.map((activity, actIndex) => (
                                          <li key={actIndex} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                            <CheckCircle size={14} className="mr-2 text-green-500" />
                                            {activity}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Included Meals</h4>
                                      <div className="flex space-x-3 mb-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${day.meals.breakfast ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                          Breakfast
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${day.meals.lunch ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                          Lunch
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${day.meals.dinner ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                          Dinner
                                        </span>
                                      </div>
                                      
                                      {day.accommodation && (
                                        <>
                                          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Accommodation</h4>
                                          <p className="text-sm text-gray-700 dark:text-gray-300">{day.accommodation}</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Gallery Tab - Improved layout with hover effects */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore Kashmir</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {packageData.galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''} rounded-xl overflow-hidden group cursor-pointer`}
                        >
                          <div className="aspect-w-3 aspect-h-2">
                            <img
                              src={`/images/${image}`}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                              <Camera size={20} className="text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Reviews Tab - Cards with better typography */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                      <div className="flex items-center">
                        <StarRating rating={packageData.averageRating} />
                        <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">{packageData.averageRating}/5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {packageData.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{review.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Posted on {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                          
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                              {review.images.map((img, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={`/images/${img}`}
                                  alt={`Review image ${imgIndex + 1}`}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-lg flex-shrink-0"
                                />
                              ))}
                            </div>
                          )}
                          
                          {review.reply && (
                            <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded-lg border-l-2 border-[#F14479]">
                              <p className="text-sm text-gray-700 dark:text-gray-300">{review.reply.text}</p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Reply from Kashmir Travels • {new Date(review.reply.date).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* FAQs Tab - Cleaner accordion style */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {packageData.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                            <div className={`p-1 rounded-full text-gray-500 transition-all duration-300 ${openFAQ === index ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                              {openFAQ === index ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </div>
                          </button>
                          
                          <div 
                            className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-40' : 'max-h-0'}`}
                          >
                            <div className="p-4 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Right Column - Booking Widget - Hidden on mobile */}
          <div className={`w-full lg:w-1/3 mt-8 lg:mt-0 ${isMobile ? 'hidden' : 'block'}`}>
            <div className="lg:sticky lg:top-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book This Package</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Type</label>
                    <select
                      value={selectedPackage.title}
                      onChange={(e) => {
                        const pkg = packageData.pricingOptions.find(p => p.title === e.target.value);
                        setSelectedPackage(pkg);
                      }}
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F14479] focus:border-transparent"
                    >
                      {packageData.pricingOptions.map(pkg => (
                        <option key={pkg.title} value={pkg.title}>{pkg.title} - ₹{pkg.price.toLocaleString()}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F14479] focus:border-transparent"
                    >
                      <option value="">Select a date</option>
                      {packageData.departureDate.map(date => (
                        <option key={date} value={date}>{formatDate(date)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Package Price</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{selectedPackage.price.toLocaleString()}</span>
                    </div>
                    
                    {packageData.discounts && packageData.discounts.length > 0 && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Discount</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -{packageData.discounts[0].amount}%
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                      {formatPrice(selectedPackage.price, packageData.discounts[0]?.amount || 0)}
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-[#F14479] hover:bg-[#e03e65] active:bg-[#d03558] text-white rounded-lg font-medium transition-all duration-300">
                    Book Now
                  </button>
                  
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <p className="mb-1">By booking, you agree to our <a href="#" className="text-[#F14479] hover:underline">Terms & Conditions</a></p>
                    <p>Need help? Call us at +91 12345 67890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}