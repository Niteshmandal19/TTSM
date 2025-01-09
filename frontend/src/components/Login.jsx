// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './styles.css';

// const Login = ({ onLogin }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:3000/api/auth/login', formData);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

//       onLogin(); // Update the authentication state
//       navigate('/IncidentList'); // Redirect to tickets page
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">Sign In</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email address"
//               className="form-input"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="form-input"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {error && <p className="error-message">{error}</p>}
//           <button 
//             type="submit" 
//             className="submit-btn" 
//             disabled={loading}
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
//         <div className="switch-auth">
//           <p>
//             Don't have an account? <Link to="/register">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isFirstLogin) {
      setNewPasswordData(prevState => ({ 
        ...prevState, 
        [name]: value 
      }));
    } else {
      setFormData(prevState => ({ 
        ...prevState, 
        [name]: value 
      }));
    }
  };

  const handleFirstLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/first-login', {
        email: formData.email,
        temp_password: formData.password,
        newPassword: newPasswordData.newPassword
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      onLogin();
      navigate('/IncidentList');
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);

      // Check if this is a first-time login
      if (response.data.requirePasswordChange) {
        setIsFirstLogin(true);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      onLogin();
      navigate('/IncidentList');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Render first-time login form
  if (isFirstLogin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Set New Password</h2>
          <form onSubmit={handleFirstLoginSubmit}>
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="form-input"
                value={newPasswordData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="form-input"
                value={newPasswordData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Regular login form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;