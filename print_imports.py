import os
file_path = r"d:\Developer\Mangment birds\frontend\src\app\dashboard\birds\[id]\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith("import"):
            print(line.strip())
