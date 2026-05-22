import { useState, useEffect } from 'react';
import './App.css';

interface Log {
  _id?: string;
  id?: string;
  message: string;
  level?: string;
  timestamp?: string;
  createdAt?: string;
}

export default function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // หลังบ้านตัวจริงพอร์ต 8081
  const API_URL = 'http://localhost:8081/api/log';

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Backend server returned an error status');
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON. Please check backend port.');
        }
        return res.json();
      })
      .then((data) => {
        const logData = Array.isArray(data) ? data : (data.data || []);
        setLogs(logData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Network Error connecting to backend');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <h2>Log Application Dashboard</h2>
      <p>Connecting to backend API: <code>{API_URL}</code></p>
      <hr />

      {loading && <p style={{ color: 'orange', fontWeight: 'bold' }}>Loading logs from MongoDB...</p>}

      {error && (
        <div style={{ backgroundColor: '#fee', color: '#b00', padding: '15px', borderRadius: '4px', border: '1px solid #fcc' }}>
          <h4>Connection Error</h4>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <p>Connected to backend successfully, but log database is currently empty.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Message</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Level</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log._id || log.id || index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd', color: '#666' }}>{log._id || log.id || index}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{log.message}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '3px',
                    color: '#fff',
                    fontWeight: 'bold',
                    backgroundColor: log.level === 'error' ? 'red' : log.level === 'warn' ? 'orange' : 'green'
                  }}>
                    {log.level || 'info'}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', color: '#555' }}>{log.timestamp || log.createdAt || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
