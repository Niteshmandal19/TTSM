// import React, { useState, useEffect, useMemo } from 'react';
// import { Search } from 'lucide-react';
// import axios from 'axios';
// import './UserManagement.css'
// import UserCreationForm from './UserCreationForm';
// import User from './User';

// const ROLES = {
//   IBDIC_ADMIN: 'IBDIC_ADMIN',
//   IBDIC_USER: 'IBDIC_USER',
//   ORG_ADMIN: 'ORG_ADMIN',
//   ORG_USER: 'ORG_USER'
// };

// const ADMIN_ROLES = [ROLES.IBDIC_ADMIN, ROLES.ORG_ADMIN];

// const parseJwt = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const payload = JSON.parse(window.atob(base64));
//     return payload;
//   } catch (e) {
//     console.error('Error parsing token:', e);
//     return null;
//   }
// };

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [organizations, setOrganizations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isUserFormOpen, setIsUserFormOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('');
//   const [filterOrganization, setFilterOrganization] = useState('');
//   const [selectedUserId, setSelectedUserId] = useState(null);


//   const getCurrentUserRole = () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return null;
//       const payload = parseJwt(token);
//       return payload?.role;
//     } catch (err) {
//       console.error('Error getting user role:', err);
//       return null;
//     }
//   };

//   const getCurrentUserOrgId = () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return null;
//       const payload = parseJwt(token);
//       return payload?.organization_id;
//     } catch (err) {
//       console.error('Error getting user organization:', err);
//       return null;
//     }
//   };

//   const canCreateUsers = ADMIN_ROLES.includes(getCurrentUserRole());

//   useEffect(() => {
//     const fetchOrganizations = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/api/users/organizations', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success && Array.isArray(response.data.data)) {
//           setOrganizations(response.data.data);
//         } else {
//           console.error('Unexpected organization data format:', response.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch organizations:', error);
//       }
//     };

//     fetchOrganizations();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/api/users/getUserDetailByOrganization', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUsers(response.data);
//         setError(null);
//       } catch (err) {
//         setError(err.message || 'Error fetching users');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = useMemo(() => {
//     return users.filter(user => {
//       const matchesSearch =
//         user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesRole = !filterRole || user.role === filterRole;
//       const matchesOrganization = !filterOrganization || user.organization_id === filterOrganization;

//       return matchesSearch && matchesRole && matchesOrganization;
//     });
//   }, [users, searchTerm, filterRole, filterOrganization]);

//   const handleRowClick = (userId) => {
//     console.log('Row clicked:', userId); // For debugging
//     setSelectedUserId(userId);
//   };


//   const handleUserCreation = async (newUserData) => {
//     if (!canCreateUsers) {
//       setError('You do not have permission to create users');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:3000/api/users', newUserData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setUsers(prev => [...prev, response.data]);
//       setIsUserFormOpen(false);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create user');
//     }
//   };

//   if (isLoading) {
//     return <div className="loading">Loading users...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }

//   return (
//     <div className="user-management-container">
//       <div className="user-management-header">
//         <div className="user-management-search">
//           <div className="search-input-wrapper">
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             <Search className="search-icon" size={20} />
//           </div>

//           <select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="role-filter"
//           >
//             <option value="">All Roles</option>
//             {Object.values(ROLES).map(role => (
//               <option key={role} value={role}>{role}</option>
//             ))}
//           </select>

//           <select
//             value={filterOrganization}
//             onChange={(e) => setFilterOrganization(e.target.value)}
//             className="organization-filter"
//           >
//             <option value="">All Organizations</option>
//             {organizations.map(org => (
//               <option key={org.organization_id} value={org.organization_id}>
//                 {org.organization_id}
//               </option>
//             ))}
//           </select>

//           {canCreateUsers && (
//             <button
//               onClick={() => setIsUserFormOpen(true)}
//               className="add-user-btn"
//             >
//               + New User
//             </button>
//           )}
//         </div>
//       </div>

//       {isUserFormOpen && canCreateUsers && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Create New User</h2>
//               <button
//                 onClick={() => setIsUserFormOpen(false)}
//                 className="modal-close-btn"
//               >
//                 &times;
//               </button>
//             </div>
//             <UserCreationForm
//               onSubmit={handleUserCreation}
//               onCancel={() => setIsUserFormOpen(false)}
//             />
//           </div>
//         </div>
//       )}

//       <div className="table-container">
//         <table className="user-management-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>First Name</th>
//               <th>Last Name</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Role</th>
//               <th>Organization ID</th>
//               <th>Identifier Type</th>
//               <th>Identifier</th>
//               <th>Tickets Assigned</th>
//               <th>Tickets Resolved</th>
//               <th>Date Created</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map(user => (
//               <tr
//                 key={user.id}
//                 onClick={() => handleRowClick(user.id)}
//                 className="cursor-pointer hover:bg-gray-50 transition-colors"
//                 style={{ cursor: 'pointer' }}
//               >
//                 <td className="px-4 py-2">{user.id}</td>
//                 <td className="px-4 py-2">{user.first_name}</td>
//                 <td className="px-4 py-2">{user.last_name}</td>
//                 <td className="px-4 py-2">{user.email}</td>
//                 <td className="px-4 py-2">{user.mobile_no}</td>
//                 <td className="px-4 py-2">{user.role}</td>
//                 <td className="px-4 py-2">{user.organization_id}</td>
//                 <td className="px-4 py-2">{user.identifier_type}</td>
//                 <td className="px-4 py-2">{user.identifier}</td>
//                 <td className="px-4 py-2">{user.ticket_assigned}</td>
//                 <td className="px-4 py-2">{user.ticket_resolved}</td>
//                 <td className="px-4 py-2">{user.date_created}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedUserId && (
//         <User
//           userId={selectedUserId}
//           onClose={() => setSelectedUserId(null)}
//           currentUserRole={getCurrentUserRole()}
//           currentUserOrgId={getCurrentUserOrgId()}
//         />
//       )}
//     </div>
//   );
// };
// export default UserManagement;


import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import './UserManagement.css';
import UserCreationForm from './UserCreationForm';
import { useNavigate } from 'react-router-dom';

const ROLES = {
  IBDIC_ADMIN: 'IBDIC_ADMIN',
  IBDIC_USER: 'IBDIC_USER',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_USER: 'ORG_USER'
};

const ADMIN_ROLES = [ROLES.IBDIC_ADMIN, ROLES.ORG_ADMIN];

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

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');

  const getCurrentUserRole = () => {
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

  const canCreateUsers = ADMIN_ROLES.includes(getCurrentUserRole());

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/organizations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          setOrganizations(response.data.data);
        } else {
          console.error('Unexpected organization data format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/getUserDetailByOrganization', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !filterRole || user.role === filterRole;
      const matchesOrganization = !filterOrganization || user.organization_id === filterOrganization;

      return matchesSearch && matchesRole && matchesOrganization;
    });
  }, [users, searchTerm, filterRole, filterOrganization]);

  const canAccessUserDetails = ADMIN_ROLES.includes(getCurrentUserRole());

  const handleRowClick = (userId) => {
    if (canAccessUserDetails) {
      navigate(`/user-management/user/${userId}`);
    } else {
      setError('You do not have permission to view user details');
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };


  const handleUserCreation = async (newUserData) => {
    if (!canCreateUsers) {
      setError('You do not have permission to create users');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/users', newUserData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(prev => [...prev, response.data]);
      setIsUserFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="user-management-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="">All Roles</option>
            {Object.values(ROLES).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={filterOrganization}
            onChange={(e) => setFilterOrganization(e.target.value)}
            className="organization-filter"
          >
            <option value="">All Organizations</option>
            {organizations.map(org => (
              <option key={org.organization_id} value={org.organization_id}>
                {org.organization_id}
              </option>
            ))}
          </select>

          {canCreateUsers && (
            <button
              onClick={() => setIsUserFormOpen(true)}
              className="add-user-btn"
            >
              + New User
            </button>
          )}
        </div>
      </div>

      {isUserFormOpen && canCreateUsers && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New User</h2>
              <button
                onClick={() => setIsUserFormOpen(false)}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>
            <UserCreationForm
              onSubmit={handleUserCreation}
              onCancel={() => setIsUserFormOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="user-management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Organization ID</th>
              <th>Identifier Type</th>
              <th>Identifier</th>
              <th>Tickets Assigned</th>
              <th>Tickets Resolved</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${canAccessUserDetails ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                style={{
                  cursor: canAccessUserDetails ? 'pointer' : 'not-allowed',
                  opacity: canAccessUserDetails ? 1 : 0.7
                }}
                title={!canAccessUserDetails ? 'You do not have permission to view user details' : ''}
              >
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.mobile_no}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.organization_id}</td>
                <td className="px-4 py-2">{user.identifier_type}</td>
                <td className="px-4 py-2">{user.identifier}</td>
                <td className="px-4 py-2">{user.ticket_assigned}</td>
                <td className="px-4 py-2">{user.ticket_resolved}</td>
                <td className="px-4 py-2">{user.date_created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;