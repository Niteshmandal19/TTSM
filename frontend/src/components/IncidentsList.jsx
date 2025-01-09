// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import {
//     FileText,
//     ChevronDown,
//     X,
//     Search,
//     Filter,
//     RefreshCw,
//     Calendar,
//     User,
//     Info,
//     Loader,
//     AlertTriangle
// } from 'lucide-react';
// import './IncidentsList.css';
// import IncidentDetails from './IncidentDetails';

// const API_BASE_URL = 'http://localhost:3000/api';

// const IncidentsList = () => {
//     const navigate = useNavigate();
//     const [incidents, setIncidents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filters, setFilters] = useState({
//         projects: [],
//         issueTypes: [],
//         requestTypes: [],
//         assignees: [],
//         priorities: [],
//         statuses: [],
//         created_by: []
//     });

//     const [globalSearch, setGlobalSearch] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [selectedIncident, setSelectedIncident] = useState(null);

//     const [dateFilter, setDateFilter] = useState({
//         startDate: '',
//         endDate: '',
//         isOpen: false
//     });


//     const getDateForComparison = (dateString) => {
//         if (!dateString) return null;
//         const date = new Date(dateString);
//         return new Date(date.getFullYear(), date.getMonth(), date.getDate());
//     };



//     // Fetch incidents from the backend
//     const fetchIncidents = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/tickets`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setIncidents(response.data);
//             setError(null);
//         } catch (err) {
//             // You might want to handle 401 (unauthorized) errors specifically
//             if (err.response && err.response.status === 401) {
//                 // Redirect to login or refresh token
//                 navigate('/login');
//             }
//             setError(err.response?.data?.message || 'Error fetching tickets');
//             console.error('Error fetching tickets:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Initial data fetch
//     useEffect(() => {
//         fetchIncidents();
//     }, []);

//     // Handle row click to navigate to detailed view
//     const handleRowClick = (incident, e) => {
//         // Prevent opening details if clicking on the title link
//         if (e.target.tagName === 'A') {
//             return;
//         }
//         setSelectedIncident(incident);
//     };



//     // Predefined filter options
//     const PREDEFINED_FILTERS = {
//         projects: ['SUP', 'ITN', 'IH2.0', 'SIIE'],
//         issueTypes: ['Incident', 'Bug', 'FeatureRequest', 'Support'],
//         requestTypes: ['CriticalBug', 'UIBug', 'NewModule', 'LoginHelp'],
//         assignees: ['support123HR', 'support123DEV', 'support123INFRA'],
//         priorities: ['Urgent', 'High', 'Medium', 'Low'],
//         statuses: ['Pending', 'In-progress', 'Open'],
//         created_by: ['me']
//     };

//     // Generate unique filter options from incidents
//     const uniqueFilters = useMemo(() => {
//         if (!incidents.length) return {
//             projects: [],
//             issueTypes: [],
//             requestTypes: [],
//             assignees: [],
//             priorities: [],
//             statuses: [],
//             created_by: []
//         };

//         return {
//             projects: [...new Set([...PREDEFINED_FILTERS.projects])].filter(Boolean).sort(),
//             issueTypes: [...new Set([...PREDEFINED_FILTERS.issueTypes])].filter(Boolean).sort(),
//             requestTypes: [...new Set([...PREDEFINED_FILTERS.requestTypes])].filter(Boolean).sort(),
//             assignees: [...new Set([...PREDEFINED_FILTERS.assignees])].filter(Boolean).sort(),
//             priorities: [...new Set([...PREDEFINED_FILTERS.priorities])].filter(Boolean).sort(),
//             statuses: [...new Set([...PREDEFINED_FILTERS.statuses])].filter(Boolean).sort(),
//             created_by: [...new Set([...PREDEFINED_FILTERS.created_by])].filter(Boolean).sort()
//         };
//     }, [incidents]);

//     // Filter incidents based on search and filter criteria
//     const filteredIncidents = useMemo(() => {
//         return incidents.filter(incident => {
//             const matchesGlobalSearch = globalSearch
//                 ? Object.values(incident).some(val =>
//                     String(val).toLowerCase().includes(globalSearch.toLowerCase())
//                 )
//                 : true;

//             // Date filtering logic
//             let matchesDateRange = true;
//             if (dateFilter.startDate || dateFilter.endDate) {
//                 const incidentDate = getDateForComparison(incident.createdAt);
//                 const startDate = getDateForComparison(dateFilter.startDate);
//                 const endDate = getDateForComparison(dateFilter.endDate);

