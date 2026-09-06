import os
import re
file_path = r"d:\Developer\Mangment birds\frontend\src\app\dashboard\settings\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("body: JSON.stringify({ name: newSpeciesName })", "body: JSON.stringify({ name: newSpeciesName, incubationPeriodInDays: Number(newSpeciesHatch) || 0, maturityAgeInDays: Number(newSpeciesMature) || 0 })")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
