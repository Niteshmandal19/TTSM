import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  LogOut,
  User,
  Plus
} from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';

const Header = ({ onMenuClick, onLogout, onCreateTicket }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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


  const headerStyle = {
    height: '60px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const buttonStyle = {
    padding: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#333',
    transition: 'color 0.3s'
  };

  const createTicketButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onMenuClick}
            style={buttonStyle}
            title="Toggle Sidebar"
          >
            <Menu strokeWidth={1.5} size={24} />
          </button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>IT Service Management</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            style={createTicketButtonStyle}
          >
            <Plus size={16} />
            New Ticket
          </button>
        </div>
        
        <div style={userSectionStyle}>
          <button
            style={buttonStyle}
            onClick={() => navigate('/profile')}
            title="View Profile"
          >
            <User strokeWidth={1.5} size={20} />
            <span>Welcome, {userRole}</span>
          </button>
          
          <button
            style={{
              ...buttonStyle,
              color: '#dc3545'
            }}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut strokeWidth={1.5} size={20} />
            Logout
          </button>
        </div>
      </header>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreateTicket}
      />
    </>
  );
};

export default Header;