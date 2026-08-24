import re
with open('frontend/src/app/dashboard/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import AIAssistant from "../../components/AIAssistant";', 'import AIAssistant from "../../components/AIAssistant";\nimport { AIFarmAssistant } from "../../components/AIFarmAssistant";')

with open('frontend/src/app/dashboard/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
