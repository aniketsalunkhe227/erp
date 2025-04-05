"use client" ;
import { useState , useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import kashmirrImage from './kashmirrr.jpeg';
import { Tab } from "@headlessui/react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Dummy package data
const packageData = {
  _id: "60a7c3d6e8c6f12345678901",
  name: "Magical Kashmir: Paradise on Earth",
  slug: "magical-kashmir-paradise-on-earth",
  destinations: [
    { city: "Srinagar", state: "Jammu and Kashmir", country: "India" },
    { city: "Gulmarg", state: "Jammu and Kashmir", country: "India" },
    { city: "Pahalgam", state: "Jammu and Kashmir", country: "India" },
    { city: "Sonmarg", state: "Jammu and Kashmir", country: "India" },
  ],
  duration: { nights: 6, days: 7 },
  description:
    "Experience the enchanting beauty of Kashmir with our 7-day tour package. Visit the stunning destinations of Srinagar, Gulmarg, Pahalgam, and Sonmarg. Enjoy a stay in traditional houseboats, witness breathtaking landscapes, and create memories to cherish forever.",
  richTextDescription:
    "<h2>Welcome to Paradise on Earth</h2><p>Kashmir's breathtaking beauty has earned it the title of <strong>\"Paradise on Earth\"</strong>, and our carefully curated 7-day tour package gives you the perfect opportunity to experience this heaven.</p><h3>What makes this trip special?</h3><ul><li>Stay in traditional Kashmiri houseboats on the serene Dal Lake</li><li>Experience the thrill of a Shikara ride on the pristine waters</li><li>Visit Asia's largest tulip garden (seasonal)</li></ul>",
  inclusions: [
    "6 nights accommodation ",
    "Daily breakfast and dinner",
    "Airport transfers",
    "All sightseeing as per itinerary",
    "Shikara ride on Dal Lake",
    "+ 3 more included",
  ],
  exclusions: [
    "Airfare",
    "Lunch",
    "Personal expenses",
    "Travel insurance",
    "Entry fees to monuments not mentioned in the itinerary",
    "+ 3 more excluded",
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Srinagar - Houseboat Check-in",
      description:
        "Upon arrival at Sheikh ul-Alam International Airport, transfer to your houseboat on Dal Lake. Enjoy a traditional Kashmiri welcome with Kahwa tea. Evening Shikara ride.",
      activities: ["Airport transfer", "Houseboat check-in", "Shikara ride"],
    },
    {
      day: 2,
      title: "Srinagar Local Sightseeing",
      description:
        "Visit Mughal Gardens including Nishat Bagh and Shalimar Bagh. Explore Shankaracharya Temple.",
      activities: ["Mughal Gardens tour", "Temple visit"],
    },
    {
      day: 3,
      title: "Excursion to Gulmarg",
      description:
        "Drive to Gulmarg, known for its scenic meadows and cable car rides. Enjoy the Gondola ride up to Apharwat Peak. Optional activities include pony rides and skiing (seasonal). Return to Srinagar in the evening.",
      activities: ["Gondola ride", "Pony ride", "Sightseeing"],
    },
    {
      day: 4,
      title: "Day Trip to Pahalgam",
      description:
        "Drive to Pahalgam, the Valley of Shepherds. En route visit saffron fields and the ruins of Avantipur. Explore the Lidder River, enjoy optional rafting or pony rides. Return to Srinagar by evening.",
      activities: ["Sightseeing", "Avantipur ruins", "Lidder River visit"],
    },
    {
      day: 5,
      title: "Departure from Srinagar",
      description:
        "After breakfast, check out from your hotel or houseboat. Transfer to Srinagar airport for your return journey with beautiful memories of Kashmir.",
      activities: ["Check-out", "Airport transfer"],
    },
  ]
   ,
  basicPrice: 28999,
  currency: "INR",
  pricingOptions: [
    { title: "Standard Package", price: 28999, maxGuests: 2 },
    { title: "Deluxe Package", price: 35999, maxGuests: 2 },
  ],
  departureDate: ["2025-05-15T00:00:00.000Z", "2025-06-05T00:00:00.000Z"],
  mainImage: "/kashmirpackage.jpg",
  galleryImages: [
    kashmirrImage ,
    "kashmirpackage.jpg",
    "/kashmir_gallery_3.jpg",
  ],
  highlights: [
    "Stay in authentic Kashmiri houseboats on Dal Lake",
    "Experience the highest gondola ride in Gulmarg",
    "Visit the stunning Betaab Valley",
  ],
  additionalServices: [
    {
      name: "Professional Photography Service",
      description: "A photographer will capture your trip moments.",
      price: 7999,
      isOptional: true,
    },
    {
      name: "Kashmiri Cooking Class",
      description: "Learn to cook Kashmiri dishes like Rogan Josh.",
      price: 1999,
      isOptional: true,
    },
  ],
  reviews: [
    {
      userId: "60a7c3d6e8c6f12345678902",
      rating: 5,
      title: "Once in a lifetime experience!",
      comment:
        "This trip exceeded all our expectations. The houseboat stay was magical, and the landscapes were breathtaking. Our guide Farooq was knowledgeable and made us feel welcome. The itinerary was perfectly balanced with activities and rest time.",
      date: "2024-09-12T00:00:00.000Z",
      reply: {
        text: "Thank you for your wonderful feedback! We're delighted that you enjoyed your Kashmir experience. We look forward to hosting you again in the future.",
        date: "2024-09-13T00:00:00.000Z",
      },
    },
    {
      userId: "60a7c3d6e8c6f12345678903",
      rating: 4,
      title: "Beautiful trip with minor hiccups",
      comment: "Great views, but had some minor issues with scheduling.",
      date: "2024-08-25T00:00:00.000Z",
    },
  ],
  faqs: [
    {
      question: "What is the best time to visit Kashmir?",
      answer:
        "March to October is ideal. Spring (March-May) offers blooming flowers, and summer (June-August) is great for outdoor activities.",
      reply: null,
    },
    {
      question: "Is Kashmir safe for tourists?",
      answer: "Yes, tourist areas are safe with local hospitality.",
      reply: null,
    },
  ],
  termsAndConditions: "Subject to availability. 50% advance payment required.",
};

