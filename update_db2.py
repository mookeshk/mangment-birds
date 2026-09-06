import os
file_path = r"d:\Developer\Mangment birds\backend\Program.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_db = """var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));"""

new_db = """var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Parse Heroku/Render format postgres://user:pass@host:port/db
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SslMode=Require;TrustServerCertificate=True;";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString != null && (connectionString.Contains("Host=") || connectionString.Contains("Server=")))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString ?? "Data Source=app.db");
    }
});"""

content = content.replace(old_db, new_db)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
