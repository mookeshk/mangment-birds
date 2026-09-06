import os
file_path = r"d:\Developer\Mangment birds\backend\Controllers\BreedsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "var breed = new Breed\n        {\n            Name = input.Name,\n            SpeciesId = input.SpeciesId\n        };",
    "var breed = new Breed\n        {\n            Name = input.Name,\n            SpeciesId = input.SpeciesId,\n            UserId = userId\n        };"
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
