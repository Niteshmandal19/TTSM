// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { MessageCircle, Clock, History, Paperclip, Download, File, Image } from 'lucide-react';
// import { X } from 'lucide-react';
// import axios from 'axios';
// import './CompleteTicket.css';

// const CompleteTicket = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [commentType, setCommentType] = useState('open');
//   const [newComment, setNewComment] = useState('');
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editedContent, setEditedContent] = useState('');
//   const [currentUserOrg, setCurrentUserOrg] = useState(null);
//   const [attachmentPreview, setAttachmentPreview] = useState(null);

//   const isImageFile = (filename) => {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
//     const extension = filename?.split('.').pop()?.toLowerCase();
//     return imageExtensions.includes(extension);
//   };



//   const CommentForm = () => {
//     const [newComment, setNewComment] = useState('');
//     const [commentType, setCommentType] = useState('open');
//     const [selectedFile, setSelectedFile] = useState(null);
//     const fileInputRef = useRef(null);

//     const handleFileSelect = (event) => {
//       const file = event.target.files[0];
//       setSelectedFile(file);
//     };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!newComment.trim() && !selectedFile) return;

//       const formData = new FormData();
//       formData.append('content', newComment);
//       formData.append('type', commentType);
//       if (selectedFile) {
//         formData.append('attachment', selectedFile);
//       }

//       try {
//         const token = localStorage.getItem('token');
//         await axios.post(
//           `http://localhost:3000/api/tickets/create-comments/${id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );

//         setNewComment('');
//         setSelectedFile(null);
//         fetchTicketData();
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         alert(error.response?.data?.message || 'Failed to add comment');
//       }
//     };

//     return (
//       <div className="comment-form">
//         <div className="comment-type-container">
//           <button
//             onClick={() => setCommentType('internal')}
//             className={`comment-type-button ${commentType === 'internal' ? 'internal' : ''}`}
//           >
//             Internal Note
//           </button>
//           <button
//             onClick={() => setCommentType('open')}
//             className={`comment-type-button ${commentType === 'open' ? 'open' : ''}`}
//           >
//             Open Comment
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="comment-input"
//             placeholder="Add a comment... (Press M to focus)"
//             rows="3"
//           />

//           <div className="attachment-section">
//             {selectedFile ? (
//               <div className="selected-file">
//                 <File className="file-icon" size={16} />
//                 <span>{selectedFile.name}</span>
//                 <button
//                   type="button"
//                   onClick={() => setSelectedFile(null)}
//                   className="remove-file"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="attach-button"
//               >
//                 <Paperclip size={16} />
//                 Attach File
//               </button>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileSelect}
//               style={{ display: 'none' }}
//             />
//           </div>

//           <button type="submit" className="submit-button">
//             Add Comment
//           </button>
//         </form>
//       </div>
//     );
//   };

//   const CommentCard = ({ comment }) => {
//     const isImageFile = (filename) => {
//       const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
//       const extension = filename?.split('.').pop()?.toLowerCase();
//       return imageExtensions.includes(extension);
//     };




//     const StatusChangeComment = ({ content, timestamp, user }) => {
//       // Parse the content which contains the status information
//       let statusData;
//       try {
//         statusData = JSON.parse(content);
//       } catch (error) {
//         console.error('Error parsing status change content:', error);
//         return null; // Return null if parsing fails
//       }

//       const { oldStatus, newStatus } = statusData;

//       // Function to get CSS class name from status
//       const getStatusClassName = (status) => {
//         return status ? status.toLowerCase().replace(' ', '-') : '';
//       };

//       return (
//         <div className="status-change">
//           <span className={`status-badge ${getStatusClassName(oldStatus)}`}>
//             {oldStatus}
//           </span>
//           <span className="status-arrow">→</span>
//           <span className={`status-badge ${getStatusClassName(newStatus)}`}>
//             {newStatus}
//           </span>
//           <span className="user-info">by {user}</span>
//           <span className="timestamp">
//             {new Date(timestamp).toLocaleString()}
//           </span>
//         </div>
//       );
//     };



