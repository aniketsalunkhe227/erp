// /app/components/orders/OrderDetails.js
import { useState } from 'react';
import Link from 'next/link';
import { 
  ClockIcon, TruckIcon, CreditCardIcon, DocumentTextIcon,
  CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon 
} from '@heroicons/react/outline';

export default function OrderDetails({ order, onUpdateStatus, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!order) return null;
  
  // Status badge color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  const handleStatusChange = (e) => {
    onUpdateStatus(order.id, e.target.value);
  };
  
  const confirmDelete = () => {
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
  };
  
  const executeDelete = () => {
    onDelete(order.id);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-medium mr-3">Order #{order.id}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <ClockIcon className="h-4 w-4 inline-block mr-1" />
              {formatDate(order.date)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isDeleting ? (
              <div className="bg-red-50 p-2 rounded-md border border-red-200">
                <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this order?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelDelete}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    className="px-3 py-1 bg-red-600 border border-red-600 rounded text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href={`/orders/${order.id}/edit`}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
                <select
                  value={order.status}
                  onChange={handleStatusChange}
                  className="block pl-3 pr-10 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="md:col-span-1">
            <h3 className="text-md font-medium mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
              <p className="text-sm text-gray-600 mt-1">{order.customerEmail}</p>
              <p className="text-sm text-gray-600">{order.customerPhone}</p>
              <hr className="my-3 border-gray-200" />
              <h4 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h4>
              <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="md:col-span-1">
            <h3 className="text-md font-medium mb-3">Order Timeline</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ol className="relative border-l border-gray-300 ml-3">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-gray-50">
                    <DocumentTextIcon className="w-3 h-3 text-blue-600" />
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">Order Placed</h4>
                  <time className="block text-xs text-gray-500">{formatDate(order.date)}</time>
                  <p className="text-xs text-gray-600 mt-1">Order #{order.id} was created</p>
                </li>
                
                {order.status !== 'pending' && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-gray-50">
                      <CreditCardIcon className="w-3 h-3 text-blue-600" />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">Payment Confirmed</h4>
                    <time className="block text-xs text-gray-500">{formatDate(new Date(new Date(order.date).getTime() + 3600000))}</time>
                    <p className="text-xs text-gray-600 mt-1">Payment of ${total.toFixed(2)} received</p>
                  </li>
                )}
                
                {(order.status === 'processing' || order.status === 'completed') && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-gray-50">
                      <TruckIcon className="w-3 h-3 text-blue-600" />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">Order Shipped</h4>
                    <time className="block text-xs text-gray-500">{formatDate(new Date(new Date(order.date).getTime() + 86400000))}</time>
                    <p className="text-xs text-gray-600 mt-1">Order has been shipped via {order.shippingMethod}</p>
                  </li>
                )}
                
                {order.status === 'completed' && (
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-gray-50">
                      <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">Order Completed</h4>
                    <time className="block text-xs text-gray-500">{formatDate(new Date(new Date(order.date).getTime() + 259200000))}</time>
                    <p className="text-xs text-gray-600 mt-1">Order has been delivered and completed</p>
                  </li>
                )}
                
                {order.status === 'cancelled' && (
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-gray-50">
                      <XCircleIcon className="w-3 h-3 text-red-600" />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">Order Cancelled</h4>
                    <time className="block text-xs text-gray-500">{formatDate(new Date())}</time>
                    <p className="text-xs text-gray-600 mt-1">Order has been cancelled</p>
                  </li>
                )}
              </ol>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="md:col-span-1">
            <h3 className="text-md font-medium mb-3">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Payment Method:</span> {order.paymentMethod}
              </p>
              {order.paymentMethod === 'Credit Card' && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-gray-800">Card:</span> •••• •••• •••• {order.lastFourDigits}
                </p>
              )}
              <hr className="my-3 border-gray-200" />
              <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
              <p className="text-sm text-gray-600">{order.billingAddress.street}</p>
              <p className="text-sm text-gray-600">
                {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
              </p>
              <p className="text-sm text-gray-600">{order.billingAddress.country}</p>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="mt-8">
          <h3 className="text-md font-medium mb-3">Order Items</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.name}
                      {item.sku && (
                        <span className="text-xs text-gray-500 block">SKU: {item.sku}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <th scope="row" colSpan="3" className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                    Subtotal
                  </th>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <th scope="row" colSpan="3" className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                    Tax (10%)
                  </th>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${tax.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <th scope="row" colSpan="3" className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                    Shipping ({order.shippingMethod})
                  </th>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${order.shippingCost.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <th scope="row" colSpan="3" className="px-6 py-3 text-base font-medium text-gray-900 text-right">
                    Total
                  </th>
                  <td className="px-6 py-3 whitespace-nowrap text-base font-medium text-gray-900 text-right">
                    ${(total + order.shippingCost).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Notes */}
        {order.notes && (
          <div className="mt-8">
            <h3 className="text-md font-medium mb-3">Order Notes</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}