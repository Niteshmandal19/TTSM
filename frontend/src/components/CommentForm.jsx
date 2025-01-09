// import React, { useState, useRef } from 'react';
// import { MessageCircle, Paperclip, X, File as FileIcon } from 'lucide-react';
// import axios from 'axios';

// const defaultFormData = {
//   content: '',
//   type: 'open',
//   attachment: null,
//   attachmentOriginalName: '',
//   attachmentMimeType: ''
// };

// const CommentForm = ({ ticketId, onCommentAdded }) => {
//   const [formData, setFormData] = useState(defaultFormData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fileError, setFileError] = useState('');
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: undefined
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const MAX_FILE_SIZE = 10 * 1024 * 1024;

//       if (file.size > MAX_FILE_SIZE) {
//         setFileError('File size exceeds 10MB limit');
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         attachment: file,
//         attachmentOriginalName: file.name,
//         attachmentMimeType: file.type
//       }));
//       setFileError('');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.type || !['open', 'internal'].includes(formData.type)) {
//       newErrors.type = 'Comment type is required';
//     }

//     if (!formData.attachment && (!formData.content || formData.content.trim().length === 0)) {
//       newErrors.content = 'Comment or attachment is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const submissionData = new FormData();
//       submissionData.append('type', formData.type); // Always include type
      
//       if (formData.content && formData.content.trim()) {
//         submissionData.append('content', formData.content.trim());
//       }

//       if (formData.attachment instanceof File) {
//         submissionData.append('attachment', formData.attachment);
//       }

//       const response = await axios.post(
//         `http://localhost:3000/api/tickets/create-comments/${ticketId}`,
//         submissionData,
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             // Remove Content-Type header to let browser set it with boundary for FormData
//           }
//         }
//       );

//       setFormData(defaultFormData);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }

//       if (onCommentAdded) {
//         onCommentAdded(response.data);
//       }
//     } catch (error) {
//       console.error('Comment creation failed:', error.response?.data || error.message);
//       alert(
//         error.response?.data?.message ||
//         'Failed to create comment. Please try again.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="comment-form">
//       <div className="comment-type-buttons">
//         <button
//           type="button"
//           onClick={() => handleInputChange('type', 'internal')}
//           className={`type-button ${formData.type === 'internal' ? 'internal-active' : ''}`}
//         >
//           Internal Note
//         </button>
//         <button
//           type="button"
//           onClick={() => handleInputChange('type', 'open')}
//           className={`type-button ${formData.type === 'open' ? 'open-active' : ''}`}
//         >
//           Open Comment
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="comment-form-content">
//         <div className="form-group">
//           <textarea
//             value={formData.content}
//             onChange={(e) => handleInputChange('content', e.target.value)}
//             className={`comment-textarea ${errors.content ? 'error' : ''}`}
//             placeholder="Add a comment... (Press M to focus)"
//             rows="3"
//           />
//           {errors.content && <span className="error-message">{errors.content}</span>}
//         </div>

//         <div className="form-actions">
//           {formData.attachment ? (
//             <div className="selected-file">
//               <FileIcon className="file-icon" />
//               <span className="file-name">{formData.attachmentOriginalName}</span>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData(prev => ({
//                     ...prev,
//                     attachment: null,
//                     attachmentOriginalName: '',
//                     attachmentMimeType: ''
//                   }));
//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                   }
//                 }}
//                 className="remove-file-button"
//               >
//                 <X />
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="attach-button"
//             >
//               <Paperclip />
//               <span>Attach File</span>
//             </button>
//           )}
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden-file-input"
//           />
          
//           {fileError && <div className="error-message">{fileError}</div>}
//           {errors.type && <div className="error-message">{errors.type}</div>}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
//           >
//             {isSubmitting ? 'Adding...' : 'Add Comment'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CommentForm;










// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX










// import React, { useState, useRef } from 'react';
// import { MessageCircle, Paperclip, X, File as FileIcon } from 'lucide-react';
// import axios from 'axios';
// import './CommentForm.css'

// const defaultFormData = {
//   content: '',
//   type: 'open',
//   attachment: null,
//   attachmentOriginalName: '',
//   attachmentMimeType: ''
// };

// const CommentForm = ({ ticketId, onCommentAdded, disabled = false }) => {
//   const [formData, setFormData] = useState(defaultFormData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fileError, setFileError] = useState('');
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: undefined
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const MAX_FILE_SIZE = 10 * 1024 * 1024;

//       if (file.size > MAX_FILE_SIZE) {
//         setFileError('File size exceeds 10MB limit');
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         attachment: file,
//         attachmentOriginalName: file.name,
//         attachmentMimeType: file.type
//       }));
//       setFileError('');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.type || !['open', 'internal'].includes(formData.type)) {
//       newErrors.type = 'Comment type is required';
//     }

//     if (!formData.attachment && (!formData.content || formData.content.trim().length === 0)) {
//       newErrors.content = 'Comment or attachment is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       const submissionData = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== '') {
//           if (key === 'attachment' && value instanceof File) {
//             submissionData.append(key, value);
//           } else {
//             submissionData.append(key, value);
//           }
//         }
//       });
    
//     setIsSubmitting(true);

//     try {
//       // const submissionData = new FormData();
//       // submissionData.append('type', formData.type);
      
