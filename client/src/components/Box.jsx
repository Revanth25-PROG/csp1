import React from 'react';
import { AlertTriangle, Droplets, Lightbulb, ChevronRight } from 'lucide-react';

function Box() {
  return (
    <div className="phone-mockup">
      <div className="phone-header">
        <h2>Recent Issues</h2>
      </div>
      
      <div className="phone-body">
        
        <div className="complaint-item">
          <div className="complaint-icon" style={{ color: '#ef4444', background: '#fee2e2' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="complaint-text">
            Pothole on Main St.
          </div>
          <ChevronRight size={18} className="chevron-icon" />
        </div>

        <div className="complaint-item">
          <div className="complaint-icon" style={{ color: '#3b82f6', background: '#dbeafe' }}>
            <Droplets size={20} />
          </div>
          <div className="complaint-text">
            Broken Water Pipe
          </div>
          <ChevronRight size={18} className="chevron-icon" />
        </div>

        <div className="complaint-item">
          <div className="complaint-icon" style={{ color: '#f59e0b', background: '#fef3c7' }}>
            <Lightbulb size={20} />
          </div>
          <div className="complaint-text">
            Streetlight Out
          </div>
          <ChevronRight size={18} className="chevron-icon" />
        </div>
        
        {/* Placeholder skeleton rows to show scrolling capability */}
        <div className="complaint-item" style={{ opacity: 0.6 }}>
          <div className="complaint-icon" style={{ background: '#e2e8f0' }}></div>
          <div className="complaint-text" style={{ background: '#e2e8f0', height: '14px', borderRadius: '4px', width: '60%' }}></div>
        </div>
        
        <div className="complaint-item" style={{ opacity: 0.3 }}>
          <div className="complaint-icon" style={{ background: '#e2e8f0' }}></div>
          <div className="complaint-text" style={{ background: '#e2e8f0', height: '14px', borderRadius: '4px', width: '40%' }}></div>
        </div>

      </div>
    </div>
  );
}

export default Box;