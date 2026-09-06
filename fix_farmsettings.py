import os
file_path = r"d:\Developer\Mangment birds\backend\Controllers\FarmSettingsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('user.FarmLogoUrl = $"/uploads/logos/{fileName}";', 'user.FarmLogoUrl = $"https://mangment-birds-api.onrender.com/uploads/logos/{fileName}";')
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