//                 if (startDate && endDate) {
//                     matchesDateRange = incidentDate >= startDate && incidentDate <= endDate;
//                 } else if (startDate) {
//                     matchesDateRange = incidentDate >= startDate;
//                 } else if (endDate) {
//                     matchesDateRange = incidentDate <= endDate;
//                 }
//             }

//             const matchesProjects = filters.projects.length === 0 || filters.projects.includes(incident.project);
//             const matchesIssueTypes = filters.issueTypes.length === 0 || filters.issueTypes.includes(incident.issueType);
//             const matchesRequestTypes = filters.requestTypes.length === 0 || filters.requestTypes.includes(incident.requestType);
//             const matchesAssignees = filters.assignees.length === 0 || filters.assignees.includes(incident.assignee);
//             const matchesPriorities = filters.priorities.length === 0 || filters.priorities.includes(incident.priority);
//             const matchesStatuses = filters.statuses.length === 0 || filters.statuses.includes(incident.status);
//             const matchesCreatedBy = filters.created_by.length === 0 || filters.created_by.includes(incident.created_by);

//             return (
//                 matchesGlobalSearch &&
//                 matchesDateRange &&
//                 matchesProjects &&
//                 matchesIssueTypes &&
//                 matchesRequestTypes &&
//                 matchesAssignees &&
//                 matchesPriorities &&
//                 matchesStatuses &&
//                 matchesCreatedBy
//             );
//         });
//     }, [incidents, filters, globalSearch, dateFilter]);

//     // Paginate filtered incidents
//     const paginatedIncidents = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return filteredIncidents.slice(startIndex, startIndex + itemsPerPage);
//     }, [filteredIncidents, currentPage, itemsPerPage]);

//     const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

//     // Add date filter reset to the existing resetFilters function
//     const resetFilters = useCallback(() => {
//         setFilters({
//             projects: [],
//             issueTypes: [],
//             requestTypes: [],
//             assignees: [],
//             priorities: [],
//             statuses: [],
//             created_by: []
//         });
//         setDateFilter(prev => ({
//             ...prev,
//             startDate: '',
//             endDate: ''
//         }));
//         setGlobalSearch('');
//         setCurrentPage(1);
//     }, []);

//     // Toggle filter selection
//     const toggleFilter = useCallback((filterType, value) => {
//         setFilters(prev => ({
//             ...prev,
//             [filterType]: prev[filterType].includes(value)
//                 ? prev[filterType].filter(item => item !== value)
//                 : [...prev[filterType], value]
//         }));
//     }, []);

//     // Get badge classes for different attributes
//     const getPriorityBadgeClass = useCallback((priority) => {
//         switch (priority) {
//             case 'Urgent': return 'priority-badge priority-badge-urgent';
//             case 'High': return 'priority-badge priority-badge-high';
//             case 'Medium': return 'priority-badge priority-badge-medium';
//             default: return 'priority-badge priority-badge-low';
//         }
//     }, []);

//     const getStatusBadgeClass = useCallback((status) => {
//         switch (status) {
//             case 'Open': return 'status-badge status-badge-open';
//             case 'In Progress': return 'status-badge status-badge-in-progress';
//             case 'Resolved': return 'status-badge status-badge-resolved';
//             default: return 'status-badge status-badge-closed';
//         }
//     }, []);

//     // Loading State
//     if (loading) {
//         return (
//             <div className="loading-state">
//                 <Loader className="loading-spinner w-8 h-8" />
//                 <p>Loading tickets...</p>
//             </div>
//         );
//     }



//     // Error State
//     if (error) {
//         return (
//             <div className="empty-state">
//                 <div className="text-center">
//                     <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                     <p className="text-red-600 mb-4">Error loading tickets: {error}</p>
//                     <button
//                         onClick={fetchIncidents}
//                         className="pagination-button"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const DateFilterPopup = () => {
//         const [tempStartDate, setTempStartDate] = useState(dateFilter.startDate);
//         const [tempEndDate, setTempEndDate] = useState(dateFilter.endDate);

//         const handleApply = () => {
//             setDateFilter(prev => ({
//                 ...prev,
//                 startDate: tempStartDate,
//                 endDate: tempEndDate,
//                 isOpen: false
//             }));
//             setCurrentPage(1); // Reset to first page when filter is applied
//         };

