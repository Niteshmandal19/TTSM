// import React, { useState, useEffect } from 'react';
// import { PlusCircle, X, Edit2 } from 'lucide-react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// const Filter = ({ onFilterChange }) => {
//   const [filters, setFilters] = useState([]);
//   const [fieldOptions, setFieldOptions] = useState([]);
//   const [fieldValues, setFieldValues] = useState({});
//   const [newFilter, setNewFilter] = useState({
//     field: '',
//     operator: '',
//     value: ''
//   });
//   const [editingFilter, setEditingFilter] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch available fields and their possible values
//   const fetchFieldOptions = async () => {
//     try {
//       const response = await api.get('/fields');
//       setFieldOptions(response.data);
      
//       // Create an object to store values for each field
//       const values = {};
//       await Promise.all(
//         response.data.map(async (field) => {
//           const valuesResponse = await api.get(`/fields/${field.value}/values`);
//           values[field.value] = valuesResponse.data;
//         })
//       );
//       setFieldValues(values);
//     } catch (error) {
//       handleError(error, 'fetch field options');
//     }
//   };

//   useEffect(() => {
//     fetchFieldOptions();
//     fetchFilters();
//   }, []);

//   useEffect(() => {
//     if (onFilterChange) {
//       onFilterChange(filters);
//     }
//   }, [filters, onFilterChange]);

//   const handleError = (error, action) => {
//     if (error.response?.status === 401) {
//       setError('Session expired. Please log in again.');
//       return;
//     }
    
//     setError(error.response?.data?.error || `Failed to ${action}. Please try again.`);
//     console.error(`Error ${action}:`, error);
//   };

//   const fetchFilters = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get('/filters');
//       setFilters(response.data);
//       setError(null);
//     } catch (error) {
//       handleError(error, 'fetch filters');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getOperatorOptions = (fieldType) => {
//     const operatorMap = {
//       string: [
//         { value: 'equals', label: 'Equals' },
//         { value: 'contains', label: 'Contains' },
//         { value: 'starts_with', label: 'Starts With' },
//         { value: 'ends_with', label: 'Ends With' }
//       ],
//       number: [
//         { value: 'equals', label: 'Equals' },
//         { value: 'greater_than', label: 'Greater Than' },
//         { value: 'less_than', label: 'Less Than' },
//         { value: 'between', label: 'Between' }
//       ],
//       date: [
//         { value: 'equals', label: 'Equals' },
//         { value: 'before', label: 'Before' },
//         { value: 'after', label: 'After' },
//         { value: 'between', label: 'Between' }
//       ],
//       enum: [
//         { value: 'equals', label: 'Equals' },
//         { value: 'not_equals', label: 'Not Equals' }
//       ]
//     };

//     const selectedField = fieldOptions.find(f => f.value === newFilter.field);
//     return selectedField ? operatorMap[selectedField.type] || [] : [];
//   };

//   const validateFilter = (filter) => {
//     if (!filter.field || !filter.operator || !filter.value) {
//       setError('Please fill in all filter fields');
//       return false;
//     }
//     return true;
//   };

//   const createFilter = async () => {
//     if (!validateFilter(newFilter)) return;
    
//     setIsLoading(true);
//     try {
//       const response = await api.post('/filters', newFilter);
//       setFilters([response.data, ...filters]);
//       setNewFilter({ field: '', operator: '', value: '' });
//       setError(null);
//     } catch (error) {
//       handleError(error, 'create filter');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateFilter = async (id) => {
//     if (!validateFilter(editingFilter)) return;
    
//     setIsLoading(true);
//     try {
//       const response = await api.put(`/filters/${id}`, editingFilter);
//       setFilters(filters.map(f => f.id === id ? response.data : f));
//       setEditingFilter(null);
//       setError(null);
//     } catch (error) {
//       handleError(error, 'update filter');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteFilter = async (id) => {
//     setIsLoading(true);
//     try {
//       await api.delete(`/filters/${id}`);
//       setFilters(filters.filter(filter => filter.id !== id));
//       setError(null);
//     } catch (error) {
//       handleError(error, 'delete filter');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderValueInput = () => {
//     const selectedField = fieldOptions.find(f => f.value === newFilter.field);
//     if (!selectedField) return null;

//     const values = fieldValues[selectedField.value] || [];