//       // if (formData.content && formData.content.trim()) {
//       //   submissionData.append('content', formData.content.trim());
//       // }

//       if (formData.attachment instanceof File) {
//         submissionData.append('attachment', formData.attachment);
//       }

//       const response = await axios.post(
//         `http://localhost:3000/api/tickets/create-comments/${ticketId}`,
//         submissionData,
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       setFormData(defaultFormData);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }

//       if (onCommentAdded) {
//         onCommentAdded(response.data);
//       }
//     } catch (error) {
//       console.error('Comment creation failed:', error.response?.data || error.message);
//       alert(
//         error.response?.data?.message ||
//         'Failed to create comment. Please try again.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   };

//   return (
//     <div className="comment-form">
//       <div className="comment-type-buttons">
//         <button
//           type="button"
//           onClick={() => handleInputChange('type', 'internal')}
//           className={`type-button ${formData.type === 'internal' ? 'internal-active' : ''}`}
//           disabled={disabled}
//         >
//           Internal Note
//         </button>
//         <button
//           type="button"
//           onClick={() => handleInputChange('type', 'open')}
//           className={`type-button ${formData.type === 'open' ? 'open-active' : ''}`}
//           disabled={disabled}
//         >
//           Open Comment
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="comment-form-content">
//         <div className="form-group">
//           <textarea
//             value={formData.content}
//             onChange={(e) => handleInputChange('content', e.target.value)}
//             className={`comment-textarea ${errors.content ? 'error' : ''}`}
//             placeholder="Add a comment... (Press M to focus)"
//             rows="3"
//             disabled={disabled}
//           />
//           {errors.content && <span className="error-message">{errors.content}</span>}
//         </div>

//         <div className="form-actions">
//           {formData.attachment ? (
//             <div className="selected-file">
//               <FileIcon className="file-icon" />
//               <span className="file-name">{formData.attachmentOriginalName}</span>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData(prev => ({
//                     ...prev,
//                     attachment: null,
//                     attachmentOriginalName: '',
//                     attachmentMimeType: ''
//                   }));
//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                   }
//                 }}
//                 className="remove-file-button"
//                 disabled={disabled}
//               >
//                 <X />
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="attach-button"
//               disabled={disabled}
//             >
//               <Paperclip />
//               <span>Attach File</span>
//             </button>
//           )}
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden-file-input"
//             disabled={disabled}
//           />
          
//           {fileError && <div className="error-message">{fileError}</div>}
//           {errors.type && <div className="error-message">{errors.type}</div>}

//           <button
//             type="submit"
//             disabled={isSubmitting || disabled}
//             className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
//           >
//             {isSubmitting ? 'Adding...' : 'Add Comment'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CommentForm;




import React, { useState, useRef } from 'react';
import { MessageCircle, Paperclip, X, File as FileIcon } from 'lucide-react';
import axios from 'axios';
import './CommentForm.css';

const defaultFormData = {
  content: '',
  type: 'open',
  attachment: null,
  attachmentOriginalName: '',
  attachmentMimeType: ''
};

const CommentForm = ({ 
  ticketId, 
  onCommentAdded, 
  disabled = false,
  currentUserId = null 
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

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
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    if (!formData.type || !['open', 'internal'].includes(formData.type)) {
      newErrors.type = 'Comment type is required';
    }

    if (!formData.attachment && (!formData.content || formData.content.trim().length === 0)) {
      newErrors.content = 'Comment or attachment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      const submissionData = new FormData();

      // Add all form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'attachment' && value instanceof File) {
            submissionData.append(key, value);
          } else if (key === 'content') {
            submissionData.append(key, value.trim());
          } else {
            submissionData.append(key, value);
          }
        }
      });

      // Add currentUserId if available
      if (currentUserId) {
        submissionData.append('created_by', currentUserId);
      }

      try {
        const response = await axios.post(
          `http://localhost:3000/api/tickets/create-comments/${ticketId}`,
          submissionData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Reset form
        setFormData(defaultFormData);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Notify parent component
        if (onCommentAdded) {
          onCommentAdded(response.data);
        }
      } catch (error) {
        console.error('Comment creation failed:', error.response?.data || error.message);
        alert(
          error.response?.data?.message ||
          'Failed to create comment. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          disabled={disabled || isSubmitting}
          className={errors.type ? 'error' : ''}
        >
          <option value="open">Open Comment</option>
          <option value="internal">Internal Note</option>
        </select>
        {errors.type && <span className="error-message">{errors.type}</span>}
      </div>

      <div className="form-group">
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Add a comment..."
          disabled={disabled || isSubmitting}
          className={errors.content ? 'error' : ''}
        />
        {errors.content && <span className="error-message">{errors.content}</span>}
      </div>

      <div className="form-group">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled || isSubmitting}
          style={{ display: 'none' }}
        />
        
        <div className="file-upload-section">
          {formData.attachment ? (
            <div className="file-preview">
              <FileIcon size={16} />
              <span>{formData.attachmentOriginalName}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    attachment: null,
                    attachmentOriginalName: '',
                    attachmentMimeType: ''
                  }));
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={disabled || isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isSubmitting}
              className="attach-button"
            >
              <Paperclip size={16} />
              Attach File
            </button>
          )}
          {fileError && <span className="error-message">{fileError}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="submit-button"
      >
        <MessageCircle size={16} />
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;