//         const handleClear = () => {
//             setTempStartDate('');
//             setTempEndDate('');
//             setDateFilter(prev => ({
//                 ...prev,
//                 startDate: '',
//                 endDate: '',
//                 isOpen: false
//             }));
//             setCurrentPage(1);
//         };

//         return (
//             <div className="date-filter-popup">
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Start Date
//                         </label>
//                         <input
//                             type="date"
//                             value={tempStartDate}
//                             onChange={(e) => {
//                                 setTempStartDate(e.target.value);
//                                 if (tempEndDate && e.target.value > tempEndDate) {
//                                     setTempEndDate(e.target.value);
//                                 }
//                             }}
//                             className="date-input"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             End Date
//                         </label>
//                         <input
//                             type="date"
//                             value={tempEndDate}
//                             onChange={(e) => setTempEndDate(e.target.value)}
//                             min={tempStartDate}
//                             className="date-input"
//                         />
//                     </div>
//                     <div className="flex justify-end space-x-2">
//                         <button
//                             onClick={handleClear}
//                             className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
//                         >
//                             Clear
//                         </button>
//                         <button
//                             onClick={handleApply}
//                             className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//                         >
//                             Apply
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };



//     return (
//         <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Incidents List</h2>
//                 <div className="flex items-center space-x-2">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Search incidents..."
//                             className="search-input pl-8"
//                             value={globalSearch}
//                             onChange={(e) => {
//                                 setGlobalSearch(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                         />
//                         <Search className="absolute left-2 top-3 text-gray-400" size={18} />
//                     </div>
//                     {/* Date Filter Button */}
//                     <div className="relative">
//                         <button
//                             onClick={() => setDateFilter(prev => ({ ...prev, isOpen: !prev.isOpen }))}
//                             className={`p-2 rounded-md hover:bg-gray-200 ${(dateFilter.startDate || dateFilter.endDate) ? 'bg-blue-100' : 'bg-gray-100'
//                                 }`}
//                             title="Filter by date"
//                         >
//                             <Calendar size={20} className={
//                                 (dateFilter.startDate || dateFilter.endDate) ? 'text-blue-600' : 'text-gray-600'
//                             } />
//                         </button>
//                         {dateFilter.isOpen && <DateFilterPopup />}
//                     </div>

//                     <button
//                         onClick={() => setIsFilterOpen(!isFilterOpen)}
//                         className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
//                     >
//                         <Filter size={20} className="text-gray-600" />
//                     </button>

//                     <button
//                         onClick={resetFilters}
//                         className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
//                     >
//                         <RefreshCw size={20} className="text-gray-600" />
//                     </button>

//                 </div>
//             </div>

//             {isFilterOpen && (
//                 <div className="filter-panel">
//                     {Object.entries(uniqueFilters).map(([filterType, options]) => (
//                         <div key={filterType}>
//                             <h3 className="font-semibold mb-2 capitalize">{filterType}</h3>
//                             <div className="space-y-1">
//                                 {options.map(option => (
//                                     <label key={option} className="flex items-center space-x-2">
//                                         <input
//                                             type="checkbox"
//                                             checked={filters[filterType].includes(option)}
//                                             onChange={() => toggleFilter(filterType, option)}
//                                             className="rounded"
//                                         />
//                                         <span>{option}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="overflow-x-auto">
//                 <table className="incidents-table">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Title</th>
//                             <th>Project</th>
//                             <th>Issue Type</th>
//                             <th>Request Type</th>
//                             <th>Priority</th>
//                             <th>Status</th>
//                             <th>Assignee</th>
//                             <th>Created By</th>
//                             <th>Organization_id</th>
//                             <th>Created At</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {paginatedIncidents.map(incident => (
//                             <tr
//                                 key={incident.id}
//                                 onClick={(e) => handleRowClick(incident, e)}
//                                 className="cursor-pointer hover:bg-gray-50"
//                             >
//                                 <td>{incident.id}</td>
//                                 <td onClick={(e) => e.stopPropagation()}>
//                                     <Link
//                                         to={`/incidents/${incident.id}`}
//                                         className="text-blue-600 hover:text-blue-800 hover:underline"
//                                     >
//                                         {incident.title}
//                                     </Link>
//                                 </td>
//                                 <td>{incident.project}</td>
//                                 <td>{incident.issueType}</td>
//                                 <td>{incident.requestType}</td>
//                                 <td>
//                                     <span className={getPriorityBadgeClass(incident.priority)}>
//                                         {incident.priority}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <span className={getStatusBadgeClass(incident.status)}>
//                                         {incident.status}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <div className="flex items-center space-x-1">
//                                         <User size={16} />
//                                         <span>{incident.assignedTo?.first_name} {incident.assignedTo?.last_name}</span>
//                                     </div>
//                                 </td>
//                                 <td>{incident.creator?.first_name} {incident.creator?.last_name}</td>
//                                 <td>{incident.organization_id}</td>
//                                 <td>{incident.createdAt}</td>
//                                 <td onClick={(e) => e.stopPropagation()}>
//                                     <button
//                                         onClick={() => setSelectedIncident(incident)}
//                                         className="p-1 hover:bg-gray-100 rounded"
//                                     >
//                                         <Info size={16} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="pagination-container">
//                 <div>
//                     Showing {paginatedIncidents.length} of {filteredIncidents.length} incidents
//                 </div>
//                 <div className="flex space-x-2 items-center">
//                     <button
//                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                         disabled={currentPage === 1}
//                         className="pagination-button"
//                     >
//                         Previous
//                     </button>
//                     <span>{currentPage} of {totalPages}</span>
//                     <button
//                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                         disabled={currentPage === totalPages}
//                         className="pagination-button"
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>

