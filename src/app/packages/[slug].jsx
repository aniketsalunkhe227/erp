// pages/packages/[slug].jsx
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import { 
  CalendarDays, MapPin, Clock, Users, Star, 
  Heart, Share2, CheckCircle, XCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

// Dummy package data (in production, fetch this from data.json based on slug)
const packageData = {
  "_id": "60a7c3d6e8c6f12345678901",
  "name": "Magical Kashmir: Paradise on Earth",
  "slug": "magical-kashmir-paradise-on-earth",
  "destinations": [
    { "city": "Srinagar", "state": "Jammu and Kashmir", "country": "India", "coordinates": { "latitude": 34.0837, "longitude": 74.7973 } },
    { "city": "Gulmarg", "state": "Jammu and Kashmir", "country": "India", "coordinates": { "latitude": 34.0484, "longitude": 74.3805 } },
    { "city": "Pahalgam", "state": "Jammu and Kashmir", "country": "India", "coordinates": { "latitude": 34.0159, "longitude": 75.3145 } },
    { "city": "Sonmarg", "state": "Jammu and Kashmir", "country": "India", "coordinates": { "latitude": 34.3068, "longitude": 75.3206 } }
  ],
  "duration": { "nights": 6, "days": 7 },
  "description": "Experience the enchanting beauty of Kashmir with our 7-day tour package. Visit the stunning destinations of Srinagar, Gulmarg, Pahalgam, and Sonmarg. Enjoy a stay in traditional houseboats, witness breathtaking landscapes, and create memories to cherish forever.",
  "richTextDescription": "<h2>Welcome to Paradise on Earth</h2><p>Kashmir's breathtaking beauty has earned it the title of <strong>\"Paradise on Earth\"</strong>, and our carefully curated 7-day tour package gives you the perfect opportunity to experience this heaven.</p><h3>What makes this trip special?</h3><ul><li>Stay in traditional Kashmiri houseboats on the serene Dal Lake</li><li>Experience the thrill of a Shikara ride on the pristine waters</li><li>Visit Asia's largest tulip garden (seasonal)</li><li>Enjoy a gondola ride with panoramic views in Gulmarg</li><li>Witness the stunning landscapes of Pahalgam and Sonmarg</li><li>Shop for authentic Kashmiri handicrafts, saffron, and dry fruits</li></ul><p>Our experienced guides will ensure you discover both popular attractions and hidden gems while enjoying the warm hospitality of the locals.</p>",
  "inclusions": [
    "6 nights accommodation (3 nights in Srinagar houseboat, 1 night in Gulmarg, 1 night in Pahalgam, 1 night in Sonmarg)",
    "Daily breakfast and dinner",
    "Airport transfers",
    "All sightseeing as per itinerary",
    "Shikara ride on Dal Lake",
    "Gondola ride in Gulmarg (Phase 1)",
    "All applicable taxes",
    "English-speaking tour guide"
  ],
  "exclusions": [
    "Airfare",
    "Lunch",
    "Personal expenses",
    "Travel insurance",
    "Entry fees to monuments not mentioned in the itinerary",
    "Activities marked as optional",
    "Gondola ride Phase 2 in Gulmarg",
    "Tips for guides and drivers"
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Srinagar - Houseboat Check-in",
      "description": "Upon arrival at Sheikh ul-Alam International Airport, our representative will greet you and transfer you to your houseboat on Dal Lake. Enjoy a traditional Kashmiri welcome with Kahwa tea. In the evening, experience the mesmerizing Shikara ride on Dal Lake and witness the floating vegetable markets and the life of locals living on the lake.",
      "activities": ["Airport transfer", "Houseboat check-in", "Evening Shikara ride"],
      "meals": { "breakfast": false, "lunch": false, "dinner": true },
      "accommodation": "Deluxe Houseboat, Dal Lake"
    },
    {
      "day": 2,
      "title": "Srinagar Local Sightseeing",
      "description": "After breakfast, embark on a full-day sightseeing tour of Srinagar. Visit the famous Mughal Gardens including Nishat Bagh (Garden of Pleasure), Shalimar Bagh (Abode of Love), and Chashme Shahi (Royal Spring). Later, visit the ancient Shankaracharya Temple situated on a hill with panoramic views of the city. End your day with a visit to the local handicraft markets.",
      "activities": ["Mughal Gardens tour", "Shankaracharya Temple visit", "Handicraft market shopping"],
      "meals": { "breakfast": true, "lunch": false, "dinner": true },
      "accommodation": "Deluxe Houseboat, Dal Lake"
    },
    {
      "day": 3,
      "title": "Srinagar to Gulmarg",
      "description": "After breakfast, check out from the houseboat and drive to Gulmarg (56 km, approximately 2 hours). Known as the 'Meadow of Flowers', Gulmarg is famous for having one of the highest gondola rides in the world. Enjoy the gondola ride up to Kongdori (Phase 1) with breathtaking views of the Himalayas. You can also opt for the second phase of the gondola (optional, at extra cost) that takes you close to the Alpather Glacier.",
      "activities": ["Scenic drive to Gulmarg", "Gondola ride (Phase 1)", "Optional: Gondola Phase 2"],
      "meals": { "breakfast": true, "lunch": false, "dinner": true },
      "accommodation": "Hotel Royal Park, Gulmarg"
    }
  ],
  "basicPrice": 28999,
  "currency": "INR",
  "pricingOptions": [
    { "title": "Standard Package", "accommodation": "Standard houseboats and 3-star hotels", "price": 28999, "maxGuests": 2 },
    { "title": "Deluxe Package", "accommodation": "Premium houseboats and 4-star hotels", "price": 35999, "maxGuests": 2 },
    { "title": "Luxury Package", "accommodation": "Super Deluxe houseboats and 5-star hotels", "price": 45999, "maxGuests": 2 },
    { "title": "Family Package", "accommodation": "Family rooms in hotels and connected houseboat rooms", "price": 56999, "maxGuests": 4 }
  ],
  "departureDate": ["2025-05-15T00:00:00.000Z", "2025-05-22T00:00:00.000Z", "2025-06-05T00:00:00.000Z", "2025-06-19T00:00:00.000Z"],
  "mainImage": "kashmir_main_image.jpg",
  "galleryImages": ["kashmir_gallery_1.jpg", "kashmir_gallery_2.jpg", "kashmir_gallery_3.jpg", "kashmir_gallery_4.jpg"],
  "highlights": [
    "Stay in authentic Kashmiri houseboats on Dal Lake",
    "Experience the highest gondola ride in Gulmarg",
    "Visit the stunning Betaab Valley and Thajiwas Glacier",
    "Explore the historical Mughal Gardens",
    "Shop for authentic Kashmiri handicrafts and saffron"
  ],
  "category": "family",
  "difficulty": "easy",
  "averageRating": 4.8,
  "faqs": [
    {
      "question": "What is the best time to visit Kashmir?",
      "answer": "The best time to visit Kashmir is from March to October. Spring (March-May) offers blooming flowers and pleasant weather. Summer (June-August) is ideal for outdoor activities. Autumn (September-October) presents stunning fall colors."
    },
    {
      "question": "Is Kashmir safe for tourists?",
      "answer": "Yes, the tourist areas in Kashmir are safe for visitors. The tourism industry is well-established, and the locals are known for their hospitality. However, as with any travel, it's advisable to stay updated with the current situation and follow local guidelines."
    },
    {
      "question": "What type of clothes should I pack?",
      "answer": "Kashmir's weather varies by season. For summer (June-August), light woolens and full-sleeve clothes are recommended. For spring and autumn, a mix of light and heavy woolens is ideal. Don’t forget to pack comfortable walking shoes, sunscreen, and a hat."
    }
  ],
  "additionalServices": [
    {
      "name": "Professional Photography Service",
      "description": "A professional photographer will accompany you throughout the trip to capture your special moments.",
      "price": 7999,
      "isOptional": true
    },
    {
      "name": "Kashmiri Cooking Class",
      "description": "Learn to prepare traditional Kashmiri dishes like Rogan Josh, Dum Aloo, and Kahwa tea from local experts.",
      "price": 1999,
      "isOptional": true
    }
  ],
  "reviews": [
    {
      "userId": "60a7c3d6e8c6f12345678902",
      "rating": 5,
      "title": "Once in a lifetime experience!",
      "comment": "This trip exceeded all our expectations. The houseboat stay was magical, and the landscapes were breathtaking. Our guide Farooq was knowledgeable and made us feel welcome.",
      "images": ["review1_image1.jpg", "review1_image2.jpg"],
      "date": "2024-09-12T00:00:00.000Z",
      "reply": {
        "text": "Thank you for your wonderful feedback! We’re delighted you enjoyed your Kashmir experience.",
        "date": "2024-09-13T00:00:00.000Z"
      }
    }
  ],
  "termsAndConditions": "Booking confirmation is subject to availability. 50% advance payment is required to confirm the booking. Cancellation charges apply as per policy.",
  "cancellationPolicy": "- More than 30 days before departure: 10% of total tour cost\n- 15-30 days before departure: 25% of total tour cost\n- 7-14 days before departure: 50% of total tour cost\n- Less than 7 days before departure: 100% of total tour cost",
  "visaRequirements": "Indian nationals do not require any special permits to visit Kashmir. Foreign nationals need a valid Indian visa."
};

