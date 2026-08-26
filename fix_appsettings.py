import json

with open('backend/appsettings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['ConnectionStrings']['DefaultConnection'] = 'Data Source=BirdFarm.db'

with open('backend/appsettings.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
