import React, { useEffect } from 'react';
import './Trading.css';
import { Link } from 'react-router-dom';

export default function Contact() {
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

        return () => {
            observer.disconnect();
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
                            <Link to="/faq" className="px-5 py-2 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">FAQ</Link>
                            <Link to="/contact" className="px-5 py-2 text-[13px] font-medium text-white hover:bg-white/10 rounded-full transition-colors">Contact us</Link>
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

                {/* Contact Header */}
                <header className="pt-48 pb-20 relative border-b border-white/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
                    <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10 reveal">
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">Contact Us</h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
                            Whether you have a question about our trading community, our apparel, or just want to say hello, our team is ready to answer all your questions.
                        </p>
                    </div>
                </header>

                {/* Contact Content */}
                <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-start reveal">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-medium text-white mb-6">Get in Touch</h3>
                                <p className="text-white/50 text-base leading-relaxed mb-8">
                                    Fill out the form and our team will get back to you within 24 hours. We prioritize support for our community members.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#e06810] shrink-0">
                                            <iconify-icon icon="lucide:mail" className="text-xl"></iconify-icon>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Email</h4>
                                            <a href="mailto:timepiecels26@gmail.com" className="text-white/50 hover:text-[#e06810] transition-colors">timepiecels26@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#e06810] shrink-0">
                                            <iconify-icon icon="lucide:message-square" className="text-xl"></iconify-icon>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Discord Support</h4>
                                            <p className="text-white/50">Join our Discord server and open a support ticket for immediate assistance.</p>
                                            <a href="https://discord.gg/7b5asbZAkq" target="_blank" rel="noreferrer" className="text-[#e06810] text-sm mt-2 inline-block hover:underline">Join Discord Server</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 lg:p-10 reveal reveal-delay-1 shadow-2xl">
                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="first-name" className="text-sm font-medium text-white/80">First Name</label>
                                        <input type="text" id="first-name" className="bg-[#060606] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e06810] transition-colors" placeholder="John" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="last-name" className="text-sm font-medium text-white/80">Last Name</label>
                                        <input type="text" id="last-name" className="bg-[#060606] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e06810] transition-colors" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
                                    <input type="email" id="email" className="bg-[#060606] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e06810] transition-colors" placeholder="john@example.com" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-sm font-medium text-white/80">Message</label>
                                    <textarea id="message" rows={5} className="bg-[#060606] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e06810] transition-colors resize-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="submit" className="mt-4 px-8 py-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#000000] border border-[#333] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-white font-medium hover:bg-[#e06810] hover:text-black hover:border-[#e06810] transition-all">
                                    Send Message
                                </button>
                            </form>
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
                                    <li><Link to="/trading" className="hover:text-[#e06810] transition-colors">TPL: Trading</Link></li>
                                    <li><Link to="/market-news" className="hover:text-[#e06810] transition-colors">TPL: Markets</Link></li>
                                    <li><Link to="/apparel" className="hover:text-[#e06810] transition-colors">TPL: Apparel</Link></li>
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