//     // const fetchTicketData = async () => {
//     //   try {
//     //     setLoading(true);
//     //     const token = localStorage.getItem('token');

//     //     const userData = JSON.parse(localStorage.getItem('user'));
//     //     setCurrentUserOrg(userData?.organization_id);

//     //     const ticketResponse = await axios.get(
//     //       `http://localhost:3000/api/tickets/complete-incidents/${id}`,
//     //       { headers: { Authorization: `Bearer ${token}` } }
//     //     );
//     //     const commentsResponse = await axios.get(
//     //       `http://localhost:3000/api/tickets/comments/${id}`,
//     //       { headers: { Authorization: `Bearer ${token}` } }
//     //     );

//     //     // If there's an attachment and it's an image, fetch the preview
//     //     if (ticketResponse.data.attachment && isImageFile(ticketResponse.data.attachmentOriginalName)) {
//     //       const attachmentResponse = await axios.get(
//     //         `http://localhost:3000/api/tickets/download-attachment/${id}`,
//     //         {
//     //           headers: { Authorization: `Bearer ${token}` },
//     //           responseType: 'blob'
//     //         }
//     //       );
//     //       const previewUrl = URL.createObjectURL(attachmentResponse.data);
//     //       setAttachmentPreview(previewUrl);
//     //     }

//     //     setTicket(ticketResponse.data);

//     //     const sortedComments = commentsResponse.data
//     //       .filter(comment => {
//     //         if (comment.type === 'internal') {
//     //           return currentUserOrg === 'IBDIC';
//     //         }
//     //         return true;
//     //       })
//     //       .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//     //     setComments(sortedComments);
//     //   } catch (error) {
//     //     console.error('Error fetching data:', error);
//     //     if (error.response?.status === 401) {
//     //       navigate('/incidents');
//     //     }
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // };


//     const fetchTicketData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');

//         const userData = JSON.parse(localStorage.getItem('user'));
//         setCurrentUserOrg(userData?.organization_id);

//         // Only fetch the ticket data - remove the separate comments fetch
//         const ticketResponse = await axios.get(
//           `http://localhost:3000/api/tickets/complete-incidents/${id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Handle attachment preview if needed
//         if (ticketResponse.data.attachment && isImageFile(ticketResponse.data.attachmentOriginalName)) {
//           const attachmentResponse = await axios.get(
//             `http://localhost:3000/api/tickets/download-attachment/${id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//               responseType: 'blob'
//             }
//           );
//           const previewUrl = URL.createObjectURL(attachmentResponse.data);
//           setAttachmentPreview(previewUrl);
//         }

//         setTicket(ticketResponse.data);

//         // Get comments from the ticket data instead
//         const sortedComments = ticketResponse.data.comments
//           .filter(comment => {
//             if (comment.type === 'internal') {
//               return currentUserOrg === 'IBDIC';
//             }
//             return true;
//           })
//           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//         setComments(sortedComments);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         if (error.response?.status === 401) {
//           navigate('/incidents');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };


//     const AttachmentSection = () => {
//       if (!ticket?.attachment) return null;

//       const isImage = isImageFile(ticket.attachmentOriginalName);

//       return (
//         <div className="attachments-section">
//           <h3 className="attachments-title">
//             <Paperclip className="inline-icon" />
//             Attachment
//           </h3>
//           <div className="attachment-card">
//             <div className="attachment-icon">
//               {isImage ? <Image size={24} /> : <File size={24} />}
//             </div>
//             <div className="attachment-details">
//               <span className="attachment-name">
//                 {ticket.attachmentOriginalName || 'Attachment'}
//               </span>
//             </div>
//             <button
//               className="download-button"
//               onClick={handleDownloadAttachment}
//             >
//               <Download size={16} />
//             </button>
//           </div>
//           {isImage && attachmentPreview && (
//             <div className="attachment-preview">
//               <img
//                 src={attachmentPreview}
//                 alt={ticket.attachmentOriginalName}
//                 className="attachment-image"
//               />
//             </div>
//           )}
//         </div>
//       );
//     };



