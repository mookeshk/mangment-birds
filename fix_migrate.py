import os
file_path = r"d:\Developer\Mangment birds\backend\Program.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();"""

new_code = """using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    if (dbContext.Database.ProviderName == "Npgsql.EntityFrameworkCore.PostgreSQL")
    {
        dbContext.Database.Migrate();
    }
    else
    {
        // For SQLite, bypass migrations and just create the schema
        dbContext.Database.EnsureCreated();
    }"""

content = content.replace(old_code, new_code)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
