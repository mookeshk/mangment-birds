"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5089/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Successful registration, redirect to login
        router.push('/?registered=true');
      } else {
        const data = await res.json();
        // Extract validation errors
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(' | ');
          setError(messages);
        } else {
          setError('حدث خطأ أثناء التسجيل. تأكد من إدخال كلمة مرور قوية.');
        }
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الواجهة الخلفية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 className="h1" style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '24px' }}>
        إنشاء حساب جديد
      </h1>
      
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="h2">بيانات المزرعة</h2>
        
        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', textAlign: 'right', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleRegister} style={{ marginTop: '24px', textAlign: 'right' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="user@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">كلمة المرور (يجب أن تحتوي على حروف كبيرة ورموز وأرقام)</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          لديك حساب بالفعل؟ <Link href="/" style={{ fontWeight: 'bold' }}>تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
