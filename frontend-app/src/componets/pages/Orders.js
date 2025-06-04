import React, { useState } from 'react';
import { Search, Clock, AlertCircle } from 'lucide-react';

const OrderDetails = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOrder(data);
        setError('');
      } else {
        setOrder(null);
        setError(data.message || 'Error fetching order');
      }
    } catch (err) {
      setOrder(null);
      setError('Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header section */}
      <div className="bg-yellow-400 rounded-lg px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold">SIMPLE WAY TO TRACK ORDER</h1>
      </div>
      
      {/* Main content with hero text */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gray-800">Track Your</span> <span className="text-yellow-400">Order</span> <span className="text-gray-800">in</span> 
            <br />
            <span className="text-yellow-400">Real-time.</span>
          </h2>
          
          <p className="text-gray-600 mb-8">
            Online Food Home Delivery Services in India with contactless delivery and 
            premium quality ingredients.
          </p>
          
          {/* Search Box styled like the reference */}
          <div className="relative rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Enter your order ID..."
              className="w-full px-6 py-4 outline-none"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchOrder()}
            />
            <button
              onClick={fetchOrder}
              className="absolute right-0 top-0 h-full bg-yellow-400 hover:bg-yellow-500 px-8 font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
        
        {/* Order details card when order is found */}
        <div className="md:w-1/2">
          {order && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Order #{orderId}</h3>
                <div className="flex items-center text-yellow-500">
                  <Clock className="h-5 w-5 mr-1" />
                  <span className="font-medium">30 min delivery</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Restaurant</span>
                    <span className="font-semibold">{order.restaurant?.name || order.restaurant}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Customer</span>
                    <span className="font-semibold">{order.user?.name || order.user}</span>
                  </div>
                  
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Items</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Total Price</span>
                    <span className="text-xl font-bold">₹{order.totalPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-500">Status</span>
                    <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors">
                    Track Delivery
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;