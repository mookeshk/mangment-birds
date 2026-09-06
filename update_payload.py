import os
file_path = r"frontend/src/app/dashboard/breeding/PairingModal.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'femaleBirdId: mode === "individual" ? parseInt(femaleId) : null,',
    'femaleBirdId: mode === "individual" ? parseInt(femaleId) : null,\n                colonyBirdIds: mode === "colony" ? colonyBirdIds.map(Number) : undefined,'
)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
