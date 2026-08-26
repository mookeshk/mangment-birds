import os

files_to_fix = [
    r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\BirdModal.tsx",
    r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\new\page.tsx",
    r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\[id]\page.tsx"
]

for file_path in files_to_fix:
    if not os.path.exists(file_path): continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("fetch(https://mangment-birds-api.onrender.com/api/birds", "fetchWithAuth(/api/birds")
    content = content.replace("fetch('https://mangment-birds-api.onrender.com/api/birds'", "fetchWithAuth('/api/birds'")
    content = content.replace("credentials: 'include',", "")
    content = content.replace("credentials: 'include'", "")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