//             {/* Incident Details Popup */}
//             {selectedIncident && (
//                 <div className="incident-details-overlay">
//                     <div className="incident-details-popup">
//                         <IncidentDetails
//                             incident={selectedIncident}
//                             onClose={() => setSelectedIncident(null)}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default IncidentsList;


// ------------------------------------------------------------------------------------------------------------

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Search,
    User,
    Info,
    Loader,
    AlertTriangle
} from 'lucide-react';
import './IncidentsList.css';
import IncidentDetails from './IncidentDetails';
import Filter from './Filter';

const API_BASE_URL = 'http://localhost:3000/api';

// Predefined filter options
const PREDEFINED_FILTERS = {
    projects: ['SUP', 'ITN', 'IH2.0', 'SIIE'],
    issueTypes: ['Incident', 'Bug', 'FeatureRequest', 'Support'],
    requestTypes: ['CriticalBug', 'UIBug', 'NewModule', 'LoginHelp'],
    assignees: ['support123HR', 'support123DEV', 'support123INFRA'],
    priorities: ['Urgent', 'High', 'Medium', 'Low'],
    statuses: ['Pending', 'In-progress', 'Open'],
    created_by: ['me']
};

const IncidentsList = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        projects: [],
        issueTypes: [],
        requestTypes: [],
        assignees: [],
        priorities: [],
        statuses: [],
        created_by: []
    });

    const [globalSearch, setGlobalSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
        isOpen: false
    });

    const getDateForComparison = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Generate unique filter options from incidents
    const uniqueFilters = useMemo(() => ({
        projects: [...new Set([...PREDEFINED_FILTERS.projects])].filter(Boolean).sort(),
        issueTypes: [...new Set([...PREDEFINED_FILTERS.issueTypes])].filter(Boolean).sort(),
        requestTypes: [...new Set([...PREDEFINED_FILTERS.requestTypes])].filter(Boolean).sort(),
        assignees: [...new Set([...PREDEFINED_FILTERS.assignees])].filter(Boolean).sort(),
        priorities: [...new Set([...PREDEFINED_FILTERS.priorities])].filter(Boolean).sort(),
        statuses: [...new Set([...PREDEFINED_FILTERS.statuses])].filter(Boolean).sort(),
        created_by: [...new Set([...PREDEFINED_FILTERS.created_by])].filter(Boolean).sort()
    }), []);

    // Fetch incidents from the backend
    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/tickets`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIncidents(response.data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
            setError(err.response?.data?.message || 'Error fetching tickets');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchIncidents();
    }, []);

    // Handle row click to navigate to detailed view
    const handleRowClick = (incident, e) => {
        if (e.target.tagName === 'A') return;
        setSelectedIncident(incident);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            projects: [],
            issueTypes: [],
            requestTypes: [],
            assignees: [],
            priorities: [],
            statuses: [],
            created_by: []
        });
        setDateFilter({
            startDate: '',
            endDate: '',
            isOpen: false
        });
        setGlobalSearch('');
        setCurrentPage(1);
    };

    // Filter incidents based on search and filter criteria
    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            const matchesGlobalSearch = globalSearch
                ? Object.values(incident).some(val =>
                    String(val).toLowerCase().includes(globalSearch.toLowerCase())
                )
                : true;

            // Date filtering logic
            let matchesDateRange = true;
            if (dateFilter.startDate || dateFilter.endDate) {
                const incidentDate = getDateForComparison(incident.createdAt);
                const startDate = getDateForComparison(dateFilter.startDate);
                const endDate = getDateForComparison(dateFilter.endDate);

                if (startDate && endDate) {
                    matchesDateRange = incidentDate >= startDate && incidentDate <= endDate;
                } else if (startDate) {
                    matchesDateRange = incidentDate >= startDate;
                } else if (endDate) {
                    matchesDateRange = incidentDate <= endDate;
                }
            }

            const matchesProjects = filters.projects.length === 0 || filters.projects.includes(incident.project);
            const matchesIssueTypes = filters.issueTypes.length === 0 || filters.issueTypes.includes(incident.issueType);
            const matchesRequestTypes = filters.requestTypes.length === 0 || filters.requestTypes.includes(incident.requestType);
            const matchesAssignees = filters.assignees.length === 0 || filters.assignees.includes(incident.assignee);
            const matchesPriorities = filters.priorities.length === 0 || filters.priorities.includes(incident.priority);
            const matchesStatuses = filters.statuses.length === 0 || filters.statuses.includes(incident.status);
            const matchesCreatedBy = filters.created_by.length === 0 || filters.created_by.includes(incident.created_by);

            return (
                matchesGlobalSearch &&
                matchesDateRange &&
                matchesProjects &&
                matchesIssueTypes &&
                matchesRequestTypes &&
                matchesAssignees &&
                matchesPriorities &&
                matchesStatuses &&
                matchesCreatedBy
            );
        });
    }, [incidents, filters, globalSearch, dateFilter]);

    // Paginate filtered incidents
    const paginatedIncidents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredIncidents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredIncidents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

    // Get badge classes for different attributes
    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'Urgent': return 'priority-badge priority-badge-urgent';
            case 'High': return 'priority-badge priority-badge-high';
            case 'Medium': return 'priority-badge priority-badge-medium';
            default: return 'priority-badge priority-badge-low';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Open': return 'status-badge status-badge-open';
            case 'In Progress': return 'status-badge status-badge-in-progress';
            case 'Resolved': return 'status-badge status-badge-resolved';
            default: return 'status-badge status-badge-closed';
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="loading-state">
                <Loader className="loading-spinner w-8 h-8" />
                <p>Loading tickets...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="empty-state">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading tickets: {error}</p>
                    <button
                        onClick={fetchIncidents}
                        className="pagination-button"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Incidents List</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search incidents..."
                            className="search-input pl-8"
                            value={globalSearch}
                            onChange={(e) => {
                                setGlobalSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="absolute left-2 top-3 text-gray-400" size={18} />
                    </div>
                    
                    <Filter 
                        filters={filters}
                        setFilters={setFilters}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        uniqueFilters={uniqueFilters}
                        onReset={resetFilters}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="incidents-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Project</th>
                            <th>Issue Type</th>
                            <th>Request Type</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Assignee</th>
                            <th>Created By</th>
                            <th>Organization_id</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedIncidents.map(incident => (
                            <tr
                                key={incident.id}
                                onClick={(e) => handleRowClick(incident, e)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <td>{incident.id}</td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <Link
                                        to={`/incidents/${incident.id}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {incident.title}
                                    </Link>
                                </td>
                                <td>{incident.project}</td>
                                <td>{incident.issueType}</td>
                                <td>{incident.requestType}</td>
                                <td>
                                    <span className={getPriorityBadgeClass(incident.priority)}>
                                        {incident.priority}
                                    </span>
                                </td>
                                <td>
                                    <span className={getStatusBadgeClass(incident.status)}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center space-x-1">
                                        <User size={16} />
                                        <span>{incident.assignedTo?.first_name} {incident.assignedTo?.last_name}</span>
                                    </div>
                                </td>
                                <td>{incident.creator?.first_name} {incident.creator?.last_name}</td>
                                <td>{incident.organization_id}</td>
                                <td>{incident.createdAt}</td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setSelectedIncident(incident)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <Info size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-container">
                <div>
                    Showing {paginatedIncidents.length} of {filteredIncidents.length} incidents
                </div>
                <div className="flex space-x-2 items-center">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Incident Details Popup */}
            {selectedIncident && (
                <div className="incident-details-overlay">
                    <div className="incident-details-popup">
                        <IncidentDetails
                            incident={selectedIncident}
                            onClose={() => setSelectedIncident(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentsList;