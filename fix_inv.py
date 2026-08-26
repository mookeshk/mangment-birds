import sys

with open('frontend/src/app/dashboard/inventory/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

handle_consume = '''
    const handleConsume = async (id: number, quantity: number, date: string, notes: string) => {
        try {
            await fetchWithAuth(`/api/inventory/${id}/consume`, {
                method: 'POST',
                body: JSON.stringify({ quantity, date, notes })
            });
            setIsConsumeModalOpen(false);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };
'''

content = content.replace('const loadData = async () => {', handle_consume + '\n    const loadData = async () => {')
content = content.replace('onSave={() => { setIsConsumeModalOpen(false); loadData(); }}', 'onSubmit={handleConsume}')

with open('frontend/src/app/dashboard/inventory/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
