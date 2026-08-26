import os
import re

directory = 'frontend/src'
find_str = 'http://localhost:5089'
replace_str = 'https://mangment-birds-api.onrender.com'

count = 0
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if find_str in content:
                new_content = content.replace(find_str, replace_str)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {filepath}")

print(f"Updated {count} files.")
