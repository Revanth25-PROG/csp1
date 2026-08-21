import { useState } from 'react';
import { ShieldAlert, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Admin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Check if the user is actually an admin
        if (data.user?.user_metadata?.role === 'admin') {
          navigate('/dashboard');
        } else {
          // If a normal user tries to log in here, kick them out
          await supabase.auth.signOut();
          setError('Access Denied: You do not have administrator privileges.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <ShieldAlert size={32} />
          </div>
          <h1>Admin Portal</h1>
          <p>Authorized personnel only. Please login to continue.</p>
        </div>

        {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Master Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" style={{ background: 'var(--secondary-color)', boxShadow: '0 10px 20px -10px rgba(15, 23, 42, 0.5)' }} disabled={loading}>
            {loading ? <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;
