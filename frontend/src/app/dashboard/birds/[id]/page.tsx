"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';

interface Bird {
  id: number;
  species: string;
  gender: string;
  source: string;
  purchasePrice: number;
  purchaseDate: string;
  status: string;
  notes: string;
}

export default function BirdDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [bird, setBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBird();
  }, [id]);

  const fetchBird = async () => {
    try {
      const res = await fetch(`https://mangment-birds-api.onrender.com/api/Birds/${id}`, {
        credentials: 'include'
      });

      if (res.status === 401) {
        router.push('/');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setBird(data);
      } else {
        setError('تعذر العثور على الطائر المحدد.');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>جاري التحميل...</div>;
  if (error || !bird) return <div style={{ padding: '24px', color: 'var(--danger)' }}>{error || 'الطائر غير موجود'}</div>;

  // The link that the QR code will redirect to (e.g. mobile scanner scanning this bird)
  const qrCodeValue = `http://localhost:3000/dashboard/birds/${bird.id}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>تفاصيل الطائر #{bird.id}</h1>
        <button className="btn btn-outline" onClick={() => router.back()}>العودة للقائمة</button>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 className="h2" style={{ marginBottom: '16px' }}>البيانات الأساسية</h2>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li><strong>النوع:</strong> {bird.species}</li>
            <li><strong>الجنس:</strong> {bird.gender}</li>
            <li><strong>المصدر:</strong> {bird.source || 'غير محدد'}</li>
            <li><strong>تاريخ الشراء/الفقس:</strong> {new Date(bird.purchaseDate).toLocaleDateString('ar-EG')}</li>
            <li><strong>السعر:</strong> {bird.purchasePrice} ج.م</li>
            <li><strong>الحالة:</strong> 
              <span style={{ marginLeft: '8px', color: bird.status === 'Active' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                {bird.status === 'Active' ? 'نشط' : bird.status}
              </span>
            </li>
          </ul>
          
          {bird.notes && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
              <strong>ملاحظات:</strong>
              <p style={{ marginTop: '8px' }}>{bird.notes}</p>
            </div>
          )}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="h2" style={{ marginBottom: '24px' }}>رمز الاستجابة السريعة (QR Code)</h2>
          <div style={{ padding: '16px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <QRCode value={qrCodeValue} size={200} />
          </div>
          <p className="text-muted" style={{ marginTop: '16px', textAlign: 'center' }}>
            يمكنك طباعة هذا الرمز ولصقه على القفص الخاص بالطائر. عند مسحه بكاميرا الهاتف ستظهر لك بيانات هذا الطائر فوراً.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => window.print()}>
            طباعة الرمز
          </button>
        </div>
      </div>
    </div>
  );
}
