import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { CheckCircle } from 'lucide-react';

const ThankYou = () => {
  const { formatPrice } = useStoreSettings();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from localStorage
    const orderDetailsStr = localStorage.getItem('lastOrderDetails');
    if (orderDetailsStr) {
      const orderDetails = JSON.parse(orderDetailsStr);
      setOrderData(orderDetails);
    } else {
      // Fallback to mock data if no order details found
      const num = localStorage.getItem('lastOrderNumber');
      const email = localStorage.getItem('lastOrderEmail');
      const mockOrder = {
        orderNumber: num || 'ZLR-1234567890',
        email: email || 'customer@example.com',
        contact: {
          phone: '+923001234567'
        },
        shipping: {
          name: 'Shujah Store',
          address: 'Soooter mill stop near manawan traning center paris colony street no 5 house no 5 gt road',
          city: 'Lahore',
          country: 'Pakistan',
          phone: '+923001234567'
        },
        shippingMethod: 'معیاری (Standard)',
        paymentMethod: 'Cash on Delivery (COD)',
        total: 3748
      };
      setOrderData(mockOrder);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-2xl">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center justify-between py-4 mb-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Back</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <div className="text-lg font-medium">
              Thank you for your order
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Success Icon and Greeting */}
          <div className="flex items-center gap-4 mb-8">
            <CheckCircle size={48} className="text-blue-600" />
            <h1 className="font-medium text-3xl">
              Thank you, Shujah!
            </h1>
          </div>

          {/* Order Info Cards */}
          <div className="space-y-6">
            {/* Order Confirmed Card */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl">
              <h2 className="font-medium text-xl mb-2">Your order is confirmed</h2>
              <p className="text-gray-600">
                You’ll receive a confirmation text soon
              </p>
            </div>

            {/* Order Updates Card */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl">
              <h2 className="font-medium text-xl mb-2">Order updates</h2>
              <p className="text-gray-600 mb-4">
                You’ll get shipping and delivery updates by email.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 border border-blue-500 rounded-2xl px-4 py-3">
                  <input
                    type="email"
                    defaultValue={orderData.email}
                    className="w-full outline-none text-base"
                  />
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium">
                  Submit
                </button>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl">
              <h2 className="font-medium text-xl mb-6">Order details</h2>
              
              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Contact information</h3>
                <p className="text-gray-700">{orderData.contact.phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Shipping address</h3>
                <div className="text-gray-700 space-y-1">
                  <p>{orderData.shipping.name}</p>
                  <p>{orderData.shipping.address}</p>
                  <p>{orderData.shipping.city}</p>
                  <p>{orderData.shipping.country}</p>
                  <p>{orderData.shipping.phone}</p>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Shipping method</h3>
                <p className="text-gray-700">{orderData.shippingMethod}</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Payment method</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-9 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs">$</span>
                  </div>
                  <p className="text-gray-700">
                    {orderData.paymentMethod} · {formatPrice(orderData.total)} PKR
                  </p>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h3 className="font-medium text-lg mb-2">Billing address</h3>
                <div className="text-gray-700 space-y-1">
                  <p>{orderData.shipping.name}</p>
                  <p>{orderData.shipping.address}</p>
                </div>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="pt-4">
              <Link
                to="/shop"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-2xl font-medium text-lg"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;
