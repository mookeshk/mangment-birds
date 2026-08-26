import os

target_dir = r"d:\Developer\Mangment birds\frontend\src"
old_url = "https://mangment-birds-api.onrender.com"
new_url = "/api-proxy"

changed_files = 0

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_url in content:
                content = content.replace(old_url, new_url)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file_path}")
                changed_files += 1

print(f"Total files modified: {changed_files}")
