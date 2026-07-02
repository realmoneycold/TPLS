import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAIChatReply } from "./services/aiConfig";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Sparkles, Heart } from "lucide-react";
import Header from './Header';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': any;
    }
  }
}

const wheelProducts = [
  { name: 'Core Black Hoodie', price: '$85.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-black-hoodie-front.png?v=1780053097', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-black-hoodie-back.png?v=1780070496', desc: 'A statement in elevated comfort. Crafted from heavyweight 500gsm organic cotton, offering a structured silhouette with a soft, brushed interior finish.' },
  { name: 'Schematic Longsleeve Tee', price: '$55.00', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/schematic-longsleeve-front.png?v=1780053340', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/schematic-longsleeve-back.png?v=1780053340', desc: 'Premium longsleeve tee with a unique schematic design. Made from 100% organic cotton for all-day comfort.' },
  { name: 'Expressive Tee', price: '$41.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/expressive-tee-front.png?v=1780052951', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/expressive-tee-back.png?v=1780052951', desc: 'Express yourself with this premium tee, crafted from soft organic cotton with a relaxed fit.' },
  { name: 'Core Cap', price: '$34.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-cap-front.png?v=1780052836', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-cap-front.png?v=1780052836', desc: 'Classic unstructured cap with embroidered logo. Adjustable strap for a perfect fit.' },
  { name: 'Kinetic Tee', price: '$41.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/kinetic-tee-front.png?v=1780053256', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/kinetic-tee-back.png?v=1780053256', desc: 'Dynamic design meets everyday comfort. Heavyweight organic cotton with a clean classic fit.' },
  { name: 'Chladni Tote Bag', price: '$24.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/tote-front.png?v=1780052519', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/tote-back.png?v=1780301430', desc: 'Sturdy canvas tote bag featuring the Chladni pattern. Perfect for everyday carry.' },
  { name: 'Research Preview Cap', price: '$34.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-cap-front.png?v=1780052774', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-cap-side.png?v=1780052773', desc: 'Limited edition cap with a research preview embroidery. Adjustable closure.' },
  { name: 'Reverb Longsleeve Tee', price: '$55.00', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/reverb-longsleeve-front.png?v=1780053317', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/reverb-longsleeve-back.png?v=1780070181', desc: 'A premium longsleeve with reverb-inspired graphic. Soft hand feel with structured construction.' },
  { name: 'Core Tee', price: '$41.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-tee-front.png?v=1780053131', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-tee-back.png?v=1780301637', desc: 'The essential core tee. Clean, minimal design in premium organic cotton.' },
  { name: 'Employee Tee', price: '$41.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/employee-tee-front.png?v=1780052707', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/employee-tee-back.png?v=1780301815', desc: 'Wear it like you work here. Premium cotton tee with subtle branding.' },
  { name: 'Wave Hoodie', price: '$85.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/wave-hoodie-front.png?v=1780053289', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/wave-hoodie-back.png?v=1780070626', desc: 'Premium heavyweight hoodie with wave-inspired design. 500gsm organic cotton.' },
  { name: 'Core Crew Sweatshirt', price: '$75.00', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-crew-front.png?v=1780052909', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-crew-back.png?v=1780301939', desc: 'Classic crew sweatshirt in heavyweight organic cotton. Brushed interior for warmth.' },
  { name: '11_11 Crew Sweatshirt', price: '$75.00', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/11-11-crew-front_fb8efabc-8659-4bcc-b66c-c6102044ae18.png?v=1780053477', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/11-11-crew-back_e39ad985-f5b6-43e7-8548-c0548782e598.png?v=1780067125', desc: 'Limited edition crew with the iconic 11:11 design. Premium heavyweight construction.' },
  { name: '11_11 Water Bottle', price: '$29.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/nalgene-front_a4c6a823-d646-41c2-8132-daaec5222b9d.png?v=1780052440', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/nalgene-back.png?v=1780052438', desc: 'Durable Nalgene water bottle with custom 11:11 design. 1000ml capacity.' },
  { name: 'Research Preview Hoodie', price: '$85.99', front: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-hoodie-font.png?v=1780052640', back: 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-hoodie-back_e4d98a9d-d94f-4705-a678-0e611bb2b5a1.png?v=1780066397', desc: 'Limited research preview hoodie. Heavyweight 500gsm organic cotton with structured silhouette.' }
];

export default function Apparel() {
  const navigate = useNavigate();

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hello! Welcome to TPL Apparel. How can I assist you with our collection today?" }
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
        throw new Error("API Key is not configured in .env file.");
      }

      const reply = await generateAIChatReply(
        apiKey,
        [...chatMessages, { role: "user", text: userMsg }],
        userMsg,
        "User is browsing the TPL: Apparel collection page. Featured products: Core Black Hoodie ($85.99), Schematic Longsleeve Tee ($55.00), Expressive Tee ($41.99), Core Cap ($34.99), Kinetic Tee ($41.99), Chladni Tote Bag ($24.99), Research Preview Cap ($34.99), Reverb Longsleeve Tee ($55.00), Core Tee ($41.99), Employee Tee ($41.99), Wave Hoodie ($85.99), Core Crew Sweatshirt ($75.00), 11_11 Crew Sweatshirt ($75.00), 11_11 Water Bottle ($29.99), Research Preview Hoodie ($85.99)."
      );

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

  // Scroll functionality
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [likedItems, setLikedItems] = useState<any[]>([]);

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
      currentLikes.push({ id: prod.id, name: prod.name, front: prod.front });
    }
    setLikedItems(currentLikes.map((p: any) => p.id));
    localStorage.setItem('likedProducts', JSON.stringify(currentLikes));
    window.dispatchEvent(new CustomEvent('likedProductsUpdated'));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDown(false);
      if (sliderRef.current) {
        sliderRef.current.classList.remove('active');
      }
    };
    if (isDown) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDown]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    sliderRef.current.classList.add('active');
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDown(false);
    if (sliderRef.current) {
      sliderRef.current.classList.remove('active');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 0.5; // Even slower, making it feel heavier and smoother
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollByAmount = (amount: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Wheel State & Logic
  const wheelRef = useRef<HTMLDivElement>(null);
  const RADIUS = 38; // vmin
  const TARGET_ANGLE = 90;

  const wheelRotationRef = useRef(0);
  const activeIndexRef = useRef(-1);
  const animatingRotationRef = useRef(false);
  const touchStartYRef = useRef(0);

  const [activeProductIndex, setActiveProductIndex] = useState(-1);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [mainImgSrc, setMainImgSrc] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');

  const productElsRef = useRef<(HTMLDivElement | null)[]>([]);

  const updatePositions = () => {
    productElsRef.current.forEach((el, index) => {
      if (!el) return;
      const baseAngle = parseFloat(el.dataset.baseAngle || "0");
      const currentAngle = baseAngle + wheelRotationRef.current;
      const rad = (currentAngle - 90) * (Math.PI / 180);
      const x = Math.cos(rad) * RADIUS;
      const y = Math.sin(rad) * RADIUS;
      el.style.transform = `translate(calc(-50% + ${x}vmin), calc(-50% + ${y}vmin)) scale(1)`;
      el.style.opacity = '1';
    });
  };

  useEffect(() => {
    updatePositions();
  }, []);

  const selectProduct = (index: number) => {
    if (animatingRotationRef.current) return;
    const product = wheelProducts[index];
    const el = productElsRef.current[index];
    if (!el) return;

    const baseAngle = parseFloat(el.dataset.baseAngle || "0");
    const targetWheelRotation = TARGET_ANGLE - baseAngle;

    let rotationDelta = targetWheelRotation - wheelRotationRef.current;
    while (rotationDelta > 180) rotationDelta -= 360;
    while (rotationDelta < -180) rotationDelta += 360;

    const finalRotation = wheelRotationRef.current + rotationDelta;

    if (wheelRef.current) {
      wheelRef.current.style.transform = `translate(calc(-133vmin - 10vw), 0) scale(3.5)`;
    }

    setActiveProductIndex(index);
    activeIndexRef.current = index;

    animatingRotationRef.current = true;
    const startRotation = wheelRotationRef.current;
    const startTime = performance.now();
    const duration = 600;

    const animateWheel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      wheelRotationRef.current = startRotation + (finalRotation - startRotation) * eased;
      updatePositions();

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        wheelRotationRef.current = finalRotation;
        updatePositions();
        animatingRotationRef.current = false;
      }
    };
    requestAnimationFrame(animateWheel);
  };

  const closeDetail = () => {
    if (activeIndexRef.current === -1) return;
    activeIndexRef.current = -1;
    setActiveProductIndex(-1);
    setIsDetailVisible(false);

    if (wheelRef.current) {
      wheelRef.current.style.transform = `translateX(0) scale(1)`;
      wheelRef.current.style.opacity = '1';
    }
    updatePositions();
  };

  const openProductDetail = (index: number) => {
    setIsDetailVisible(true);
    setMainImgSrc(wheelProducts[index].front);
    if (wheelRef.current) wheelRef.current.style.opacity = '0';
  };

  const handleWheel = (e: WheelEvent) => {
    if (isDetailVisible) return;
    e.preventDefault();
    if (animatingRotationRef.current) return;

    if (activeIndexRef.current !== -1) {
      let nextIndex = activeIndexRef.current + (e.deltaY > 0 ? 1 : -1);
      if (nextIndex >= wheelProducts.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = wheelProducts.length - 1;
      selectProduct(nextIndex);
    } else {
      wheelRotationRef.current += e.deltaY * 0.05;
      updatePositions();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDetailVisible) return;
    e.preventDefault();
    if (animatingRotationRef.current) return;

    const deltaY = touchStartYRef.current - e.touches[0].clientY;
    touchStartYRef.current = e.touches[0].clientY;
    if (Math.abs(deltaY) < 5) return;

    if (activeIndexRef.current !== -1) {
      let nextIndex = activeIndexRef.current + (deltaY > 0 ? 1 : -1);
      if (nextIndex >= wheelProducts.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = wheelProducts.length - 1;
      selectProduct(nextIndex);
    } else {
      wheelRotationRef.current += deltaY * 0.1;
      updatePositions();
    }
  };

  useEffect(() => {
    const wheel = wheelRef.current;
    if (wheel) {
      wheel.addEventListener('wheel', handleWheel, { passive: false });
      wheel.addEventListener('touchstart', handleTouchStart, { passive: true });
      wheel.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        wheel.removeEventListener('wheel', handleWheel);
        wheel.removeEventListener('touchstart', handleTouchStart);
        wheel.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isDetailVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDetailVisible) {
          setIsDetailVisible(false);
          if (wheelRef.current) wheelRef.current.style.opacity = '1';
        } else if (activeIndexRef.current !== -1) {
          closeDetail();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDetailVisible]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col w-full relative overflow-x-hidden text-black font-[Satoshi]">
      <style>{`
        body { font-family: 'Satoshi', sans-serif; background-color: #F9F9F9; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        #interactive-wheel-section .wheel-container {
          position: relative; width: 92vmin; height: 92vmin; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.06); margin: auto; z-index: 10;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
          transform-origin: center center;
        }

        #interactive-wheel-section .product-wrapper {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          cursor: pointer; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s ease, opacity 0.5s ease;
          width: 13vmin; height: 13vmin; display: flex; justify-content: center; align-items: center; z-index: 1;
        }

        #interactive-wheel-section .product-wrapper:hover {
          z-index: 15; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
        }

        #interactive-wheel-section .product-wrapper.active {
          z-index: 40 !important; cursor: default; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
        }

        #interactive-wheel-section .image-container {
          position: relative; width: 100%; height: 100%;
        }

        #interactive-wheel-section .product-img {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;
          pointer-events: none; transition: opacity 0.3s ease;
        }

        #interactive-wheel-section .product-img-front { z-index: 2; }
        #interactive-wheel-section .product-img-back { z-index: 1; opacity: 0; }
        #interactive-wheel-section .product-wrapper:hover .product-img-front { opacity: 0; }
        #interactive-wheel-section .product-wrapper:hover .product-img-back { opacity: 1; }

        #interactive-wheel-section #product-panel {
          transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        #interactive-wheel-section .open-btn-container {
          position: relative; width: 6rem; height: 6rem; border-radius: 1rem; overflow: hidden;
          background: #333; flex-shrink: 0; cursor: pointer; border: 2px solid rgba(255,255,255,0.15);
        }
        #interactive-wheel-section .open-btn-container:hover { border-color: rgba(255,255,255,0.4); }
        #interactive-wheel-section .open-btn-container img { width: 100%; height: 100%; object-fit: contain; }

        #interactive-wheel-section .open-btn-label {
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          background: rgba(0,0,0,0.75); color: white; font-size: 0.7rem; font-weight: 500;
          padding: 2px 12px; border-radius: 9999px; backdrop-filter: blur(4px);
        }

        #interactive-wheel-section .product-detail-overlay {
          position: absolute; inset: 0; z-index: 100; display: flex; opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease; background: #F9F9F9;
        }
        #interactive-wheel-section .product-detail-overlay.visible { opacity: 1; pointer-events: auto; }
        
        #interactive-wheel-section .detail-left { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        #interactive-wheel-section .detail-left img { max-width: 70%; max-height: 70vh; object-fit: contain; }
        
        #interactive-wheel-section .detail-thumbs { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        #interactive-wheel-section .detail-thumbs img { width: 60px; height: 60px; object-fit: contain; border-radius: 0.5rem; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
        #interactive-wheel-section .detail-thumbs img.active-thumb, #interactive-wheel-section .detail-thumbs img:hover { opacity: 1; }

        #interactive-wheel-section .detail-right { width: 400px; background: #1a1a1a; color: white; padding: 2.5rem; display: flex; flex-direction: column; overflow-y: auto; text-align: left; }
        #interactive-wheel-section .detail-right h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
        #interactive-wheel-section .detail-right .detail-price { color: #999; font-size: 1rem; margin-bottom: 1.5rem; }
        #interactive-wheel-section .detail-right .detail-desc { color: #bbb; font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; }

        #interactive-wheel-section .detail-close-btn { position: relative; width: 60px; height: 60px; border-radius: 1rem; overflow: hidden; background: #333; border: 2px solid rgba(255,255,255,0.15); cursor: pointer; flex-shrink: 0; }
        #interactive-wheel-section .detail-close-btn:hover { border-color: rgba(255,255,255,0.4); }
        #interactive-wheel-section .detail-close-btn img { width: 100%; height: 100%; object-fit: contain; }
        #interactive-wheel-section .detail-close-label { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.75); color: white; font-size: 0.6rem; font-weight: 500; padding: 1px 8px; border-radius: 9999px; }

        #interactive-wheel-section .size-options { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        #interactive-wheel-section .size-btn { padding: 0.5rem 1.2rem; border: 1px solid #444; border-radius: 9999px; background: transparent; color: white; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
        #interactive-wheel-section .size-btn:hover, #interactive-wheel-section .size-btn.selected { background: white; color: black; border-color: white; }

        #interactive-wheel-section .add-to-cart-btn { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 1px solid #444; background: transparent; color: white; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        #interactive-wheel-section .add-to-cart-btn:hover { background: white; color: black; }

        #interactive-wheel-section .sizing-accordion { border-top: 1px solid #333; padding-top: 1rem; margin-bottom: 1.5rem; }
        #interactive-wheel-section .sizing-accordion-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; color: white; font-weight: 500; background: none; border: none; width: 100%; padding: 0; font-size: 0.95rem; }
      `}</style>

      <Header bgColor="#F9F9F9" />

      {/* Video Section */}
      <section className="w-full h-screen relative bg-black overflow-hidden">
        <iframe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100vw,177.78vh)] h-[max(56.25vw,100vh)] pointer-events-none"
          src="https://www.youtube.com/embed/75nNqaNOYrs?autoplay=1&mute=1&controls=0&loop=1&playlist=75nNqaNOYrs"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </section>

      {/* Men/Women Split Section */}
      <section className="w-full bg-[#F9F9F9] pt-20 pb-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 tracking-wide">Shop For</h2>
          </div>

          <div className="w-full bg-[#E8E5F0] relative flex flex-col md:flex-row h-auto md:h-[750px] overflow-hidden rounded-lg">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} className="group w-full md:w-1/2 relative flex justify-center items-end p-8 min-h-[500px] md:min-h-0 block cursor-pointer overflow-hidden">
              <div className="absolute bottom-8 left-8 bg-white px-10 py-3 shadow-sm z-20 transition-transform group-hover:scale-105">
                <span className="text-sm font-medium text-gray-900 uppercase tracking-widest">Men</span>
              </div>
              <img src="https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051841057-Lascada_MEN.png" className="h-[80%] md:h-[85%] w-auto object-contain z-10 transition-transform duration-700 group-hover:scale-105 origin-bottom" alt="Men Collection" />
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} className="group w-full md:w-1/2 relative flex justify-center items-end p-8 min-h-[500px] md:min-h-0 block cursor-pointer overflow-hidden">
              <div className="absolute bottom-8 left-8 bg-white px-10 py-3 shadow-sm z-20 transition-transform group-hover:scale-105">
                <span className="text-sm font-medium text-gray-900 uppercase tracking-widest">Women</span>
              </div>
              <div className="absolute bottom-8 right-8 flex flex-col items-center z-20">
                <div className="w-4 h-4 border-[1.5px] border-black rotate-45 flex items-center justify-center mb-1">
                  <div className="w-1 h-1 bg-black"></div>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase">TPLS</span>
              </div>
              <img src="https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/1/1729051838710-Lacada_WOMEN.png" className="h-[80%] md:h-[85%] w-auto object-contain z-10 transition-transform duration-700 group-hover:scale-105 origin-bottom" alt="Women Collection" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full bg-[#F9F9F9] py-16 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-4xl font-light text-gray-800 tracking-tight">Featured Products</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollByAmount(-350)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <iconify-icon icon="lucide:chevron-left" class="text-xl"></iconify-icon>
              </button>
              <button onClick={() => scrollByAmount(350)} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                <iconify-icon icon="lucide:chevron-right" class="text-xl"></iconify-icon>
              </button>
            </div>
          </div>
          <div className="relative group">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
              className="flex gap-6 overflow-x-auto no-scrollbar pb-12 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none"
            >
              {[
                { id: "apparel-1", title: "Striped Knit Shirt", price: "$39.99", cat: "Man", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750141248450-fulls-(4).png&w=640&q=75" },
                { id: "apparel-2", title: "Embroidered Shirt Denim", price: "$39.99", cat: "Woman", sizes: "S - XXL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" },
                { id: "apparel-3", title: "Tweed Ruffle Dress", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750408187531-untitled-00519-2-(1).jpg&w=640&q=75" },
                { id: "apparel-4", title: "Striped Knit Shirt V2", price: "$39.99", cat: "Man", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750141248450-fulls-(4).png&w=640&q=75" },
                { id: "apparel-5", title: "Embroidered Shirt Denim", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" },
                { id: "apparel-6", title: "Tweed Ruffle Dress", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750408187531-untitled-00519-2-(1).jpg&w=640&q=75" },
                { id: "apparel-7", title: "Signature Denim Shirt", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" },
                { id: "apparel-8", title: "Striped Knit Shirt", price: "$39.99", cat: "Man", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750141248450-fulls-(4).png&w=640&q=75" },
                { id: "apparel-9", title: "Embroidered Shirt Denim", price: "$39.99", cat: "Woman", sizes: "S - XXL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" },
                { id: "apparel-10", title: "Tweed Ruffle Dress", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750408187531-untitled-00519-2-(1).jpg&w=640&q=75" },
                { id: "apparel-11", title: "Striped Knit Shirt V2", price: "$39.99", cat: "Man", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750141248450-fulls-(4).png&w=640&q=75" },
                { id: "apparel-12", title: "Embroidered Shirt Denim", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" },
                { id: "apparel-13", title: "Tweed Ruffle Dress", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750408187531-untitled-00519-2-(1).jpg&w=640&q=75" },
                { id: "apparel-14", title: "Signature Denim Shirt", price: "$39.99", cat: "Woman", sizes: "S - XL", img: "https://www.lascada.id/_next/image?url=https%3A%2F%2Fsgp1.digitaloceanspaces.com%2Fupload-file-s3%2Flascada%2F12%2F1750403679332-untitled-00774-(1).jpg&w=640&q=75" }
              ].map((prod, i) => (
                <div 
                  key={i} 
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    navigate('/product/1');
                  }} 
                  className="flex-shrink-0 w-[280px] md:w-[320px] group/card cursor-pointer"
                >
                  <div className="relative bg-[#F2F2F2] aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <img draggable="false" src={prod.img} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" alt={prod.title} />
                    <button 
                      onClick={(e) => toggleLike(e, prod)}
                      className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm transition-opacity duration-300 ${likedItems.includes(prod.id) ? 'opacity-100 text-red-500' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}
                    >
                      <Heart size={16} fill={likedItems.includes(prod.id) ? "currentColor" : "none"} className={likedItems.includes(prod.id) ? "text-red-500" : ""} />
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      <span>{prod.cat}</span>
                      <span>{prod.sizes}</span>
                    </div>
                    <h3 className="text-sm md:text-base font-medium mt-1 text-gray-900">{prod.title}</h3>
                    <p className="text-base font-bold mt-2 text-black">{prod.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center mt-12">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/products'); }} className="inline-block border border-black px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-all duration-300">
              Shop All Featured Product
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Wheel Section */}
      <section id="interactive-wheel-section" className="w-full h-[100vh] relative overflow-hidden bg-[#F9F9F9] flex items-center justify-center">
        {activeProductIndex !== -1 && (
          <div id="bg-overlay" className="absolute inset-0 z-0 block" onClick={closeDetail}></div>
        )}

        <div className="wheel-container" id="product-wheel" ref={wheelRef}>
          {wheelProducts.map((product, index) => {
            const baseAngle = (index * 360) / wheelProducts.length;
            return (
              <div
                key={index}
                className={`product-wrapper ${activeProductIndex === index ? 'active' : ''}`}
                data-base-angle={baseAngle}
                ref={el => { productElsRef.current[index] = el; }}
                onClick={() => {
                  if (activeProductIndex !== index) selectProduct(index);
                }}
              >
                <div className="image-container">
                  <img src={product.front} className="product-img product-img-front" draggable="false" alt="" />
                  <img src={product.back} className="product-img product-img-back" draggable="false" alt="" />
                </div>
              </div>
            );
          })}
        </div>

        <div
          id="product-panel"
          className={`absolute right-[5%] top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white rounded-[1.5rem] px-5 py-4 w-[22rem] flex items-center justify-between gap-4 z-50 shadow-2xl transition-all duration-500
            ${activeProductIndex !== -1 && !isDetailVisible ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none translate-x-8'}`}
        >
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-medium text-[1.05rem] mb-1 truncate">{activeProductIndex !== -1 ? wheelProducts[activeProductIndex].name : ''}</h3>
            <p className="text-gray-400 text-sm">{activeProductIndex !== -1 ? wheelProducts[activeProductIndex].price : ''}</p>
          </div>
          <button
            className="open-btn-container transition-all"
            onClick={() => {
              if (activeProductIndex !== -1) openProductDetail(activeProductIndex);
            }}
          >
            <img src={activeProductIndex !== -1 ? wheelProducts[activeProductIndex].front : ''} className="w-full h-full object-contain" alt="" />
            <span className="open-btn-label">Open</span>
          </button>
        </div>

        <div id="product-detail" className={`product-detail-overlay ${isDetailVisible ? 'visible' : ''}`}>
          {activeProductIndex !== -1 && (
            <>
              <div className="detail-left">
                <img src={mainImgSrc} alt="" />
                <div className="detail-thumbs">
                  <img src={wheelProducts[activeProductIndex].front} className={mainImgSrc === wheelProducts[activeProductIndex].front ? 'active-thumb' : ''} onClick={() => setMainImgSrc(wheelProducts[activeProductIndex].front)} alt="" />
                  <img src={wheelProducts[activeProductIndex].back} className={mainImgSrc === wheelProducts[activeProductIndex].back ? 'active-thumb' : ''} onClick={() => setMainImgSrc(wheelProducts[activeProductIndex].back)} alt="" />
                </div>
              </div>
              <div className="detail-right">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2>{wheelProducts[activeProductIndex].name}</h2>
                    <p className="detail-price">{wheelProducts[activeProductIndex].price}</p>
                  </div>
                  <button className="detail-close-btn" onClick={() => setIsDetailVisible(false)}>
                    <img src={wheelProducts[activeProductIndex].front} alt="" />
                    <span className="detail-close-label">Close</span>
                  </button>
                </div>
                <p className="detail-desc">{wheelProducts[activeProductIndex].desc}</p>
                <div className="sizing-accordion">
                  <button className="sizing-accordion-header">
                    <span>Sizing</span>
                    <span>+</span>
                  </button>
                </div>
                <div className="size-options">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#03060a] text-white pt-24 pb-12 px-6 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
            <div className="flex flex-col items-start pl-0 md:pl-8">
              <div className="flex flex-col items-center mb-8">
                <img src="/TPL logo.png" alt="TPLS Logo" className="h-12 w-auto object-contain mb-3" />
                <span className="text-xl font-semibold tracking-[0.25em] uppercase text-white">TPLS</span>
              </div>
              <div className="flex space-x-6 text-white ml-2">
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="mdi:instagram" class="text-lg"></iconify-icon>
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="mdi:youtube" class="text-lg"></iconify-icon>
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  <iconify-icon icon="ic:baseline-tiktok" class="text-lg"></iconify-icon>
                </a>
              </div>
            </div>

            <div className="flex flex-col pt-2 pl-0 md:pl-12">
              <h4 className="text-base font-semibold mb-6 tracking-wide text-white">Quick Link</h4>
              <div className="flex flex-col space-y-4 text-[13px] text-gray-300">
                <a href="#" className="hover:text-white transition-colors">Shop for Men</a>
                <a href="#" className="hover:text-white transition-colors">Shop for Woman</a>
              </div>
            </div>

            <div className="flex flex-col pt-2 max-w-sm">
              <h4 className="text-base font-semibold mb-4 tracking-wide text-white">Subscribe</h4>
              <p className="text-[13px] text-gray-300 leading-relaxed mb-8">
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

          <div className="pt-8 border-t border-gray-800 flex flex-col justify-start text-[12px] text-gray-500">
            <p>&copy;2026 TPLS | All Right Reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Assistant Chatbox */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 md:right-8 w-[340px] h-[450px] rounded-[1.2rem] bg-white border border-gray-200 z-[70] flex flex-col overflow-hidden shadow-2xl font-[Satoshi]"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Markus - Apparel</p>
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

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 custom-scrollbar bg-white">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] px-4 py-2.5 text-xs leading-relaxed ${msg.role === "ai"
                      ? "bg-[#F2F2F2] text-gray-800 self-start rounded-2xl rounded-bl-sm"
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
                  className="max-w-[85%] px-4 py-3 bg-[#F2F2F2] text-gray-800 self-start rounded-2xl rounded-bl-sm"
                >
                  <div className="flex items-center gap-1.5 py-1 px-0.5">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
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

      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#03060a] text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-[80] group border border-gray-800 cursor-pointer"
      >
        <Sparkles size={24} className="group-hover:text-gray-300 transition-colors" />
        {isChatOpen && <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />}
      </button>
    </div>
  );
}
