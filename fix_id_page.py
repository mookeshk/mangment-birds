import os
file_path = r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\[id]\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { useParams, useRouter } from 'next/navigation';", "import { useParams, useRouter } from 'next/navigation';\nimport { useAuth } from '../../../../contexts/AuthContext';")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
