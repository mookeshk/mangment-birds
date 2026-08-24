import re

with open('frontend/src/app/dashboard/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={px-6 py-2 rounded-full font-medium transition-all }', 
    'className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === \'farm\' ? \'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25\' : \'bg-slate-800 text-slate-300 hover:bg-slate-700\'}`}'
)

bad_pass = """className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab ===const [activeTab, setActiveTab] = useState<'farm' | 'species' | 'password' | 'subscription'>('farm');"""
good_pass = """className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'password' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>كلمة المرور</button>"""
content = content.replace(bad_pass, good_pass)

bad_cond = """{activeTab ===const [activeTab, setActiveTab] = useState<'farm' | 'species' | 'password' | 'subscription'>('farm');"""
good_cond = """{activeTab === 'password' && ("""
content = content.replace(bad_cond, good_cond)

with open('frontend/src/app/dashboard/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
