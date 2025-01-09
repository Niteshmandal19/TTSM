import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Upload } from 'lucide-react';
import axios from 'axios';
import './CreateTicketModal.css'

const defaultOptions = {
  projects: [
    { value: 'SUP', label: 'Support (SUP)' },
    { value: 'ITN', label: 'IT Network' },
    { value: 'IH2.0', label: 'Internal Helpdesk 2.0' },
    { value: 'SIIE', label: 'Systems Integration' }
  ],
  issueTypes: [
    { value: 'Incident', label: 'System Incident' },
    { value: 'Bug', label: 'Technical Bug' },
    { value: 'FeatureRequest', label: 'Feature Request' },
    { value: 'Support', label: 'General Support' }
  ],
  requestTypes: [
    { value: 'CriticalBug', label: 'Critical Bug' },
    { value: 'UIBug', label: 'User Interface Bug' },
    { value: 'NewModule', label: 'New Module Request' },
    { value: 'LoginHelp', label: 'Authentication Support' }
  ],
  priorities: [
    { value: 'Urgent', label: '🔴 Urgent' },
    { value: 'High', label: '🟠 High' },
    { value: 'Medium', label: '🟡 Medium' },
    { value: 'Low', label: '🟢 Low' }
  ],
};

const CreateTicketModal = ({
  isOpen = false,
  onClose = () => { },
  options = defaultOptions,
  onSubmit = () => { },
  showSuccessMessage = false,
  currentUserId = null
}) => {
  const [formData, setFormData] = useState({
    project: '',
    issueType: '',
    requestType: '',
    title: '',
    description: '',
    assignee: '',
    priority: '',
    attachment: null,
    attachmentOriginalName: '',
    attachmentMimeType: ''
  });

  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);
  const [assigneeError, setAssigneeError] = useState('');

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingAssignees(true);
      setAssigneeError('');

      try {
        const response = await axios.get('http://localhost:3000/api/users/assignee', {
        });

        // Check if response.data.users exists and is an array
        // const formattedUsers = Array.isArray(response.data.users)
        //   ? response.data.users.map((user) => ({
        //     value: user.id,
        //     label: `${user.first_name} ${user.last_name}`,
        //   }))
        //   : [];
        const formattedUsers = response.data.users?.map((user) => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name}`,
        })) || [];


        setAssignees(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAssigneeError('Failed to load assignees');
      } finally {
        setLoadingAssignees(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);


  // Merge provided options with default options, but use fetched assignees
  const mergedOptions = {
    ...options,
    projects: options.projects || defaultOptions.projects,
    issueTypes: options.issueTypes || defaultOptions.issueTypes,
    requestTypes: options.requestTypes || defaultOptions.requestTypes,
    priorities: options.priorities || defaultOptions.priorities,
    // Use the fetched assignees instead of the default ones
    assignees: assignees
  };

  // Rest of the component remains the same, but update the assignee dropdown render:

  // Previous handlers remain the same
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024;

      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 10MB limit');
        return;
      }

      setFormData(prev => ({
        ...prev,
        attachment: file,
        attachmentOriginalName: file.name,
        attachmentMimeType: file.type
      }));
      setFileError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['project', 'issueType', 'title', 'description', 'priority'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'attachment' && value instanceof File) {
            submissionData.append(key, value);
          } else {
            submissionData.append(key, value);
          }
        }
      });

      if (currentUserId) {
        submissionData.append('created_by', currentUserId);
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/api/tickets/create-ticket',
          submissionData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        onClose();
        onSubmit(response.data);
        alert('Ticket created successfully');
      } catch (error) {
        console.error('Ticket creation failed:', error.response?.data || error.message);
        alert(
          error.response?.data?.message ||
          'Failed to create ticket. Please try again.'
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Incident</h2>
          <p className="modal-description">
            Fill out the details for your new service ticket
          </p>
        </div>

        {showSuccessMessage && (
          <div className="success-message">
            <CheckCircle className="icon success" />
            <span>Ticket created successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <select
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className={errors.project ? 'error' : ''}
              >
                <option value="">Select Project</option>
                {mergedOptions.projects.map(project => (
                  <option key={project.value} value={project.value}>
                    {project.label}
                  </option>
                ))}
              </select>
              {errors.project && (
                <div className="error-message">
                  <AlertCircle className="icon" /> {errors.project}
                </div>
              )}
            </div>

            <div className="form-group">
              <select
                value={formData.issueType}
                onChange={(e) => handleInputChange('issueType', e.target.value)}
                className={errors.issueType ? 'error' : ''}
              >
                <option value="">Issue Type</option>
                {mergedOptions.issueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.issueType && (
                <div className="error-message">
                  <AlertCircle className="icon" /> {errors.issueType}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Incident Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && (
              <div className="error-message">
                <AlertCircle className="icon" /> {errors.title}
              </div>
            )}
          </div>

          <div className="form-group">
            <textarea
              placeholder="Detailed Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && (
              <div className="error-message">
                <AlertCircle className="icon" /> {errors.description}
              </div>
            )}
          </div>

          <div className="form-grid-three">
            <select
              value={formData.requestType}
              onChange={(e) => handleInputChange('requestType', e.target.value)}
            >
              <option value="">Request Type</option>
              {mergedOptions.requestTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              disabled={loadingAssignees}
            >
              <option value="">
                {loadingAssignees ? 'Loading assignees...' : 'Assignee'}
              </option>
              {mergedOptions.assignees.map(assignee => (
                <option key={assignee.value} value={assignee.value}>
                  {assignee.label}
                </option>
              ))}

            </select>

            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className={errors.priority ? 'error' : ''}
            >
              <option value="">Priority</option>
              {mergedOptions.priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* New attachment upload field */}
          <div className="form-group">
            <div className="file-upload">
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="attachment" className="file-label">
                <Upload className="icon" />
                <span>
                  {formData.attachmentOriginalName
                    ? formData.attachmentOriginalName
                    : 'Upload Attachment (Optional)'}
                </span>
              </label>
            </div>
            {fileError && (
              <div className="error-message">
                <AlertCircle className="icon" /> {fileError}
              </div>
            )}
          </div>

          <div className="button-group">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              <XCircle className="icon" /> Cancel
            </button>
            <button type="submit" className="button primary">
              <CheckCircle className="icon" /> Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;