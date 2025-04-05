import { useState } from 'react';
import { useRouter } from 'next/router';
import { XIcon, PlusIcon } from '@heroicons/react/outline';

export default function OrderForm({ order = null, customers = [], products = [], isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer: order?.customer || '',
    items: order?.items || [],
    status: order?.status || 'pending',
    notes: order?.notes || '',
  });
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const addItem = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity,
        }
      ],
    });
    
    setSelectedProduct('');
    setQuantity(1);
  };
  
  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({
      ...formData,
      items: newItems,
    });
  };
  
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      total: calculateTotal(),
      date: new Date().toISOString(),
    };
    
    try {
      console.log('Submitting order:', orderData);
      router.push('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium">{isEdit ? 'Edit Order' : 'New Order'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Items</label>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name} - ${product.price.toFixed(2)}</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add
              </button>
            </div>
          </div>

          {formData.items.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">${item.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                        <XIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">
          {isEdit ? 'Update Order' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
