import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AllAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMap, setStatusMap] = useState({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments/portal'); // admin route
      setItems(data?.appointments || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id) => {
    const status = statusMap[id];
    if (!status) return;
    try {
      await api.put(`/appointments/portal/${id}`, { status });
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/appointments/portal/${id}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <div style={{maxWidth:900,margin:'32px auto'}}>Loading...</div>;
  if (error) return <div style={{maxWidth:900,margin:'32px auto',color:'crimson'}}>{error}</div>;

  return (
    <div style={{maxWidth:1100,margin:'32px auto'}}>
      <h3>All Appointments</h3>
      {items.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table width="100%" cellPadding={8} style={{borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f3f4f6'}}>
              <th align="left">Patient</th>
              <th align="left">Email</th>
              <th align="left">Doctor</th>
              <th align="left">Date</th>
              <th align="left">Time</th>
              <th align="left">Status</th>
              <th align="left">Reason</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id} style={{borderTop:'1px solid #e5e7eb'}}>
                <td>{a?.patient?.name || '-'}</td>
                <td>{a?.patient?.email || '-'}</td>
                <td>{a?.doctor?.name || '-'}</td>
                <td>{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                <td>{a.time || '-'}</td>
                <td>{a.status}</td>
                <td>{a.reason || '-'}</td>
                <td style={{display:'flex',gap:8}}>
                  <select
                    value={statusMap[a._id] ?? ''}
                    onChange={(e) => setStatusMap(s => ({ ...s, [a._id]: e.target.value }))}
                  >
                    <option value="">Set status</option>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button onClick={() => updateStatus(a._id)}>Update</button>
                  <button onClick={() => del(a._id)} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'6px 10px'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
