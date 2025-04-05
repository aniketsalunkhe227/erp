"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, ShoppingCart, CreditCard, Package, Truck, Archive, Users, Settings, Menu, X, MoreHorizontal 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Supplies", href: "/supplies", icon: Truck },
  { name: "Inventory", href: "/inventory", icon: Archive },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href) => pathname === href;

  if (isMobile && !isOpen) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 w-full h-14 bg-white dark:bg-gray-900 border-b dark:border-gray-700 flex items-center justify-between z-10 px-4 shadow-sm">
          <button 
            onClick={() => setIsOpen(true)} 
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold dark:text-white">ERP System</h1>
          <div className="w-10"></div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 flex justify-around z-10 shadow-sm py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex flex-col items-center py-2 px-3 ${
                isActive(item.href) 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <button 
            onClick={() => setIsOpen(true)} 
            className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>

        <div className="pt-14 pb-16"></div>
      </>
    );
  }

  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 z-20 bg-gray-800/50 dark:bg-gray-900/80">
        <div className="h-full w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col">
          <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
            <h1 className="text-lg font-semibold dark:text-white">ERP System</h1>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center px-4 py-3 ${
                  isActive(item.href) 
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`} 
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="ml-2">
                <p className="text-sm font-medium dark:text-white">User Name</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Role: Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 border-r dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-semibold dark:text-white">ERP System</h1>
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center px-4 py-3 ${
              isActive(item.href) 
                ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="ml-3">
            <p className="text-sm font-medium dark:text-white">User Name</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Role: Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
}