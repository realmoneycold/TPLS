import os
import re

files_to_fix = [
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/Trading.tsx',
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/About.tsx',
    '/home/ahror/Downloads/bloom---ai-plant-&-floral-design/src/FAQ.tsx'
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix background-image style
    content = content.replace(
        'style="background-image: repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px);"',
        'style={{ backgroundImage: \'repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px)\' }}'
    )
    
    # Fix transform style
    content = content.replace(
        'style="transform: scaleX(-1);"',
        'style={{ transform: \'scaleX(-1)\' }}'
    )
    
    # Fix referrerpolicy
    content = content.replace('referrerpolicy', 'referrerPolicy')
    
    # Check if there are any other style=""
    matches = re.findall(r'style="[^"]*"', content)
    if matches:
        print(f"Warning: Found other style strings in {file_path}: {matches}")
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing styles")
