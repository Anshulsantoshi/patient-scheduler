import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/appointments/my-appointments'); // patient route
        setItems(data?.appointments || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{maxWidth:900,margin:'32px auto'}}>Loading...</div>;
  if (error) return <div style={{maxWidth:900,margin:'32px auto',color:'crimson'}}>{error}</div>;

  return (
    <div style={{maxWidth:900,margin:'32px auto'}}>
      <h3>My Appointments</h3>
      {items.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table width="100%" cellPadding={8} style={{borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f3f4f6'}}>
              <th align="left">Date</th>
              <th align="left">Time</th>
              <th align="left">Doctor</th>
              <th align="left">Status</th>
              <th align="left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id} style={{borderTop:'1px solid #e5e7eb'}}>
                <td>{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                <td>{a.time || '-'}</td>
                <td>{a?.doctor?.name || '-'}</td>
                <td>{a.status}</td>
                <td>{a.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
