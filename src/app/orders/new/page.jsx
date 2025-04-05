"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  Trash2,
  User,
  CreditCard,
  Search,
  Phone,
  Mail,
  Coins,
  MapPin,
  Home,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Select from "react-select";


const BottomBar = ({ step, selectedItems, subtotal, navigateSteps, handleSubmit, loading }) => {
  const totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0);
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [step]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 left-0 right-0 mx-auto max-w-lg w-11/12 z-20 sm:bottom-6"
    >
<div className="bg-white/30 dark:bg-gray-900/30 px-3 py-3 backdrop-blur-md text-gray-800 dark:text-gray-200  rounded-3xl shadow-md flex items-center justify-between border border-white/40 dark:border-gray-700/50 transition-colors duration-300">
{/* Back button - iOS style with subtle background */}
<button
  onClick={() => navigateSteps("prev")}
  disabled={step === "products"}
  className="text-blue-600 dark:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-500 
             bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
             p-1.5 rounded-full transition-colors"
  aria-label="Previous step"
>
  <ChevronLeft size={20} />
</button>

        
        {/* Middle content - minimal iOS style */}
        <div className="flex items-center space-x-4 text-gray-900 dark:text-white">
  <div className="flex items-center">
    <ShoppingBag size={16} className="text-blue-700 dark:text-blue-300 mr-1.5" />
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {totalItems} {totalItems === 1 ? 'item' : 'items'}
    </span>
  </div>
  <div className="h-4 w-px bg-gray-400 dark:bg-gray-500"></div>
  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
    ₹{subtotal.toFixed(2)}
  </span>
</div>


        
        {/* Action button - iOS style primary action */}
        {step === "review" ? (
          <button
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0}
            className="text-white bg-blue-500  py-1.5 px-2 rounded-full text-sm font-medium disabled:opacity-40 transition-colors hover:bg-blue-600 whitespace-nowrap"
            aria-label="Place order"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        ) : (
          <button
          onClick={() => navigateSteps("next")}
          disabled={selectedItems.length === 0}
          className="text-blue-600 dark:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-500 
                     bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                     p-1.5 rounded-full transition-colors"
          aria-label="Next step"
        >
          <ChevronRight size={20} />
        </button>
        
        )}
      </div>

      {/* Bottom safe area - adjusts for iPhone notch/home indicator */}
      <div className="h-2 sm:h-0"></div>
    </motion.div>
  );
};





