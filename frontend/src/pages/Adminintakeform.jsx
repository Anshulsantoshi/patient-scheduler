import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminIntakeForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllIntakeForms();
  }, []);

  const fetchAllIntakeForms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/intake/admin/forms');
      if (data.success) {
        setForms(data.forms);
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to fetch intake forms');
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search term
  const filteredForms = forms.filter(form => 
    form.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openFormDetails = (form) => {
    setSelectedForm(form);
  };

  const closeFormDetails = () => {
    setSelectedForm(null);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '32px auto', textAlign: 'center' }}>
        <h2>Loading intake forms...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#1f2937', marginBottom: 8 }}>All Patient Intake Forms</h2>
        <p style={{ color: '#6b7280' }}>Total Forms: {forms.length}</p>
      </div>

      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: '#dc2626', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by patient name, email, or symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: 12,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            fontSize: 14
          }}
        />
      </div>

      {filteredForms.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 48, 
          background: '#f9fafb', 
          borderRadius: 8,
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#6b7280', marginBottom: 8 }}>
            {forms.length === 0 ? 'No intake forms submitted yet' : 'No forms match your search'}
          </h3>
          <p style={{ color: '#9ca3af' }}>
            {forms.length === 0 
              ? 'Intake forms will appear here when patients submit them.' 
              : 'Try adjusting your search terms.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredForms.map((form) => (
            <div
              key={form._id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => openFormDetails(form)}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1f2937', fontSize: 18, fontWeight: 600 }}>
                    {form.patient?.name || 'Unknown Patient'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                    {form.patient?.email || 'No email'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, color: '#374151', fontSize: 14, fontWeight: 500 }}>
                    {new Date(form.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p style={{ margin: '2px 0 0 0', color: '#9ca3af', fontSize: 12 }}>
                    {new Date(form.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Primary Symptoms
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14, lineHeight: 1.5 }}>
                    {form.symptoms ? (form.symptoms.length > 100 ? form.symptoms.substring(0, 100) + '...' : form.symptoms) : 'Not specified'}
                  </p>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Insurance Provider
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                    {form.insurance || 'Not provided'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500
                }}>
                  Click to view full details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Details Modal */}
      {selectedForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={closeFormDetails}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 32,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, color: '#1f2937', fontSize: 24 }}>
                  {selectedForm.patient?.name || 'Unknown Patient'}
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                  {selectedForm.patient?.email || 'No email'}
                </p>
              </div>
              <button
                onClick={closeFormDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: 4
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 16 }}>Medical History</h4>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                  {selectedForm.medicalHistory || 'Not provided'}
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 16 }}>Current Symptoms</h4>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                  {selectedForm.symptoms || 'Not specified'}
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 16 }}>Insurance Information</h4>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                  {selectedForm.insurance || 'Not provided'}
                </p>
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: 14 }}>
                  Submitted on: {new Date(selectedForm.createdAt).toLocaleString()}
                </p>
                {selectedForm.updatedAt !== selectedForm.createdAt && (
                  <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: 14 }}>
                    Last updated: {new Date(selectedForm.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}