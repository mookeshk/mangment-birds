import urllib.parse
url = 'postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres'
parsed = urllib.parse.urlparse(url)
print(f"Host: {parsed.hostname}")
print(f"Port: {parsed.port}")
print(f"Username: {parsed.username}")
print(f"Password: {parsed.password}")
print(f"Database: {parsed.path.lstrip('/')}")
