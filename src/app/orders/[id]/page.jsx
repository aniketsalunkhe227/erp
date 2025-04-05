"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function OrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  // Function to format receipt for 2-inch printer (32 chars/line)
  const formatReceipt = () => {
    const line = "-".repeat(32);
    let receipt = "    Indicho Ice Cream    \n";
    receipt += "   GSTIN: 12ABCDE3456F1Z2  \n"; // Replace with your actual GSTIN
    receipt += line + "\n";
    receipt += `Order #${order._id.slice(-6)}\n`;
    receipt += `Date: ${new Date(order.order_date).toLocaleDateString()}\n`;
    receipt += `Customer: ${order.customer_name}\n`;
    receipt += line + "\n";
    receipt += "Item          Qty  Price  Amt\n";
    receipt += line + "\n";

    items.forEach((item) => {
      const name = item.product_id.name.slice(0, 12).padEnd(12);
      const qty = item.quantity.toString().padEnd(4);
      const price = item.price.toString().padEnd(6);
      const amt = item.subtotal.toString().padEnd(6);
      receipt += `${name}${qty}${price}${amt}\n`;
    });

    receipt += line + "\n";
    receipt += `Subtotal:         ₹${order.subtotal}\n`;
    receipt += `CGST (${order.gst.cgst.rate}%):    ₹${order.gst.cgst.amount}\n`;
    receipt += `SGST (${order.gst.sgst.rate}%):    ₹${order.gst.sgst.amount}\n`;
    receipt += line + "\n";
    receipt += `Total:            ₹${order.total_amount}\n`;
    receipt += line + "\n";
    receipt += `Payment: ${order.payment_method}\n`;
    receipt += "   Thank You! Visit Again!   \n";
    receipt += "\n\n\n"; // Extra lines for paper feed

    return receipt;
  };

  // Print function
  const handlePrint = async () => {
    const receiptText = formatReceipt();

    // Attempt Bluetooth printing
    if (navigator.bluetooth) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }], // Adjust UUID if needed
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
        const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(receiptText));
        console.log("Printed via Bluetooth");
      } catch (error) {
        console.error("Bluetooth printing failed:", error);
        printFallback(receiptText); // Use fallback if Bluetooth fails
      }
    } else {
      printFallback(receiptText); // Use fallback if no Bluetooth support
    }
  };

  // Fallback printing for non-Bluetooth environments
  const printFallback = (receiptText) => {
    const printWindow = window.open("", "", "width=300,height=500");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: monospace; font-size: 12px; width: 200px; margin: 0; padding: 10px; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${receiptText}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  if (!order) return <div className="flex justify-center items-center h-screen text-gray-500">Order not found</div>;

  return (
    <div className="">

      <div className="flex-1 pt-14 lg:pt-0 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 pb-20"> {/* Added pb-20 for bottom padding */}
          <button onClick={() => router.back()} className="text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order #{order._id.slice(-6)}</h1>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Details</h2>
              <p className="text-gray-700 dark:text-gray-300">Customer: {order.customer_name}</p>
              <p className="text-gray-700 dark:text-gray-300">Status: {order.status}</p>
              <p className="text-gray-700 dark:text-gray-300">Date: {new Date(order.order_date).toLocaleDateString()}</p>
              <p className="text-gray-700 dark:text-gray-300">Payment: {order.payment_method}</p>
              {order.notes && <p className="text-gray-700 dark:text-gray-300">Notes: {order.notes}</p>}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Items</h2>
              {items.map((item) => (
                <div key={item._id} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-gray-900 dark:text-gray-100">{item.product_id.name}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {item.quantity}x (₹{item.price})
                    </p>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">₹{item.subtotal}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span className="text-gray-900 dark:text-gray-100">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">CGST ({order.gst.cgst.rate}%)</span>
                  <span className="text-gray-900 dark:text-gray-100">₹{order.gst.cgst.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">SGST ({order.gst.sgst.rate}%)</span>
                  <span className="text-gray-900 dark:text-gray-100">₹{order.gst.sgst.amount}</span>
                </div>
                {order.redemption_discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Points Discount</span>
                    <span className="text-gray-900 dark:text-gray-100">-₹{order.redemption_discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-gray-900 dark:text-gray-100">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full lg:w-auto"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}