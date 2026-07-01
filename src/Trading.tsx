import React, { useEffect } from 'react';
import './Trading.css';
import { Link } from 'react-router-dom';

export default function Trading() {
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
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between reveal-down">
                {/* Logo */}
                <Link to="/trading" className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                        <iconify-icon icon="lucide:x" className="text-black text-[14px] font-bold stroke-[3]"></iconify-icon>
                    </div>
                    <span className="text-xl font-medium tracking-tight mt-0.5 text-white">TPLS</span>
                </Link>

                {/* Desktop Menu */}
                <div
                    className="hidden lg:flex items-center bg-[#151515] rounded-full px-1.5 py-1 border border-white/10 shadow-2xl">
                    <Link to="/trading"
                        className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Home</Link>
                    <Link to="/about"
                        className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">About Us</Link>
                    <Link to="/faq"
                        className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">FAQ</Link>
                    <Link to="/contact"
                        className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Contact
                        us</Link>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    <button
                        className="flex items-center gap-1.5 text-[13px] font-medium text-white/60 hover:text-white transition-colors">
                        EN <iconify-icon icon="lucide:chevron-down" className="text-[10px] opacity-70"></iconify-icon>
                    </button>
                    <a href="#compare"
                        className="px-6 py-2.5 text-[13px] font-medium border border-white/30 hover:border-white rounded-full transition-all hover:bg-white hover:text-black text-white bg-transparent">
                        Trader Area
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden text-white p-2">
                    <iconify-icon icon="lucide:menu" className="text-2xl"></iconify-icon>
                </button>
            </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 relative flex flex-col pt-12 lg:pt-24 pb-8 overflow-hidden min-h-screen">
            {/* Background Image with Gradient Overlays */}
            <div
                className="absolute inset-0 w-full h-full z-0 overflow-hidden flex justify-center items-center pointer-events-none">
                <img src="https://cdn.prod.website-files.com/68821f384ee2b99395fb3a95/688c7282aa2e91cfd2adb0c6_Group%202072750887%20(1).avif"
                    alt="Hero Gradient"
                    className="w-[120%] h-[120%] max-w-none object-cover opacity-90 mix-blend-screen scale-110 translate-x-10 translate-y-10" />
                {/* Fade to black at bottom */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-transparent h-full">
                </div>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/30 to-transparent w-full">
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-10 flex flex-col h-full flex-1">

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center flex-1 py-10 lg:py-0">

                    {/* Left Content */}
                    <div className="flex flex-col items-start relative z-20 reveal">
                        {/* Trustpilot Rating */}
                        <div className="flex items-center gap-3 mb-8 opacity-90 text-[13px]">
                            <span className="text-white/80">Excellent</span>
                            <div className="flex gap-0.5 text-[#00b67a]">
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                            </div>
                            <span className="text-white/80">4,252 reviews on</span>
                            <span className="flex items-center gap-1 text-[#00b67a] font-medium">
                                <iconify-icon icon="material-symbols:star"></iconify-icon>
                                Trustpilot
                            </span>
                        </div>

                        <h1
                            className="text-4xl md:text-[40px] lg:text-[52px] font-medium leading-[1.1] tracking-tight text-white max-w-xl mb-6">
                            Trade your edge with Vantir
                        </h1>

                        <div className="flex flex-col gap-1.5 mb-10">
                            <p className="text-[15px] md:text-[16px] text-white/90 font-normal max-w-lg">
                                Start Your Funded Journey – From Challenge to $3M Simulated Capital
                            </p>
                            <p className="text-[15px] md:text-[16px] text-white/70 font-normal">
                                Fast payouts: Within 24 hours
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <a href="#compare"
                                className="group flex items-center justify-between gap-5 px-1.5 py-1.5 pl-6 border border-white/60 rounded-full hover:border-white transition-all bg-transparent w-full sm:w-auto">
                                <span className="text-[15px] font-medium text-white">Get Funded</span>
                                <div
                                    className="w-[34px] h-[34px] bg-white rounded-xl flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                                    <iconify-icon icon="ph:arrow-right" className="text-lg"></iconify-icon>
                                </div>
                            </a>

                            <a href="#"
                                className="px-7 py-3 text-[15px] font-medium border border-white/10 rounded-full hover:bg-white/5 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-white">
                                <iconify-icon icon="mdi:discord" className="text-[18px]"></iconify-icon>
                                Join Our Discord
                            </a>
                        </div>
                    </div>

                    {/* Right Content (Video/Image Card) */}
                    <div
                        className="relative w-full sm:w-full lg:w-[98%] xl:w-[96%] mx-auto lg:ml-auto lg:mr-0 aspect-[4/3] md:aspect-[16/10] rounded-[32px] overflow-hidden group border border-white/10 shadow-2xl reveal reveal-delay-1">
                        <iframe width="100%" height="100%"
                            src="https://www.youtube.com/embed/tvERE-Beu2U?si=wDNQCkudPr2-KiZy"
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                            className="absolute inset-0 w-full h-full z-20"></iframe>
                    </div>
                </div>

                {/* Bottom Feature Pills */}
                <div className="w-full mt-16 lg:mt-auto pt-8 border-t border-white/5 relative z-20 reveal reveal-delay-2">
                    <div className="w-full overflow-x-auto hide-scrollbar pb-4">
                        <div className="flex gap-4 w-max items-center">

                            <button
                                className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between gap-4 text-[14px] font-medium text-white/80 hover:text-white hover:border-[#e06810]/50 hover:bg-[#e06810]/10 transition-all group">
                                <span>Apprentice Track</span>
                                <iconify-icon icon="lucide:arrow-right"
                                    className="text-white/60 text-[14px] group-hover:text-[#e06810] transition-colors"></iconify-icon>
                            </button>

                            <button
                                className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between gap-4 text-[14px] font-medium text-white/80 hover:text-white hover:border-[#e06810]/50 hover:bg-[#e06810]/10 transition-all group">
                                <span>Junior Analyst</span>
                                <iconify-icon icon="lucide:arrow-right"
                                    className="text-white/60 text-[14px] group-hover:text-[#e06810] transition-colors"></iconify-icon>
                            </button>

                            <button
                                className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between gap-4 text-[14px] font-medium text-white/80 hover:text-white hover:border-[#e06810]/50 hover:bg-[#e06810]/10 transition-all group">
                                <span>Senior Analyst</span>
                                <iconify-icon icon="lucide:arrow-right"
                                    className="text-white/60 text-[14px] group-hover:text-[#e06810] transition-colors"></iconify-icon>
                            </button>

                            <button
                                className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between gap-4 text-[14px] font-medium text-white/80 hover:text-white hover:border-[#e06810]/50 hover:bg-[#e06810]/10 transition-all group">
                                <span>Lead Analyst</span>
                                <iconify-icon icon="lucide:arrow-right"
                                    className="text-white/60 text-[14px] group-hover:text-[#e06810] transition-colors"></iconify-icon>
                            </button>

                            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                            <span
                                className="flex items-center gap-2 text-[14px] font-medium text-[#e06810] px-4 py-2">
                                <iconify-icon icon="lucide:plus" className="text-lg"></iconify-icon>
                                Faith-Grounded Culture
                            </span>

                        </div>
                    </div>
                </div>

            </div>
        </main>

        {/* Our Story & Values (Sticky Scroll Section) */}
        <section id="why" className="relative border-t border-white/5 bg-[#0a0a0a] w-full h-[200vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px)' }}>
                </div>
                <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-10 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left Side: Stacked Cards */}
                        <div className="relative w-full max-w-[600px] aspect-square lg:aspect-[1.1/1] mx-auto reveal-left">
                            {/* Card 2 (Starts Behind) */}
                            <div id="card-2" className="absolute inset-0 rounded-[32px] border border-white/10 bg-[#060606] overflow-hidden shadow-2xl flex flex-col justify-between p-8 lg:p-12 z-0 transform -translate-x-6 lg:-translate-x-12 translate-y-4 lg:translate-y-6 scale-[0.9] lg:scale-[0.95] opacity-50 will-change-transform">
                                {/* Background Image for Card 2 */}
                                <img src="https://cdn.prod.website-files.com/68821f384ee2b99395fb3a95/688ca8ac72861a7bae1e2d6c_Rectangle%20(1).avif" alt="Card Background" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 pointer-events-none object-center" style={{ transform: 'scaleX(-1)' }} />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/90 via-transparent to-[#060606]/90 pointer-events-none"></div>
                                {/* Content for Card 2 */}
                                <div className="relative z-20">
                                    <div className="flex justify-between items-center text-white/50 text-xs font-medium tracking-wide pb-5 border-b border-white/10">
                                        <span>Community.</span>
                                        <span>Focus.</span>
                                        <span>Growth.</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white mt-10 leading-[1.15]">
                                        Process over<br/>emotion. Always.
                                    </h3>
                                </div>
                                <div className="relative z-20 pb-2">
                                    <p className="text-white/50 text-[13px] leading-[1.6] max-w-[90%] md:max-w-[85%]">
                                        Traders and creators lifting each other up. No gatekeeping, no ego. A repeatable process beats repeatable emotion.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Card 1 (Front Card) */}
                            <div id="card-1" className="absolute inset-0 rounded-[32px] border border-white/10 bg-[#060606] overflow-hidden shadow-2xl flex flex-col justify-between p-8 lg:p-12 z-10 transform will-change-transform">
                                <img src="https://cdn.prod.website-files.com/68821f384ee2b99395fb3a95/688ca8ac72861a7bae1e2d6c_Rectangle%20(1).avif" alt="Card Background" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 pointer-events-none object-center" />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/90 via-transparent to-[#060606]/90 pointer-events-none"></div>

                                <div className="relative z-20">
                                    <div className="flex justify-between items-center text-white/50 text-xs font-medium tracking-wide pb-5 border-b border-white/10">
                                        <span>Capital.</span>
                                        <span>Discipline.</span>
                                        <span>Results.</span>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white mt-10 leading-[1.15]">
                                        Analysis over<br/>chance. Always.
                                    </h3>
                                </div>

                                <div className="relative z-20 pb-2">
                                    <p className="text-white/50 text-[13px] leading-[1.6] max-w-[90%] md:max-w-[85%]">
                                        We provide traders with a fair, scalable environment to grow and succeed. Our model is built for those ready to perform at the highest level.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Text & Toggle */}
                        <div className="relative flex flex-col justify-center lg:pl-16 reveal-right">
                            <h2 className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase mb-8">WHY TPLS</h2>
                            <p className="text-2xl md:text-[28px] leading-[1.4] text-white/90 font-medium tracking-tight mb-12 max-w-xl">
                                At TPLS, we're redefining what it means to be a proprietary trading firm by empowering a new generation of traders with unmatched speed, fairness, and scalability.
                            </p>
                            <div className="flex items-center">
                                <div className="w-16 h-8 rounded-full border border-white/10 bg-white/5 flex items-center px-1.5 gap-2 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors">
                                    <div className="h-5 w-8 rounded-full bg-gradient-to-r from-[#e06810] to-[#e06810]/60 shadow-[0_0_10px_rgba(224,104,16,0.5)]"></div>
                                    <div className="h-2 w-2 rounded-full bg-white/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Discord Hub */}
        <section id="community" className="py-20 lg:py-0 min-h-screen flex flex-col justify-center relative border-t border-white/5 bg-[#060606] overflow-hidden w-full">
            {/* Discord accent gradient */}
            <div
                className="absolute w-[600px] h-[600px] bg-[#5865F2]/10 rounded-full blur-[100px] top-1/2 right-0 -translate-y-1/2 pointer-events-none">
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10">
                <div
                    className="bg-[#111] border border-white/10 rounded-[40px] p-10 lg:p-20 overflow-hidden relative reveal">
                    <div
                        className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    </div>
                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] text-sm font-medium mb-6">
                                <iconify-icon icon="ic:baseline-discord" className="text-lg"></iconify-icon>
                                The TPAM Discord Hub
                            </div>
                            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">No noise, no
                                hype.<br />Just people committed to growth.</h3>
                            <p className="text-white/60 text-lg mb-10">
                                Our Discord is the heartbeat of the TPAM community — where traders of all levels come
                                together to learn, share setups, ask questions, and hold each other accountable.
                            </p>
                            <a href="#"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-colors shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                                <iconify-icon icon="ic:baseline-discord" className="text-xl"></iconify-icon>
                                Join The Server
                            </a>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="card-glass p-6 rounded-2xl flex gap-4 items-start reveal reveal-delay-1 border-white/5 hover:border-[#5865F2]/50 transition-colors">
                                <div
                                    className="w-12 h-12 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0">
                                    <iconify-icon icon="lucide:book-open-check"
                                        className="text-[#5865F2] text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium mb-1">Free Access, Real Education</h5>
                                    <p className="text-sm text-white/50">The free tier isn't a teaser. You'll see real
                                        setups, honest analysis, and substantive conversations from day one.</p>
                                </div>
                            </div>
                            <div
                                className="card-glass p-6 rounded-2xl flex gap-4 items-start reveal reveal-delay-2 border-white/5 hover:border-[#5865F2]/50 transition-colors">
                                <div
                                    className="w-12 h-12 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0">
                                    <iconify-icon icon="lucide:ban" className="text-[#5865F2] text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium mb-1">No Signal Selling</h5>
                                    <p className="text-sm text-white/50">We teach you to read the market, not to depend on
                                        someone else's calls. Independent, disciplined traders.</p>
                                </div>
                            </div>
                            <div
                                className="card-glass p-6 rounded-2xl flex gap-4 items-start reveal reveal-delay-3 border-white/5 hover:border-[#5865F2]/50 transition-colors">
                                <div
                                    className="w-12 h-12 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0">
                                    <iconify-icon icon="lucide:cross" className="text-[#5865F2] text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium mb-1">Faith-Grounded Culture</h5>
                                    <p className="text-sm text-white/50">Markets are a crucible for character. We talk about
                                        the mental side of trading openly, through a lens of growth and grace.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Analysts Section */}
        <section id="analysts" className="py-32 relative bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                {/* Header (Centered like the reference) */}
                <div className="flex flex-col items-center text-center mb-20 reveal">
                    <h2 className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase mb-6">The Team Hierarchy</h2>
                    <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-10 leading-[1.2]">
                        The TPL: Trading<br/>Analyst Team
                    </h3>
                    <a href="#compare"
                        className="group flex items-center justify-between gap-4 px-1.5 py-1.5 pl-6 border border-white/20 rounded-full hover:border-white transition-all bg-transparent">
                        <span className="text-[14px] font-medium text-white">Join The Team</span>
                        <div
                            className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                            <iconify-icon icon="lucide:arrow-right" className="text-[16px]"></iconify-icon>
                        </div>
                    </a>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Apprentice */}
                    <div className="relative bg-[#060606] border border-white/10 rounded-[24px] p-8 lg:p-10 flex flex-col items-start min-h-[260px] overflow-hidden group reveal">
                        <iconify-icon icon="lucide:book-open" className="text-[28px] text-white/80 mb-8 font-light"></iconify-icon>
                        <h4 className="text-xl font-medium text-white mb-4">Apprentice</h4>
                        <p className="text-white/50 text-[13px] leading-[1.7] max-w-sm">
                            The starting point. Learn market structure, terminology, and foundational habits. Shadow Senior analysts and focus on learning — not earning.
                        </p>
                    </div>

                    {/* Junior */}
                    <div className="relative bg-[#060606] border border-white/10 rounded-[24px] p-8 lg:p-10 flex flex-col items-start min-h-[260px] overflow-hidden group reveal reveal-delay-1">
                        {/* Subtle orange bottom gradient glow */}
                        <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-[#e06810]/20 via-[#e06810]/5 to-transparent rounded-br-[24px] pointer-events-none blur-xl"></div>
                        <iconify-icon icon="lucide:compass" className="text-[28px] text-[#e06810] mb-8 font-light"></iconify-icon>
                        <h4 className="text-xl font-medium text-white mb-4 relative z-10">Junior Analyst</h4>
                        <p className="text-white/50 text-[13px] leading-[1.7] max-w-sm relative z-10">
                            Demonstrate basic competency and form independent market reads. Contribute to community discussions and receive structured feedback.
                        </p>
                    </div>

                    {/* Senior */}
                    <div className="relative bg-[#060606] border border-white/10 rounded-[24px] p-8 lg:p-10 flex flex-col items-start min-h-[260px] overflow-hidden group reveal">
                        <iconify-icon icon="lucide:target" className="text-[28px] text-white/80 mb-8 font-light"></iconify-icon>
                        <h4 className="text-xl font-medium text-white mb-4">Senior Analyst</h4>
                        <p className="text-white/50 text-[13px] leading-[1.7] max-w-sm">
                            Proven consistency over time. Lead community sessions, mentor others, and present documented setups with full rationale.
                        </p>
                    </div>

                    {/* Lead */}
                    <div className="relative bg-[#060606] border border-white/10 rounded-[24px] p-8 lg:p-10 flex flex-col items-start min-h-[260px] overflow-hidden group reveal reveal-delay-1">
                        <iconify-icon icon="lucide:crown" className="text-[28px] text-white/80 mb-8 font-light"></iconify-icon>
                        <h4 className="text-xl font-medium text-white mb-4">Lead Analyst</h4>
                        <p className="text-white/50 text-[13px] leading-[1.7] max-w-[90%] lg:max-w-sm">
                            Set the standard for the community. Drive curriculum, represent TPL publicly, and maintain the education-first culture.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="compare" className="py-32 relative bg-[#060606]">
            <div
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none">
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 reveal">
                    <h2 className="text-5xl font-medium tracking-tight text-white mb-6">Membership Comparison</h2>
                    <p className="text-white/60 text-lg">
                        Pick your path — from free access to lifetime mentorship. The progression is a growth framework,
                        not a billing hierarchy designed to upsell you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-center">

                    {/* Free Tier */}
                    <div className="card-glass card-glow rounded-[32px] p-10 border border-[#262626] reveal">
                        <h3 className="text-2xl font-medium text-white mb-2">Community</h3>
                        <p className="text-white/50 text-sm mb-8 h-10">Start learning immediately — no commitment needed.
                        </p>
                        <div className="mb-8">
                            <span className="text-5xl font-medium text-white">Free</span>
                        </div>
                        <a href="#"
                            className="group flex items-center justify-between pl-8 pr-1 py-1 w-full rounded-full border border-[#262626] hover:border-white transition-all mb-10 grad-btn text-white">
                            <span className="font-medium text-[15px]">Join Free</span>
                            <div
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                                <iconify-icon icon="lucide:arrow-right" className="text-lg"></iconify-icon>
                            </div>
                        </a>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Discord community access
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Basic educational content
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Free trade journal tools
                            </div>
                            <div className="flex items-center gap-3 text-white/30">
                                <iconify-icon icon="lucide:minus-circle" className="text-lg"></iconify-icon>
                                No analyst sessions
                            </div>
                            <div className="flex items-center gap-3 text-white/30">
                                <iconify-icon icon="lucide:minus-circle" className="text-lg"></iconify-icon>
                                No mentorship
                            </div>
                        </div>
                    </div>

                    {/* Pro Tier */}
                    <div
                        className="card-glass card-glow-orange rounded-[32px] p-10 border-[#e06810]/50 pricing-glow relative transform lg:-translate-y-4 bg-[#0a0a0a] overflow-hidden reveal reveal-delay-1">
                        <div
                            className="absolute top-6 right-8 bg-[#e06810]/20 text-[#e06810] text-xs font-bold px-3 py-1 rounded-full border border-[#e06810]/30 uppercase tracking-wider">
                            Most Popular
                        </div>

                        <h3 className="text-2xl font-medium text-white mb-2">Pro Mentorship</h3>
                        <p className="text-white/50 text-sm mb-8 h-10">Structured mentorship — from beginner to consistent
                            trader.</p>
                        <div className="mb-2 flex items-baseline gap-1">
                            <span className="text-5xl font-medium text-white">$25</span>
                            <span className="text-white/50">/mo</span>
                        </div>
                        <p className="text-[#e06810]/80 text-sm mb-6">+ $10 one-time fee</p>

                        <a href="#"
                            className="group flex items-center justify-between pl-8 pr-1 py-1 w-full rounded-full border border-[#e06810]/50 hover:border-[#e06810] transition-all mb-10 bg-[#e06810]/10 text-white">
                            <span className="font-medium text-[15px]">Get Started</span>
                            <div
                                className="w-10 h-10 rounded-full bg-[#e06810] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                                <iconify-icon icon="lucide:arrow-right" className="text-lg"></iconify-icon>
                            </div>
                        </a>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Everything in Community
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Weekly analyst sessions
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Monthly live trade reviews
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Full curriculum + trade library
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Analyst track progression
                            </div>
                        </div>
                    </div>

                    {/* Lifetime Tier */}
                    <div
                        className="card-glass card-glow rounded-[32px] p-10 border border-[#262626] reveal reveal-delay-2">
                        <h3 className="text-2xl font-medium text-white mb-2">Lifetime+</h3>
                        <p className="text-white/50 text-sm mb-8 h-10">Everything — forever. Founding member status.</p>
                        <div className="mb-8 flex items-baseline gap-1">
                            <span className="text-5xl font-medium text-white">$1,000</span>
                            <span className="text-white/50">one-time</span>
                        </div>
                        <a href="#"
                            className="group flex items-center justify-between pl-8 pr-1 py-1 w-full rounded-full border border-[#262626] hover:border-white transition-all mb-10 grad-btn text-white">
                            <span className="font-medium text-[15px]">Join Lifetime+</span>
                            <div
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                                <iconify-icon icon="lucide:arrow-right" className="text-lg"></iconify-icon>
                            </div>
                        </a>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                All Pro benefits, permanent
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Unlimited 1-on-1 mentorship
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Daily trade reviews (priority)
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                All future TPL products — free
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <iconify-icon icon="lucide:check-circle-2"
                                    className="text-[#e06810] text-lg"></iconify-icon>
                                Annual apparel drop
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* Partnerships */}
        <section id="partner" className="py-32 relative bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 reveal">
                    <h2 className="text-[#e06810] text-sm font-bold tracking-[0.2em] uppercase mb-4">Grow With Us</h2>
                    <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Referral & Partnership
                        Program</h3>
                    <p className="text-white/60 text-lg">
                        We believe the best growth comes from people who genuinely believe in what we build. If TPL has
                        made a difference in your trading, we'd love to partner with you.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="card-glass rounded-3xl p-8 reveal">
                        <iconify-icon icon="lucide:link" className="text-3xl text-[#e06810] mb-6"></iconify-icon>
                        <h4 className="text-2xl font-medium text-white mb-3">Affiliate Partner</h4>
                        <p className="text-white/60 text-sm">Earn commission on every referral who becomes a paying TPL:
                            Trading member. Share your unique link, earn as others grow.</p>
                    </div>
                    <div
                        className="card-glass rounded-3xl p-8 reveal reveal-delay-1 border-[#e06810]/20 relative overflow-hidden group">
                        <div
                            className="absolute inset-0 bg-[#e06810]/5 group-hover:bg-[#e06810]/10 transition-colors">
                        </div>
                        <iconify-icon icon="lucide:megaphone"
                            className="text-3xl text-[#e06810] mb-6 relative z-10"></iconify-icon>
                        <h4 className="text-2xl font-medium text-white mb-3 relative z-10">Brand Ambassador</h4>
                        <p className="text-white/60 text-sm relative z-10">Active community members who represent TPL
                            publicly — on social, in trading circles, wherever God leads you.</p>
                    </div>
                    <div className="card-glass rounded-3xl p-8 reveal reveal-delay-2">
                        <iconify-icon icon="lucide:handshake" className="text-3xl text-[#e06810] mb-6"></iconify-icon>
                        <h4 className="text-2xl font-medium text-white mb-3">Strategic Partner</h4>
                        <p className="text-white/60 text-sm">For those with a platform, audience, or community of their own.
                            Let's build something together for His glory.</p>
                    </div>
                </div>

                <div className="flex justify-center reveal">
                    <a href="mailto:timepiecels26@gmail.com"
                        className="px-8 py-4 rounded-full border border-[#e06810] text-[#e06810] font-medium hover:bg-[#e06810] hover:text-black transition-all">
                        Inquire About Partnership
                    </a>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 border-t border-white/5 bg-black">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 reveal">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <a href="#" className="flex items-center gap-2 mb-6 group w-fit">
                            <div
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#e06810]/20 transition-colors border border-white/10 group-hover:border-[#e06810]/50">
                                <iconify-icon icon="lucide:clock-4"
                                    className="text-2xl text-white group-hover:text-[#e06810] transition-colors"></iconify-icon>
                            </div>
                            <span className="text-2xl font-medium tracking-tight text-white">Time Piece Lifestyle</span>
                        </a>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                            "Whatever you do, work at it with all your heart, as working for the Lord, not for human
                            masters."
                        </p>
                        <div className="flex gap-4">
                            <a href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#5865F2] hover:text-white transition-all border border-white/10">
                                <iconify-icon icon="ic:baseline-discord" className="text-xl"></iconify-icon>
                            </a>
                            <a href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10">
                                <iconify-icon icon="ri:twitter-x-fill" className="text-lg"></iconify-icon>
                            </a>
                            <a href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#e06810] hover:text-black transition-all border border-white/10">
                                <iconify-icon icon="ri:instagram-fill" className="text-xl"></iconify-icon>
                            </a>
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h4 className="text-white font-medium mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Memberships</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Markets</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Shop Apparel</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Discord Community</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-medium mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">About Us</a></li>
                            <li><Link to="/faq" className="hover:text-[#e06810] transition-colors">FAQ</Link></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Partnership Program</a>
                            </li>
                            <li><Link to="/contact" className="hover:text-[#e06810] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-white font-medium mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div
                    className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 reveal reveal-delay-1">
                    <p className="text-white/40 text-xs leading-relaxed max-w-4xl text-center lg:text-left">
                        <strong className="text-white/60">General Risk Disclaimer:</strong> Market data and trading
                        education provided by Time Piece Lifestyle is for educational purposes only and does not
                        constitute financial advice. All trading activity involves risk. Past performance does not
                        guarantee future results. Participants are fully responsible for their use of TPL's information
                        and services.
                    </p>
                    <div className="flex items-center gap-2 text-white/40 text-sm shrink-0">
                        <span>© 2026 Time Piece Lifestyle.<br /><span className="text-[#e06810]/80">Every Tick, His
                                Glory.</span></span>
                    </div>
                </div>
            </div>
        </footer>

    </div>
        </div>
    );
}
