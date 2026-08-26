import os

target_dir = r"d:\Developer\Mangment birds\frontend\src\app\dashboard"
changed_files = 0

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx"):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if "credentials:" in content:
                # Add token to headers
                # But wait, it's easier to just use fetchWithAuth if it's already there!
                print(f"File needs update: {file_path}")