export default function PackageDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  // State management
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packageData.pricingOptions[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openItinerary, setOpenItinerary] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);

  // Format date function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <Image
          src={`/images/${packageData.mainImage}`}
          alt={packageData.name}
          layout="fill"
          objectFit="cover"
          className="brightness-90 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 lg:p-12">
          <div className="flex items-center space-x-2 mb-2 animate-fade-in">
            <MapPin size={18} className="text-[#F14479]" />
            <span className="text-white text-sm">{packageData.destinations.map(d => d.city).join(' • ')}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">{packageData.name}</h1>
          <div className="flex flex-wrap gap-4 text-white animate-fade-in">
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{packageData.duration.days} days, {packageData.duration.nights} nights</span>
            </div>
            <div className="flex items-center">
              <Star size={16} className="mr-2 text-yellow-400" />
              <span>{packageData.averageRating} rating</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>Max {selectedPackage.maxGuests} guests</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 active:scale-95"
          >
            <Heart
              size={20}
              fill={isFavorite ? "#F14479" : "none"}
              color={isFavorite ? "#F14479" : "white"}
              className="transition-colors duration-200"
            />
          </button>
          <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 active:scale-95">
            <Share2 size={20} color="white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 -mt-10 relative">
          {/* Left Column - Package Details */}
          <div className="w-full lg:w-2/3">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
                {['Overview', 'Itinerary', 'Gallery', 'Reviews', 'FAQs'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-[#F14479] ring-white ring-opacity-60 transition-all duration-300 ${
                        selected
                          ? 'bg-white dark:bg-gray-900 text-[#F14479] shadow'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-[#F14479]'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                {/* Overview Tab */}
                <Tab.Panel className="animate-fade-in">
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: packageData.richTextDescription }} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Highlights</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packageData.additionalServices.map((service, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{service.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-[#F14479]">₹{service.price.toLocaleString()}</span>
                            {service.isOptional && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Itinerary Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trip Itinerary</h3>
                  {packageData.itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-4 transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenItinerary(openItinerary === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">Day {day.day}: {day.title}</span>
                        {openItinerary === index ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      {openItinerary === index && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{day.description}</p>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Activities:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Meals:</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Breakfast: {day.meals.breakfast ? 'Included' : 'Not included'}, 
                            Lunch: {day.meals.lunch ? 'Included' : 'Not included'}, 
                            Dinner: {day.meals.dinner ? 'Included' : 'Not included'}
                          </p>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Accommodation:</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{day.accommodation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </Tab.Panel>

                {/* Gallery Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Photo Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {packageData.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        <Image
                          src={`/images/${image}`}
                          alt={`Gallery image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                {/* Reviews Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
                  <div className="space-y-6">
                    {packageData.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{review.title}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {review.images.map((img, imgIndex) => (
                              <Image
                                key={imgIndex}
                                src={`/images/${img}`}
                                alt={`Review image ${imgIndex + 1}`}
                                width={64}
                                height={64}
                                className="object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Posted on {new Date(review.date).toLocaleDateString()}
                        </div>
                        {review.reply && (
                          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{review.reply.text}</p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Replied on {new Date(review.reply.date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                {/* FAQs Tab */}
                <Tab.Panel className="animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {packageData.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                          {openFAQ === index ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </button>
                        {openFAQ === index && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:sticky lg:top-20">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 transition-all duration-300">
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
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F14479] transition-all duration-200"
                  >
                    {packageData.pricingOptions.map((option) => (
                      <option key={option.title} value={option.title}>
                        {option.title} - ₹{option.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F14479] transition-all duration-200"
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">Price per person</span>
                  <span className="text-2xl font-bold text-[#F14479]">₹{selectedPackage.price.toLocaleString()}</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-[#F14479] text-white font-medium shadow-lg shadow-[#F14479]/20 hover:shadow-[#F14479]/30 transition-all duration-300 active:scale-95">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information Section */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Important Information</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenPolicy(openPolicy === 'terms' ? null : 'terms')}
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <span className="font-medium text-gray-900 dark:text-white">Terms and Conditions</span>
              {openPolicy === 'terms' ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {openPolicy === 'terms' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                <p className="text-sm text-gray-700 dark:text-gray-300">{packageData.termsAndConditions}</p>
              </div>
            )}
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenPolicy(openPolicy === 'cancellation' ? null : 'cancellation')}
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <span className="font-medium text-gray-900 dark:text-white">Cancellation Policy</span>
              {openPolicy === 'cancellation' ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {openPolicy === 'cancellation' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{packageData.cancellationPolicy}</p>
              </div>
            )}
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenPolicy(openPolicy === 'visa' ? null : 'visa')}
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <span className="font-medium text-gray-900 dark:text-white">Visa Requirements</span>
              {openPolicy === 'visa' ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {openPolicy === 'visa' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 animate-expand">
                <p className="text-sm text-gray-700 dark:text-gray-300">{packageData.visaRequirements}</p>
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