//     useEffect(() => {
//       return () => {
//         if (attachmentPreview) {
//           URL.revokeObjectURL(attachmentPreview);
//         }
//       };
//     }, [attachmentPreview]);


//     const handleDownloadAttachment = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(
//           `http://localhost:3000/api/tickets/download-attachment/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: 'blob'
//           }
//         );

//         // Create blob URL
//         const blob = new Blob([response.data], {
//           type: response.headers['content-type']
//         });
//         const url = window.URL.createObjectURL(blob);

//         // Create temporary link and trigger download
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = ticket.attachmentOriginalName || 'download';
//         document.body.appendChild(link);
//         link.click();

//         // Cleanup
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error('Error downloading attachment:', error);
//         alert('Failed to download attachment: ' + (error.response?.data?.message || error.message));
//       }
//     };



//     const handleStatusChange = async (newStatus) => {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.put(
//           `/api/tickets/update-status/${id}`,
//           { status: newStatus },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         fetchTicketData();
//       } catch (error) {
//         console.error('Error updating status:', error);
//         alert(error.response?.data?.message || 'Failed to update status');
//       }
//     };



//     const handleAddComment = async (e) => {
//       e.preventDefault();
//       if (!newComment.trim()) return;

//       try {
//         const token = localStorage.getItem('token');
//         await axios.post(
//           `/api/tickets/create-comments/${id}`,
//           {
//             content: newComment,
//             type: commentType
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setNewComment('');
//         fetchTicketData();
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         alert(error.response?.data?.message || 'Failed to add comment');
//       }
//     };

//     useEffect(() => {
//       fetchTicketData();
//     }, [id]);

//     useEffect(() => {
//       const handleKeyPress = (e) => {
//         if (e.key === 'm' || e.key === 'M') {
//           document.getElementById('commentInput')?.focus();
//         }
//       };

//       document.addEventListener('keydown', handleKeyPress);
//       return () => document.removeEventListener('keydown', handleKeyPress);
//     }, []);

//     const handleEditComment = async (commentId, newContent) => {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.put(
//           `/api/tickets/comments/${commentId}`,
//           { content: newContent },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setEditingCommentId(null);
//         setEditedContent('');
//         fetchTicketData();
//       } catch (error) {
//         console.error('Error updating comment:', error);
//         alert(error.response?.data?.message || 'Failed to update comment');
//       }
//     };

//     const handleDeleteComment = async (commentId) => {
//       if (!window.confirm('Are you sure you want to delete this comment?')) {
//         return;
//       }

//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`/api/tickets/comments/${commentId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         fetchTicketData();
//       } catch (error) {
//         console.error('Error deleting comment:', error);
//         alert(error.response?.data?.message || 'Failed to delete comment');
//       }
//     };



//     return (
//       <div className="container">
//         {/* Ticket Details Section */}
//         <section className="ticket-section">
//           <div className="ticket-header">
//             <h1 className="ticket-title">{ticket?.title}</h1>
//             <select
//               value={ticket?.status}
//               onChange={(e) => handleStatusChange(e.target.value)}
//               className="status-select"
//             >
//               <option value="Open">Open</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Closed">Closed</option>
//               <option value="On Hold">On Hold</option>
//             </select>
//           </div>

//           <p className="ticket-description">{ticket?.description}</p>


//           <div className="details-grid">
//             <div className="detail-item">
//               {[
//                 { label: 'Project', value: ticket?.project },
//                 { label: 'Issue Type', value: ticket?.issueType },
//                 { label: 'Priority', value: ticket?.priority }
//               ].map(({ label, value }) => (
//                 <div key={label} className="detail-row">
//                   <span className="detail-label">{label}:</span>
//                   <span>{value}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="detail-item">
//               {[
//                 {
//                   label: 'Created By',
//                   value: `${ticket?.creator?.first_name} ${ticket?.creator?.last_name}`
//                 },
//                 {
//                   label: 'Assigned To',
//                   value: `${ticket?.assignedTo?.first_name} ${ticket?.assignedTo?.last_name}`
//                 }
//               ].map(({ label, value }) => (
//                 <div key={label} className="detail-row">
//                   <span className="detail-label">{label}:</span>
//                   <span>{value}</span>
//                 </div>
//               ))}
//             </div>

