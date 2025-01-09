import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MasterManagement.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const OrgMasterCreationForm = ({ onClose }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        organization_id: '',
        org_name: '',
        member_no: '',
        address1: '',
        address2: '',
        pin_code: '',
        city: '',
        state: '',
        pan_no: '',
        gstn_no: '',
        agreement_no: '',
        date_of_agreement: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: undefined
            }));
        }
    };

    const validateForm = (data, requiredFields) => {
        const newErrors = {};
        requiredFields.forEach(field => {
            if (!data[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = [
            'organization_id', 'member_no', 'address1', 'pin_code',
            'city', 'state', 'pan_no', 'gstn_no',
            'agreement_no', 'date_of_agreement'
        ];
    
        if (validateForm(formData, requiredFields)) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/api/organization/create-org-master',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                console.log('Response data:', response.data);
                alert('Organization created successfully!');
                onClose();
            } catch (error) {
                console.error('Submission error:', error.response?.data || error);
                alert(error.response?.data?.message || 'An error occurred while submitting the form.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="org-master-form">
            <h2>Create Organization Master</h2>
            
            <div className="form-group">
                <label htmlFor="organization_id">Organization ID</label>
                <input
                    type="text"
                    id="organization_id"
                    name="organization_id"
                    value={formData.organization_id}
                    onChange={handleChange}
                    className={errors.organization_id ? 'error' : ''}
                />
                {errors.organization_id && <span className="error-message">{errors.organization_id}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="org_name">Organization Name</label>
                <input
                    type="text"
                    id="org_name"
                    name="org_name"
                    value={formData.org_name}
                    onChange={handleChange}
                    className={errors.org_name ? 'error' : ''}
                />
                {errors.org_name && <span className="error-message">{errors.org_name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="member_no">Member Number</label>
                <input
                    type="text"
                    id="member_no"
                    name="member_no"
                    value={formData.member_no}
                    onChange={handleChange}
                    className={errors.member_no ? 'error' : ''}
                />
                {errors.member_no && <span className="error-message">{errors.member_no}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="address1">Address Line 1</label>
                    <input
                        type="text"
                        id="address1"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className={errors.address1 ? 'error' : ''}
                    />
                    {errors.address1 && <span className="error-message">{errors.address1}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address2">Address Line 2</label>
                    <input
                        type="text"
                        id="address2"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="pin_code">PIN Code</label>
                    <input
                        type="text"
                        id="pin_code"
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={handleChange}
                        className={errors.pin_code ? 'error' : ''}
                    />
                    {errors.pin_code && <span className="error-message">{errors.pin_code}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="pan_no">PAN Number</label>
                    <input
                        type="text"
                        id="pan_no"
                        name="pan_no"
                        value={formData.pan_no}
                        onChange={handleChange}
                        className={errors.pan_no ? 'error' : ''}
                    />
                    {errors.pan_no && <span className="error-message">{errors.pan_no}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="gstn_no">GSTN Number</label>
                    <input
                        type="text"
                        id="gstn_no"
                        name="gstn_no"
                        value={formData.gstn_no}
                        onChange={handleChange}
                        className={errors.gstn_no ? 'error' : ''}
                    />
                    {errors.gstn_no && <span className="error-message">{errors.gstn_no}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="agreement_no">Agreement Number</label>
                    <input
                        type="text"
                        id="agreement_no"
                        name="agreement_no"
                        value={formData.agreement_no}
                        onChange={handleChange}
                        className={errors.agreement_no ? 'error' : ''}
                    />
                    {errors.agreement_no && <span className="error-message">{errors.agreement_no}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date_of_agreement">Agreement Date</label>
                    <input
                        type="date"
                        id="date_of_agreement"
                        name="date_of_agreement"
                        value={formData.date_of_agreement}
                        onChange={handleChange}
                        className={errors.date_of_agreement ? 'error' : ''}
                    />
                    {errors.date_of_agreement && <span className="error-message">{errors.date_of_agreement}</span>}
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Submit</button>
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

const MasterManagement = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/organization/list');
            setOrganizations(response.data.organizations || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            alert('Failed to fetch organizations');
            setOrganizations([]);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleDelete = async (event, orgId) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `http://localhost:3000/api/organization/soft-delete/${orgId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 200) {
                    alert('Organization deleted successfully');
                    await fetchOrganizations();
                }
            } catch (error) {
                console.error('Error deleting organization:', error);
                alert('Failed to delete organization: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const filteredOrganizations = organizations.filter(org =>
        org?.org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org?.organization_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrganizationClick = (organizationId) => {
        navigate(`/complete-org/${organizationId}`);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="master-management-container">
            <div className="management-header">
                <h1>Organization Master Management</h1>
                <div className="header-actions">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="create-org-btn"
                        onClick={() => setIsCreationModalOpen(true)}
                    >
                        <Plus /> Create New Organization
                    </button>
                </div>
            </div>

            <table className="organizations-table">
                <thead>
                    <tr>
                        <th>Organization ID</th>
                        <th>Organization Name</th>
                        <th>Member Number</th>
                        <th>Status</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrganizations.map(org => (
                        <tr
                            key={org.organization_id}
                            onClick={() => handleOrganizationClick(org.organization_id)}
                            className="clickable-row"
                        >
                            <td>{org.organization_id}</td>
                            <td>{org.org_name}</td>
                            <td>{org.member_no}</td>
                            <td className={org.status === 1 ? "status-active" : "status-inactive"}>
                                {org.status === 1 ? "Active" : "Inactive"}
                            </td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDelete(e, org.organization_id)}
                                    title="Delete Organization"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight />
                </button>
            </div>

            <Modal 
                isOpen={isCreationModalOpen} 
                onClose={() => setIsCreationModalOpen(false)}
            >
                <OrgMasterCreationForm
                    onClose={() => {
                        setIsCreationModalOpen(false);
                        fetchOrganizations();
                    }}
                />
            </Modal>
        </div>
    );
};

export default MasterManagement;