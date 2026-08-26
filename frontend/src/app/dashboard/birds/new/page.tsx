"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

export default function NewBirdPage() {
  const router = useRouter();
    const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    species: '',
    gender: 'ذكر',
    source: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0], // Today
    status: 'Active',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchWithAuth('/api/birds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          ...formData,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : 0
        }),
      });

      if (res.status === 401) {
        router.push('/');
        return;
      }

      if (res.ok) {
        // Success! Go back to birds list
        router.push('/dashboard/birds');
      } else {
        const data = await res.json();
        setError(data.title || 'حدث خطأ أثناء حفظ بيانات الطائر.');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم. تأكد من تشغيل API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="h1">إضافة طائر جديد</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', textAlign: 'right' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">النوع أو الفصيلة (مثال: كوكتيل لاتينو)</label>
              <input type="text" name="species" className="form-control" value={formData.species} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">الجنس</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
                <option value="غير معروف">غير معروف</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">المصدر (تم شراؤه من..)</label>
              <input type="text" name="source" className="form-control" value={formData.source} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">سعر الشراء (ج.م)</label>
              <input type="number" name="purchasePrice" className="form-control" value={formData.purchasePrice} onChange={handleChange} min="0" step="0.01" />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">تاريخ الشراء / الفقس</label>
              <input type="date" name="purchaseDate" className="form-control" value={formData.purchaseDate} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">الحالة</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option value="Active">نشط (في المزرعة)</option>
                <option value="Sick">مريض / في العزل</option>
                <option value="Sold">مباع</option>
                <option value="Deceased">نافق</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">ملاحظات إضافية (اختياري)</label>
            <textarea name="notes" className="form-control" rows={3} value={formData.notes} onChange={handleChange}></textarea>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ بيانات الطائر'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => router.back()}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