export default function CreateOrderPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);
  const [step, setStep] = useState("products");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [customers, setCustomers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState({ address: "", state: "" });
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [gstRate, setGstRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({ phone: "", email: "" });
  const router = useRouter();
  const mainContentRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/active");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = ["All", ...new Set(data.map((product) => product.category || "Uncategorized"))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (activeCategory === "All") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products.filter((product) => product.category === activeCategory));
      }
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, activeCategory]);

  // Add item to cart
  const addItem = (product, portionType) => {
    const portion = product.portions.find((p) => p.type === portionType) || { price: product.price, quantity: 1 };
    const existing = selectedItems.find((i) => i.product_id === product._id && i.portion === portionType);

    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.product_id === product._id && i.portion === portionType ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          product_id: product._id,
          portion: portionType,
          quantity: 1,
          price: portion.price,
          name: product.name,
          image: product.image_url,
        },
      ]);
    }
  };

  // Update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(index);
      return;
    }
    setSelectedItems(selectedItems.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item)));
  };

  // Remove item from cart
  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // Get quantity of a specific product portion
  const getProductQuantity = (productId, portionType) => {
    const item = selectedItems.find((i) => i.product_id === productId && i.portion === portionType);
    return item ? item.quantity : 0;
  };

  // Calculate totals
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = subtotal * (gstRate / 100);
  const total = subtotal + gstAmount - redeemPoints;

  // Validate customer inputs
  const validateCustomer = () => {
    const newErrors = { phone: "", email: "" };
    if (customer.phone && !/^\d{10}$/.test(customer.phone)) {
      newErrors.phone = "Phone must be a 10-digit number";
    }
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return !newErrors.phone && !newErrors.email;
  };

  // Handle customer selection with React Select
  const handleCustomerSelect = (selectedOption) => {
    if (selectedOption) {
      const selectedCustomer = customers.find((c) => c.name === selectedOption.value);
      if (selectedCustomer) {
        setCustomer({
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          email: selectedCustomer.email,
        });
      } else {
        setCustomer({ name: selectedOption.value, phone: "", email: "" });
      }
    } else {
      setCustomer({ name: "", phone: "", email: "" });
    }
  };

  // Submit order
  const handleSubmit = async () => {
    if (step === "customer" && !validateCustomer()) return;
    setLoading(true);
    const orderData = {
      customer_details: customer.name ? customer : null,
      payment_method: paymentMethod,
      notes,
      items: selectedItems,
      delivery_details: deliveryDetails.address ? deliveryDetails : null,
      redeem_points: redeemPoints,
      gst_rate: gstRate,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RlNzc2MWI2OWNmNTg4NmExYzg3ZjciLCJpYXQiOjE3NDMzNDcyOTIsImV4cCI6MTc0MzM1NDQ5Mn0.LALmZvcAdZD8SBfpQQwSM9rDLyPiMUUTFz8jA6wDaes`
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      router.push(`/orders/${data.order._id}`);
    } catch (error) {
      console.error(error);
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  // Navigate steps
  const navigateSteps = (direction) => {
    const steps = ["products", "customer", "review"];
    const currentIndex = steps.indexOf(step);
    let newStep;

    if (direction === "next" && currentIndex < steps.length - 1) {
      newStep = steps[currentIndex + 1];
    } else if (direction === "prev" && currentIndex > 0) {
      newStep = steps[currentIndex - 1];
    } else {
      return;
    }

    if (step === "customer" && direction === "next" && !validateCustomer()) {
      return;
    }

    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }

    setStep(newStep);
  };

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-950 shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="text-gray-600 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Order</h1>
        <div className="relative">
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {selectedItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
          <button onClick={() => setStep("review")} className="text-gray-600 dark:text-gray-300">
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {/* <Sidebar /> */}
      </div>

      <div className="flex-1  pt-14 lg:pt-0">
        {/* Step Navigation - Desktop */}
        <div className="hidden lg:flex justify-between mx-6 mt-6 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          {["products", "customer", "review"].map((s, index) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 py-3 font-medium transition-colors ${
                step === s ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${index === 0 ? "rounded-l-full" : index === 2 ? "rounded-r-full" : ""}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div ref={mainContentRef} className="p-4 lg:p-6 pb-32 lg:pb-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Products */}
            {step === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Search & Filter Bar */}
                <div className="sticky top-14 lg:top-0 z-10 bg-gray-50 dark:bg-gray-900 pt-2 pb-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"
                      aria-label="Search products"
                    />
                    <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  <div className="flex overflow-x-auto pb-2 space-x-2 hide-scrollbar">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                          activeCategory === category
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                      {searchQuery ? "No products found matching your search" : "Loading products..."}
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
                      >
                        <div className="relative h-32">
                          <img
                            src={
                              product.image_url && !product.image_url.includes("imgres")
                                ? product.image_url
                                : "https://via.placeholder.com/150"
                            }
                            alt={product.name}
                            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                            className="w-full h-full object-cover transition-opacity"
                          />
                          {product.discount && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3
                            className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2"
                            title={product.description}
                          >
                            {product.description}
                          </p>
                          <div className="space-y-2">
                            {(product.portions && product.portions.length > 0
                              ? product.portions
                              : [{ type: "Regular", price: product.price }]
                            ).map((portion) => {
                              const quantityInCart = getProductQuantity(product._id, portion.type);
                              return (
                                <div
                                  key={portion.type}
                                  className="flex items-center justify-between gap-2 w-full"
                                >
                                  <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <span
                                      className="text-sm text-gray-700 dark:text-gray-300 "
                                      title={portion.type}
                                    >
                                      {portion.type}
                                    </span>
                                    <span className="text-sm font-medium">₹{portion.price}</span>
                                  </div>
                                  <div className="w-24 flex justify-end">
                                    {quantityInCart > 0 ? (
                                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-1 rounded-lg">
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              selectedItems.findIndex(
                                                (i) =>
                                                  i.product_id === product._id && i.portion === portion.type
                                              ),
                                              quantityInCart - 1
                                            )
                                          }
                                          className="h-6 w-6 flex items-center justify-center"
                                          aria-label={`Decrease quantity of ${product.name} ${portion.type}`}
                                        >
                                          <MinusCircle size={18} />
                                        </button>
                                        <span className="text-xs font-medium w-6 text-center">
                                          {quantityInCart}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              selectedItems.findIndex(
                                                (i) =>
                                                  i.product_id === product._id && i.portion === portion.type
                                              ),
                                              quantityInCart + 1
                                            )
                                          }
                                          className="h-6 w-6 flex items-center justify-center"
                                          aria-label={`Increase quantity of ${product.name} ${portion.type}`}
                                        >
                                          <PlusCircle size={18} />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => addItem(product, portion.type)}
                                        className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                        aria-label={`Add ${product.name} ${portion.type} to cart`}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Customer + Payment */}
            {step === "customer" && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer & Payment</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <Select
                        options={customers.map((c) => ({ value: c.name, label: c.name }))}
                        onChange={handleCustomerSelect}
                        isClearable
                        placeholder="Select or type customer name..."
                        className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "transparent",
                            border: "none",
                            boxShadow: "none",
                            padding: 0,
                            minHeight: "auto",
                          }),
                          valueContainer: (base) => ({ ...base, padding: 0 }),
                          input: (base) => ({ ...base, margin: 0, padding: 0 }),
                          singleValue: (base) => ({ ...base, color: "inherit" }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "0.75rem",
                            marginTop: "0.5rem",
                          }),
                          option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#dbeafe" : "#fff",
                            color: "#1f2937",
                          }),
                        }}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customer.phone}
                        onChange={(e) => {
                          setCustomer({ ...customer, phone: e.target.value });
                          validateCustomer();
                        }}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                          errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white`}
                        aria-label="Phone Number"
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={customer.email}
                        onChange={(e) => {
                          setCustomer({ ...customer, email: e.target.value });
                          validateCustomer();
                        }}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                          errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white`}
                        aria-label="Email Address"
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["cash", "card", "online"].map((method) => (
                          <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-3 px-4 text-center rounded-xl border ${
                              paymentMethod === method
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400"
                                : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                            }`}
                            aria-label={`Select ${method} payment method`}
                          >
                            <div className="flex flex-col items-center">
                              {method === "cash" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 mb-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                              {method === "card" && <CreditCard size={24} className="mb-1" />}
                              {method === "online" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 mb-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                  />
                                </svg>
                              )}
                              <span className="text-sm capitalize">{method}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Delivery Address"
                        value={deliveryDetails.address}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        aria-label="Delivery Address"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="State"
                        value={deliveryDetails.state}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        aria-label="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order Notes
                      </label>
                      <textarea
                        placeholder="Special instructions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        aria-label="Order Notes"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Coins size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="Redeem Points"
                        value={redeemPoints}
                        onChange={(e) => setRedeemPoints(Number(e.target.value))}
                        min="0"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        aria-label="Redeem Points"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Review Order</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Order Items</h3>
                      <div className="space-y-3">
  {selectedItems.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No items selected</p>
  ) : (
    selectedItems.map((item, index) => (
      <div
        key={index}
        className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
      >
        {/* Top row: Name, Price, Remove button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4
              className="text-sm font-medium text-gray-900 dark:text-white truncate"
              title={`${item.name} (${item.portion})`}
            >
              {item.name} <span className="text-xs">({item.portion})</span>
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ₹{item.price} each
            </p>
          </div>
          <button
            onClick={() => removeItem(index)}
            className="text-red-500 dark:text-red-400 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {/* Bottom row: Quantity controls and total price */}
        <div className="flex items-center justify-between mt-1">
          {/* Quantity Counter (Horizontal) */}
          <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1">
            <button
              onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
              className="flex items-center justify-center text-gray-700 dark:text-gray-300"
            >
              <MinusCircle size={16} />
            </button>
            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(index, item.quantity + 1)}
              className="flex items-center justify-center text-gray-700 dark:text-gray-300"
            >
              <PlusCircle size={16} />
            </button>
          </div>
          
          {/* Item Total Price */}
          <div className="text-right font-medium">
            ₹{(item.price * item.quantity) % 1 === 0
              ? item.price * item.quantity
              : (item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    ))
  )}
