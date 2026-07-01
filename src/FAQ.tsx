import React, { useEffect } from 'react';
import './Trading.css';
import { Link } from 'react-router-dom';

export default function FAQ() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.reveal, .reveal-down, .reveal-left, .reveal-right').forEach((el) => {
            observer.observe(el);
        });

        setTimeout(() => {
            document.querySelectorAll('.reveal, .reveal-down, .reveal-left, .reveal-right').forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 100);

        const handleScroll = () => {
            const section = document.getElementById('why');
            if(!section) return;
            const rect = section.getBoundingClientRect();
            
            let progress = 0;
            if (rect.top <= 0) {
                const totalScrollDistance = section.offsetHeight - window.innerHeight;
                progress = Math.abs(rect.top) / totalScrollDistance;
                progress = Math.min(1, Math.max(0, progress));
            }

            const card1 = document.getElementById('card-1');
            const card2 = document.getElementById('card-2');

            const isLg = window.innerWidth >= 1024;
            const startXOffset = isLg ? -48 : -24;
            const startYOffset = isLg ? 24 : 16;
            const startScale = isLg ? 0.95 : 0.9;

            if(card1 && card2) {
                const y1 = progress * -100;
                const opacity1 = 1 - (progress * 2.5);
                card1.style.transform = `translateY(${y1}px)`;
                card1.style.opacity = Math.max(0, opacity1).toString();

                const scale2 = startScale + (progress * (1 - startScale));
                const x2 = startXOffset - (progress * startXOffset);
                const y2 = startYOffset - (progress * startYOffset);
                const opacity2 = 0.5 + (progress * 0.5);
                card2.style.transform = `translate(${x2}px, ${y2}px) scale(${scale2})`;
                card2.style.opacity = opacity2.toString();
                card2.style.zIndex = progress > 0.3 ? "30" : "0";
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="bg-[#060606] text-white font-sans selection:bg-[#e06810] selection:text-white">
<div className="min-h-screen flex flex-col relative w-full">

        {/* Navigation */}
        <nav className="w-full absolute top-0 left-0 z-50 pt-8 transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
                {/* Logo */}
                <Link to="/trading" className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                        <iconify-icon icon="lucide:x" className="text-black text-[14px] font-bold stroke-[3]"></iconify-icon>
                    </div>
                    <span className="text-xl font-medium tracking-tight mt-0.5 text-white">TPLS</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center bg-[#151515] rounded-full px-1.5 py-1 border border-white/10 shadow-2xl">
                    <Link to="/trading" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Home</Link>
                    <Link to="/about" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">About Us</Link>
                    <Link to="/faq" className="px-5 py-2 text-[13px] font-medium text-white hover:bg-white/10 rounded-full transition-colors">FAQ</Link>
                    <Link to="/contact" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Contact us</Link>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    <button className="flex items-center gap-1.5 text-[13px] font-medium text-white/60 hover:text-white transition-colors">
                        EN <iconify-icon icon="lucide:chevron-down" className="text-[10px] opacity-70"></iconify-icon>
                    </button>
                    <Link to="/trading#compare" className="px-6 py-2.5 text-[13px] font-medium border border-white/30 hover:border-white rounded-full transition-all hover:bg-white hover:text-black text-white bg-transparent">
                        Trader Area
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden text-white p-2">
                    <iconify-icon icon="lucide:menu" className="text-2xl"></iconify-icon>
                </button>
            </div>
        </nav>

        {/* FAQ Header */}
        <header className="pt-48 pb-20 relative border-b border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
            <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10 reveal">
                <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">Frequently Asked Questions</h1>
                <p className="text-white/60 text-lg leading-relaxed">
                    Everything you need to know about the TPL ecosystem. Can't find what you're looking for? <a href="mailto:timepiecels26@gmail.com" className="text-[#e06810] hover:underline">Email us</a>.
                </p>
            </div>
        </header>

        {/* FAQ Content */}
        <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-20">
            
            {/* General */}
            <div className="mb-16 reveal">
                <h2 className="text-2xl font-medium text-white mb-8 flex items-center gap-3">
                    <iconify-icon icon="lucide:info" className="text-[#e06810]"></iconify-icon> General
                </h2>
                <div className="space-y-4">
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            What does "For His Glory" mean?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            Every brand under Time Piece Lifestyle is built around one conviction: our calling is to build well. "For His Glory" anchors our sub-brand taglines as a reminder — but more than that, it's our operating framework. We build with purpose, not impulse. We pursue excellence, not shortcuts. We steward our time, talent, and resources as a trust, not a given. Colossians 3:23 — "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters" — isn't just a scripture reference. It's how we make every decision.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            What is the TPL ecosystem?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            One company, three distinct brands under one umbrella: TPL: Apparel, TPL: Markets, and TPL: Trading. Future expansion includes watches, monitors, accessories, and desk setups — all under the TPL ecosystem.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            How can I stay updated on new products?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            Join the TPAM Discord. As new products and features come online, the community is always the first to know. Free community access is available now at <a href="https://discord.gg/7b5asbZAkq" target="_blank" className="text-[#e06810] hover:underline">discord.gg/7b5asbZAkq</a>.
                        </div>
                    </details>
                </div>
            </div>

            {/* TPL: Trading */}
            <div className="mb-16 reveal reveal-delay-1">
                <h2 className="text-2xl font-medium text-white mb-8 flex items-center gap-3">
                    <iconify-icon icon="lucide:bar-chart-2" className="text-[#e06810]"></iconify-icon> TPL: Trading
                </h2>
                <div className="space-y-4">
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            What is included in the TPL: Trading program?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            TPL: Trading is the trading education and mentorship program under the TPL umbrella. It includes free community access, a structured analyst track (Apprentice → Junior → Senior → Lead), live trade documentation, and mentorship sessions.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            Do you provide trade calls or signals?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            We don't sell trade calls or "signals." We teach you to read the market. Most groups sell subscriptions by showing winning trades — we show the process, including the losing ones. The goal is a trader who can think independently, not one who depends on someone else's calls.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            How does the analyst hierarchy work?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            A four-tier progression — Apprentice → Junior → Senior → Lead. It's a growth framework, not a billing hierarchy designed to upsell you into expensive tiers. Each level builds on the last: Apprentices learn fundamentals, Juniors form independent market reads, Seniors mentor and lead sessions, Leads drive curriculum and community standards.
                        </div>
                    </details>

                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            Is there a free tier available?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            Yes. Free community access and real educational content is available to everyone — no credit card, no teaser. Join the Discord now at <a href="https://discord.gg/7b5asbZAkq" target="_blank" className="text-[#e06810] hover:underline">discord.gg/7b5asbZAkq</a>.
                        </div>
                    </details>
                </div>
            </div>

            {/* TPL: Apparel & Markets */}
            <div className="mb-16 reveal reveal-delay-2">
                <h2 className="text-2xl font-medium text-white mb-8 flex items-center gap-3">
                    <iconify-icon icon="lucide:shopping-bag" className="text-[#e06810]"></iconify-icon> Apparel & Markets
                </h2>
                <div className="space-y-4">
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            What materials are used for TPL: Apparel?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            Premium-weight cotton and cotton-blend fabrics, selected for durability and comfort. Tees and polos are midweight — substantial enough to hold structure, light enough for all-day wear. No thin, disposable fabrics. The logo is stitched, not printed — embroidery holds up to repeated washing far better than screen printing.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            What is TPL: Markets?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            TPL: Markets is the physical goods arm of the TPL ecosystem — premium everyday carry and workspace products (watches, monitors, desk setups, phone cases, and more). Every product is vetted by the TPL team before it ships. No compromises on quality, no fast-fashion noise.
                        </div>
                    </details>
                    
                    <details className="group bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e06810]/30 transition-colors">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-white/90 text-lg">
                            Do you ship internationally?
                            <iconify-icon icon="lucide:chevron-down" className="text-white/40 group-open:rotate-180 transition-transform"></iconify-icon>
                        </summary>
                        <div className="px-6 pb-6 text-white/50 text-base leading-relaxed border-t border-white/5 pt-4">
                            Domestic US shipping is available for all products. International availability depends on the fulfillment provider — check the shop page for current shipping destinations. More regions are added as fulfillment expands.
                        </div>
                    </details>
                </div>
            </div>

        </main>

        {/* Footer */}
        <footer className="bg-[#060606] pt-20 pb-10 border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 reveal">
                    <div>
                        <Link to="/trading" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <iconify-icon icon="lucide:x" className="text-black text-[16px] font-bold stroke-[3]"></iconify-icon>
                            </div>
                            <span className="text-xl font-medium tracking-tight mt-0.5 text-white">TPLS</span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            Excellence and faith aren't in tension.<br/>Every tick of the clock, every trade executed, every stitch in our apparel points back to Him.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-6">TPL Ecosystem</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Trading</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Markets</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Apparel</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">About Us</a></li>
                            <li><Link to="/faq" className="hover:text-[#e06810] transition-colors">FAQ</Link></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 reveal reveal-delay-1">
                    <p className="text-white/40 text-xs leading-relaxed max-w-4xl text-center lg:text-left">
                        <strong className="text-white/60">General Risk Disclaimer:</strong> Market data and trading
                        education provided by Time Piece Lifestyle is for educational purposes only and does not
                        constitute financial advice.
                    </p>
                    <div className="flex items-center gap-2 text-white/40 text-sm shrink-0 text-center lg:text-right">
                        <span>© 2026 Time Piece Lifestyle.<br /><span className="text-[#e06810]/80">Every Tick, His Glory.</span></span>
                    </div>
                </div>
            </div>
        </footer>

    </div>
        </div>
    );
}
