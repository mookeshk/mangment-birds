import os

file_path = r"d:\Developer\Mangment birds\frontend\src\app\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";\nimport { useAuth } from "../contexts/AuthContext";')
content = content.replace('const router = useRouter();', 'const router = useRouter();\n    const { refreshUser, user } = useAuth();')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
