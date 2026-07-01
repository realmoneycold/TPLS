import os
import re

files_to_fix = [
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/Trading.tsx',
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/About.tsx',
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/FAQ.tsx',
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/Contact.tsx'
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix <Link to="/"> inside the text
    content = content.replace('<Link to="/">', '<Link to="/trading">')
    content = content.replace('<Link to="/" className="', '<Link to="/trading" className="')
    content = content.replace('to="/"\n                        className="', 'to="/trading"\n                        className="')
    
    # Fix the logo <a href="#"> in Trading.tsx
    content = content.replace(
        '<a href="#" className="flex items-center gap-2 shrink-0">',
        '<Link to="/trading" className="flex items-center gap-2 shrink-0">'
    ).replace(
        '</a>\n\n                {/* Desktop Menu */}',
        '</Link>\n\n                {/* Desktop Menu */}'
    )
    
    # Fix any remaining <a href="#"> for the logo in footers
    content = content.replace(
        '<a href="#" className="flex items-center gap-2 mb-6">',
        '<Link to="/trading" className="flex items-center gap-2 mb-6">'
    ).replace(
        '</a>\n                        <p className="text-white/40',
        '</Link>\n                        <p className="text-white/40'
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing links")
