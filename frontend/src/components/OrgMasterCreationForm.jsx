import React, { useState } from 'react';
import axios from 'axios';
import { CodeSquare } from 'lucide-react';


const OrgMasterCreationForm = ({
    isOpen = true,
    onClose = () => { }
}) => {
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
            'organization_id',
            'member_no', 'address1', 'pin_code',
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
        <div className={`org-master-form-overlay ${isOpen ? 'open' : ''}`}>
            <div className="org-master-form-container">
                <form onSubmit={handleSubmit} className="org-master-form">
                    <div className="form-header">
                        <CodeSquare size={24} />
                        <h2>Create Organization Master</h2>
                    </div>

                    {/* Bank Selection */}
                    <div className={`form-group ${errors.organization_id ? 'error' : ''}`}>
                        <label htmlFor="organization_id">organization_id</label>
                        <input
                            type="text"
                            id="organization_id"
                            name="organization_id"
                            value={formData.organization_id}
                            onChange={handleChange}
                            required
                        />
                        {errors.organization_id && <span className="error-message">{errors.organization_id}</span>}
                    </div>

                    {/* Member Number */}
                    <div className={`form-group ${errors.member_no ? 'error' : ''}`}>
                        <label htmlFor="member_no">member_no</label>
                        <input
                            type="text"
                            id="member_no"
                            name="member_no"
                            value={formData.member_no}
                            onChange={handleChange}
                            required
                        />
                        {errors.member_no && <span className="error-message">{errors.member_no}</span>}
                    </div>

                    {/* Organization Name */}
                    <div className={`form-group ${errors.org_name ? 'error' : ''}`}>
                        <label htmlFor="org_name">org_name</label>
                        <input
                            type="text"
                            id="org_name"
                            name="org_name"
                            value={formData.org_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.org_name && <span className="error-message">{errors.org_name}</span>}
                    </div>

                    {/* Address Fields */}
                    <div className="form-group">
                        <label htmlFor="address1">Address Line 1</label>
                        <input
                            type="text"
                            id="address1"
                            name="address1"
                            value={formData.address1}
                            onChange={handleChange}
                            required
                        />
                        {errors.address1 && <span className="error-message">{errors.address1}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address2">address2</label>
                        <input
                            type="text"
                            id="address2"
                            name="address2"
                            value={formData.address2}
                            onChange={handleChange}
                        />
                        {errors.address2 && <span className="error-message">{errors.address2}</span>}
                    </div>

                    {/* Location Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pin_code">pin_code</label>
                            <input
                                type="text"
                                id="pin_code"
                                name="pin_code"
                                value={formData.pin_code}
                                onChange={handleChange}
                                required
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
                                required
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
                                required
                            />
                            {errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                    </div>

                    {/* Tax and Registration Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pan_no">pan_no</label>
                            <input
                                type="text"
                                id="pan_no"
                                name="pan_no"
                                value={formData.pan_no}
                                onChange={handleChange}
                                required
                            />
                            {errors.pan_no && <span className="error-message">{errors.pan_no}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="gstn_no">gstn_no</label>
                            <input
                                type="text"
                                id="gstn_no"
                                name="gstn_no"
                                value={formData.gstn_no}
                                onChange={handleChange}
                                required
                            />
                            {errors.gstn_no && <span className="error-message">{errors.gstn_no}</span>}
                        </div>
                    </div>

                    {/* Agreement Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="agreement_no">agreement_no</label>
                            <input
                                type="text"
                                id="agreement_no"
                                name="agreement_no"
                                value={formData.agreement_no}
                                onChange={handleChange}
                                required
                            />
                            {errors.agreement_no && <span className="error-message">{errors.agreement_no}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="date_of_agreement">date_of_agreement</label>
                            <input
                                type="date"
                                id="date_of_agreement"
                                name="date_of_agreement"
                                value={formData.date_of_agreement}
                                onChange={handleChange}
                                required
                            />
                            {errors.date_of_agreement && <span className="error-message">{errors.date_of_agreement}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Submit</button>
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrgMasterCreationForm;