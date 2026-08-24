using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.Models;
using System;
using System.IO;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Bind to PORT provided by Render
var port = Environment.GetEnvironmentVariable(""PORT"") ?? ""8080"";
builder.WebHost.UseUrls($""http://*:{port}"");

var connectionString = builder.Configuration.GetConnectionString(""DefaultConnection"");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<Microsoft.AspNetCore.Identity.IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllers();
builder.Services.AddTransient<Microsoft.AspNetCore.Identity.IEmailSender<backend.Models.ApplicationUser>, backend.Services.EmailSender>();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Automatically apply migrations and create DB on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Microsoft.AspNetCore.Identity.IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    
    // Seed Admin Role
    if (!roleManager.RoleExistsAsync(""Admin"").GetAwaiter().GetResult())
    {
        roleManager.CreateAsync(new Microsoft.AspNetCore.Identity.IdentityRole(""Admin"")).GetAwaiter().GetResult();
    }
    
    // Make specific user admin
    var adminEmail = ""eng.mo.keshk@gmail.com"";
    var adminUser = userManager.FindByEmailAsync(adminEmail).GetAwaiter().GetResult();
    if (adminUser != null)
    {
        if (!userManager.IsInRoleAsync(adminUser, ""Admin"").GetAwaiter().GetResult())
        {
            userManager.AddToRoleAsync(adminUser, ""Admin"").GetAwaiter().GetResult();
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), ""wwwroot"");
if (!Directory.Exists(wwwrootPath))
{
    Directory.CreateDirectory(wwwrootPath);
}

app.UseStaticFiles();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<ApplicationUser>();

app.Run();