//           </div>
//           {/* Attachment Section */}
//           <AttachmentSection />
//         </section>

//         {/* Activity Section */}
//         <section className="activity-section">
//           <div className="tab-container">
//             {[
//               { id: 'all', label: 'All' },
//               { id: 'comments', icon: MessageCircle },
//               { id: 'history', icon: History },
//               { id: 'worklog', icon: Clock }
//             ].map(({ id, label, icon: Icon }) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveTab(id)}
//                 className={`tab ${activeTab === id ? 'active' : ''}`}
//               >
//                 {label || <Icon className="icon" />}
//               </button>
//             ))}
//           </div>

//           <div className="comment-form">
//             <div className="comment-type-container">
//               {[
//                 { type: 'internal', label: 'Internal Note' },
//                 { type: 'open', label: 'Open Comment' }
//               ].map(({ type, label }) => (
//                 <button
//                   key={type}
//                   onClick={() => setCommentType(type)}
//                   className={`comment-type-button ${commentType === type ? type : ''
//                     }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//             <form onSubmit={handleAddComment}>
//               <textarea
//                 id="commentInput"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className="comment-input"
//                 placeholder="Add a comment... (Press M to focus)"
//                 rows="3"
//               />
//               <button type="submit" className="submit-button">
//                 Add Comment
//               </button>
//             </form>
//           </div>



//           <div className="timeline">
//             {comments.map((comment) => {
//               if (comment.type === 'status_change') {
//                 return (
//                   <div key={comment.id} className="comment-card system">
//                     <StatusChangeComment
//                       content={comment.content}
//                       timestamp={comment.created_at}
//                       user={`${comment.user?.first_name} ${comment.user?.last_name}`}
//                     />
//                   </div>
//                 );
//               }

//               return (
//                 <div
//                   key={comment.id}
//                   className={`comment-card ${comment.type} ${comment.type === 'internal' ? 'internal-comment' : ''
//                     }`}
//                 >
//                   <div className="comment-header">
//                     {comment.type === 'internal' && (
//                       <div className="internal-badge">Internal Note</div>
//                     )}
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       className="avatar"
//                       fill="currentColor"
//                     >
//                       <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.41 0-8 3.59-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.41-3.59-8-8-8z" />
//                     </svg>

//                     <div>
//                       <div className="user-info">
//                         {comment.user?.first_name} {comment.user?.last_name}
//                       </div>
//                       <div className="timestamp">
//                         {new Date(comment.created_at).toLocaleDateString('en-GB', {
//                           day: '2-digit',
//                           month: 'long',
//                           year: 'numeric',
//                         })}{' '}
//                         {new Date(comment.created_at).toLocaleTimeString('en-US')}
//                       </div>
//                     </div>
//                   </div>

//                   <p className="comment-content">{comment.content}</p>
//                   {comment.type !== 'system' && (
//                     <div className="comment-actions">
//                       {editingCommentId === comment.id ? (
//                         <div className="edit-comment-form">
//                           <textarea
//                             value={editedContent}
//                             onChange={(e) => setEditedContent(e.target.value)}
//                             className="comment-input"
//                             rows="3"
//                           />
//                           <div className="edit-buttons">
//                             <button
//                               className="save-button"
//                               onClick={() => handleEditComment(comment.id, editedContent)}
//                             >
//                               Save
//                             </button>
//                             <button
//                               className="cancel-button"
//                               onClick={() => {
//                                 setEditingCommentId(null);
//                                 setEditedContent('');
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <button
//                             className="edit-button"
//                             onClick={() => {
//                               setEditingCommentId(comment.id);
//                               setEditedContent(comment.content);
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="delete-button"
//                             onClick={() => handleDeleteComment(comment.id)}
//                           >
//                             Delete
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   )}
//                   {comment.attachment && (
//                     <div className="comment-attachment">
//                       <div className="attachment-preview">
//                         {isImageFile(comment.attachmentOriginalName) ? (
//                           <img
//                             src={`/api/comments/${comment.id}/attachment`}
//                             alt={comment.attachmentOriginalName}
//                             className="attachment-image"
//                           />
//                         ) : (
//                           <div className="file-icon-container">
//                             <File size={24} />
//                             <span>{comment.attachmentOriginalName}</span>
//                           </div>
//                         )}
//                       </div>
//                       <button
//                         onClick={() => window.open(`/api/comments/${comment.id}/attachment`, '_blank')}
//                         className="download-button"
//                       >
//                         <Download size={16} />
//                         Download
//                       </button>
//                     </div>
//                   )}

