// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Ticket, 
//   Users, 
//   BarChart3, 
//   Settings,
//   ChevronsLeft,
//   ChevronsRight, 
// } from 'lucide-react';


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
// const getCurrentUserRole = () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
//     const payload = parseJwt(token);
//     return payload?.role; // Assuming 'role' is the key in your JWT payload
//   } catch (err) {
//     console.error('Error getting user role:', err);
//     return null;
//   }
// };

// const canCreateMaster = ADMIN_ROLES.includes(getCurrentUserRole());


// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const location = useLocation();

//   const sidebarStyle = {
//     width: isOpen ? '250px' : '70px',
//     backgroundColor: '#2c3e50',
//     color: 'white',
//     height: '100vh',
//     position: 'fixed',
//     left: 0,
//     top: 0,
//     transition: 'width 0.3s ease',
//     overflowX: 'hidden',
//     zIndex: 1000,
//     boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
//   };

//   const toggleButtonStyle = {
//     position: 'absolute',
//     top: '15px',
//     right: '10px',
//     background: 'none',
//     border: 'none',
//     color: 'white',
//     cursor: 'pointer',
//     padding: '5px',
//   };

//   const menuItemStyle = (path) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: '15px 25px',
//     cursor: 'pointer',
//     backgroundColor: location.pathname === path ? '#34495e' : 'transparent',
//     textDecoration: 'none',
//     color: 'white',
//     transition: 'background-color 0.3s',
//     gap: '15px',
//   });

//   const logoStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '20px 0',
//     borderBottom: '1px solid #445',
//     position: 'relative',
//   };

//   const iconStyle = {
//     marginRight: isOpen ? '10px' : '0',
//     width: '24px',
//     height: '24px',
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
//     { id: 'incidents', label: 'Incidents', path: '/incidents', icon: Ticket },
//     { id: 'users', label: 'User Management', path: '/user-management', icon: Users },
//     { id: 'masters', label: 'Master Management', path: '/master-management', icon: Users },
//     { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
//     { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
//   ];

//   return (
//     <div style={sidebarStyle}>
//       <div style={logoStyle}>
//         <h2
//           style={{
//             margin: 0,
//             textAlign: 'center',
//             width: '100%',
//             fontSize: isOpen ? '1.5rem' : '1rem',
//           }}
//         >
//           {isOpen ? 'ITSM System' : 'ITSM'}
//         </h2>
//         <button
//           onClick={toggleSidebar}
//           style={toggleButtonStyle}
//           title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
//         >
//           {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
//         </button>
//       </div>

//       <nav style={{ marginTop: '20px' }}>
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <Link key={item.id} to={item.path} style={menuItemStyle(item.path)}>
//               <Icon style={iconStyle} />
//               {isOpen && <span>{item.label}</span>}
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings,
  ChevronsLeft,
  ChevronsRight, 
} from 'lucide-react';

const ROLES = {
  IBDIC_ADMIN: 'IBDIC_ADMIN',
  IBDIC_USER: 'IBDIC_USER',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_USER: 'ORG_USER'
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

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentUserRole = getCurrentUserRole();

  const sidebarStyle = {
    width: isOpen ? '250px' : '70px',
    backgroundColor: '#2c3e50',
    color: 'white',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    zIndex: 1000,
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '5px',
  };

  const menuItemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    cursor: 'pointer',
    backgroundColor: location.pathname === path ? '#34495e' : 'transparent',
    textDecoration: 'none',
    color: 'white',
    transition: 'background-color 0.3s',
    gap: '15px',
  });

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #445',
    position: 'relative',
  };

  const iconStyle = {
    marginRight: isOpen ? '10px' : '0',
    width: '24px',
    height: '24px',
  };

  // Define menu items with role-based access control
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      path: '/incidents', 
      icon: Ticket,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'users', 
      label: 'User Management', 
      path: '/user-management', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'masters', 
      label: 'Master Management', 
      path: '/master-management', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN] // Only IBDIC_ADMIN can access
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      path: '/reports', 
      icon: BarChart3,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      path: '/settings', 
      icon: Settings,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
  ];

  // Filter menu items based on user role
  const authorizedMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(currentUserRole)
  );

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        <h2
          style={{
            margin: 0,
            textAlign: 'center',
            width: '100%',
            fontSize: isOpen ? '1.5rem' : '1rem',
          }}
        >
          {isOpen ? 'ITSM System' : 'ITSM'}
        </h2>
        <button
          onClick={toggleSidebar}
          style={toggleButtonStyle}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
        </button>
      </div>

      <nav style={{ marginTop: '20px' }}>
        {authorizedMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} to={item.path} style={menuItemStyle(item.path)}>
              <Icon style={iconStyle} />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