export default function PackageDetailPage() {
    const [selectedDate, setSelectedDate] = useState("");
    
    const [mounted, setMounted] = useState(false); // ✅ define `mounted` BEFORE using it


  const [selectedPackage, setSelectedPackage] = useState(
    packageData.pricingOptions[0]
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [openItinerary, setOpenItinerary] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const { theme, setTheme } = useTheme(); // Still included but not used for toggling in this fix  const [openPolicy, setOpenPolicy] = useState(null);
    const [isReadMore, setIsReadMore] = useState(false);

    const [openPolicy, setOpenPolicy] = useState(null);




  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const shortDescription = packageData.richTextDescription.substring(
    0,
    150
  ); // Show first 150 characters

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Add this function to toggle dark mode
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  // Update the document class when dark mode changes

    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 transition-colors duration-300  dark:bg-neutral-900 dark:!bg-[radial-gradient(circle_at_left_70%,#F14479_0%,transparent_20%),radial-gradient(circle_at_top_right,#F14479_0%,transparent_20%)]`}>  
    
{/* <div class="min-h-screen bg-gray-50 transition-colors duration-300  */}
    {/* dark:bg-neutral-900 dark:!bg-[radial-gradient(circle_at_left_70%,#F14479_0%,transparent_20%),radial-gradient(circle_at_top_right,#F14479_0%,transparent_20%)]">   Hero Section */}
      <div className="relative h-[60vh] sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
        <Image
          src={packageData.mainImage}
          alt={packageData.name}
          layout="fill"
          objectFit="cover"
          className="brightness-90 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6 lg:p-12 lg:pb-10 pb-10 ">
          <div className="flex items-center space-x-2 mb-2 animate-fade-in">
            <MapPin size={18} className="text-[#F14479]" />
            <span className="text-white text-sm">
              {packageData.destinations.map((d) => d.city).join(" • ")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">
            {packageData.name}
          </h1>
          <div className="flex flex-wrap gap-2 text-white animate-fade-in">
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>
                {packageData.duration.days} days, {packageData.duration.nights}{" "}
                nights
              </span>
            </div>
            <div className="flex items-center">
              <Star size={16} className="mr-2 text-yellow-400" />
              <span>4.8 rating</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>Max {selectedPackage.maxGuests} guests</span>
            </div>
          </div>
        </div>
                    <div className="absolute top-4 right-4 flex space-x-2 ">
                    <button
  onClick={toggleDarkMode}
  className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
  title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
>
  {theme === 'dark' ? (
    // Sun icon for dark mode
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    // Moon icon for light mode
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )}
</button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
          >
            <Heart
              size={20}
              fill={isFavorite ? "#F14479" : "none"}
              color={isFavorite ? "#F14479" : "white"}
            />
          </button>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300">
            <Share2 size={20} color="white" />
                  </button>
          
            


        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:space-x-8 -mt-10 relative">
          {/* Left Column - Package Details */}
          <div className="w-full lg:w-2/3">
            <Tab.Group>
            <Tab.List className="flex overflow-x-auto hide-scrollbar md:overflow-visible rounded-xl bg-gray-100 dark:bg-gray-800 p-1.5 mb-6">
  {["Overview", "Itinerary", "Gallery", "Reviews", "FAQs"].map(
    (tab) => (
      <Tab
        key={tab}
        className={({ selected }) =>
          `w-full whitespace-nowrap py-2 px-2 md:px-4 text-base font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-[#F14479] ring-white ring-opacity-60 transition-all duration-300 ${
            selected
              ? "bg-white dark:bg-gray-900 text-[#F14479] shadow"
              : "text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-[#F14479]"
          }`
        }
      >
        {tab}
      </Tab>
                  )
                )}
              </Tab.List>
              <Tab.Panels>
                {/* Overview Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: isReadMore
                          ? packageData.richTextDescription
                          : `${shortDescription}...`,
                      }}
                    />
                    <button
                      onClick={() => setIsReadMore(!isReadMore)}
                      className="text-[#F14479] text-sm font-medium mt-2"
                    >
                      {isReadMore ? "Read Less" : "Read More"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        What's Included
                      </h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        {packageData.inclusions.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle
                              size={16}
                              className="text-green-500 mr-2"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Not Included
                      </h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        {packageData.exclusions.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <XCircle size={16} className="text-red-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Highlights
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Enhance Your Trip
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packageData.additionalServices.map((service, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {service.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-[#F14479]">
                              ₹{service.price.toLocaleString()}
                            </span>
                            <button className="text-xs text-[#F14479] font-medium">
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Itinerary Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Trip Itinerary
                  </h3>
                  {packageData.itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-900 rounded-xl shadow-md mb-4"
                    >
                      <button
                        onClick={() =>
                          setOpenItinerary(openItinerary === index ? null : index)
                        }
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Day {day.day}: {day.title}
                          </span>
                        </div>
                        {openItinerary === index ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      {openItinerary === index && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 animate-expand">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {day.description}
                          </p>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            Activities:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </Tab.Panel>

                {/* Gallery Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {packageData.galleryImages.map((image, index) => (
    <div
      key={index}
      className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md"
    >
      <img
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  ))}
</div>
                </Tab.Panel>

                {/* Reviews Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Customer Reviews
                  </h3>
                  <div className="space-y-6">
                    {packageData.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                              {review.title}
                            </span>
                            <div className="flex ml-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {review.comment}
                        </p>
                        {review.reply && (
                          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {review.reply.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Reply from Kashmir Travels - {formatDate(review.reply.date)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                {/* FAQs Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-6">
                    {packageData.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4"
                      >
                        <button
                          onClick={() =>
                            setOpenFAQ(openFAQ === index ? null : index)
                          }
                          className="w-full flex items-center justify-between text-left"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {faq.question}
                          </span>
                          {openFAQ === index ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </button>
                        {openFAQ === index && (
                          <div className="mt-2 animate-expand">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Right Column - Sticky Booking Widget */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-20">
            <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800/30 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300">                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Book This Package
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Package Type
                    </label>
                    <select
                      value={selectedPackage.title}
                      onChange={(e) => {
                        const pkg = packageData.pricingOptions.find(
                          (p) => p.title === e.target.value
                        );
                        setSelectedPackage(pkg);
                      }}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F14479]"
                    >
                      {packageData.pricingOptions.map((option) => (
                        <option key={option.title} value={option.title}>
                          {option.title} - ₹{option.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Departure Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F14479]"
                    >
                      <option value="">Select a date</option>
                      {packageData.departureDate.map((date) => (
                        <option key={date} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Package Price
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#F14479]">
                      ₹{selectedPackage.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#F14479]">
                      ₹{(selectedPackage.price * 0.9).toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full py-2 sm:py-3 rounded-xl bg-[#F14479] text-white font-medium shadow-lg hover:shadow-[#F14479]/30 transition-all duration-300">
                    Book Now
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By booking, you agree to our Terms & Conditions
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Need help? Call us at +91-12345 67890
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* </div>
      </div> */}

      {/* Important Information Section */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Important Information
        </h3>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
            <button
              onClick={() =>
                setOpenPolicy(openPolicy === "terms" ? null : "terms")
              }
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                Terms and Conditions
              </span>
              {openPolicy === "terms" ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {openPolicy === "terms" && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {packageData.termsAndConditions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
            </div>
     
  );
}

// Custom animations for Tailwind
const tailwindConfig = `
  @layer utilities {
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    .animate-slide-up {
      animation: slideUp 0.5s ease-out;
    }
    .animate-expand {
      animation: expand 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes expand {
      from { opacity: 0; height: 0; }
      to { opacity: 1; height: auto; }
    }
  }
`;