</div>
                    </div>
                    {customer.name && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Customer Details</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{customer.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">{customer.phone}</p>
                          {customer.email && <p className="text-gray-600 dark:text-gray-400">{customer.email}</p>}
                        </div>
                      </div>
                    )}
                    {deliveryDetails.address && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Delivery Details</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{deliveryDetails.address}</p>
                          {deliveryDetails.state && (
                            <p className="text-gray-600 dark:text-gray-400">{deliveryDetails.state}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Payment Method</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg capitalize">{paymentMethod}</div>
                    </div>
                    {notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Order Notes</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{notes}</p>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
  <label className="text-gray-600 dark:text-gray-400 flex items-center">
    GST
    <select
      value={gstRate}
      onChange={(e) => setGstRate(Number(e.target.value))}
      className="ml-2 bg-transparent border-none text-gray-600 dark:text-gray-400 focus:outline-none"
    >
      {[0, 5, 12, 18, 28].map((rate) => (
        <option key={rate} value={rate}>
          {rate}%
        </option>
      ))}
    </select>
  </label>
  <span className="text-gray-900 dark:text-white">₹{gstAmount.toFixed(2)}</span>
</div>
                      {redeemPoints > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Points Redeemed</span>
                          <span className="text-gray-900 dark:text-white">-{redeemPoints}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg mt-3">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {selectedItems.length > 0 && (
            <BottomBar
              step={step}
              selectedItems={selectedItems}
              subtotal={subtotal}
              navigateSteps={navigateSteps}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}