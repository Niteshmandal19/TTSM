// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import axios from 'axios';

// const User = ({ userId, onClose, currentUserRole, currentUserOrgId }) => {
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({});

//   const canEdit = (user) => {
//     return currentUserRole === 'IBDIC_ADMIN' || 
//            (currentUserRole === 'ORG_ADMIN' && currentUserOrgId === user?.organization_id) ||
//            user?.id === userId;
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(response.data);
//         setFormData(response.data);
//       } catch (err) {
//         setError('Failed to fetch user details');
//       }
//     };

//     fetchUser();
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`http://localhost:3000/api/users/${userId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setUser(response.data);
//       setIsEditing(false);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update user');
//     }
//   };

//   if (!user) {
//     return <div className="loading">Loading user details...</div>;
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">User Details</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">First Name</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="first_name"
//                   value={formData.first_name || ''}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 />
//               ) : (
//                 <p className="p-2 bg-gray-50 rounded">{user.first_name}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Last Name</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="last_name"
//                   value={formData.last_name || ''}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 />
//               ) : (
//                 <p className="p-2 bg-gray-50 rounded">{user.last_name}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <p className="p-2 bg-gray-50 rounded">{user.email}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Mobile</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="mobile_no"
//                   value={formData.mobile_no || ''}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 />
//               ) : (
//                 <p className="p-2 bg-gray-50 rounded">{user.mobile_no}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Role</label>
//               <p className="p-2 bg-gray-50 rounded">{user.role}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Organization ID</label>
//               <p className="p-2 bg-gray-50 rounded">{user.organization_id}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Identifier Type</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="identifier_type"
//                   value={formData.identifier_type || ''}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 />
//               ) : (
//                 <p className="p-2 bg-gray-50 rounded">{user.identifier_type}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Identifier</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="identifier"
//                   value={formData.identifier || ''}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 />
//               ) : (
//                 <p className="p-2 bg-gray-50 rounded">{user.identifier}</p>
//               )}
//             </div>
//           </div>

//           {canEdit(user) && (
//             <div className="flex justify-end space-x-4 mt-6">
//               {isEditing ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setFormData(user);
//                     }}
//                     className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Save Changes
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default User;
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './User.css';

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

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserOrgId, setCurrentUserOrgId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setCurrentUserRole(payload?.role);
      setCurrentUserOrgId(payload?.organization_id);
    }
  }, []);

  const canEdit = (user) => {
    return currentUserRole === 'IBDIC_ADMIN' ||
      (currentUserRole === 'ORG_ADMIN' && currentUserOrgId === user?.organization_id) ||
      user?.id === userId;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'status' ? Number(value) : value;
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/user-management');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
        setIsDeleting(false);
      }
    }
  };

  if (!user) {
    return <div className="loading-state">Loading user details...</div>;
  }

  return (
    <div className="user-page-container">
      <div className="user-content-wrapper">
        <div className="user-content-inner">
          <div className="user-header">
            <h2 className="user-title">User Details</h2>
            <button
              onClick={() => navigate('/user-management')}
              className="close-button"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.first_name}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.last_name}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <p className="form-value">{user.email}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="mobile_no"
                    value={formData.mobile_no || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.mobile_no}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <p className="form-value">{user.role}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Organization ID</label>
                <p className="form-value">{user.organization_id}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value='1'>Active</option>
                    <option value='0'>Inactive</option>
                  </select>
                ) : (
                  <p className={`form-value status-badge ${user.status === 1 ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 1 ? 'Active' : 'Inactive'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Identifier Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="identifier_type"
                    value={formData.identifier_type || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.identifier_type}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Identifier</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.identifier}</p>
                )}
              </div>
            </div>

            {canEdit(user) && (
              <div className="button-group">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="button button-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="button button-save"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="button button-edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="button button-delete"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete User'}
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;