import os
import re

src_dir = '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src'

# Regex to find Rp followed by numbers and dots, e.g., Rp 399.000
def rp_to_usd(match):
    val_str = match.group(1).replace('.', '')
    val = int(val_str)
    
    # 399000 -> $39.99 (or 39.90, let's just do val/10000 - 0.01 if ends in 99)
    # Actually, simpler: if 399000 -> 39.90. We can just do val / 10000.
    # Let's do: 399000 -> $39.99 if it ends in 9000, etc.
    # Just format as ${val/10000:.2f}
    usd_val = val / 10000
    if (val % 10000) == 9000:
        usd_val = (val // 10000) + 0.99
        
    return f"${usd_val:.2f}"

def format_range(match):
    # For strings like 'Under Rp 200.000'
    return match.group(0).replace('Rp 200.000', '$20.00').replace('Rp 400.000', '$40.00').replace('Rp 600.000', '$60.00')

rp_pattern = re.compile(r'Rp\s+(\d+(?:\.\d+)*)')

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Special case for the filter strings
            content = content.replace('Under Rp 200.000', 'Under $20.00')
            content = content.replace('Rp 200.000 - Rp 400.000', '$20.00 - $40.00')
            content = content.replace('Rp 400.000 - Rp 600.000', '$40.00 - $60.00')
            content = content.replace('Above Rp 600.000', 'Above $60.00')
            
            # Normal replacement
            new_content = rp_pattern.sub(rp_to_usd, content)
            
            # Special case for Checkout.tsx where it parses the Rp
            if 'Checkout.tsx' in filepath:
                new_content = new_content.replace(
                    "if (priceStr.includes('Rp'))", 
                    "if (priceStr.includes('$'))"
                ).replace(
                    "const num = parseInt(priceStr.replace(/[^0-9]/g, ''));",
                    "const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));"
                ).replace(
                    "return `Rp ${total.toLocaleString('id-ID')}`;",
                    "return `$${total.toFixed(2)}`;"
                )

                # Fix logo click navigate
                new_content = new_content.replace(
                    "onClick={(e) => { e.preventDefault(); navigate('/'); }} className=\"flex items-center gap-2\"",
                    "onClick={(e) => { e.preventDefault(); navigate('/apparel'); }} className=\"flex items-center gap-2\""
                )

            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

