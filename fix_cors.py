import sys

with open('backend/Program.cs', 'r', encoding='utf-8') as f:
    content = f.read()

old_policy = '''policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();'''

new_policy = '''policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();'''

content = content.replace(old_policy, new_policy)

# To be safe against indentation issues:
content = content.replace('policy.WithOrigins("http://localhost:3000", "http://localhost:3001")', 'policy.SetIsOriginAllowed(_ => true)')

with open('backend/Program.cs', 'w', encoding='utf-8') as f:
    f.write(content)
