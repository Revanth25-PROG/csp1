import { useState, useEffect } from 'react';
import { UserCircle, Mail, Lock, Loader2, LogOut, LayoutList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function User() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New states for profile check
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setCheckingAuth(false);
    };
    checkUser();
  }, []);

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
        if (data.user?.app_metadata?.role === 'admin') {
          navigate('/dashboard'); // If admin logs in from user page
        } else {
          setCurrentUser(data.user); // Update state to show profile
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  if (checkingAuth) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>Loading...</div>;
  }

  // --- Profile View (If already logged in) ---
  if (currentUser) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-header" style={{ marginBottom: '20px' }}>
            <div className="auth-icon-container" style={{ background: '#d1fae5', color: '#10b981', margin: '0 auto 15px' }}>
              <UserCircle size={40} />
            </div>
            <h1>Your Profile</h1>
            <p>You are logged in.</p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '25px', border: '1px solid var(--border-color)' }}>
            <p style={{ margin: '0 0 10px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Name:</strong> {currentUser.user_metadata?.full_name || 'N/A'}
            </p>
            <p style={{ margin: '0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/track" className="auth-btn" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <LayoutList size={18} /> View My Complaints
            </Link>
            <button 
              onClick={handleLogout} 
              className="auth-btn" 
              style={{ background: 'transparent', color: '#ef4444', border: '2px solid #fee2e2', boxShadow: 'none' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Login Form View (If NOT logged in) ---
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <UserCircle size={32} />
          </div>
          <h1>User Login</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="john.doe@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one now</Link>
        </div>
      </div>
    </div>
  );
}

export default User;