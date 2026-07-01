import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Checkout() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Error parsing order", e);
      }
    }
  }, []);

  const formatPrice = (priceStr: string, qty: number) => {
    // Basic formatting assuming price is like '$39.99' or similar
    // We'll just display it as is or if it's numeric, multiply
    if (!priceStr) return '$0.00';
    if (priceStr.includes('$')) {
      const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      const total = num * qty;
      return `$${total.toFixed(2)}`;
    }
    if (priceStr.startsWith('$')) {
        const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        const total = num * qty;
        return `$${total.toFixed(2)}`;
    }
    return priceStr;
  };

  const getPriceValue = () => {
    if (!order) return '$159.00'; // fallback
    return formatPrice(order.price, order.quantity || 1);
  };

  const getProductDisplay = () => {
    if (!order) return 'After Death Is Life Hoodie - M x 1'; // fallback
    return `${order.title} - ${order.size} x ${order.quantity || 1}`;
  };

  const handlePlaceOrder = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert("Please log in first to place and track your order.");
      return;
    }
    
    if (!order) {
      alert("Your cart is empty!");
      return;
    }

    const newOrder = {
      ...order,
      userEmail: currentUser.email,
      date: new Date().toISOString(),
      status: 'On Delivery'
    };

    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    history.push(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(history));
    localStorage.removeItem('currentOrder');
    setOrder(null);
    
    window.dispatchEvent(new CustomEvent('orderUpdated'));
    alert("Order Placed Successfully!");
    navigate('/apparel');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-serif">
      <Header bgColor="#F9F9F9" />

      {/* Top Header - Black Bar */}
      <div className="w-full bg-[#0a0a0a] text-white py-8 flex justify-center items-center">
        <div className="text-[13px] tracking-[0.15em] flex items-center gap-4 text-gray-500 uppercase">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/products')}>Shopping Cart</span>
          <span>&rarr;</span>
          <span className="text-white font-bold">Checkout</span>
          <span>&rarr;</span>
          <span>Order Complete</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-6xl flex-1 flex flex-col lg:flex-row gap-12 font-[Satoshi]">
        {/* Left Column: Billing Details */}
        <div className="flex-1 max-w-3xl">
          <button className="w-full bg-black text-white py-4 rounded flex items-center justify-center gap-2 font-medium mb-8 hover:bg-gray-800 transition-colors cursor-pointer">
            Buy with <span className="font-bold tracking-tight text-lg"><span className="text-blue-500">G</span> <span className="text-red-500">P</span><span className="text-yellow-500">a</span><span className="text-green-500">y</span></span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">OR</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <h2 className="text-xl font-normal text-gray-900 mb-8 font-serif uppercase tracking-wider">Billing Details</h2>

          <form className="flex flex-col gap-5 text-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-5">
              <div className="flex-1">
                <label className="block mb-2 text-gray-700 font-medium">First name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-gray-700 font-medium">Last name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Company name (optional)</label>
              <input type="text" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Country / Region <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full border border-gray-200 px-4 py-3 rounded-sm appearance-none bg-white focus:border-black outline-none transition-colors text-gray-700">
                  <option>United States (US)</option>
                  <option>United Kingdom (UK)</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Street address <span className="text-red-500">*</span></label>
              <input type="text" placeholder="House number and street name" className="w-full border border-gray-200 px-4 py-3 rounded-sm mb-3 focus:border-black outline-none transition-colors" />
              <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Town / City <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">State <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full border border-gray-200 px-4 py-3 rounded-sm appearance-none bg-white focus:border-black outline-none transition-colors text-gray-700">
                  <option>California</option>
                  <option>New York</option>
                  <option>Texas</option>
                  <option>Florida</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">ZIP Code <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Phone <span className="text-red-500">*</span></label>
              <input type="tel" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Email address <span className="text-red-500">*</span></label>
              <input type="email" className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors" />
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-gray-900 font-serif text-lg">Additional information</label>
              <label className="block mb-2 text-gray-700 font-medium text-sm">Order notes (optional)</label>
              <textarea rows={4} placeholder="Notes about your order, e.g. special notes for delivery." className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-black outline-none transition-colors resize-none"></textarea>
            </div>
          </form>
        </div>

        {/* Right Column: Your Order */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="bg-[#f9f9f9] rounded-sm p-8 relative border-t-4 border-t-transparent pt-10" style={{ borderImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 10 10\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"5\" cy=\"5\" r=\"3\" fill=\"%23e5e7eb\"/></svg>') 4 round" }}>
            <h2 className="text-xl font-normal text-center text-gray-900 mb-8 font-serif uppercase tracking-wider">Your Order</h2>
            
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-4 mb-4">
              <span>Product</span>
              <span>Subtotal</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-700 py-4 border-b border-gray-200">
              <span className="pr-4">{getProductDisplay()}</span>
              <span className="font-medium whitespace-nowrap">{getPriceValue()}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-medium text-gray-700 py-4 border-b border-gray-200">
              <span>Subtotal</span>
              <span>{getPriceValue()}</span>
            </div>

            <div className="flex justify-between items-center py-6 border-b border-gray-200 mb-6">
              <span className="text-base font-normal">Total</span>
              <span className="text-xl font-bold text-gray-900">{getPriceValue()}</span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <input type="radio" id="cc" name="payment" defaultChecked className="accent-black w-4 h-4" />
                <label htmlFor="cc" className="text-sm font-medium text-gray-900 cursor-pointer">Credit Card</label>
              </div>

              <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm relative">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                <p className="text-gray-500 text-[13px] mb-4">Pay with your credit card</p>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-gray-700 text-xs font-medium">Card Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="text" placeholder="1234 1234 1234 1234" className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm focus:border-black outline-none transition-colors" />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 opacity-80">
                        <div className="h-5 px-1 bg-green-800 text-white rounded-[2px] flex items-center justify-center text-[10px] font-bold tracking-tight">link</div>
                        <div className="h-5 w-8 bg-blue-600 rounded-[2px] flex items-center justify-center text-white text-[8px] font-bold italic">VISA</div>
                        <div className="h-5 w-7 bg-gray-800 rounded-[2px] flex items-center justify-center text-white text-[10px] font-bold">7359</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-gray-700 text-xs font-medium">Expiry Date <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="MM / YY" className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm focus:border-black outline-none transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-gray-700 text-xs font-medium">Card Code (CVC) <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="CVC" className="w-full border border-gray-200 px-3 py-2.5 text-sm rounded-sm focus:border-black outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="w-full h-14 bg-black text-white font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 mt-2">
              Place Order
            </button>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-[#03060a] text-white pt-16 pb-6 px-6 lg:px-16 mt-20 font-[Satoshi]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
            
            {/* Left: Logo & Socials */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                <img src="/TPL logo.png" alt="TPLS Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                <span className="text-xl font-bold tracking-widest uppercase text-white">TPLS</span>
              </div>
              <div className="flex space-x-6 text-white">
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="mdi:instagram" class="text-xl"></iconify-icon>
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="mdi:youtube" class="text-xl"></iconify-icon>
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="ic:baseline-tiktok" class="text-xl"></iconify-icon>
                </a>
              </div>
            </div>

            {/* Middle: Quick Link */}
            <div className="flex flex-col pt-1 pl-0 md:pl-12">
              <h4 className="text-[15px] font-semibold mb-5 tracking-wide text-white">Quick Link</h4>
              <div className="flex flex-col space-y-3 text-[13px] text-gray-300">
                <a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/products')}>Shop for Men</a>
                <a href="#" className="hover:text-white transition-colors" onClick={() => navigate('/products')}>Shop for Woman</a>
              </div>
            </div>

            {/* Right: Subscribe */}
            <div className="flex flex-col pt-1">
              <h4 className="text-[15px] font-semibold mb-4 tracking-wide text-white">Subscribe</h4>
              <p className="text-[13px] text-gray-300 leading-relaxed mb-6">
                Subscribe for exclusive offers, original stories, activism awareness, events and more.
              </p>
              <form className="flex items-end w-full" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent border-b border-gray-600 pb-2 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" 
                  required 
                />
                <button type="submit" className="bg-white text-black text-[13px] font-semibold px-6 py-2 ml-4 hover:bg-gray-200 transition-colors shrink-0">
                  Subscribe
                </button>
              </form>
            </div>
            
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-between items-center text-[12px] text-gray-500 relative">
            <p>&copy;2026 TPLS | All Right Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
