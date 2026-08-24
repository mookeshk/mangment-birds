import re
with open('frontend/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# find the bottom of the form
search = """                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        ليس لديك حساب؟{" "}
                        <Link href="/register" className="text-emerald-500 font-bold hover:underline">
                            سجل مزرعتك الآن
                        </Link>
                    </p>"""

replace = search + """
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
                        <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            تسجيل دخول الإدارة
                        </Link>
                    </div>"""

if "تسجيل دخول الإدارة" not in content:
    content = content.replace(search, replace)
    with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
