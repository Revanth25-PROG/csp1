import { useState } from 'react';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: 'user' // Storing role in user metadata
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        alert('Signup successful! Check your email for confirmation or login now if auto-confirmed.');
        navigate('/user');
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
          <div className="auth-icon-container">
            <UserPlus size={32} />
          </div>
          <h1>Create Account</h1>
          <p>Join the community to report and track issues.</p>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

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
             {loading ? <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
