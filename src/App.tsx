import { useState, useEffect } from 'react'
import './App.css'

// กำหนดโครงสร้างข้อมูล Log ให้ระบบเข้าใจ
interface Log {
  _id?: string;
  id?: string;
  message: string;
  level?: string;
  timestamp?: string;
  createdAt?: string;
}

function App() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔥 หักดิบ: ฝัง URL ของ Backend พอร์ต 8081 ตรงๆ ให้เด็ดขาดไปเลย
  // ⚠️ (หมายเหตุ: ถ้าหลังบ้านของคุณใช้ endpoint อื่น เช่น http://localhost:8081/logs สามารถปรับแก้ตรงนี้ได้เลยครับ)
  const API_URL = 'http://localhost:8081/api/logs' 

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`เซิร์ฟเวอร์หลังบ้านตอบกลับด้วย Error รหัส: ${res.status}`);
        }
        
        // เช็คความปลอดภัย: ข้อมูลที่ได้กลับมาต้องเป็น JSON ไม่ใช่หน้าเว็บ HTML ผีสิงของ Jenkins หรือ Nginx
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("ข้อมูลที่ได้กลับมาไม่ใช่ JSON! เบราว์เซอร์อาจจะวิ่งไปโดนพอร์ตของ Jenkins (8080) แนะนำให้รีเช็คพอร์ตหลังบ้านอีกครั้ง");
        }
        
        return res.json()
      })
      .then((data) => {
        // รองรับทั้งแบบส่งมาเป็น Array ตรงๆ หรือห่ออยู่ใน object { data: [...] }
        const logData = Array.isArray(data) ? data : (data.data || []);
        setLogs(logData)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend พอร์ต 8081 ได้ (Network Error)')
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', textAlign: 'left', color: '#333' }}>
      <h2 style={{ color: '#2c3e50', margin: 0 }}>🚀 ระบบแดชบอร์ดแสดงผล Log-App</h2>
      <p style={{ color: '#7f8c8d' }}>กำลังดึงข้อมูลจากระบบหลังบ้าน: <code style={{ backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{API_URL}</code></p>
      <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }} />

      {/* ⏳ สถานะกำลังโหลด */}
      {loading && <p style={{ color: '#f39c12', fontWeight: 'bold' }}>⏳ กำลังโหลดข้อมูล Log จากฐานข้อมูล MongoDB...</p>}
      
      {/* ❌ ถ้าเกิดข้อผิดพลาดในการดึงข้อมูล */}
      {error && (
        <div style={{ backgroundColor: '#ffeaea', color: '#cc0000', padding: '20px', borderRadius: '6px', border: '1px solid #ffa3a3', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>💥 เกิดข้อผิดพลาดในการเชื่อมต่อระบบ</h4>
          <p style={{ margin: '0 0 10px 0' }}>{error}</p>
          <small style={{ color: '#666' }}>💡 วิธีแก้: เช็คให้แน่ใจว่าตู้หลังบ้าน (Backend Container) กำลังรันอยู่บนพอร์ต 8081 จริงๆ โดยใช้คำสั่ง `docker ps` ส่องดู</small>
        </div>
      )}

      {/* 📭 เชื่อมต่อสำเร็จแต่ฐานข้อมูลยังว่างเปล่า */}
      {!loading && !error && logs.length === 0 && (
        <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '4px' }}>📭 ต่อหลังบ้านติดแล้ว! แต่ปัจจุบันยังไม่มีข้อมูล Log บันทึกอยู่ในฐานข้อมูล MongoDB</p>
      )}

      {/* 📊 ตารางแสดงข้อมูลเมื่อดึงสำเร็จ */}
      {!loading && !error && logs.length > 0 && (
        <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0