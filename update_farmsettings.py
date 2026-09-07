import os

file_path = r"backend\Controllers\FarmSettingsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace UpdateFarmSettings
old_update = '''        if (logo != null && logo.Length > 0)
        {
            var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "logos");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            var fileName = $"{user.Id}_{Guid.NewGuid()}{Path.GetExtension(logo.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await logo.CopyToAsync(stream); }

            user.FarmLogoUrl = $"https://mangment-birds-api.onrender.com/uploads/logos/{fileName}";
        }'''

new_update = '''        if (logo != null && logo.Length > 0)
        {
            using (var memoryStream = new MemoryStream())
            {
                await logo.CopyToAsync(memoryStream);
                var imageBytes = memoryStream.ToArray();
                var base64String = Convert.ToBase64String(imageBytes);
                // Get MIME type from extension or contentType
                var contentType = logo.ContentType;
                user.FarmLogoUrl = $"data:{contentType};base64,{base64String}";
            }
        }'''

# Replace UploadLogo
old_upload = '''        var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "logos");
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        var fileName = $"{user.Id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create)) { await file.CopyToAsync(stream); }

        user.FarmLogoUrl = $"https://mangment-birds-api.onrender.com/uploads/logos/{fileName}";'''

new_upload = '''        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();
            var base64String = Convert.ToBase64String(imageBytes);
            var contentType = file.ContentType;
            user.FarmLogoUrl = $"data:{contentType};base64,{base64String}";
        }'''

content = content.replace(old_update, new_update)
content = content.replace(old_upload, new_upload)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
