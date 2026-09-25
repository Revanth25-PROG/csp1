import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Tag, Calendar, LogOut, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { withPhotoLinks } from '../complaintPhotos';

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.app_metadata?.role !== 'admin') {
        navigate('/admin-login');
        return;
      }
      
      // Fetch complaints
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch complaints from Supabase');
      } else {
        setComplaints(await withPhotoLinks(data));
      }
      setLoading(false);
    };

    checkUserAndFetch();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  const handleMarkSolved = async (id) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: 'solved' })
        .eq('id', id);

      if (error) {
        alert('Failed to update status: ' + error.message);
        return;
      }

      // Update local state to reflect the change immediately
      setComplaints(complaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: 'solved' } : complaint
      ));
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ padding: '40px 5%', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary-color)' }}>
          <LayoutDashboard color="var(--primary-color)" /> Admin Dashboard
        </h1>
        <button onClick={handleLogout} className="auth-btn" style={{ background: '#ef4444', padding: '10px 20px', margin: 0, boxShadow: 'none' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {complaints.length === 0 ? (
          <p>No complaints registered yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
              
              {complaint.photo_url ? (
                <img 
                  src={complaint.photo_url} 
                  alt="Complaint" 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No Photo Attached
                </div>
              )}
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--primary-color)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '20px' }}>
                    <Tag size={14} /> {complaint.category}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px', background: complaint.status === 'pending' ? '#fef3c7' : '#d1fae5', color: complaint.status === 'pending' ? '#d97706' : '#10b981' }}>
                    {complaint.status}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', color: 'var(--secondary-color)', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={18} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} /> {complaint.location}
                </h3>
                
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                  {complaint.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> 
                    {new Date(complaint.created_at).toLocaleString()}
                  </span>
                  {complaint.status === 'pending' && (
                    <button 
                      onClick={() => handleMarkSolved(complaint.id)}
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      <CheckCircle size={14} /> Solved
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
