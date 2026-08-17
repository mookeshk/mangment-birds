export default function InventoryPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>المخزون والعلف</h1>
        <button className="btn btn-primary">+ إضافة كمية جديدة</button>
      </div>

      <div className="card">
        <h2 className="h2" style={{ marginBottom: '16px' }}>مخزون العلف الحالي</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الصنف</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الكمية المتبقية</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>حالة المخزون</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>سعر الشراء</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>علف حمام مخلوط</td>
              <td style={{ padding: '16px' }}>45 كجم</td>
              <td style={{ padding: '16px' }}><span style={{ color: 'var(--success)' }}>جيد</span></td>
              <td style={{ padding: '16px' }}>900 ج.م</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>فلارس و بلكم (عصافير)</td>
              <td style={{ padding: '16px' }}>2 كجم</td>
              <td style={{ padding: '16px' }}><span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>منخفض جداً</span></td>
              <td style={{ padding: '16px' }}>150 ج.م</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
