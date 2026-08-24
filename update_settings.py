import re

with open('frontend/src/app/dashboard/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_statement = "import SubscriptionTab from \"../../../components/SubscriptionTab\";\n"
if "SubscriptionTab" not in content:
    content = content.replace("import FarmSettingsTab", import_statement + "import FarmSettingsTab")

# Replace old subscription block
bad_block = """{activeTab === 'subscription' && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold">اشتراكك نشط</h2>
                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl text-right inline-block min-w-full sm:min-w-[300px]">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">نوع الباقة</p>
                            <p className="font-bold mb-4">الباقة الاحترافية (Pro)</p>
                            
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الانتهاء</p>
                            <p className="font-bold">2027/08/23</p>
                        </div>
                    </div>
                )}"""
                
good_block = "{activeTab === 'subscription' && <SubscriptionTab />}"
content = content.replace(bad_block, good_block)

with open('frontend/src/app/dashboard/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
