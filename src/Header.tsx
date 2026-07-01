import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, User, Package, LogOut } from 'lucide-react';

export default function Header({ bgColor = '#F9F9F9' }: { bgColor?: string }) {
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Form states
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Update global data
  const updateGlobalData = () => {
    let savedLikes = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    // Clean up old string format if any
    if (savedLikes.length > 0 && typeof savedLikes[0] === 'string') {
      savedLikes = [];
      localStorage.setItem('likedProducts', '[]');
    }
    setLikedProducts(savedLikes);

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const userOrders = allOrders.filter((o: any) => o.userEmail === user.email);
      setOrders(userOrders);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    updateGlobalData();
    window.addEventListener('likedProductsUpdated', updateGlobalData);
    window.addEventListener('userUpdated', updateGlobalData);
    window.addEventListener('orderUpdated', updateGlobalData);
    
    const interval = setInterval(updateGlobalData, 2000);
    return () => {
      window.removeEventListener('likedProductsUpdated', updateGlobalData);
      window.removeEventListener('userUpdated', updateGlobalData);
      window.removeEventListener('orderUpdated', updateGlobalData);
      clearInterval(interval);
    };
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (authMode === 'signup') {
      const existingUser = users.find((u: any) => u.email === authEmail);
      if (existingUser) {
        alert("Email already exists. Please login.");
        return;
      }
      const newUser = { fullName: authName, email: authEmail, password: authPassword };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      window.dispatchEvent(new CustomEvent('userUpdated'));
    } else {
      const user = users.find((u: any) => u.email === authEmail && u.password === authPassword);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        window.dispatchEvent(new CustomEvent('userUpdated'));
      } else {
        alert("Invalid email or password!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowUserMenu(false);
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const handleForgotPassword = () => {
    const email = prompt("Enter your email address to reset password:");
    if (email) {
      alert(`A password reset link has been sent to ${email}`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };





  return (
    <>
      <div className={`bg-[${bgColor}] border-b border-gray-200 h-8 flex items-center justify-center flex-shrink-0 z-[60] font-[Satoshi]`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-[10px] sm:text-xs font-medium tracking-wide text-gray-800">
            <a href="#" className="flex items-center hover:text-black group">
              FOLLOW OUR INSTAGRAM! <iconify-icon icon="lucide:chevron-right" class="ml-1 text-gray-500 group-hover:text-black"></iconify-icon>
            </a>
            <span className="hidden md:inline text-gray-300">|</span>
            <a href="#" className="flex items-center hover:text-black group">
              BUY 2 PRODUCT, GET FREE EXCLUSIVE TUMBLER <iconify-icon icon="lucide:chevron-right" class="ml-1 text-gray-500 group-hover:text-black"></iconify-icon>
            </a>
            <span className="hidden md:inline text-gray-300">|</span>
            <a href="#" className="flex items-center hover:text-black group">
              Discount 30% All Item <iconify-icon icon="lucide:chevron-right" class="ml-1 text-gray-500 group-hover:text-black"></iconify-icon>
            </a>
          </div>
        </div>
      </div>

      <nav className={`bg-[${bgColor}] py-3 border-b border-gray-200 z-[60] flex-shrink-0 sticky top-0 font-[Satoshi]`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/products')} className="flex items-center text-sm font-semibold text-black hover:text-gray-600 cursor-pointer">
                Men <iconify-icon icon="lucide:chevron-down" class="ml-1 text-xs"></iconify-icon>
              </button>
              <button onClick={() => navigate('/products')} className="flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors cursor-pointer">
                Women <iconify-icon icon="lucide:chevron-down" class="ml-1 text-xs"></iconify-icon>
              </button>
            </div>
            <div className="md:hidden">
              <button className="p-2 text-gray-600">
                <iconify-icon icon="lucide:menu" class="text-2xl"></iconify-icon>
              </button>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/apparel'); }} className="flex items-center gap-2">
                <img src="/TPL logo.png" alt="TPLS Logo" className="h-7 w-auto object-contain" />
                <span className="text-lg sm:text-xl font-bold tracking-widest uppercase text-black">TPLS</span>
              </a>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button onClick={() => setIsOrdersModalOpen(true)} className="text-gray-800 hover:text-black transition-colors cursor-pointer relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {currentUser && orders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </button>
              
              <button onClick={() => setIsLikedModalOpen(true)} className="hidden sm:block text-gray-800 hover:text-black transition-colors cursor-pointer relative">
                <Heart size={20} strokeWidth={1.5} />
                {likedProducts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {likedProducts.length}
                  </span>
                )}
              </button>
              
              <div className="hidden sm:block relative">
                {currentUser ? (
                  <>
                    <div 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold tracking-widest cursor-pointer select-none"
                    >
                      {getInitials(currentUser.fullName)}
                    </div>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{currentUser.email}</p>
                        </div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors">
                          <LogOut size={14} /> Log Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors text-gray-800">
                    <User size={20} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Liked Products Modal/Drawer */}
      {isLikedModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-[Satoshi]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLikedModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
                <Heart size={20} className="text-red-500" fill="currentColor" /> Saved Items
              </h2>
              <button onClick={() => setIsLikedModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-200 transition-colors text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {likedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <Heart size={48} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900">No saved items yet.</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-[250px]">Explore our collections and save your favorite pieces here.</p>
                  <button onClick={() => { setIsLikedModalOpen(false); navigate('/products'); }} className="mt-8 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors cursor-pointer">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {likedProducts.map((prod: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors bg-gray-50/50 cursor-pointer" onClick={() => { setIsLikedModalOpen(false); navigate(`/product/${prod.id || 1}`); }}>
                      <div className="w-20 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {prod.img ? (
                          <img src={prod.img} alt={prod.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs text-gray-400 font-medium">TPLS</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{prod.title}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Saved Item</p>
                        <button 
                          className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600 self-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newLikes = likedProducts.filter((p: any) => p.id !== prod.id);
                            localStorage.setItem('likedProducts', JSON.stringify(newLikes));
                            setLikedProducts(newLikes);
                            window.dispatchEvent(new CustomEvent('likedProductsUpdated'));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal/Drawer */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-[Satoshi]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOrdersModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
                <ShoppingBag size={20} /> Your Orders
              </h2>
              <button onClick={() => setIsOrdersModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-200 transition-colors text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {!currentUser ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
                  <User size={48} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900">Sign in to view orders</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-[250px]">You need to login or signup in order to see your ordered products.</p>
                  <button onClick={() => { setIsOrdersModalOpen(false); setIsAuthModalOpen(true); }} className="mt-8 px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors cursor-pointer">
                    Log In
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
                  <Package size={48} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900">You did not order any product yet</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-[250px]">Discover our latest arrivals and exclusive drops.</p>
                  <button onClick={() => { setIsOrdersModalOpen(false); navigate('/products'); }} className="mt-8 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors cursor-pointer">
                    Shop Collection
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order: any, idx: number) => {
                    const orderDate = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isDelivered = order.status === 'Delivered';
                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase">Order #{1000 + idx}</p>
                          <p className="text-xs font-medium text-gray-500">{orderDate}</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-400">TPLS</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">{order.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">Size: {order.size} • Qty: {order.quantity}</p>
                            <p className="text-sm font-bold text-black mt-2">{order.price}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                            {order.status}
                          </span>
                          <button className="text-xs font-semibold text-black underline underline-offset-2 hover:text-gray-600">
                            Track
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-[Satoshi]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAuthModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button onClick={() => setIsAuthModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-200 transition-colors text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-black focus:outline-none transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-black focus:outline-none transition-colors" 
                    placeholder="you@example.com" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
                    {authMode === 'login' && (
                      <button type="button" onClick={handleForgotPassword} className="text-[10px] text-gray-500 hover:text-black font-medium underline underline-offset-2 cursor-pointer">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-black focus:outline-none transition-colors" 
                    placeholder="••••••••" 
                  />
                </div>

                <button type="submit" className="w-full mt-2 bg-black text-white h-12 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 cursor-pointer">
                  {authMode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-600">
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="ml-1 text-black font-bold uppercase tracking-wide hover:underline underline-offset-2 cursor-pointer"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
