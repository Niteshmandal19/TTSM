// import React from 'react';
// import axios from 'axios';

// const OrgSignatories = ({ signatories, onSignatoryUpdate }) => {
//     const handleInputChange = (index, field, value) => {
//         const updatedSignatories = [...signatories];
//         updatedSignatories[index] = {
//             ...updatedSignatories[index],
//             [field]: value
//         };
//         onSignatoryUpdate(updatedSignatories);
//     };

//     return (
//         <div className="signatories-section">
//             <h3>Signatories</h3>
//             <div className="signatories-table-container">
//                 <table className="signatories-table">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Position</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {signatories.map((signatory, index) => (
//                             <tr key={signatory.id}>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         value={signatory.name}
//                                         onChange={(e) => handleInputChange(index, 'name', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         value={signatory.position}
//                                         onChange={(e) => handleInputChange(index, 'position', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="email"
//                                         value={signatory.email}
//                                         onChange={(e) => handleInputChange(index, 'email', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="tel"
//                                         value={signatory.phone}
//                                         onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={signatory.status}
//                                         onChange={(e) => handleInputChange(index, 'status', e.target.value)}
//                                     >
//                                         <option value="ACTIVE">Active</option>
//                                         <option value="INACTIVE">Inactive</option>
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <button
//                                         onClick={() => handleSignatoryUpdate(signatory.id, index)}
//                                         className="update-btn"
//                                     >
//                                         Update
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default OrgSignatories;


import React, { useState } from 'react';
import axios from 'axios';
import { Edit2, Save, X } from 'lucide-react';

const OrgSignatories = ({ signatories, onSignatoryUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEdit = (signatory) => {
        setEditingId(signatory.id);
        setEditData(signatory);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (signatoryId) => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update-signatories/${signatoryId}`, editData);
            onSignatoryUpdate(); // Refresh the signatories list
            setEditingId(null);
        } catch (error) {
            console.error('Error updating signatory:', error);
            alert('Failed to update signatory');
        }
    };

    return (
        <div className="signatories-section">
            <div className="signatories-table-container">
                <table className="signatories-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>designation</th>
                            <th>email_id</th>
                            <th>mobile_no</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {signatories.map((signatory) => (
                            <tr key={signatory.id}>
                                <td>
                                    {editingId === signatory.id ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    ) : (
                                        signatory.name
                                    )}
                                </td>
                                <td>
                                    {editingId === signatory.id ? (
                                        <input
                                            type="text"
                                            value={editData.designation}
                                            onChange={(e) => handleInputChange('designation', e.target.value)}
                                        />
                                    ) : (
                                        signatory.designation
                                    )}
                                </td>
                                <td>
                                    {editingId === signatory.id ? (
                                        <input
                                            type="email_id"
                                            value={editData.email_id}
                                            onChange={(e) => handleInputChange('email_id', e.target.value)}
                                        />
                                    ) : (
                                        signatory.email_id
                                    )}
                                </td>
                                <td>
                                    {editingId === signatory.id ? (
                                        <input
                                            type="tel"
                                            value={editData.mobile_no}
                                            onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                                        />
                                    ) : (
                                        signatory.mobile_no
                                    )}
                                </td>
                                <td>
                                    {editingId === signatory.id ? (
                                        <select
                                            value={editData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    ) : (
                                        signatory.status
                                    )}
                                </td>
                                <td>
                                    {editingId === signatory.id ? (
                                        <div className="button-group">
                                            <button
                                                onClick={() => handleSave(signatory.id)}
                                                className="save-btn"
                                            >
                                                <Save size={16} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="cancel-btn"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(signatory)}
                                            className="edit-btn"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrgSignatories;