//     switch (selectedField.type) {
//       case 'enum':
//         return (
//           <select
//             className="filter-select"
//             value={newFilter.value}
//             onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
//             disabled={isLoading}
//           >
//             <option value="">Select Value</option>
//             {values.map(value => (
//               <option key={value.id} value={value.value}>
//                 {value.label}
//               </option>
//             ))}
//           </select>
//         );
//       case 'date':
//         return (
//           <input
//             type="date"
//             className="filter-input"
//             value={newFilter.value}
//             onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
//             disabled={isLoading}
//           />
//         );
//       case 'number':
//         return (
//           <input
//             type="number"
//             className="filter-input"
//             value={newFilter.value}
//             onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
//             disabled={isLoading}
//           />
//         );
//       default:
//         return (
//           <input
//             type="text"
//             className="filter-input"
//             value={newFilter.value}
//             onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
//             disabled={isLoading}
//             placeholder="Enter value"
//           />
//         );
//     }
//   };

//   return (
//     <div className="filter-container">
//       <div className="filter-header">
//         <h2>Ticket Filters</h2>
//       </div>

//       {error && (
//         <div className="error-message" role="alert">
//           {error}
//         </div>
//       )}

//       <div className="filter-form">
//         <div className="filter-row">
//           <select
//             className="filter-select"
//             value={newFilter.field}
//             onChange={(e) => setNewFilter({
//               ...newFilter,
//               field: e.target.value,
//               operator: '',
//               value: ''
//             })}
//             disabled={isLoading}
//           >
//             <option value="">Select Field</option>
//             {fieldOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>

//           <select
//             className="filter-select"
//             value={newFilter.operator}
//             onChange={(e) => setNewFilter({...newFilter, operator: e.target.value})}
//             disabled={isLoading || !newFilter.field}
//           >
//             <option value="">Select Operator</option>
//             {getOperatorOptions(newFilter.field).map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>

//           <div className="filter-value-container">
//             {renderValueInput()}
//             <button
//               onClick={createFilter}
//               className="add-button"
//               disabled={isLoading}
//             >
//               <PlusCircle className="button-icon" />
//               Add
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="filter-list">
//         {filters.map((filter) => (
//           <div key={filter.id} className="filter-item">
//             {editingFilter && editingFilter.id === filter.id ? (
//               <div className="filter-edit-form">
//                 <select
//                   className="filter-select"
//                   value={editingFilter.field}
//                   onChange={(e) => setEditingFilter({
//                     ...editingFilter,
//                     field: e.target.value
//                   })}
//                 >
//                   {fieldOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   className="filter-select"
//                   value={editingFilter.operator}
//                   onChange={(e) => setEditingFilter({
//                     ...editingFilter,
//                     operator: e.target.value
//                   })}
//                 >
//                   {getOperatorOptions(editingFilter.field).map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {renderValueInput()}
//                 <div className="filter-edit-buttons">
//                   <button
//                     onClick={() => updateFilter(filter.id)}
//                     className="save-button"
//                     disabled={isLoading}
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setEditingFilter(null)}
//                     className="cancel-button"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="filter-item-content">
//                   <span className="filter-item-field">{filter.field}</span>
//                   <span className="filter-item-operator">{filter.operator}</span>
//                   <span className="filter-item-value">{filter.value}</span>
//                 </div>
//                 <div className="filter-item-actions">
//                   <button
//                     onClick={() => setEditingFilter(filter)}
//                     className="edit-button"
//                     disabled={isLoading}
//                   >
//                     <Edit2 className="button-icon" />
//                   </button>
//                   <button
//                     onClick={() => deleteFilter(filter.id)}
//                     className="delete-button"
//                     disabled={isLoading}
//                   >
//                     <X className="button-icon" />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//       </div>
//       )};

//       export default Filter;


