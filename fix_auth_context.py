import os
file_path = r"d:\Developer\Mangment birds\frontend\src\contexts\AuthContext.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = "farmLogoUrl: farmData.farmLogoUrl ? ${farmData.farmLogoUrl} : undefined,"
new_code = "farmLogoUrl: farmData.farmLogoUrl ? (farmData.farmLogoUrl.startsWith('http') ? farmData.farmLogoUrl : https://mangment-birds-api.onrender.com) : undefined,"

content = content.replace(old_code, new_code)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
