import urllib.request
import urllib.error

url = 'https://mangment-birds-api.onrender.com/api/cages'
try:
    with urllib.request.urlopen(url) as res:
        print(f"Status: {res.status}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
except Exception as e:
    print(f"Error: {e}")
