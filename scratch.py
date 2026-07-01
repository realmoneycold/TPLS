import re

def convert_html_to_jsx(in_path, out_path, comp_name):
    with open(in_path, 'r', encoding='utf-8') as f:
        html = f.read()

    body_match = re.search(r'<body[^>]*>(.*?)<script>', html, flags=re.DOTALL)
    if not body_match:
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html, flags=re.DOTALL)
        
    if body_match:
        body = body_match.group(1).strip()
        
        body = body.replace('class=', 'className=')
        body = body.replace('<!--', '{/*').replace('-->', '*/}')
        body = body.replace('for=', 'htmlFor=')
        body = body.replace('allowfullscreen', 'allowFullScreen')
        body = body.replace('frameborder="0"', 'frameBorder="0"')
        
        body = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1 />', body)
        body = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', body)
        body = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', body)
        body = re.sub(r'<input([^>]+?)(?<!/)>', r'<input\1 />', body)

        body = body.replace('brand-orange', '[#e06810]')
        body = body.replace('brand-black', '[#060606]')
        body = body.replace('brand-dark', '[#0a0a0a]')
        body = body.replace('brand-border', '[#262626]')
        body = body.replace('brand-muted', '[#a3a3a3]')
        
        # First turn internal specific hrefs to "to="
        body = body.replace('href="tpls.html#compare"', 'to="/trading#compare"')
        body = body.replace('href="tpls.html#portfolio"', 'to="/#portfolio"')
        body = body.replace('href="tpls.html"', 'to="/"')
        body = body.replace('href="about.html"', 'to="/about"')
        body = body.replace('href="faq.html"', 'to="/faq"')
        body = body.replace('href="contact.html"', 'to="/contact"')

        # Regex to replace <a ... to="..." ...>...</a> with <Link ... to="..." ...>...</Link>
        # We find <a and its attributes, if it has 'to=', we convert.
        def replacer(m):
            attrs = m.group(1)
            content = m.group(2)
            # Find the "to=" and change <a to <Link, </a> to </Link>
            if 'to="' in attrs:
                return f'<Link {attrs}>{content}</Link>'
            return m.group(0) # unchanged if no 'to='

        body = re.sub(r'<a\s+([^>]+)>(.*?)</a>', replacer, body, flags=re.DOTALL)
        
        jsx = f"""import React, {{ useEffect }} from 'react';
import './Trading.css';
import {{ Link }} from 'react-router-dom';

export default function {comp_name}() {{
    useEffect(() => {{
        const observer = new IntersectionObserver((entries) => {{
            entries.forEach((entry) => {{
                if (entry.isIntersecting) {{
                    entry.target.classList.add('active');
                }}
            }});
        }}, {{
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        }});

        document.querySelectorAll('.reveal, .reveal-down, .reveal-left, .reveal-right').forEach((el) => {{
            observer.observe(el);
        }});

        setTimeout(() => {{
            document.querySelectorAll('.reveal, .reveal-down, .reveal-left, .reveal-right').forEach((el) => {{
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {{
                    el.classList.add('active');
                }}
            }});
        }}, 100);

        const handleScroll = () => {{
            const section = document.getElementById('why');
            if(!section) return;
            const rect = section.getBoundingClientRect();
            
            let progress = 0;
            if (rect.top <= 0) {{
                const totalScrollDistance = section.offsetHeight - window.innerHeight;
                progress = Math.abs(rect.top) / totalScrollDistance;
                progress = Math.min(1, Math.max(0, progress));
            }}

            const card1 = document.getElementById('card-1');
            const card2 = document.getElementById('card-2');

            const isLg = window.innerWidth >= 1024;
            const startXOffset = isLg ? -48 : -24;
            const startYOffset = isLg ? 24 : 16;
            const startScale = isLg ? 0.95 : 0.9;

            if(card1 && card2) {{
                const y1 = progress * -100;
                const opacity1 = 1 - (progress * 2.5);
                card1.style.transform = `translateY(${{y1}}px)`;
                card1.style.opacity = Math.max(0, opacity1).toString();

                const scale2 = startScale + (progress * (1 - startScale));
                const x2 = startXOffset - (progress * startXOffset);
                const y2 = startYOffset - (progress * startYOffset);
                const opacity2 = 0.5 + (progress * 0.5);
                card2.style.transform = `translate(${{x2}}px, ${{y2}}px) scale(${{scale2}})`;
                card2.style.opacity = opacity2.toString();
                card2.style.zIndex = progress > 0.3 ? "30" : "0";
            }}
        }};

        window.addEventListener('scroll', handleScroll);
        
        return () => {{
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        }};
    }}, []);

    return (
        <div className="bg-[#060606] text-white font-sans selection:bg-[#e06810] selection:text-white">
{body}
        </div>
    );
}}
"""
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(jsx)

# Regenerate Trading.tsx
convert_html_to_jsx('/home/ahror/Downloads/bloom---ai-plant-&-floral-design/FinancialJuiceScrapper/tpls-trading.html', '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/Trading.tsx', 'Trading')

# Generate About.tsx
convert_html_to_jsx('/home/ahror/Downloads/bloom---ai-plant-&-floral-design/FinancialJuiceScrapper/tpls-about.html', '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/About.tsx', 'About')

# Generate FAQ.tsx
convert_html_to_jsx('/home/ahror/Downloads/bloom---ai-plant-&-floral-design/FinancialJuiceScrapper/faq.html', '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/FAQ.tsx', 'FAQ')

