import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, MessageCircle, X, Send, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';

// Reusing same product data structure but extending for grid
const dummyProducts = [
  { id: 1, title: 'Striped Knit Shirt', price: '$39.99', cat: 'Man', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750141248450-fulls-(4).png', colors: ['#000', '#d1d5db'] },
  { id: 2, title: 'Signature Denim Shirt', price: '$45.00', cat: 'Man', sizes: 'M - XXL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750403679332-untitled-00774-(1).jpg', colors: ['#3b82f6', '#1e3a8a'] },
  { id: 3, title: 'Core Black Hoodie', price: '$59.99', cat: 'Man', sizes: 'S - XXL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-black-hoodie-front.png?v=1780053097', colors: ['#000'] },
  { id: 4, title: 'Schematic Longsleeve Tee', price: '$29.99', cat: 'Man', sizes: 'S - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/schematic-longsleeve-front.png?v=1780053340', colors: ['#000', '#fff'] },
  { id: 5, title: 'Expressive Tee', price: '$24.99', cat: 'Man', sizes: 'S - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/expressive-tee-front.png?v=1780052951', colors: ['#fff', '#fcd34d'] },
  { id: 6, title: 'Kinetic Tee', price: '$24.99', cat: 'Man', sizes: 'M - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/kinetic-tee-front.png?v=1780053256', colors: ['#000', '#dc2626'] },
  { id: 7, title: 'Wave Hoodie', price: '$59.99', cat: 'Man', sizes: 'S - XXL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/wave-hoodie-front.png?v=1780053289', colors: ['#000'] },
  { id: 8, title: 'Core Crew Sweatshirt', price: '$49.99', cat: 'Man', sizes: 'S - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-crew-front.png?v=1780052909', colors: ['#4b5563', '#000'] },
  { id: 9, title: 'Reverb Longsleeve', price: '$34.99', cat: 'Man', sizes: 'S - XXL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/reverb-longsleeve-front.png?v=1780053317', colors: ['#000', '#6b7280'] },
  { id: 10, title: '11_11 Crew Sweatshirt', price: '$49.99', cat: 'Man', sizes: 'M - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/11-11-crew-front_fb8efabc-8659-4bcc-b66c-c6102044ae18.png?v=1780053477', colors: ['#000'] },
  { id: 11, title: 'Research Preview Hoodie', price: '$64.99', cat: 'Man', sizes: 'S - XL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-hoodie-font.png?v=1780052640', colors: ['#000'] },
  { id: 12, title: 'Employee Tee', price: '$24.99', cat: 'Man', sizes: 'S - XXL', img: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/employee-tee-front.png?v=1780052707', colors: ['#000', '#fff'] },
];

export default function Products() {
  const navigate = useNavigate();
  
  // Filtering state
  const [products, setProducts] = useState<any[]>(dummyProducts); // fallback
  const [activeAccordion, setActiveAccordion] = useState<string | null>('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<any[]>([]); // array of ids
  
  useEffect(() => {
    const updateLikes = () => {
      let saved = JSON.parse(localStorage.getItem('likedProducts') || '[]');
      if (saved.length > 0 && typeof saved[0] === 'string') {
        saved = [];
        localStorage.setItem('likedProducts', '[]');
      }
      setLikedItems(saved.map((p: any) => p.id));
    };
    updateLikes();
    window.addEventListener('likedProductsUpdated', updateLikes);
    return () => window.removeEventListener('likedProductsUpdated', updateLikes);
  }, []);

  const toggleLike = (e: React.MouseEvent, prod: any) => {
    e.stopPropagation();
    let currentLikes = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    if (currentLikes.length > 0 && typeof currentLikes[0] === 'string') currentLikes = [];
    
    const exists = currentLikes.find((p: any) => p.id === prod.id);
    if (exists) {
      currentLikes = currentLikes.filter((p: any) => p.id !== prod.id);
    } else {
      currentLikes.push({ id: prod.id, title: prod.title, img: prod.img });
    }
    setLikedItems(currentLikes.map((p: any) => p.id));
    localStorage.setItem('likedProducts', JSON.stringify(currentLikes));
    window.dispatchEvent(new CustomEvent('likedProductsUpdated'));
  };
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleColorChange = (color: string) => {
    // Add mapping for similar colors (e.g., #000000 mapping to #000)
    let searchHex = color;
    if (color === '#000000') searchHex = '#000';
    if (color === '#FFFFFF') searchHex = '#fff';
    
    setSelectedColors(prev => prev.includes(searchHex) ? prev.filter(c => c !== searchHex) : [...prev, searchHex]);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price ? `$${(parseFloat(p.price) > 1000 ? parseFloat(p.price) / 15000 : parseFloat(p.price)).toFixed(2)}` : '$39.99',
          cat: p.category ? p.category.name : p.gender,
          sizes: p.sizes.map((s: any) => s.size).join(' - '),
          img: p.images.length > 0 ? p.images[0].image_url : '',
          colors: p.colors || ['#000', '#fff']
        }));
        setProducts(formatted);
      })
      .catch(err => console.error("Failed to fetch products from backend:", err));
  }, []);

  const filteredProducts = products.filter(prod => {
    if (selectedCategories.length > 0) {
      const isMatch = selectedCategories.some(cat => {
        if (cat === 'T-Shirt' && prod.title.includes('Tee')) return true;
        return prod.title.toLowerCase().includes(cat.toLowerCase());
      });
      if (!isMatch) return false;
    }
    
    if (selectedSizes.length > 0) {
      const isMatch = selectedSizes.some(size => prod.sizes.includes(size));
      if (!isMatch) return false;
    }

    if (selectedColors.length > 0) {
      const isMatch = selectedColors.some(c => prod.colors.includes(c));
      if (!isMatch) return false;
    }

    if (searchQuery.trim() !== '') {
      if (!prod.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [selectedCategories, selectedSizes, selectedColors, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: string; text: string}[]>([
    { role: "ai", text: "Hello! Welcome to our product catalog. Need help finding a specific size or style?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isThinking]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatMessage("");
    setIsThinking(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("API Key is not configured.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMsg,
      });
      
      const reply = response.text || "I couldn't generate a response. Please try again.";
      setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: "ai", 
        text: `Error connecting to Gemini API. Please make sure VITE_GEMINI_API_KEY is correctly set.` 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col w-full relative overflow-x-hidden text-black font-[Satoshi]">
      
      <Header bgColor="#FFFFFF" />

      {/* Category Banner */}
      <div className="w-full bg-[#F2F3F5] py-12 px-4 lg:px-8">
        {/* Header & Description */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-semibold text-black tracking-tight mb-2">Products</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto md:mx-0">
            Explore our curated collection of premium apparel, designed for everyday comfort and effortless style.
          </p>
        </div>
      </div>

      {/* Product Catalog Section */}
      <section className="container mx-auto px-4 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
          {/* Category Filter */}
          <div className="border-b border-gray-200 pb-4">
            <button 
              onClick={() => toggleAccordion('category')}
              className="w-full flex justify-between items-center text-sm font-semibold text-black mb-3"
            >
              PRODUCT CATEGORY
              <iconify-icon icon={activeAccordion === 'category' ? "lucide:minus" : "lucide:plus"} class="text-gray-400"></iconify-icon>
            </button>
            {activeAccordion === 'category' && (
              <div className="flex flex-col gap-2 mt-2">
                {['T-Shirt', 'Shirt', 'Sweatshirt', 'Hoodie', 'Pants', 'Accessories'].map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(item)}
                      onChange={() => handleCategoryChange(item)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" 
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black">{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="border-b border-gray-200 pb-4">
            <button 
              onClick={() => toggleAccordion('size')}
              className="w-full flex justify-between items-center text-sm font-semibold text-black mb-3"
            >
              SIZE
              <iconify-icon icon={activeAccordion === 'size' ? "lucide:minus" : "lucide:plus"} class="text-gray-400"></iconify-icon>
            </button>
            {activeAccordion === 'size' && (
              <div className="flex flex-wrap gap-2 mt-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button 
                    key={size} 
                    onClick={() => handleSizeChange(size)}
                    className={`w-10 h-10 flex items-center justify-center border rounded text-sm transition-colors ${selectedSizes.includes(size) ? 'border-black text-black bg-black/5' : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="border-b border-gray-200 pb-4">
            <button 
              onClick={() => toggleAccordion('color')}
              className="w-full flex justify-between items-center text-sm font-semibold text-black mb-3"
            >
              COLOR
              <iconify-icon icon={activeAccordion === 'color' ? "lucide:minus" : "lucide:plus"} class="text-gray-400"></iconify-icon>
            </button>
            {activeAccordion === 'color' && (
              <div className="flex flex-wrap gap-3 mt-2">
                {['#000000', '#FFFFFF', '#9CA3AF', '#3B82F6', '#EF4444', '#10B981'].map((hex, i) => {
                  const searchHex = hex === '#000000' ? '#000' : hex === '#FFFFFF' ? '#fff' : hex;
                  const isSelected = selectedColors.includes(searchHex);
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleColorChange(hex)}
                      className={`w-6 h-6 rounded-full border shadow-sm flex items-center justify-center ${isSelected ? 'border-black ring-2 ring-black/20' : 'border-gray-300'}`} 
                      style={{ backgroundColor: hex }}
                    >
                      {isSelected && <div className={`w-2 h-2 rounded-full ${hex === '#FFFFFF' ? 'bg-black' : 'bg-white'}`}></div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="border-b border-gray-200 pb-4">
            <button 
              onClick={() => toggleAccordion('price')}
              className="w-full flex justify-between items-center text-sm font-semibold text-black mb-3"
            >
              PRICE
              <iconify-icon icon={activeAccordion === 'price' ? "lucide:minus" : "lucide:plus"} class="text-gray-400"></iconify-icon>
            </button>
            {activeAccordion === 'price' && (
              <div className="flex flex-col gap-2 mt-2">
                {['Under $20.00', '$20.00 - $40.00', '$40.00 - $60.00', 'Above $60.00'].map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" />
                    <span className="text-sm text-gray-600 group-hover:text-black">{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Product Grid */}
        <div className="flex-1 flex flex-col">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-[#F9F9F9]"
              />
              <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></iconify-icon>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <select className="border-none bg-transparent font-medium text-black cursor-pointer focus:outline-none">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
            {paginatedProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-500">
                No products found matching your criteria.
              </div>
            ) : (
              paginatedProducts.map((prod) => (
                <div key={prod.id} onClick={() => navigate(`/product/${prod.id}`)} className="group flex flex-col cursor-pointer">
                  {/* Image Box */}
                  <div className="relative bg-[#F2F3F5] aspect-[3/4] flex items-center justify-center overflow-hidden mb-4 rounded-sm">
                    <img 
                      src={prod.img} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={prod.title} 
                    />
                    <button 
                      onClick={(e) => toggleLike(e, prod)}
                      className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-opacity duration-300 ${likedItems.includes(prod.id) ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-50 text-gray-500 hover:text-black'}`}
                    >
                      <Heart size={14} fill={likedItems.includes(prod.id) ? "currentColor" : "none"} className={likedItems.includes(prod.id) ? "text-red-500" : ""} />
                    </button>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">
                    <span>{prod.cat}</span>
                    <span>{prod.sizes}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2">{prod.title}</h3>
                  
                  {/* Colors */}
                  <div className="flex gap-1.5 mb-2.5">
                    {prod.colors.map((hex, i) => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: hex }}></div>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <p className="text-[15px] font-bold text-black">{prod.price}</p>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16 border-t border-gray-100 pt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center border-2 text-sm font-semibold transition-colors ${
                  currentPage === i + 1 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`h-10 px-4 flex items-center justify-center text-sm font-medium transition-colors ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-black'
              }`}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#0B111E] text-white pt-20 pb-10 px-6 lg:px-16 mt-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-16">
            <div className="flex flex-col items-start pl-0 md:pl-8">
              <div className="flex flex-col items-start mb-6">
                <img src="/TPL logo.png" alt="TPLS Logo" className="h-10 w-auto object-contain mb-3" style={{ filter: 'brightness(0) invert(1)' }} />
                <span className="text-lg font-semibold tracking-[0.25em] uppercase text-white">TPLS</span>
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

            <div className="flex flex-col pt-1 pl-0 md:pl-12">
              <h4 className="text-sm font-semibold mb-6 tracking-wide text-white uppercase">Quick Link</h4>
              <div className="flex flex-col space-y-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Shop for Men</a>
                <a href="#" className="hover:text-white transition-colors">Shop for Woman</a>
                <a href="#" className="hover:text-white transition-colors">Track Order</a>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>

            <div className="flex flex-col pt-1 max-w-sm">
              <h4 className="text-sm font-semibold mb-4 tracking-wide text-white uppercase">Subscribe</h4>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
                Subscribe for exclusive offers, original stories, activism awareness, events and more.
              </p>
              <form className="flex items-end w-full" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-600 pb-2 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" required />
                <button type="submit" className="bg-white text-black text-[13px] font-semibold px-6 py-2 ml-4 hover:bg-gray-200 transition-colors shrink-0">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col justify-start text-xs text-gray-500">
            <p>&copy; 2026 TPLS | All Right Reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Assistant Floating Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-white text-black h-12 md:h-14 px-4 md:px-5 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 z-[80] group border border-gray-200 cursor-pointer gap-2.5"
      >
        <Sparkles size={18} strokeWidth={1.5} className="text-gray-800 group-hover:text-black transition-colors" />
        <span className="text-[13px] font-medium text-gray-800 group-hover:text-black tracking-wide uppercase">Ask Markus</span>
        {isChatOpen && <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border-[1.5px] border-white" />}
      </button>

      {/* AI Chatbox Overlay placeholder - reused logic from Apparel.tsx if full functionality requested here too */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 md:right-8 w-[340px] h-[450px] rounded-[1.2rem] bg-white border border-gray-200 z-[70] flex flex-col overflow-hidden shadow-2xl font-[Satoshi]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Markus - Products</p>
                  <p className="text-[10px] text-gray-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 custom-scrollbar bg-white">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-[#F2F3F5] text-gray-800 self-start rounded-2xl rounded-bl-sm"
                      : "bg-black text-white self-end rounded-2xl rounded-br-sm"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[85%] px-4 py-3 bg-[#F2F3F5] text-gray-800 self-start rounded-2xl rounded-bl-sm"
                >
                  <div className="flex items-center gap-1.5 py-1 px-0.5">
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-[#F9F9F9]">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm focus-within:border-gray-400 transition-colors">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about sizes, styles..."
                  className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
