import re
with open('frontend/src/app/dashboard/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import { AIFarmAssistant } from '@/components/AIFarmAssistant';"
if import_statement not in content:
    content = content.replace('import { Icons } from "@/components/Icons";', 'import { Icons } from "@/components/Icons";\n' + import_statement)

assistant_tag = "<AIFarmAssistant />"
if assistant_tag not in content:
    content = content.replace('</main>', f'    {assistant_tag}\n            </main>')
    with open('frontend/src/app/dashboard/layout.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
