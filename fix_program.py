import os
import re
file_path = r"d:\Developer\Mangment birds\backend\Program.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Login MapPost
old_login = """        var farmData = new
        {
            FarmName = user.FarmName,
            ContactNumbers = user.ContactNumbers,
            FarmLogoUrl = user.FarmLogoUrl,
            SubscriptionEndDate = user.SubscriptionEndDate,
            PackageName = user.ActivePackage?.Name,
            IsAdmin = roles.Contains("Admin")
        };"""

new_login = """        var logoUrl = user.FarmLogoUrl;
        if (!string.IsNullOrEmpty(logoUrl) && logoUrl.StartsWith("/"))
        {
            logoUrl = "https://mangment-birds-api.onrender.com" + logoUrl;
        }

        var farmData = new
        {
            FarmName = user.FarmName,
            ContactNumbers = user.ContactNumbers,
            FarmLogoUrl = logoUrl,
            SubscriptionEndDate = user.SubscriptionEndDate,
            PackageName = user.ActivePackage?.Name,
            IsAdmin = roles.Contains("Admin")
        };"""

content = content.replace(old_login, new_login)

# Fix Profile MapGet
old_profile = """        return Results.Ok(new
        {
            user.Email,
            user.FarmName,
            user.ContactNumbers,
            user.FarmLogoUrl,
            user.SubscriptionEndDate,
            PackageName = user.ActivePackage?.Name,
            IsAdmin = roles.Contains("Admin")
        });"""

new_profile = """        var logoUrl = user.FarmLogoUrl;
        if (!string.IsNullOrEmpty(logoUrl) && logoUrl.StartsWith("/"))
        {
            logoUrl = "https://mangment-birds-api.onrender.com" + logoUrl;
        }

        return Results.Ok(new
        {
            user.Email,
            user.FarmName,
            user.ContactNumbers,
            FarmLogoUrl = logoUrl,
            user.SubscriptionEndDate,
            PackageName = user.ActivePackage?.Name,
            IsAdmin = roles.Contains("Admin")
        });"""

content = content.replace(old_profile, new_profile)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
