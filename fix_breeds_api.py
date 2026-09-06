import os
file_path = r"d:\Developer\Mangment birds\frontend\src\app\dashboard\settings\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("/api/Species//breeds", "/api/Breeds?speciesId=")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
