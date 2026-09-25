import { useState } from 'react';
import { FileEdit, MapPin, AlignLeft, ListTree, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

function Register() {
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: ''
  });
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedPath = null;
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Please log in before registering a complaint.');
      if (photo && (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type) || photo.size > 5242880)) {
        throw new Error('Choose a JPEG, PNG, or WebP image no larger than 5 MB.');
      }
      let photo_url = null;

      // 1. Upload photo to Supabase Storage if it exists
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('complaint-photos')
          .upload(filePath, photo);

        if (uploadError) {
          throw uploadError;
        }

        uploadedPath = filePath;
        photo_url = filePath;
      }

      // 3. Insert record into database
      const { error: insertError } = await supabase
        .from('complaints')
        .insert([
          {
            category: formData.category,
            location: formData.location,
            description: formData.description,
            photo_url: photo_url,
            status: 'pending',
            user_id: user.id
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setIsSuccess(true);
      setFormData({ category: '', location: '', description: '' });
      setPhoto(null);
      
    } catch (error) {
      if (uploadedPath) await supabase.storage.from('complaint-photos').remove([uploadedPath]);
      console.error('Error submitting complaint:', error);
      alert(`Failed to register complaint: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="auth-icon-container" style={{ background: '#d1fae5', color: '#10b981', margin: '0 auto 20px' }}>
            <CheckCircle2 size={32} />
          </div>
          <h1>Complaint Registered!</h1>
          <p style={{ marginTop: '10px' }}>Your complaint has been successfully recorded in the database.</p>
          <button onClick={() => setIsSuccess(false)} className="auth-btn" style={{ marginTop: '30px' }}>
            Register Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-icon-container">
            <FileEdit size={32} />
          </div>
          <h1>Register Complaint</h1>
          <p>Fill out the details below and attach a photo of the issue.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Category</label>
            <div className="input-wrapper">
              <ListTree size={18} className="input-icon" />
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="" disabled>Select an issue category</option>
                <option value="Road Damage / Potholes">Road Damage / Potholes</option>
                <option value="Garbage Overflow">Garbage Overflow</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Street Light Issue">Street Light Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Location / Landmark</label>
            <div className="input-wrapper">
              <MapPin size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g. Near Central Park, 5th Avenue" 
                required 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
              <AlignLeft size={18} className="input-icon" style={{ top: '14px' }} />
              <textarea 
                placeholder="Provide detailed information about the issue..." 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="input-group">
            <label>Attach Photo (Optional)</label>
            <div className="input-wrapper">
              <ImageIcon size={18} className="input-icon" />
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files[0])}
                style={{ paddingLeft: '42px', paddingTop: '10px' }}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
            ) : (
              'Submit Complaint'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
