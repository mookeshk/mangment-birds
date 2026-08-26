import os

file_path = r"d:\Developer\Mangment birds\frontend\src\app\register\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("https://mangment-birds-api.onrender.com/login?", "https://mangment-birds-api.onrender.com/login")

old_str = """                if (loginRes.ok) {
                    router.push('/dashboard');
                }"""

new_str = """                if (loginRes.ok) {
                    const data = await loginRes.json();
                    if (data.accessToken) {
                        localStorage.setItem('token', data.accessToken);
                    }
                    router.push('/dashboard');
                }"""

content = content.replace(old_str, new_str)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
