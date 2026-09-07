import json
import urllib.request

url = 'https://mangment-birds-api.onrender.com/api/breedingsessions'

# We don't have auth token, so this will fail with 401
req = urllib.request.Request(url, method='POST')
req.add_header('Content-Type', 'application/json')
data = json.dumps({
    "cageId": 1,
    "matingDate": "2026-09-06",
    "colonyBirdIds": [1, 2, 3, 4]
}).encode('utf-8')

try:
    with urllib.request.urlopen(req, data=data) as response:
        print(response.read())
except Exception as e:
    print(e)
