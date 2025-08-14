import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyIntakeForms() {
  const [forms, setForms] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data } = await api.get('/intake/forms');
        if (data.success) setForms(data.forms);
      } catch (error) {
        setErr(error?.response?.data?.message || error.message);
      }
    };
    fetchForms();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '32px auto' }}>
      <h3>My Intake Forms</h3>
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      {forms.length === 0 ? (
        <p>No forms submitted yet.</p>
      ) : (
        <ul>
          {forms.map((form) => (
            <li key={form._id}>
              <strong>Date:</strong> {new Date(form.createdAt).toLocaleDateString()} <br />
              <strong>Medical History:</strong> {form.medicalHistory} <br />
              <strong>Insurance:</strong> {form.insurance || '-'} <br />
              <strong>Symptoms:</strong> {form.symptoms}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
