import React from 'react';
import './IncidentDetails.css';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Briefcase, 
  Tag, 
  CheckCircle, 
  Calendar, 
  MessageSquare,
  X 
} from 'lucide-react';

const IncidentDetails = ({ incident, onClose }) => {
  if (!incident) return null;

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return <AlertTriangle className="text-red-500 w-6 h-6" />;
      case 'High': return <AlertTriangle className="text-orange-500 w-6 h-6" />;
      case 'Medium': return <Clock className="text-yellow-500 w-6 h-6" />;
      default: return <CheckCircle className="text-green-500 w-6 h-6" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-yellow-100 text-yellow-600';
      case 'Resolved': return 'bg-blue-100 text-blue-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="incident-details-container">
      <div className="incident-details-header">
        <div>
          <h2 className="incident-title">{incident.title}</h2>
          <p className="incident-number">Incident #{incident.id}</p>
        </div>
        <button 
          onClick={onClose} 
          className="close-button"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="incident-details-grid">
        <div className="incident-details-column">
          <div className="incident-detail-item">
            <Briefcase className="detail-icon" />
            <span className="detail-label">Project:</span>
            <span>{incident.project}</span>
          </div>
          <div className="incident-detail-item">
            <Tag className="detail-icon" />
            <span className="detail-label">Issue Type:</span>
            <span>{incident.issueType}</span>
          </div>
          <div className="incident-detail-item">
            <User className="detail-icon" />
            <span className="detail-label">Assignee:</span>
            <span>{incident.assignedTo?.first_name} {incident.assignedTo?.last_name}</span>
          </div>
        </div>
            
        <div className="incident-details-column">
          <div className="incident-detail-item">
            <div className="flex items-center space-x-2">
              {getPriorityIcon(incident.priority)}
              <span className="detail-label">Priority:</span>
              <span className={`priority-badge ${getPriorityClass(incident.priority)}`}>
                {incident.priority}
              </span>
            </div>
          </div>
          <div className="incident-detail-item">
            <CheckCircle className="detail-icon" />
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${getStatusClass(incident.status)}`}>
              {incident.status}
            </span>
          </div>
          <div className="incident-detail-item">
            <Calendar className="detail-icon" />
            <span className="detail-label">Created:</span>
            <span>{incident.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="incident-description-section">
        <div className="section-header">
          <MessageSquare className="detail-icon" />
          <h3 className="section-title">Description</h3>
        </div>
        <p className="description-text">{incident.description || 'No description provided.'}</p>
      </div>

      {incident.comments && incident.comments.length > 0 && (
        <div className="comments-section">
          <div className="section-header">
            <MessageSquare className="detail-icon" />
            <h3 className="section-title">Comments ({incident.comments.length})</h3>
          </div>
          <div className="comments-list">
            {incident.comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-timestamp">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetails;
