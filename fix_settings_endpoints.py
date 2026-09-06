import os
import re
file_path = r"d:\Developer\Mangment birds\frontend\src\app\dashboard\settings\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'/api/Birds/species'", "'/api/Species'")
content = content.replace("/api/Birds/species//breeds", "/api/Breeds?speciesId=")
content = content.replace("/api/Birds/species/", "/api/Species/")
content = content.replace("/api/Birds/breeds/", "/api/Breeds/")
content = content.replace("/api/Birds/breeds/", "/api/Breeds/")
content = content.replace("'/api/Birds/breeds'", "'/api/Breeds'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
