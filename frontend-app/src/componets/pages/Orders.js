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
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrder = {
        id: orderId,
        restaurant: { name: 'Pizza Palace' },
        user: { name: 'John Doe' },
        items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
        totalPrice: 450,
        status: 'Preparing'
      };
      
      setOrder(mockOrder);
      setError('');
    } catch (err) {
      setOrder(null);
      setError('Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        <div className="p-4">
          {/* Header section */}
          <div className="rounded-3 px-4 py-3 mb-4" style={{ backgroundColor: '#fbbf24' }}>
            <h1 className="h3 fw-bold mb-0">SIMPLE WAY TO TRACK ORDER</h1>
          </div>
          
          {/* Main content with hero text */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <h2 className="display-5 fw-bold mb-4">
                <span className="text-dark">Track Your</span> <span style={{ color: '#fbbf24' }}>Order</span> <span className="text-dark">in</span> 
                <br />
                <span style={{ color: '#fbbf24' }}>Real-time.</span>
              </h2>
              
              <p className="text-muted mb-4">
                Online Food Home Delivery Services in India with contactless delivery and 
                premium quality ingredients.
              </p>
              
              {/* Search Box */}
              <div className="position-relative rounded-pill overflow-hidden shadow-lg mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 py-3 px-4 rounded-pill"
                    placeholder="Enter your order ID..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchOrder()}
                    style={{ paddingRight: '120px' }}
                  />
                  <button
                    className="btn fw-semibold position-absolute end-0 top-0 h-100 rounded-pill px-4"
                    style={{ 
                      backgroundColor: '#fbbf24',
                      border: 'none',
                      zIndex: 10
                    }}
                    onClick={fetchOrder}
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-start" role="alert">
                  <AlertCircle className="me-2 flex-shrink-0" style={{ width: '20px', height: '20px', marginTop: '2px' }} />
                  <div>{error}</div>
                </div>
              )}
            </div>
            
            {/* Order details card when order is found */}
            <div className="col-md-6">
              {order && (
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center py-3">
                    <h5 className="card-title fw-bold mb-0">Order #{orderId}</h5>
                    <div className="d-flex align-items-center" style={{ color: '#fbbf24' }}>
                      <Clock className="me-1" style={{ width: '20px', height: '20px' }} />
                      <span className="fw-medium">30 min delivery</span>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex justify-content-between py-2 border-bottom">
                          <span className="text-muted">Restaurant</span>
                          <span className="fw-semibold">{order.restaurant?.name || order.restaurant}</span>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between py-2 border-bottom">
                          <span className="text-muted">Customer</span>
                          <span className="fw-semibold">{order.user?.name || order.user}</span>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="py-2 border-bottom">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Items</span>
                          </div>
                          <div className="bg-light p-3 rounded-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-1">
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between py-2 border-bottom">
                          <span className="text-muted">Total Price</span>
                          <span className="h4 fw-bold mb-0">₹{order.totalPrice}</span>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-2">
                          <span className="text-muted">Status</span>
                          <span 
                            className="badge rounded-pill px-3 py-2 fw-medium"
                            style={{ 
                              backgroundColor: '#fef3c7',
                              color: '#92400e'
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button 
                        className="btn w-100 fw-bold py-3 rounded-3"
                        style={{ 
                          backgroundColor: '#fbbf24',
                          border: 'none',
                          color: 'black'
                        }}
                      >
                        Track Delivery
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;