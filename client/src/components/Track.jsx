import { useState, useEffect } from 'react';
import { Search, Clock, AlertCircle, LayoutList, MapPin, Tag, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Track() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndComplaints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setComplaints(data);
        }
      }
      setLoading(false);
    };

    fetchUserAndComplaints();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>Loading your records...</div>;
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-icon-container" style={{ background: '#e0f2fe', color: '#0284c7', margin: '0 auto 20px' }}>
            <Search size={32} />
          </div>
          <h1>Track Your Complaints</h1>
          <p style={{ marginTop: '10px', marginBottom: '25px' }}>Please log in to your account to view the status of all complaints you have submitted.</p>
          <Link to="/user" className="auth-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 5%', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary-color)' }}>
          <LayoutList color="var(--primary-color)" /> My Complaints
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {complaints.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '10px' }}>No complaints found</h3>
            <p style={{ color: 'var(--text-muted)' }}>You haven't registered any issues yet.</p>
            <Link to="/register" className="auth-btn" style={{ display: 'inline-block', marginTop: '20px', width: 'auto', padding: '10px 24px' }}>
              Report an Issue
            </Link>
          </div>
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

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Calendar size={14} /> 
                  {new Date(complaint.created_at).toLocaleString()}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Track;
