import React, { useEffect } from 'react';
import './Trading.css';
import { Link } from 'react-router-dom';

export default function About() {
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
                    <img src="/TPL logo.png" alt="TPLS Logo" className="w-7 h-7 object-contain" />
                    <span className="text-xl font-medium tracking-tight mt-0.5 text-white">TPLS</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center bg-[#151515] rounded-full px-1.5 py-1 border border-white/10 shadow-2xl">
                    <Link to="/trading" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Home</Link>
                    <Link to="/trading#compare" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">Memberships</Link>
                    <Link to="/about" className="px-5 py-2 text-[13px] font-medium text-white hover:bg-white/10 rounded-full transition-colors">About Us</Link>
                    <Link to="/faq" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">FAQ</Link>
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

        {/* Main Content Container */}
        <main className="flex-1 w-full pt-40 relative overflow-hidden">
            {/* Hero Section */}
            <header className="pt-20 pb-20 relative border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#e06810]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-[800px] mx-auto px-6 text-center relative z-10 reveal">
                    <h2 className="text-[#e06810] text-sm font-bold tracking-[0.2em] uppercase mb-4">Our Story</h2>
                    <h1 className="text-5xl md:text-[72px] font-medium tracking-tight text-white mb-8 leading-[1.1]">Every Tick,<br/>His Glory</h1>
                    <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
                        Time Piece Lifestyle was founded on the conviction that every talent is a trust — and every trust demands good stewardship. This is the story of how that belief became a brand.
                    </p>
                </div>
            </header>

            {/* Where It Started */}
            <section className="py-24 lg:py-32 max-w-[1200px] mx-auto px-6 reveal">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium text-white mb-8">Where It Started</h2>
                        <div className="space-y-6 text-white/50 text-base leading-[1.8]">
                            <p>Time Piece Lifestyle began not with a product launch — but with a conversation about purpose. The founding partners believed that the lifestyle space was crowded with noise: brands chasing trends, chasing metrics, chasing the next viral moment. And underneath all of that noise, there was silence about what actually matters.</p>
                            <p>The conviction grew: what if a brand operated differently? What if every decision — from the fabric chosen for a shirt to the way a trade is executed — started with the same question: <em>Who is this for, and does it honor them?</em></p>
                            <p>That question became the foundation. "Every Tick, His Glory" isn't a tagline — it's an operating principle. It means the work is never done for its own sake. Every stitch, every strategy, every brand decision points back to the calling behind it.</p>
                        </div>
                        <blockquote className="mt-10 border-l-[3px] border-[#e06810] pl-8 py-2">
                            <p className="text-white/80 font-medium italic text-lg leading-relaxed">"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."</p>
                        </blockquote>
                    </div>
                    <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] lg:aspect-square border border-white/10 group">
                        {/* Background abstract visual */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#060606] via-[#111] to-[#1a1a1a]"></div>
                        <img src="https://cdn.prod.website-files.com/68821f384ee2b99395fb3a95/688ca8ac72861a7bae1e2d6c_Rectangle%20(1).avif" className="w-full h-full object-cover opacity-20 mix-blend-screen group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Abstract Background" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* The People Behind the Work */}
            <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20 reveal">
                        <h2 className="text-[#e06810] text-sm font-bold tracking-[0.2em] uppercase mb-4">Meet the Founders</h2>
                        <h3 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">The People Behind the Work</h3>
                        <p className="text-white/50 text-lg">Two friends who decided that good stewardship was worth more than convenience.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 reveal reveal-delay-1">
                        {/* Andrew */}
                        <div className="bg-[#060606] border border-white/10 rounded-[32px] p-10 lg:p-12 relative group hover:border-white/20 transition-all hover:-translate-y-1 shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                                <iconify-icon icon="lucide:user" className="text-2xl text-white/80 font-light"></iconify-icon>
                            </div>
                            <div className="mb-8">
                                <h4 className="text-3xl font-medium text-white mb-2">Andrew Lovelady</h4>
                                <p className="text-[#e06810] text-[15px] font-medium">Co-Founder & Vision Architect</p>
                            </div>
                            <p className="text-white/50 text-[15px] leading-[1.8] mb-10">
                                His journey to founding TPL began with a deep conviction that excellence and faith aren't opposites — they're partners. When the idea for TPL first took shape, the question wasn't "can we build this?" but "should we?" That second question led to everything else. His role spans brand strategy, product direction, and the long-term vision across TPL: Apparel, TPL: Markets, and TPL: Trading.
                            </p>
                            <a href="mailto:timepiecels26@gmail.com" className="inline-flex items-center gap-3 text-[15px] font-medium text-white/70 hover:text-white transition-colors border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/5">
                                <iconify-icon icon="lucide:mail"></iconify-icon> Contact Andrew
                            </a>
                        </div>

                        {/* Johnny */}
                        <div className="bg-[#060606] border border-white/10 rounded-[32px] p-10 lg:p-12 relative group hover:border-white/20 transition-all hover:-translate-y-1 shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                                <iconify-icon icon="lucide:user" className="text-2xl text-white/80 font-light"></iconify-icon>
                            </div>
                            <div className="mb-8">
                                <h4 className="text-3xl font-medium text-white mb-2">Johnny Ludwig</h4>
                                <p className="text-[#e06810] text-[15px] font-medium">Co-Founder & Operations Lead</p>
                            </div>
                            <p className="text-white/50 text-[15px] leading-[1.8]">
                                His partnership with Andrew grew from a shared conviction that the marketplace needs more brands operating with intention — not just chasing growth for its own sake. Johnny brings operational depth and a long-term perspective to TPL, ensuring that every brand decision reflects the mission rather than deviating from it. He's involved across the full portfolio: TPL: Apparel, TPL: Markets, and TPL: Trading.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-24 lg:py-32 max-w-[1200px] mx-auto px-6 reveal">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-8 tracking-tight">Our Mission</h2>
                    <p className="text-white/50 text-[17px] leading-[1.8] mb-6">
                        This isn't a brand statement in the abstract — it's the question we ask before every decision. Every product we launch, every trade we analyze, every brand we build: it starts here. Not "what will perform?" but "what honors the calling?"
                    </p>
                    <p className="text-white/50 text-[17px] leading-[1.8]">
                        We believe that excellence and faith aren't in tension — they reinforce each other. Quality is the minimum standard when every stitch, every strategy, every touchpoint is an offering. We build things that last. We manage every resource as a trust.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Values */}
                    <div className="bg-[#060606] border border-white/10 rounded-[24px] p-8 hover:border-white/20 transition-colors group">
                        <iconify-icon icon="lucide:target" className="text-3xl text-[#e06810] mb-8 font-light"></iconify-icon>
                        <h4 className="text-lg font-medium text-white mb-3 group-hover:text-[#e06810] transition-colors">Purpose Over Convenience</h4>
                        <p className="text-white/50 text-sm leading-[1.7]">Every brand, every product, every trade — made with intention. No shortcuts. No impulse decisions.</p>
                    </div>
                    
                    <div className="bg-[#060606] border border-white/10 rounded-[24px] p-8 hover:border-white/20 transition-colors group">
                        <iconify-icon icon="lucide:hourglass" className="text-3xl text-[#e06810] mb-8 font-light"></iconify-icon>
                        <h4 className="text-lg font-medium text-white mb-3 group-hover:text-[#e06810] transition-colors">Stewardship of Time</h4>
                        <p className="text-white/50 text-sm leading-[1.7]">Time is the original non-renewable resource. We treat every moment — and every product — as a trust, not a given.</p>
                    </div>

                    <div className="bg-[#060606] border border-white/10 rounded-[24px] p-8 hover:border-white/20 transition-colors group">
                        <iconify-icon icon="lucide:book" className="text-3xl text-[#e06810] mb-8 font-light"></iconify-icon>
                        <h4 className="text-lg font-medium text-white mb-3 group-hover:text-[#e06810] transition-colors">Faith as Foundation</h4>
                        <p className="text-white/50 text-sm leading-[1.7]">Colossians 3:23 isn't decoration — it's an operating principle. Whatever we do, we work at it for His glory.</p>
                    </div>

                    <div className="bg-[#060606] border border-white/10 rounded-[24px] p-8 hover:border-white/20 transition-colors group">
                        <iconify-icon icon="lucide:gem" className="text-3xl text-[#e06810] mb-8 font-light"></iconify-icon>
                        <h4 className="text-lg font-medium text-white mb-3 group-hover:text-[#e06810] transition-colors">Quality Without Compromise</h4>
                        <p className="text-white/50 text-sm leading-[1.7]">Excellence is not ego — it's the minimum standard when every stitch is an offering. The details matter.</p>
                    </div>
                </div>

                <div className="mt-32 text-center reveal reveal-delay-1">
                    <p className="text-white/40 italic font-medium mb-10 text-lg">"Do you see a man skilled in his work? He will serve before kings."</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/#portfolio" className="px-8 py-4 rounded-full bg-white text-black font-medium text-[15px] hover:scale-105 transition-transform">Explore the Ecosystem</Link>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#060606] pt-20 pb-10 border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 reveal">
                    <div>
                        <Link to="/trading" className="flex items-center gap-2 mb-6">
                            <img src="/TPL logo.png" alt="TPLS Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-medium tracking-tight mt-0.5 text-white">TPLS</span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            Excellence and faith aren't in tension.<br/>Every tick of the clock, every trade executed, every stitch in our apparel points back to Him.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-6">TPL Ecosystem</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><Link to="/trading" className="hover:text-[#e06810] transition-colors">TPL: Trading</Link></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Markets</a></li>
                            <li><a href="#" className="hover:text-[#e06810] transition-colors">TPL: Apparel</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><Link to="/about" className="hover:text-[#e06810] transition-colors">About Us</Link></li>
                            <li><Link to="/faq" className="hover:text-[#e06810] transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-[#e06810] transition-colors">Contact</Link></li>
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
