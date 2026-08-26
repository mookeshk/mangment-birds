import os

files_to_fix = [
    r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\new\page.tsx",
    r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\[id]\page.tsx"
]

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "const { fetchWithAuth } = useAuth();" not in content:
        content = content.replace("const router = useRouter();", "const router = useRouter();\n    const { fetchWithAuth } = useAuth();")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
