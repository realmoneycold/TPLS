import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Heart, Share2, Plus, Minus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';
import { GoogleGenAI } from "@google/genai";

const productDatabase = {
  '1': {
    title: 'Striped Knit Shirt',
    price: '$39.99',
    colors: [
      { name: 'Black', hex: '#000000', images: ['https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750141248450-fulls-(4).png'] },
      { name: 'Grey', hex: '#d1d5db', images: ['https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750141248450-fulls-(4).png'] }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    desc: 'Striped knit shirt in soft cotton material.'
  },
  'prime-fit-oxford-shirt': {
    title: 'Prime Fit Oxford Shirt',
    price: '$45.00',
    colors: [
      { name: 'Black', hex: '#000000', images: ['https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750403679332-untitled-00774-(1).jpg'] },
      { name: 'Light Blue', hex: '#3b82f6', images: ['https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750403679332-untitled-00774-(1).jpg'] }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 90,
    desc: 'Prime Fit Oxford Shirt. High-quality cotton oxford fabric with a modern fit.'
  }
};

const relatedProducts = [
  { id: 101, title: 'Everywear Chino Pants', price: '$39.99', cat: 'Man', sizes: '29 - 42', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051841057-Lascada_MEN.png' },
  { id: 102, title: 'Loose-Fit Cargo', price: '$49.99', cat: 'Man', sizes: 'Regular', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051841057-Lascada_MEN.png' },
  { id: 103, title: 'Men Flex Cargo', price: '$49.99', cat: 'Man', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051841057-Lascada_MEN.png' },
  { id: 104, title: 'Flutter Sleeve Shirt', price: '$29.99', cat: 'Woman', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051838710-Lacada_WOMEN.png' },
];

const recentlyViewedProducts = [
  { id: 105, title: 'Embroidered Shirt Denim', price: '$39.99', cat: 'Woman', sizes: 'S - XXL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051838710-Lacada_WOMEN.png' },
  { id: 106, title: 'Embroidered Belted Shirt Dress', price: '$49.99', cat: 'Woman', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051838710-Lacada_WOMEN.png' },
  { id: 107, title: 'Tweed Ruffle Dress', price: '$49.99', cat: 'Woman', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051838710-Lacada_WOMEN.png' },
  { id: 108, title: 'Striped Knit Shirt', price: '$34.99', cat: 'Man', sizes: 'S - XL', img: 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750141248450-fulls-(4).png' },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Try to find product by ID, fallback to prime fit if not found
  const product = productDatabase[id as keyof typeof productDatabase] || productDatabase['prime-fit-oxford-shirt'];
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  
  const selectedColor = product.colors[selectedColorIndex];
  
  // Thumbnails placeholder (repeating main image for design effect as on Lascada)
  const thumbnails = Array(10).fill(selectedColor.images[0]);
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let saved = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    if (saved.length > 0 && typeof saved[0] === 'string') {
      saved = [];
      localStorage.setItem('likedProducts', '[]');
    }
    if (saved.find((p: any) => p.id === parseInt(id || '1') || p.title === product.title)) {
      setIsLiked(true);
    }
  }, [id, product.title]);

  const toggleLike = () => {
    let saved = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    if (saved.length > 0 && typeof saved[0] === 'string') saved = [];
    
    const prodId = parseInt(id || '1');
    if (isLiked) {
      const updated = saved.filter((item: any) => item.id !== prodId && item.title !== product.title);
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setIsLiked(false);
      window.dispatchEvent(new CustomEvent('likedProductsUpdated'));
    } else {
      saved.push({ id: prodId, title: product.title, img: selectedColor.images[0] });
      localStorage.setItem('likedProducts', JSON.stringify(saved));
      setIsLiked(true);
      window.dispatchEvent(new CustomEvent('likedProductsUpdated'));
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.desc,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  const handleAddToCart = () => {
    const orderDetails = {
      title: product.title,
      size: selectedSize,
      price: product.price,
      quantity: quantity
    };
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
    navigate('/checkout');
  };

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: string; text: string}[]>([
    { role: "ai", text: `Hello! I see you're looking at the ${product.title}. Need help with sizing or colors?` }
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
      const reply = response.text || "I couldn't generate a response.";
      setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: "ai", text: `Error connecting to Gemini API.` }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] flex flex-col w-full relative overflow-x-hidden text-black font-[Satoshi]">
      
      <Header bgColor="#FFFFFF" />

      {/* Main Product Layout */}
      <main className="container mx-auto px-4 lg:px-8 py-8 md:py-12 flex-1">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col lg:flex-row p-6 lg:p-10 gap-10">
          
          {/* Left Column: Thumbnail Gallery (2x5 Grid) */}
          <div className="hidden lg:grid grid-cols-2 gap-3 w-40 shrink-0 self-start">
            {thumbnails.map((thumb, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveThumbnail(idx)}
                className={`w-full aspect-[3/4] rounded border-2 transition-all overflow-hidden ${activeThumbnail === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={thumb} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>

          {/* Middle Column: Main Image */}
          <div className="flex-1 w-full relative">
            <div className="aspect-[3/4] bg-[#F9F9F9] rounded-lg overflow-hidden flex items-center justify-center">
              <img src={thumbnails[activeThumbnail]} className="w-full h-full object-contain mix-blend-multiply" alt={product.title} />
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex lg:hidden overflow-x-auto gap-2 mt-4 pb-2 no-scrollbar">
              {thumbnails.map((thumb, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveThumbnail(idx)}
                  className={`w-20 shrink-0 aspect-[3/4] rounded border-2 transition-all ${activeThumbnail === idx ? 'border-gray-900' : 'border-gray-200'}`}
                >
                  <img src={thumb} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col">
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>
            <p className="text-[22px] font-medium text-gray-900 mb-8">{product.price}</p>
            
            {/* Colors */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-3">
                Color : <span className="font-normal text-gray-600 ml-1">{selectedColor.name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setSelectedColorIndex(idx); setActiveThumbnail(0); }}
                    className={`w-10 h-10 rounded border-2 flex items-center justify-center transition-all ${selectedColorIndex === idx ? 'border-gray-900 p-0.5' : 'border-[#E4E4E4] hover:border-gray-400'}`}
                  >
                    <div className="w-full h-full rounded-sm" style={{ backgroundColor: color.hex }}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-3">
                Size : <span className="font-normal text-gray-600 ml-1">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-3 border-2 font-medium flex items-center justify-center transition-all rounded-sm ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : 'border-[#E4E4E4] text-gray-700 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-sm w-32 h-12">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Minus size={16} />
                </button>
                <div className="flex-1 h-full flex items-center justify-center font-semibold text-gray-900 border-x border-gray-300">
                  {quantity}
                </div>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500"><span className="font-bold text-gray-800">{product.stock} pcs</span> in stock</p>
            </div>

            {/* Add to Cart & Actions */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddToCart}
                className="w-full h-14 bg-black text-white font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 cursor-pointer"
              >
                Add to Cart
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={toggleLike}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 border border-gray-300 rounded-sm font-medium text-sm transition-colors cursor-pointer ${isLiked ? 'text-red-500 bg-red-50 border-red-200' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> {isLiked ? 'Saved' : 'Save'}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 h-12 flex items-center justify-center gap-2 border border-gray-300 rounded-sm font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6 lg:p-10">
          <div className="flex gap-8 border-b border-gray-200">
            {['Description', 'Additional Info', 'Reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm tracking-wide transition-all relative ${activeTab === tab ? 'font-bold text-gray-900' : 'font-medium text-gray-500 hover:text-gray-800'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
              </button>
            ))}
          </div>
          <div className="py-8 min-h-[200px]">
            {activeTab === 'Description' && (
              <p className="text-gray-600 leading-relaxed text-[15px] max-w-3xl">{product.desc}</p>
            )}
            {activeTab === 'Additional Info' && (
              <p className="text-gray-500 italic">No additional information for this product yet.</p>
            )}
            {activeTab === 'Reviews' && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                  <MessageCircle size={28} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-500 text-sm mb-6">Be the first to review this product.</p>
                <button className="px-6 py-2.5 border-2 border-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Product */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[22px] font-normal text-gray-800 tracking-wide">Related Product</h2>
            <button className="border border-black px-6 py-1.5 text-[11px] font-semibold text-black hover:bg-black hover:text-white transition-colors">
              See All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <div key={prod.id} className="group flex flex-col cursor-pointer">
                <div className="relative bg-[#F2F3F5] aspect-[3/4] flex items-center justify-center overflow-hidden mb-3 rounded-sm">
                  <img src={prod.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={prod.title} />
                  <button className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <iconify-icon icon="lucide:heart" class="text-[13px] text-gray-600"></iconify-icon>
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                  <span>{prod.cat}</span>
                  <span>{prod.sizes}</span>
                </div>
                <h3 className="text-[13px] font-normal text-gray-900 leading-snug mb-3">{prod.title}</h3>
                <p className="text-[13px] font-bold text-black">{prod.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-20 mb-10">
          <h2 className="text-[22px] font-normal text-gray-800 tracking-wide mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewedProducts.map((prod) => (
              <div key={prod.id} className="group flex flex-col cursor-pointer">
                <div className="relative bg-[#F2F3F5] aspect-[3/4] flex items-center justify-center overflow-hidden mb-3 rounded-sm">
                  <img src={prod.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={prod.title} />
                  <button className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <iconify-icon icon="lucide:heart" class="text-[13px] text-gray-600"></iconify-icon>
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                  <span>{prod.cat}</span>
                  <span>{prod.sizes}</span>
                </div>
                <h3 className="text-[13px] font-normal text-gray-900 leading-snug mb-3">{prod.title}</h3>
                <p className="text-[13px] font-bold text-black">{prod.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full bg-[#03060a] text-white pt-16 pb-6 px-6 lg:px-16 mt-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
            
            {/* Left: Logo & Socials */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-8">
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
                <a href="#" className="hover:text-white transition-colors">Shop for Men</a>
                <a href="#" className="hover:text-white transition-colors">Shop for Woman</a>
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

      {/* AI Assistant Floating Button & Chatbox */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-white text-black h-12 px-4 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 z-[80] group border border-gray-200 cursor-pointer gap-2"
      >
        <Sparkles size={18} strokeWidth={1.5} className="text-gray-800 group-hover:text-black transition-colors" />
        <span className="text-[12px] font-medium text-gray-800 group-hover:text-black tracking-wide uppercase">Ask Markus</span>
        {isChatOpen && <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border-[1.5px] border-white" />}
      </button>

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
                  <p className="text-sm font-semibold text-gray-900">Markus</p>
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
                  placeholder="Ask about this product..."
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
