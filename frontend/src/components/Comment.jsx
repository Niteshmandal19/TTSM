// import React, { useState } from 'react';
// import { MessageCircle, File, Download, Edit2, Trash2 } from 'lucide-react';
// import './Comment.css'

// const Comment = ({ 
//   comment, 
//   onEdit, 
//   onDelete, 
//   currentUserOrg 
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState(comment.content);

//   const handleSave = async () => {
//     await onEdit(comment.id, editedContent);
//     setIsEditing(false);
//   };

//   const isImageFile = (filename) => {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
//     const extension = filename?.split('.').pop()?.toLowerCase();
//     return imageExtensions.includes(extension);
//   };

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:3000/api/comments/${comment.id}/attachment`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Download failed');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = comment.attachmentOriginalName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading attachment:', error);
//       alert('Failed to download attachment');
//     }
//   };

//   return (
//     <div className={`bg-white rounded-lg shadow p-4 mb-4 ${
//       comment.type === 'internal' ? 'border-l-4 border-yellow-400' : ''
//     }`}>
//       <div className="flex items-start gap-4">
//         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//           <MessageCircle className="w-6 h-6 text-gray-500" />
//         </div>
        
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-2">
//             <div>
//               <h4 className="font-medium text-gray-900">
//                 {comment.user?.first_name} {comment.user?.last_name}
//               </h4>
//               <span className="text-sm text-gray-500">
//                 {new Date(comment.created_at).toLocaleString()}
//               </span>
//             </div>
            
//             {comment.type === 'internal' && (
//               <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
//                 Internal Note
//               </span>
//             )}
//           </div>

//           {isEditing ? (
//             <div className="space-y-4">
//               <textarea
//                 value={editedContent}
//                 onChange={(e) => setEditedContent(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 rows="3"
//               />
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleSave}
//                   className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setEditedContent(comment.content);
//                   }}
//                   className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
//           )}

//           {comment.attachment && (
//             <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//               {isImageFile(comment.attachmentOriginalName) ? (
//                 <div className="space-y-2">
//                   <img
//                     src={`/api/comments/${comment.id}/attachment`}
//                     alt={comment.attachmentOriginalName}
//                     className="max-w-full rounded"
//                   />
//                   <button
//                     onClick={handleDownload}
//                     className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
//                   >
//                     <Download className="w-4 h-4" />
//                     <span>Download</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <File className="w-5 h-5 text-gray-500" />
//                     <span className="text-sm text-gray-600">
//                       {comment.attachmentOriginalName}
//                     </span>
//                   </div>
//                   <button
//                     onClick={handleDownload}
//                     className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
//                   >
//                     <Download className="w-4 h-4" />
//                     <span>Download</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {(currentUserOrg === 'IBDIC' || comment.user_id === localStorage.getItem('userId')) && (
//             <div className="mt-4 flex gap-2">
//               {!isEditing && (
//                 <>
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                     <span>Edit</span>
//                   </button>
//                   <button
//                     onClick={() => onDelete(comment.id)}
//                     className="flex items-center gap-1 text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     <span>Delete</span>
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Comment;


import React, { useState } from 'react';
import { MessageCircle, File, Download, Edit2, Trash2 } from 'lucide-react';
import './Comment.css';

const Comment = ({ 
  comment, 
  onEdit, 
  onDelete, 
  currentUserOrg 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      if (!editedContent?.trim()) {
        setError('Comment content cannot be empty');
        return;
      }
      
      await onEdit(comment.id, editedContent);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update comment. Please try again.');
    }
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comments/${comment.id}/attachment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.status === 400 ? 'Bad request' : 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = comment.attachmentOriginalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert(`Failed to download attachment: ${error.message}`);
    }
  };

  return (
    <div className={`comment ${comment.type === 'internal' ? 'internal' : ''}`}>
      <div className="comment-container">
        <div className="avatar">
          <MessageCircle />
        </div>
        
        <div className="comment-content">
          <div className="comment-header">
            <div className="user-info">
              <h4 className="user-name">
                {comment.user?.first_name} {comment.user?.last_name}
              </h4>
              <span className="timestamp">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            
            {comment.type === 'internal' && (
              <span className="internal-badge">
                Internal Note
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="edit-container">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="edit-textarea"
                rows="3"
              />
              {error && <div className="error-message">{error}</div>}
              <div className="button-group">
                <button onClick={handleSave} className="save-button">
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                    setError('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="comment-text">{comment.content}</p>
          )}

          {comment.attachment && (
            <div className="attachment-container">
              {isImageFile(comment.attachmentOriginalName) ? (
                <div className="image-attachment">
                  <img
                    src={`/api/comments/${comment.id}/attachment`}
                    alt={comment.attachmentOriginalName}
                  />
                  <button onClick={handleDownload} className="download-button">
                    <Download className="icon" />
                    <span>Download</span>
                  </button>
                </div>
              ) : (
                <div className="file-attachment">
                  <div className="file-info">
                    <File className="icon" />
                    <span>{comment.attachmentOriginalName}</span>
                  </div>
                  <button onClick={handleDownload} className="download-button">
                    <Download className="icon" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {(currentUserOrg === 'IBDIC' || comment.user_id === localStorage.getItem('userId')) && (
            <div className="action-buttons">
              {!isEditing && (
                <>
                  <button onClick={() => setIsEditing(true)} className="edit-button">
                    <Edit2 className="icon" />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => onDelete(comment.id)} className="delete-button">
                    <Trash2 className="icon" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;