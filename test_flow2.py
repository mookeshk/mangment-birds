import urllib.request
import urllib.error
import json
import uuid

base_url = 'https://mangment-birds-api.onrender.com'
email = f'test_{uuid.uuid4().hex[:8]}@example.com'
password = 'Password123!'

def req(path, method='GET', data=None, token=None):
    url = base_url + path
    headers = {'Content-Type': 'application/json'}
    if token: headers['Authorization'] = f'Bearer {token}'
    body = json.dumps(data).encode('utf-8') if data else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as res:
            text = res.read().decode('utf-8')
            if not text: return None
            return json.loads(text)
    except urllib.error.HTTPError as e:
        print(f"Error {e.code} on {path}: {e.read().decode('utf-8')}")
        return None

# Register & Login
print('Registering...')
req('/register', 'POST', {'email': email, 'password': password})
print('Logging in...')
auth = req('/login', 'POST', {'email': email, 'password': password})
token = auth['token']

# Create Cage
cage = req('/api/cages', 'POST', {'name': 'Test Cage', 'capacity': 10}, token)
print(f'Cage created: {cage}')

# Create Birds
b1 = req('/api/birds', 'POST', {'identifier': 'B1', 'isMale': True, 'status': 0}, token)
b2 = req('/api/birds', 'POST', {'identifier': 'B2', 'isMale': False, 'status': 0}, token)
print(f'Birds created: {b1}, {b2}')

# Create Colony Session
session = req('/api/breedingsessions', 'POST', {
    'cageId': cage['id'],
    'matingDate': '2026-09-06',
    'colonyBirdIds': [b1['id'], b2['id']]
}, token)
print(f'Session created: {session}')

# Fetch Birds
birds = req('/api/birds', 'GET', token=token)
for b in birds:
    print(f"Bird {b['identifier']}: Status={b['status']}, CageId={b['cageId']}")

