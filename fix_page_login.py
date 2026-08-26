import os

file_path = r"d:\Developer\Mangment birds\frontend\src\app\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the login logic safely
old_str = """        try {
            const res = await fetch('https://mangment-birds-api.onrender.com/login?useCookies=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {"""

new_str = """        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.accessToken) {
                    localStorage.setItem('token', data.accessToken);
                }
                await refreshUser();
                router.push('/dashboard');
            } else {"""

content = content.replace(old_str, new_str)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
