import os
file_path = r"d:\Developer\Mangment birds\backend\Controllers\FarmSettingsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_get = """        return Ok(new
        {
            user.FarmName,
            user.ContactNumbers,
            user.FarmLogoUrl,
            user.SubscriptionEndDate,"""

new_get = """        var logoUrl = user.FarmLogoUrl;
        if (!string.IsNullOrEmpty(logoUrl) && logoUrl.StartsWith("/"))
        {
            logoUrl = "https://mangment-birds-api.onrender.com" + logoUrl;
        }
        
        return Ok(new
        {
            user.FarmName,
            user.ContactNumbers,
            FarmLogoUrl = logoUrl,
            user.SubscriptionEndDate,"""

content = content.replace(old_get, new_get)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
