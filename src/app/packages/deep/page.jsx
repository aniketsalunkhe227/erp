"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { 
  CalendarDays, MapPin, Clock, Users, Star, 
  Heart, Share2, ChevronDown, ChevronUp, 
  Info, ArrowRight, CheckCircle, Camera, Coffee, Car
} from 'lucide-react';
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

  // Animation styles
  const animationStyles = `
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes expand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 500px; opacity: 1; }
    }
    .animate-slide-down { animation: slideDown 0.3s ease-out; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-expand { animation: expand 0.2s ease-out; }
    .animate-slide-up { animation: slideDown 0.3s ease-out reverse; }
  `;

  // Check mobile and scroll
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  // Star rating component
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

  // Booking Widget
  const BookingWidget = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Package Type</label>
        <select
          value={selectedPackage.title}
          onChange={(e) => setSelectedPackage(packageData.pricingOptions.find(p => p.title === e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#F14479] transition-all"
        >
          {packageData.pricingOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title} - ₹{option.price.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departure Date</label>
        <div className="relative">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#F14479] appearance-none transition-all"
          >
            <option value="">Select departure date</option>
            {packageData.departureDate.map((date, index) => (
              <option key={index} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-4 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-300">Package Price</span>
          <span className="font-medium text-[#F14479]">₹{selectedPackage.price.toLocaleString()}</span>
        </div>
        {packageData.discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center text-green-600 dark:text-green-400">
            <span>{discount.type} Discount</span>
            <span>- ₹{(selectedPackage.price * discount.amount/100).toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center font-medium">
            <span>Total</span>
            <span className="text-lg text-[#F14479]">
              ₹{(
                selectedPackage.price - 
                packageData.discounts.reduce((acc, curr) => acc + (selectedPackage.price * curr.amount/100), 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setOpenPolicy(!openPolicy)}
          className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Terms & Conditions</span>
          {openPolicy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {openPolicy && (
          <div className="p-4 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 border-t animate-expand">
            <pre className="whitespace-pre-wrap font-sans">{packageData.termsAndConditions}</pre>
          </div>
        )}
      </div>

      <button className="w-full py-4 bg-[#F14479] hover:bg-[#D93E6B] text-white font-medium rounded-xl shadow-lg shadow-[#F14479]/20 transition-all">
        Book Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <style>{animationStyles}</style>

      {/* Mobile Header */}
      {isMobile && isScrolled && (
        <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg z-50 p-4 shadow-md animate-slide-down">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">{packageData.name}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all"
              >
                <Heart size={18} fill={isFavorite ? "#F14479" : "none"} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-80 sm:h-96 md:h-[500px] overflow-hidden rounded-b-3xl">
        <Image
          src={`/images/${packageData.mainImage}`}
          alt={packageData.name}
          fill
          className="object-cover brightness-95 hover:scale-105 transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 flex flex-col justify-end p-6 lg:p-12">
          <div className="flex items-center space-x-2 mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <MapPin size={18} className="text-[#F14479]" />
            <span className="text-white text-sm">{packageData.destinations.map(d => d.city).join(' • ')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {packageData.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-white animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-full">
              <Clock size={14} className="mr-2" />
              <span className="text-sm">{packageData.duration.days}d {packageData.duration.nights}n</span>
            </div>
            <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-full">
              <Star size={14} className="mr-2 text-yellow-400" />
              <span className="text-sm">{packageData.averageRating}/5</span>
            </div>
            <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-full">
              <Users size={14} className="mr-2" />
              <span className="text-sm">Max {selectedPackage.maxGuests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6 overflow-x-auto">
                {['Overview', 'Itinerary', 'Gallery', 'Reviews', 'FAQs'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selected ? 'bg-white dark:bg-gray-900 text-[#F14479] shadow' : 'text-gray-600 dark:text-gray-300'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="space-y-8">
                {/* Overview Tab */}
                <Tab.Panel className="space-y-8 animate-fade-in">
                  <div className="prose dark:prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: packageData.richTextDescription }} 
                  />
                  
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold flex items-center mb-4">
                      <Info size={18} className="mr-2 text-[#F14479]" />
                      Highlights
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={16} className="mt-1 mr-2 text-green-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab.Panel>

                {/* Itinerary Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-4">Your Journey</h3>
                    <div className="space-y-4">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenItinerary(openItinerary === index ? null : index)}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <span className="font-medium">Day {day.day}: {day.title}</span>
                            {openItinerary === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          {openItinerary === index && (
                            <div className="p-4 bg-white dark:bg-gray-900 border-t animate-expand">
                              <p className="text-gray-600 dark:text-gray-300 mb-4">{day.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Activities</h4>
                                  <ul className="space-y-1">
                                    {day.activities.map((activity, idx) => (
                                      <li key={idx} className="flex items-center text-sm">
                                        <CheckCircle size={14} className="mr-2 text-green-500" />
                                        {activity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Gallery Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {packageData.galleryImages.map((image, index) => (
                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                          <Image
                            src={`/images/${image}`}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Reviews Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">Reviews</h3>
                      <div className="flex items-center">
                        <StarRating rating={packageData.averageRating} />
                        <span className="ml-2">{packageData.averageRating}/5</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {packageData.reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{review.title}</h4>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* FAQs Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-4">FAQs</h3>
                    <div className="space-y-2">
                      {packageData.faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <span className="font-medium">{faq.question}</span>
                            {openFAQ === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          {openFAQ === index && (
                            <div className="p-4 bg-white dark:bg-gray-900 border-t animate-expand">
                              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-6 space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-4">Book Now</h3>
                <BookingWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}