import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Edit2 } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: '',
    value: ''
  });
  const [editingFilter, setEditingFilter] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available fields and their possible values
  const fetchFieldOptions = async () => {
    try {
      const response = await api.get('/fields');
      setFieldOptions(response.data);
      
      // Create an object to store values for each field
      const values = {};
      await Promise.all(
        response.data.map(async (field) => {
          const valuesResponse = await api.get(`/fields/${field.value}/values`);
          values[field.value] = valuesResponse.data;
        })
      );
      setFieldValues(values);
    } catch (error) {
      handleError(error, 'fetch field options');
    }
  };

  useEffect(() => {
    fetchFieldOptions();
    fetchFilters();
  }, []);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleError = (error, action) => {
    if (error.response?.status === 401) {
      setError('Session expired. Please log in again.');
      return;
    }
    
    setError(error.response?.data?.error || `Failed to ${action}. Please try again.`);
    console.error(`Error ${action}:`, error);
  };

  const fetchFilters = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/filters');
      setFilters(response.data);
      setError(null);
    } catch (error) {
      handleError(error, 'fetch filters');
    } finally {
      setIsLoading(false);
    }
  };

  const getOperatorOptions = (fieldType) => {
    const operatorMap = {
      string: [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'starts_with', label: 'Starts With' },
        { value: 'ends_with', label: 'Ends With' }
      ],
      number: [
        { value: 'equals', label: 'Equals' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' },
        { value: 'between', label: 'Between' }
      ],
      date: [
        { value: 'equals', label: 'Equals' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'between', label: 'Between' }
      ],
      enum: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' }
      ]
    };

    const selectedField = fieldOptions.find(f => f.value === newFilter.field);
    return selectedField ? operatorMap[selectedField.type] || [] : [];
  };

  const validateFilter = (filter) => {
    if (!filter.field || !filter.operator || !filter.value) {
      setError('Please fill in all filter fields');
      return false;
    }
    return true;
  };

  const createFilter = async () => {
    if (!validateFilter(newFilter)) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('/filters', newFilter);
      setFilters([response.data, ...filters]);
      setNewFilter({ field: '', operator: '', value: '' });
      setError(null);
    } catch (error) {
      handleError(error, 'create filter');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = async (id) => {
    if (!validateFilter(editingFilter)) return;
    
    setIsLoading(true);
    try {
      const response = await api.put(`/filters/${id}`, editingFilter);
      setFilters(filters.map(f => f.id === id ? response.data : f));
      setEditingFilter(null);
      setError(null);
    } catch (error) {
      handleError(error, 'update filter');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFilter = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/filters/${id}`);
      setFilters(filters.filter(filter => filter.id !== id));
      setError(null);
    } catch (error) {
      handleError(error, 'delete filter');
    } finally {
      setIsLoading(false);
    }
  };

  const renderValueInput = () => {
    const selectedField = fieldOptions.find(f => f.value === newFilter.field);
    if (!selectedField) return null;

    const values = fieldValues[selectedField.value] || [];

    switch (selectedField.type) {
      case 'enum':
        return (
          <select
            className="filter-select"
            value={newFilter.value}
            onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
            disabled={isLoading}
          >
            <option value="">Select Value</option>
            {values.map(value => (
              <option key={value.id} value={value.value}>
                {value.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            className="filter-input"
            value={newFilter.value}
            onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
            disabled={isLoading}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="filter-input"
            value={newFilter.value}
            onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
            disabled={isLoading}
          />
        );
      default:
        return (
          <input
            type="text"
            className="filter-input"
            value={newFilter.value}
            onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
            disabled={isLoading}
            placeholder="Enter value"
          />
        );
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2>Ticket Filters</h2>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="filter-form">
        <div className="filter-row">
          <select
            className="filter-select"
            value={newFilter.field}
            onChange={(e) => setNewFilter({
              ...newFilter,
              field: e.target.value,
              operator: '',
              value: ''
            })}
            disabled={isLoading}
          >
            <option value="">Select Field</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={newFilter.operator}
            onChange={(e) => setNewFilter({...newFilter, operator: e.target.value})}
            disabled={isLoading || !newFilter.field}
          >
            <option value="">Select Operator</option>
            {getOperatorOptions(newFilter.field).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {renderValueInput()}

          <button
            onClick={createFilter}
            className="add-button"
            disabled={isLoading}
          >
            <PlusCircle className="button-icon" />
            Add Filter
          </button>
        </div>
      </div>

      <div className="filter-list">
        {filters.map((filter) => (
          <div key={filter.id} className="filter-item">
            {editingFilter && editingFilter.id === filter.id ? (
              <div className="filter-edit-form">
                <select
                  className="filter-select"
                  value={editingFilter.field}
                  onChange={(e) => setEditingFilter({
                    ...editingFilter,
                    field: e.target.value
                  })}
                >
                  {fieldOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="filter-select"
                  value={editingFilter.operator}
                  onChange={(e) => setEditingFilter({
                    ...editingFilter,
                    operator: e.target.value
                  })}
                >
                  {getOperatorOptions(editingFilter.field).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {renderValueInput()}
                <div className="filter-edit-buttons">
                  <button
                    onClick={() => updateFilter(filter.id)}
                    className="save-button"
                    disabled={isLoading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingFilter(null)}
                    className="cancel-button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="filter-item-content">
                  <span className="filter-item-field">{filter.field}</span>
                  <span className="filter-item-operator">{filter.operator}</span>
                  <span className="filter-item-value">{filter.value}</span>
                </div>
                <div className="filter-item-actions">
                  <button
                    onClick={() => setEditingFilter(filter)}
                    className="edit-button"
                    disabled={isLoading}
                  >
                    <Edit2 className="button-icon" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFilter(filter.id)}
                    className="delete-button"
                    disabled={isLoading}
                  >
                    <X className="button-icon" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;