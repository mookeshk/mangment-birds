import os

file_path = r"d:\Developer\Mangment birds\frontend\src\app\admin\login\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = """            if (res.ok) {
                await refreshUser(); // Make sure user context is updated and we get isAdmin
                router.push("/admin");
            }"""

new_str = """            if (res.ok) {
                const data = await res.json();
                if (data.accessToken) {
                    localStorage.setItem('token', data.accessToken);
                }
                await refreshUser(); // Make sure user context is updated and we get isAdmin
                router.push("/admin");
            }"""

content = content.replace(old_str, new_str)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
