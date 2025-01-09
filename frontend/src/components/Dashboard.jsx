import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Dashboard.css';

// PieChart Component
const PieChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="pie-chart-wrapper">
      <div className="pie-chart">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const rotation = currentAngle;
          currentAngle += angle;

          return (
            <div
              key={item.name}
              className="pie-segment"
              style={{
                backgroundColor: colors[item.name],
                transform: `rotate(${rotation}deg) skew(${90 - angle}deg)`
              }}
            />
          );
        })}
      </div>
      <div className="chart-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: colors[item.name] }} 
            />
            <span className="legend-label">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// TicketTable Component
const TicketTable = ({ tickets }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const sortedTickets = useMemo(() => {
    if (!tickets.length) return [];

    return [...tickets].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tickets, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' 
        ? 'asc' 
        : 'desc'
    }));
  };

  return (
    <div className="ticket-table-container">
      <h2>Recent Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                Ticket ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('title')}>
                Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('priority')}>
                Priority {sortConfig.key === 'priority' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('createdAt')}>
                Created At {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.slice(0, 5).map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:3000/api/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIncidents(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshKey]);

  const statusData = useMemo(() => [
    { name: 'Open', value: incidents.filter(i => i.status === 'Open').length },
    { name: 'In Progress', value: incidents.filter(i => i.status === 'In Progress').length },
    { name: 'Closed', value: incidents.filter(i => i.status === 'Closed').length }
  ], [incidents]);

  const priorityData = useMemo(() => [
    { name: 'Low', value: incidents.filter(i => i.priority === 'Low').length },
    { name: 'Medium', value: incidents.filter(i => i.priority === 'Medium').length },
    { name: 'High', value: incidents.filter(i => i.priority === 'High').length },
    { name: 'Urgent', value: incidents.filter(i => i.priority === 'Urgent').length }
  ], [incidents]);

  const colors = {
    'Open': '#FFC107',
    'In Progress': '#2196F3',
    'Closed': '#4CAF50',
    'Low': '#81C784',
    'Medium': '#FFB74D',
    'High': '#FF7043',
    'Urgent': '#E57373'
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard error">
        <p>Error: {error}</p>
        <button onClick={handleRefresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>IT Service Management Dashboard</h1>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          aria-label="Refresh dashboard"
        >
          ↻ Refresh
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Status Distribution</h2>
          <PieChart data={statusData} colors={colors} />
        </div>

        <div className="dashboard-card">
          <h2>Priority Distribution</h2>
          <PieChart data={priorityData} colors={colors} />
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Incidents</h3>
            <p className="stat-value">{incidents.length}</p>
          </div>
          <div className="stat-card">
            <h3>Closed</h3>
            <p className="stat-value">
              {incidents.filter(i => i.status === 'Closed').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-value">
              {incidents.filter(i => i.status === 'In Progress').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Urgent</h3>
            <p className="stat-value">
              {incidents.filter(i => i.priority === 'Urgent').length}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-card recent-tickets-card">
        <TicketTable tickets={incidents} />
      </div>
    </div>
  );
};

export default Dashboard;