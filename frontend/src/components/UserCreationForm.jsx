// import React, { useState } from 'react';
// import './UserCreationForm.css';
// import axios from 'axios';

// const UserCreationForm = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     identifier_type: '',
//     identifier: '',
//     email: '',
//     mobile_no: '',
//     role: '',
//     temp_password: '', // Temporary password will be generated on backend
//     organization_id: '',
//     initialCommit: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [organizations, setOrganizations] = useState([]);

//   useEffect(() => {
//     // Fetch organizations when component mounts
//     const fetchOrganizations = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/users/organizations');
//         setOrganizations(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch organizations:', error);
//       }
//     };

//     fetchOrganizations();
//   }, []);



//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const requiredFields = [
//       'first_name', 'last_name', 'email',
//       'mobile_no', 'role', 
//       'identifier_type', 'identifier', 'organization_id'
//     ];

//     requiredFields.forEach(field => {
//       if (!formData[field]) {
//         newErrors[field] = `${field.replace('_', ' ')} is required`;
//       }
//     });

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (formData.email && !emailRegex.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     const mobileRegex = /^[0-9]{10,12}$/;
//     if (formData.mobile_no && !mobileRegex.test(formData.mobile_no)) {
//       newErrors.mobile_no = 'Invalid mobile number (10-12 digits)';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (validateForm()) {
//       try {
//         const payload = {
//           ...formData,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         };

//         const response = await axios.post(
//           'http://localhost:3000/api/users/createUser',
//           payload,
//           {
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         // Reset form
//         setFormData({
//           first_name: '',
//           last_name: '',
//           identifier_type: '',
//           identifier: '',
//           email: '',
//           mobile_no: '',
//           role: '',
//           temp_password:'',
//           organization_id: '',
//           initialCommit: ''
//         });

//         // Show success message
//         alert('User created successfully. Temporary password will be sent to the user.');

//         if (onClose) onClose();
//         if (onSubmit) onSubmit(response.data);
//       } catch (error) {
//         console.error('User creation failed:', error.response?.data || error.message);
//         alert(
//           error.response?.data?.message ||
//           'Failed to create user. Please try again.'
//         );
//       }
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <div className="user-creation-container">
//       <h2 className="form-title">Create User</h2>
//       <form onSubmit={handleSubmit} className="user-creation-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="first_name">First Name</label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className={errors.first_name ? 'input-error' : ''}
//             />
//             {errors.first_name && <p className="error-message">{errors.first_name}</p>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="last_name">Last Name</label>
//             <input
//               type="text"
//               id="last_name"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className={errors.last_name ? 'input-error' : ''}
//             />
//             {errors.last_name && <p className="error-message">{errors.last_name}</p>}
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="identifier_type">Identifier Type</label>
//             <select
//               id="identifier_type"
//               name="identifier_type"
//               value={formData.identifier_type}
//               onChange={handleChange}
//             >
//               <option value="">Select Type</option>
//               {['PAN', 'AADHAR', 'PASSPORT'].map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="identifier">Identifier Number</label>
//             <input
//               type="text"
//               id="identifier"
//               name="identifier"
//               value={formData.identifier}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={errors.email ? 'input-error' : ''}
//           />
//           {errors.email && <p className="error-message">{errors.email}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="mobile_no">Mobile Number</label>
//           <input
//             type="tel"
//             id="mobile_no"
//             name="mobile_no"
//             value={formData.mobile_no}
//             onChange={handleChange}
//             className={errors.mobile_no ? 'input-error' : ''}
//           />
//           {errors.mobile_no && <p className="error-message">{errors.mobile_no}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="role">Role</label>
//           <select
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className={errors.role ? 'input-error' : ''}
//           >
//             <option value="">Select Role</option>
//             {['IBDIC_ADMIN', 'IBDIC_USER', 'ORG_ADMIN', 'ORG_USER'].map(role => (
//               <option key={role} value={role}>{role}</option>
//             ))}
//           </select>
//           {errors.role && <p className="error-message">{errors.role}</p>}
//         </div>

//         {/* <div className="form-group">
//           <label htmlFor="organization_id">Organisation ID</label>
//           <input
//             type="text"
//             id="organization_id"
//             name="organization_id"
//             value={formData.organization_id}
//             onChange={handleChange}
//           />
//         </div> */}
//         <div className="form-group">
//         <label htmlFor="organization_id">Organization</label>
//         <select
//           id="organization_id"
//           name="organization_id"
//           value={formData.organization_id}
//           onChange={handleChange}
//           className={errors.organization_id ? 'error' : ''}
//         >
//           <option value="">Select Organization</option>
//           {organizations.map((org) => (
//             <option key={org.organization_id} value={org.organization_id}>
//               {org.org_name}
//             </option>
//           ))}
//         </select>
//         {errors.organization_id && (
//           <span className="error-message">{errors.organization_id}</span>
//         )}
//       </div>

//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className={errors.password ? 'input-error' : ''}
//           />
//           {errors.password && <p className="error-message">{errors.password}</p>}
//         </div>
// <div className="form-group">
//   <label htmlFor="temp_password">temp_password</label>
//   <input
//     type="temp_password"
//     id="temp_password"
//     name="temp_password"
//     value={formData.temp_password}
//     onChange={handleChange}
//     className={errors.temp_password ? 'input-error' : ''}
//   />
//   {errors.temp_password && <p className="error-message">{errors.temp_password}</p>}
// </div>
//         <div className="form-group">
//         <label>Initial Commit (Optional)</label>
//         <textarea
//           name="initialCommit"
//           value={formData.initialCommit}
//           onChange={handleChange}
//           placeholder="Optional initial commit for the user"
//         />
//       </div>
//         <button 
//         type="submit" 
//         disabled={isSubmitting}
//         className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
//       >
//         {isSubmitting ? 'Creating User...' : 'Create User'}
//       </button>

//       </form>
//     </div>
//   );
// };

// export default UserCreationForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserCreationForm.css';

const UserCreationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    identifier_type: '',
    identifier: '',
    email: '',
    mobile_no: '',
    role: '',
    organization_id: '',
    initialCommit: '',
    temp_password: ''
  });

  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const userRole = getCurrentUserRole();

  

  // Role options
  const roleOptions = [
    { value: 'IBDIC_ADMIN', label: 'IBDIC Admin' },
    { value: 'IBDIC_USER', label: 'IBDIC User' },
    { value: 'ORG_ADMIN', label: 'Organization Admin' },
    { value: 'ORG_USER', label: 'Organization User' }
  ];

  const filteredRoleOptions = roleOptions.filter(role => {
    if (userRole === 'IBDIC_ADMIN') {
      return true; // IBDIC_ADMIN can view all roles
    } else if (userRole === 'ORG_ADMIN') {
      return role.value === 'ORG_ADMIN' || role.value === 'ORG_USER'; // ORG_ADMIN can view only ORG_ADMIN and ORG_USER
    }
    return false; // Other roles see no options
  });
  

  // Identifier type options
  const identifierTypes = [
    { value: 'AADHAR', label: 'Aadhar Card' },
    { value: 'PAN', label: 'PAN Card' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'VOTER_ID', label: 'Voter ID' }
  ];

  


  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/organizations',{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrganizations(response.data.data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'role',
      'identifier_type',
      'identifier',
      'organization_id',
      'temp_passowrd'
    ];

    // requiredFields.forEach(field => {
    //   if (!formData[field].trim()) {
    //     newErrors[field] = `${field.replace('_', ' ')} is required`;
    //   }
    // });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10,12}$/;
    if (formData.mobile_no && !mobileRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Invalid mobile number (10-12 digits)';
    }

    // Identifier validation based on type
    if (formData.identifier_type === 'AADHAR') {
      const aadharRegex = /^\d{12}$/;
      if (!aadharRegex.test(formData.identifier)) {
        newErrors.identifier = 'Invalid Aadhar number (12 digits)';
      }
    } else if (formData.identifier_type === 'PAN') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.identifier)) {
        newErrors.identifier = 'Invalid PAN number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    if (validateForm()) {
      try {
        const payload = {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const response = await axios.post(
          'http://localhost:3000/api/users/createUser',
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        setSubmitSuccess(true);

        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          identifier_type: '',
          identifier: '',
          email: '',
          mobile_no: '',
          role: '',
          organization_id: '',
          initialCommit: '',
          temp_password: ''
        });

        if (onSubmit) onSubmit(response.data);
        if (onClose) onClose();

      } catch (error) {
        console.error('User creation failed:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Failed to create user. Please try again.'
        }));
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="user-form-container">
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit} className="user-form">
        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        {submitSuccess && (
          <div className="success-message">
            User created successfully! Temporary password will be sent to the user.
          </div>
        )}

        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <span className="error-message">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && (
                <span className="error-message">{errors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="mobile_no">Mobile Number *</label>
              <input
                type="text"
                id="mobile_no"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                className={errors.mobile_no ? 'error' : ''}
              />
              {errors.mobile_no && (
                <span className="error-message">{errors.mobile_no}</span>
              )}
            </div>
          </div>
        </div>

        {/* Identification */}
        <div className="form-section">
          <h3>Identification</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="identifier_type">ID Type *</label>
              <select
                id="identifier_type"
                name="identifier_type"
                value={formData.identifier_type}
                onChange={handleChange}
                className={errors.identifier_type ? 'error' : ''}
              >
                <option value="">Select ID Type</option>
                {identifierTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.identifier_type && (
                <span className="error-message">{errors.identifier_type}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="identifier">ID Number *</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className={errors.identifier ? 'error' : ''}
              />
              {errors.identifier && (
                <span className="error-message">{errors.identifier}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="temp_password">temp_password</label>
              <input
                type="temp_password"
                id="temp_password"
                name="temp_password"
                value={formData.temp_password}
                onChange={handleChange}
                className={errors.temp_password ? 'input-error' : ''}
              />
              {errors.temp_password && <p className="error-message">{errors.temp_password}</p>}
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div className="form-section">
          <h3>Organization Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization_id">Organization *</label>
              <select
                id="organization_id"
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                className={errors.organization_id ? 'error' : ''}
              >
                <option value="">Select Organization</option>
                {organizations.map(org => (
                  <option key={org.organization_id} value={org.organization_id}>
                    {org.organization_id}
                  </option>
                ))}
              </select>
              {errors.organization_id && (
                <span className="error-message">{errors.organization_id}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="">Select Role</option>
                {filteredRoleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreationForm;