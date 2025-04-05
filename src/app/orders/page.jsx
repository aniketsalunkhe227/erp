"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import DashboardCard from "@/components/dashboard/DashboardCard";
import DataTable from "@/components/DataTable";
import { ShoppingCart, Clock, CheckCircle, Plus } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState(null);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    status: "all",
    sort_by: "order_date",
    sort_order: "desc"
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query string
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Remove status if "all"
      if (queryParams.status === "all") {
        params.delete("status");
      }

      const res = await fetch(`http://localhost:5000/api/orders/?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      
      setOrders(data.data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [queryParams]);

  const handlePageChange = (newParams) => {
    setQueryParams(prev => ({
      ...prev,
      ...newParams,
      // Keep status filter in sync with activeTab
      status: activeTab === "all" ? null : activeTab
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQueryParams(prev => ({
      ...prev,
      page: 1, // Reset to first page when changing tabs
      status: tab === "all" ? null : tab
    }));
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const tableColumns = [
    { 
      key: "_id", 
      label: "Order ID", 
      sortable: true,
      render: (val) => (
        <Link 
          href={`/orders/${val}`} 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          #{val.slice(-6)}
        </Link>
      ) 
    },
    { 
      key: "customer_name", 
      label: "Customer", 
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-medium">{val}</div>
          {row.customer_id?.phone && (
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              {row.customer_id.phone}
            </div>
          )}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          val === "pending"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            : val === "completed"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    },
    { 
      key: "total_amount", 
      label: "Total", 
      sortable: true,
      render: (val) => `₹${val / 100}`
    },
    { 
      key: "order_date", 
      label: "Date & Time", 
      sortable: true,
      render: (val) => (
        <div>
          <div>{new Date(val).toLocaleDateString()}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen w-full">
      {/* Mobile top spacing - needed for mobile nav */}
      <div className="h-14 lg:h-0 block lg:hidden"></div>
      
      <main className="w-full">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {pagination?.total || 0} {pagination?.total === 1 ? "order" : "orders"} total
              </p>
            </div>
            <Link 
              href="/orders/new" 
              className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-sm hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Order</span>
            </Link>
          </div>

          {/* Stats Cards - Now grid-cols-2 on extra small screens */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <DashboardCard 
              title="Total Orders" 
              value={pagination?.total || 0} 
              icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} 
              valueClassName="text-blue-600 font-bold"
            />
            <DashboardCard 
              title="Pending" 
              value={pendingCount} 
              icon={<Clock className="h-5 w-5 text-yellow-500" />} 
              color="yellow" 
              valueClassName="text-yellow-600 font-bold"
            />
            <DashboardCard 
              title="Completed" 
              value={completedCount} 
              icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
              color="green" 
              valueClassName="text-green-600 font-bold"
              className="col-span-2 md:col-span-1"
            />
          </div>

          {/* Tabs - make horizontally scrollable without breaking layout */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex overflow-x-auto no-scrollbar pb-px">
              {["all", "pending", "completed", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`pb-2 px-4 capitalize whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-full px-4 md:px-0">
              <DataTable
                data={orders}
                columns={tableColumns}
                searchable={["_id", "customer_name", "delivery_details.address", "notes"]}
                filters={{
                  status: ["pending", "completed", "cancelled"],
                  payment_method: ["cash", "card", "upi"]
                }}
                exportOptions={true}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile bottom spacing - needed for mobile nav */}
      <div className="h-16 block lg:hidden"></div>
    </div>
  );
}