import os
file_path = r"d:\Developer\Mangment birds\backend\Program.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """    var userInfo = uri.UserInfo.Split(':');
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SslMode=Require;TrustServerCertificate=True;";"""

new_code = """    var userInfo = uri.UserInfo.Split(':');
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = Uri.UnescapeDataString(userInfo[1]);
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={username};Password={password};SslMode=Require;TrustServerCertificate=True;";"""

content = content.replace(old_code, new_code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