//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </div>
//     );
//   };
// };

//   export default CompleteTicket;


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX












import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, History, Paperclip, Download, File, Image } from 'lucide-react';
import axios from 'axios';
import CommentForm from './CommentForm';  // New import
import Comment from './Comment';  // New import
import './CompleteTicket.css';

const CompleteTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [currentUserOrg, setCurrentUserOrg] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  }; 

  const getUserOrganization = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = parseJwt(token);
      return payload?.role;
    } catch (err) {
      console.error('Error getting user role:', err);
      return null;
    }
  };

  const userOrg = getUserOrganization();

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const userData = JSON.parse(localStorage.getItem('user'));
      setCurrentUserOrg(userData?.organization_id);

      const ticketResponse = await axios.get(
        `http://localhost:3000/api/tickets/complete-incidents/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (ticketResponse.data.attachment && isImageFile(ticketResponse.data.attachmentOriginalName)) {
        const attachmentResponse = await axios.get(
          `http://localhost:3000/api/tickets/download-attachment/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
          }
        );
        const previewUrl = URL.createObjectURL(attachmentResponse.data);
        setAttachmentPreview(previewUrl);
      }

      setTicket(ticketResponse.data);

      const sortedComments = ticketResponse.data.comments
        .filter(comment => {
          if (comment.type === 'internal') {
            return currentUserOrg === 'IBDIC';
          }
          return true;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setComments(sortedComments);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/incidents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/tickets/comments/${commentId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTicketData();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/tickets/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTicketData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (currentUserOrg !== 'IBDIC') {
      alert('You do not have permission to change the status.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/tickets/update-status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTicketData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };


  const handleDownloadAttachment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/tickets/download-attachment/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = ticket.attachmentOriginalName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {/* Ticket Details Section */}
      <section className="ticket-section">
        <div className="ticket-header">
          <h1 className="ticket-title">{ticket?.title}</h1>
          { userOrg === "IBDIC" ? (
            <select
              value={ticket?.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-select"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </select>
          ) : (
            <span className="status-view">{ticket?.status}</span>
          )}
        </div>

        <p className="ticket-description">{ticket?.description}</p>

        {/* Ticket Details Grid */}
        <div className="details-grid">
          <div className="detail-item">
            {[
              { label: 'Project', value: ticket?.project },
              { label: 'Issue Type', value: ticket?.issueType },
              { label: 'Priority', value: ticket?.priority }
            ].map(({ label, value }) => (
              <div key={label} className="detail-row">
                <span className="detail-label">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="detail-item">
            {[
              {
                label: 'Created By',
                value: `${ticket?.creator?.first_name} ${ticket?.creator?.last_name}`
              },
              {
                label: 'Assigned To',
                value: `${ticket?.assignedTo?.first_name} ${ticket?.assignedTo?.last_name}`
              }
            ].map(({ label, value }) => (
              <div key={label} className="detail-row">
                <span className="detail-label">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attachment Section */}
        {ticket?.attachment && (
          <div className="attachments-section">
            <h3 className="attachments-title">
              <Paperclip className="inline-icon" />
              Attachment
            </h3>
            <div className="attachment-card">
              <div className="attachment-icon">
                {isImageFile(ticket.attachmentOriginalName) ? (
                  <Image size={24} />
                ) : (
                  <File size={24} />
                )}
              </div>
              <div className="attachment-details">
                <span className="attachment-name">
                  {ticket.attachmentOriginalName || 'Attachment'}
                </span>
              </div>
              <button
                className="download-button"
                onClick={handleDownloadAttachment}
              >
                <Download size={16} />
              </button>
            </div>
            {isImageFile(ticket.attachmentOriginalName) && attachmentPreview && (
              <div className="attachment-preview">
                <img
                  src={attachmentPreview}
                  alt={ticket.attachmentOriginalName}
                  className="attachment-image"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Activity Section */}
      <section className="activity-section">
        <div className="tab-container">
          {[
            { id: 'all', label: 'All' },
            { id: 'comments', icon: MessageCircle },
            { id: 'history', icon: History },
            { id: 'worklog', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`tab ${activeTab === id ? 'active' : ''}`}
            >
              {label || <Icon className="icon" />}
            </button>
          ))}
        </div>

        {/* New Comment Form Component */}
        <CommentForm
          ticketId={id}
          onCommentAdded={fetchTicketData}
        />

        {/* Comments Timeline */}
        <div className="comments-timeline">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUserOrg={currentUserOrg}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CompleteTicket;

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX




// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { MessageCircle, Clock, History, Paperclip, Download, File, Image, X } from 'lucide-react';
// import axios from 'axios';
// import './CompleteTicket.css';

// const CompleteTicket = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [commentType, setCommentType] = useState('open');
//   const [newComment, setNewComment] = useState('');
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editedContent, setEditedContent] = useState('');
//   const [currentUserOrg, setCurrentUserOrg] = useState(null);
//   const [attachmentPreview, setAttachmentPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const isImageFile = (filename) => {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
//     const extension = filename?.split('.').pop()?.toLowerCase();
//     return imageExtensions.includes(extension);
//   };

//   const fetchTicketData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const userData = JSON.parse(localStorage.getItem('user'));
//       setCurrentUserOrg(userData?.organization_id);

//       const ticketResponse = await axios.get(
//         `http://localhost:3000/api/tickets/complete-incidents/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (ticketResponse.data.attachment && isImageFile(ticketResponse.data.attachmentOriginalName)) {
//         const attachmentResponse = await axios.get(
//           `http://localhost:3000/api/tickets/download-attachment/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: 'blob'
//           }
//         );
//         const previewUrl = URL.createObjectURL(attachmentResponse.data);
//         setAttachmentPreview(previewUrl);
//       }

//       setTicket(ticketResponse.data);

//       const sortedComments = ticketResponse.data.comments
//         .filter(comment => {
//           if (comment.type === 'internal') {
//             return currentUserOrg === 'IBDIC';
//           }
//           return true;
//         })
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//       setComments(sortedComments);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       if (error.response?.status === 401) {
//         navigate('/incidents');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadAttachment = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `http://localhost:3000/api/tickets/download-attachment/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: 'blob'
//         }
//       );

//       const blob = new Blob([response.data], {
//         type: response.headers['content-type']
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = ticket.attachmentOriginalName || 'download';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading attachment:', error);
//       alert('Failed to download attachment: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     const formData = new FormData();
//     formData.append('content', newComment);
//     formData.append('type', commentType);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:3000/api/tickets/create-comments/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       setNewComment('');
//       fetchTicketData();
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       alert(error.response?.data?.message || 'Failed to add comment');
//     }
//   };

//   const handleStatusChange = async (newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:3000/api/tickets/update-status/${id}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       fetchTicketData();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       alert(error.response?.data?.message || 'Failed to update status');
//     }
//   };

//   useEffect(() => {
//     fetchTicketData();
//   }, [id]); // Add id to dependency array

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!ticket) {
//     return <div>No ticket found</div>;
//   }

//   return (
//     <div className="container">
//       <section className="ticket-section">
//         <div className="ticket-header">
//           <h1 className="ticket-title">{ticket.title}</h1>
//           <select
//             value={ticket.status}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             className="status-select"
//           >
//             <option value="Open">Open</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Resolved">Resolved</option>
//             <option value="Closed">Closed</option>
//             <option value="On Hold">On Hold</option>
//           </select>
//         </div>

//         <p className="ticket-description">{ticket.description}</p>

//         <div className="details-grid">
//           <div className="detail-item">
//             {[
//               { label: 'Project', value: ticket.project },
//               { label: 'Issue Type', value: ticket.issueType },
//               { label: 'Priority', value: ticket.priority }
//             ].map(({ label, value }) => (
//               <div key={label} className="detail-row">
//                 <span className="detail-label">{label}:</span>
//                 <span>{value}</span>
//               </div>
//             ))}
//           </div>
//           <div className="detail-item">
//             {[
//               {
//                 label: 'Created By',
//                 value: `${ticket.creator?.first_name} ${ticket.creator?.last_name}`
//               },
//               {
//                 label: 'Assigned To',
//                 value: `${ticket.assignedTo?.first_name} ${ticket.assignedTo?.last_name}`
//               }
//             ].map(({ label, value }) => (
//               <div key={label} className="detail-row">
//                 <span className="detail-label">{label}:</span>
//                 <span>{value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {ticket.attachment && (
//           <div className="attachments-section">
//             <h3 className="attachments-title">
//               <Paperclip className="inline-icon" />
//               Attachment
//             </h3>
//             <div className="attachment-card">
//               <div className="attachment-icon">
//                 {isImageFile(ticket.attachmentOriginalName) ? (
//                   <Image size={24} />
//                 ) : (
//                   <File size={24} />
//                 )}
//               </div>
//               <div className="attachment-details">
//                 <span className="attachment-name">
//                   {ticket.attachmentOriginalName || 'Attachment'}
//                 </span>
//               </div>
//               <button
//                 className="download-button"
//                 onClick={handleDownloadAttachment}
//               >
//                 <Download size={16} />
//               </button>
//             </div>
//             {isImageFile(ticket.attachmentOriginalName) && attachmentPreview && (
//               <div className="attachment-preview">
//                 <img
//                   src={attachmentPreview}
//                   alt={ticket.attachmentOriginalName}
//                   className="attachment-image"
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </section>

//       <section className="activity-section">
//         <div className="tab-container">
//           {[
//             { id: 'all', label: 'All' },
//             { id: 'comments', icon: MessageCircle },
//             { id: 'history', icon: History },
//             { id: 'worklog', icon: Clock }
//           ].map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`tab ${activeTab === id ? 'active' : ''}`}
//             >
//               {label || <Icon className="icon" />}
//             </button>
//           ))}
//         </div>

//         <form onSubmit={handleAddComment} className="comment-form">
//           <div className="comment-type-container">
//             <button
//               type="button"
//               onClick={() => setCommentType('internal')}
//               className={`comment-type-button ${commentType === 'internal' ? 'internal' : ''}`}
//             >
//               Internal Note
//             </button>
//             <button
//               type="button"
//               onClick={() => setCommentType('open')}
//               className={`comment-type-button ${commentType === 'open' ? 'open' : ''}`}
//             >
//               Open Comment
//             </button>
//           </div>

//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="comment-input"
//             placeholder="Add a comment..."
//             rows="3"
//           />
//           <button type="submit" className="submit-button">
//             Add Comment
//           </button>
//         </form>

//         <div className="timeline">
//           {comments.map((comment) => (
//             <div
//               key={comment.id}
//               className={`comment-card ${comment.type} ${
//                 comment.type === 'internal' ? 'internal-comment' : ''
//               }`}
//             >
//               <div className="comment-header">
//                 {comment.type === 'internal' && (
//                   <div className="internal-badge">Internal Note</div>
//                 )}
//                 <div className="user-info">
//                   {comment.user?.first_name} {comment.user?.last_name}
//                 </div>
//                 <div className="timestamp">
//                   {new Date(comment.created_at).toLocaleString()}
//                 </div>
//               </div>
//               <p className="comment-content">{comment.content}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CompleteTicket;
