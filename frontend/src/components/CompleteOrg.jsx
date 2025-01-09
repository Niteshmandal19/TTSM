// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Plus, Edit2, Save, X } from 'lucide-react';
// import './CompleteOrg.css';

// const CompleteOrg = () => {
//     const { organizationId } = useParams();
//     const [orgDetails, setOrgDetails] = useState(null);
//     const [products, setProducts] = useState([]);
//     const [signatories, setSignatories] = useState([]);
//     const [activeTab, setActiveTab] = useState('details');
//     const [showProductForm, setShowProductForm] = useState(false);
//     const [showSignatoryForm, setShowSignatoryForm] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editFormData, setEditFormData] = useState(null);

//     useEffect(() => {
//         fetchOrganizationData();
//     }, [organizationId]);

//     const fetchOrganizationData = async () => {
//         try {
//             // Fetch all organizations and find the specific one
//             const orgResponse = await axios.get('http://localhost:3000/api/organization/list');
//             const specificOrg = orgResponse.data.organizations.find(
//                 org => org.organization_id === organizationId
//             );

//             if (!specificOrg) {
//                 throw new Error('Organization not found');
//             }

//             setOrgDetails(specificOrg);

//             // Fetch products using the working endpoint
//             const productsResponse = await axios.get(`http://localhost:3000/api/organization/products/${organizationId}`);
//             setProducts(productsResponse.data.data || []);

//             // Fetch signatories using the working endpoint
//             const signatoriesResponse = await axios.get(`http://localhost:3000/api/organization/signatories/${organizationId}`);
//             setSignatories(signatoriesResponse.data.data || []);
//         } catch (error) {
//             console.error('Error fetching organization data:', error);
//             alert('Failed to fetch organization data');
//         }
//     };

//     const handleAddProduct = async (productData) => {
//         try {
//             await axios.post(`http://localhost:3000/api/organization/create-product/${organizationId}`, {
//                 ...productData,
//                 organization_id: organizationId
//             });
//             fetchOrganizationData();
//             setShowProductForm(false);
//         } catch (error) {
//             console.error('Error adding product:', error);
//             alert('Failed to add product');
//         }
//     };

//     const handleAddSignatory = async (signatoryData) => {
//         try {
//             await axios.post(`http://localhost:3000/api/organization/create-signatory/${organizationId}`, {
//                 ...signatoryData,
//                 organization_id: organizationId
//             });
//             fetchOrganizationData();
//             setShowSignatoryForm(false);
//         } catch (error) {
//             console.error('Error adding signatory:', error);
//             alert('Failed to add signatory');
//         }
//     };

//     const handleSaveChanges = async () => {
//         try {
//             await axios.put(`http://localhost:3000/api/organization/update/${organizationId}`, editFormData);
//             fetchOrganizationData();
//             setIsEditing(false);
//         } catch (error) {
//             console.error('Error updating organization:', error);
//             alert('Failed to update organization');
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };



//     const EditForm = () => (
//         <div className="edit-form-container">
//             <h3>Edit Organization Details</h3>
//             <form onSubmit={handleEditSubmit}>
//                 <div className="form-grid">
//                     <div className="form-group">
//                         <label>Organization Name</label>
//                         <input 
//                             name="org_name"
//                             value={editFormData.org_name}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Member Number</label>
//                         <input 
//                             name="member_no"
//                             value={editFormData.member_no}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Address 1</label>
//                         <input 
//                             name="address1"
//                             value={editFormData.address1}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Address 2</label>
//                         <input 
//                             name="address2"
//                             value={editFormData.address2}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>City</label>
//                         <input 
//                             name="city"
//                             value={editFormData.city}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>State</label>
//                         <input 
//                             name="state"
//                             value={editFormData.state}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Postal Code</label>
//                         <input 
//                             name="pin_code"
//                             value={editFormData.pin_code}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>PAN Number</label>
//                         <input 
//                             name="pan_no"
//                             value={editFormData.pan_no}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>GSTN Number</label>
//                         <input 
//                             name="gstn_no"
//                             value={editFormData.gstn_no}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Agreement Number</label>
//                         <input 
//                             name="agreement_no"
//                             value={editFormData.agreement_no}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Date of Agreement</label>
//                         <input 
//                             type="date"
//                             name="date_of_agreement"
//                             value={editFormData.date_of_agreement}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                 </div>
//                 <div className="form-actions">
//                     <button type="submit" className="save-button">Save Changes</button>
//                     <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );


//     const DetailField = ({ label, value, name, required = true }) => {
//         if (isEditing) {
//             return (
//                 <div className="detail-field">
//                     <label>{label}</label>
//                     <input
//                         name={name}
//                         value={editFormData[name] || ''}
//                         onChange={handleInputChange}
//                         required={required}
//                         type={name === 'date_of_agreement' ? 'date' : 'text'}
//                     />
//                 </div>
//             );
//         }
//         return (
//             <div className="detail-field">
//                 <label>{label}</label>
//                 <div className="detail-value">{value}</div>
//             </div>
//         );
//     };

//     const renderOrgDetails = () => {
//         if (!orgDetails) return null;

//         return (
//             <div className="org-details">
//                 <div className="section-header">
//                     <h2>Organization Details</h2>
//                     <div className="header-actions">
//                         {isEditing ? (
//                             <>
//                                 <button 
//                                     type="button"
//                                     onClick={handleSaveChanges} 
//                                     className="save-button"
//                                 >
//                                     <Save size={16} />
//                                     Save Changes
//                                 </button>
//                                 <button 
//                                     type="button"
//                                     onClick={() => {
//                                         setIsEditing(false);
//                                         setEditFormData(orgDetails);
//                                     }} 
//                                     className="cancel-button"
//                                 >
//                                     <X size={16} />
//                                     Cancel
//                                 </button>
//                             </>
//                         ) : (
//                             <button 
//                                 type="button"
//                                 onClick={() => {
//                                     setEditFormData(orgDetails);
//                                     setIsEditing(true);
//                                 }} 
//                                 className="edit-button"
//                             >
//                                 <Edit2 size={16} />
//                                 Edit Details
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 <div className="details-grid">
//                     <DetailField 
//                         label="Organization ID" 
//                         value={orgDetails.organization_id}
//                         name="organization_id"
//                     />
//                     <DetailField 
//                         label="Organization Name" 
//                         value={orgDetails.org_name}
//                         name="org_name"
//                     />
//                     <DetailField 
//                         label="Member Number" 
//                         value={orgDetails.member_no}
//                         name="member_no"
//                     />
//                     <DetailField 
//                         label="Address 1" 
//                         value={orgDetails.address1}
//                         name="address1"
//                     />
//                     <DetailField 
//                         label="Address 2" 
//                         value={orgDetails.address2}
//                         name="address2"
//                         required={false}
//                     />
//                     <DetailField 
//                         label="City" 
//                         value={orgDetails.city}
//                         name="city"
//                     />
//                     <DetailField 
//                         label="State" 
//                         value={orgDetails.state}
//                         name="state"
//                     />
//                     <DetailField 
//                         label="Postal Code" 
//                         value={orgDetails.pin_code}
//                         name="pin_code"
//                     />
//                     <DetailField 
//                         label="PAN Number" 
//                         value={orgDetails.pan_no}
//                         name="pan_no"
//                     />
//                     <DetailField 
//                         label="GSTN Number" 
//                         value={orgDetails.gstn_no}
//                         name="gstn_no"
//                     />
//                     <DetailField 
//                         label="Agreement Number" 
//                         value={orgDetails.agreement_no}
//                         name="agreement_no"
//                     />
//                     <DetailField 
//                         label="Date of Agreement" 
//                         value={orgDetails.date_of_agreement}
//                         name="date_of_agreement"
//                     />
//                     {!isEditing && (
//                         <>
//                             <DetailField 
//                                 label="Created By" 
//                                 value={orgDetails.created_by}
//                                 name="created_by"
//                             />
//                             <DetailField 
//                                 label="Created Date" 
//                                 value={orgDetails.created_at}
//                                 name="created_at"
//                             />
//                         </>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     if (!orgDetails) {
//         return <div>Loading...</div>;
//     }


//     const ProductForm = () => (
//         <div className="form-container">
//             <h3>Add New Product</h3>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.target);
//                 handleAddProduct({
//                     product_name: formData.get('product_name'),
//                     product_code: formData.get('product_code'),
//                     description: formData.get('description'),
//                     status: 'active'
//                 });
//             }}>
//                 <div className="form-group">
//                     <label>Product Name</label>
//                     <input name="product_name" placeholder="Product Name" required />
//                 </div>
//                 <div className="form-group">
//                     <label>Product Code</label>
//                     <input name="product_code" placeholder="Product Code" required />
//                 </div>
//                 <div className="form-group">
//                     <label>Description</label>
//                     <textarea name="description" placeholder="Description" required />
//                 </div>
//                 <div className="form-actions">
//                     <button type="submit">Add Product</button>
//                     <button type="button" onClick={() => setShowProductForm(false)}>Cancel</button>
//                 </div>
//             </form>
//         </div>
//     );

//     const SignatoryForm = () => (
//         <div className="form-container">
//             <h3>Add New Signatory</h3>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.target);
//                 handleAddSignatory({
//                     name: formData.get('name'),
//                     designation: formData.get('designation'),
//                     email_id: formData.get('email_id'),
//                     mobile_no: formData.get('mobile_no'),
//                     pan_no: formData.get('pan_no'),
//                     status: 'active'
//                 });
//             }}>
//                 <div className="form-group">
//                     <label>Name</label>
//                     <input name="name" placeholder="Name" required />
//                 </div>
//                 <div className="form-group">
//                     <label>Designation</label>
//                     <input name="designation" placeholder="Designation" required />
//                 </div>
//                 <div className="form-group">
//                     <label>Email</label>
//                     <input name="email_id" placeholder="Email" required type="email" />
//                 </div>
//                 <div className="form-group">
//                     <label>Mobile Number</label>
//                     <input name="mobile_no" placeholder="Mobile Number" required />
//                 </div>
//                 <div className="form-group">
//                     <label>Pan Number</label>
//                     <input name="pan_no" placeholder="Pan Number" required />
//                 </div>
//                 <div className="form-actions">
//                     <button type="submit">Add Signatory</button>
//                     <button type="button" onClick={() => setShowSignatoryForm(false)}>Cancel</button>
//                 </div>
//             </form>
//         </div>
//     );

//     if (!orgDetails) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="complete-org-container">
//             <div className="org-header">
//                 <h1>{orgDetails.organization_id}</h1>
//                 <div className="tab-buttons">
//                     <button 
//                         onClick={() => setActiveTab('details')}
//                         className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
//                     >
//                         Organization Details
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab('products')}
//                         className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
//                     >
//                         Products
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab('signatories')}
//                         className={`tab-button ${activeTab === 'signatories' ? 'active' : ''}`}
//                     >
//                         Signatories
//                     </button>
//                 </div>
//             </div>

//             <div className="tab-content">
//             {activeTab === 'details' && renderOrgDetails()}
//                 {activeTab === 'products' && (
//                     <div className="products-section">
//                         <div className="section-header">
//                             <h2>Products</h2>
//                             <button onClick={() => setShowProductForm(true)} className="add-button">
//                                 <Plus /> Add Product
//                             </button>
//                         </div>
//                         {showProductForm && <ProductForm />}
//                         <div className="products-grid">
//                             {products.map(product => (
//                                 <div key={product.id} className="product-card">
//                                     <h3>{product.product_name}</h3>
//                                     <p><strong>Code:</strong> {product.product_code}</p>
//                                     <p><strong>Description:</strong> {product.description}</p>
//                                     <p><strong>Status:</strong> {product.status}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'signatories' && (
//                     <div className="signatories-section">
//                         <div className="section-header">
//                             <h2>Signatories</h2>
//                             <button onClick={() => setShowSignatoryForm(true)} className="add-button">
//                                 <Plus /> Add Signatory
//                             </button>
//                         </div>
//                         {showSignatoryForm && <SignatoryForm />}
//                         <div className="signatories-grid">
//                             {signatories.map(signatory => (
//                                 <div key={signatory.id} className="signatory-card">
//                                     <h3>{signatory.name}</h3>
//                                     <p><strong>Designation:</strong> {signatory.designation}</p>
//                                     <p><strong>Email:</strong> {signatory.email_id}</p>
//                                     <p><strong>Mobile:</strong> {signatory.mobile_no}</p>
//                                     <p><strong>Status:</strong> {signatory.status}</p>
//                                     <p><strong>pan_no:</strong> {signatory.pan_no}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CompleteOrg;




import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Save, X } from 'lucide-react';
import OrgProducts from './OrgProducts';
import OrgSignatories from './OrgSignatories';
import './CompleteOrg.css';

const CompleteOrg = () => {
    const { organizationId } = useParams();
    const [orgDetails, setOrgDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [signatories, setSignatories] = useState([]);
    const [activeTab, setActiveTab] = useState('details');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showSignatoryForm, setShowSignatoryForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    useEffect(() => {
        fetchOrganizationData();
    }, [organizationId]);

    const fetchOrganizationData = async () => {
        try {
            const orgResponse = await axios.get('http://localhost:3000/api/organization/list');
            const specificOrg = orgResponse.data.organizations.find(
                org => org.organization_id === organizationId
            );

            if (!specificOrg) {
                throw new Error('Organization not found');
            }

            setOrgDetails(specificOrg);
            setEditFormData(specificOrg); // Initialize editFormData with current values
            await fetchProducts();
            await fetchSignatories();
        } catch (error) {
            console.error('Error fetching organization data:', error);
            alert('Failed to fetch organization data');
        }
    };

    const fetchProducts = async () => {
        try {
            const productsResponse = await axios.get(`http://localhost:3000/api/organization/products/${organizationId}`);
            setProducts(productsResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSignatories = async () => {
        try {
            const signatoriesResponse = await axios.get(`http://localhost:3000/api/organization/signatories/${organizationId}`);
            setSignatories(signatoriesResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching signatories:', error);
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            await axios.post(`http://localhost:3000/api/organization/create-product/${organizationId}`, {
                ...productData,
                organization_id: organizationId
            });
            fetchProducts();
            setShowProductForm(false);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleAddSignatory = async (signatoryData) => {
        try {
            await axios.post(`http://localhost:3000/api/organization/create-signatory/${organizationId}`, {
                ...signatoryData,
                organization_id: organizationId
            });
            fetchSignatories();
            setShowSignatoryForm(false);
        } catch (error) {
            console.error('Error adding signatory:', error);
            alert('Failed to add signatory');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update/${organizationId}`, editFormData);
            setOrgDetails(editFormData); // Update orgDetails immediately with the new data
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating organization:', error);
            alert('Failed to update organization');
        }
    };

    const DetailField = ({ label, value, name, required = true }) => {
        if (isEditing) {
            if (name === 'status') {
                return (
                    <div className="detail-field">
                        <label>{label}</label>
                        <select
                            name={name}
                            value={editFormData[name]}
                            onChange={handleInputChange}
                            required={required}
                            className="status-dropdown"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                );
            }
            return (
                <div className="detail-field">
                    <label>{label}</label>
                    <input
                        name={name}
                        value={editFormData[name] || ''}
                        onChange={handleInputChange}
                        required={required}
                        type={name === 'date_of_agreement' ? 'date' : 'text'}
                    />
                </div>
            );
        }
        return (
            <div className="detail-field">
                <label>{label}</label>
                <div className="detail-value">
                    {name === 'status' ?
                        (value === '1' ? 'Active' : 'Inactive') :
                        value}
                </div>
            </div>
        );
    };



    const renderOrgDetails = () => {
        if (!orgDetails) return null;

        return (
            <div className="org-details">
                <div className="section-header">
                    <h2>Organization Details {organizationId}</h2>
                    <div className="header-actions">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleSaveChanges}
                                    className="save-button"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditFormData(orgDetails);
                                    }}
                                    className="cancel-button"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditFormData(orgDetails);
                                    setIsEditing(true);
                                }}
                                className="edit-button"
                            >
                                <Edit2 size={16} />
                                Edit Details
                            </button>
                        )}
                    </div>
                </div>

                <div className="details-grid">
                    <DetailField
                        label="Status"
                        value={orgDetails.status}
                        name="status"
                    />
                    <DetailField
                        label="Organization ID"
                        value={orgDetails.organization_id}
                        name="organization_id"
                    />
                    <DetailField
                        label="Organization Name"
                        value={orgDetails.org_name}
                        name="org_name"
                    />
                    <DetailField
                        label="Member Number"
                        value={orgDetails.member_no}
                        name="member_no"
                    />
                    <DetailField
                        label="Address 1"
                        value={orgDetails.address1}
                        name="address1"
                    />
                    <DetailField
                        label="Address 2"
                        value={orgDetails.address2}
                        name="address2"
                        required={false}
                    />
                    <DetailField
                        label="City"
                        value={orgDetails.city}
                        name="city"
                    />
                    <DetailField
                        label="State"
                        value={orgDetails.state}
                        name="state"
                    />
                    <DetailField
                        label="Postal Code"
                        value={orgDetails.pin_code}
                        name="pin_code"
                    />
                    <DetailField
                        label="PAN Number"
                        value={orgDetails.pan_no}
                        name="pan_no"
                    />
                    <DetailField
                        label="GSTN Number"
                        value={orgDetails.gstn_no}
                        name="gstn_no"
                    />
                    <DetailField
                        label="Agreement Number"
                        value={orgDetails.agreement_no}
                        name="agreement_no"
                    />
                    <DetailField
                        label="Date of Agreement"
                        value={orgDetails.date_of_agreement}
                        name="date_of_agreement"
                    />
                    {!isEditing && (
                        <>
                            <DetailField
                                label="Created By"
                                value={orgDetails.created_by}
                                name="created_by"
                            />
                            <DetailField
                                label="Created Date"
                                value={orgDetails.created_at}
                                name="created_at"
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const ProductForm = () => (
        <div className="form-container">
            <h3>Add New Product</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddProduct({
                    product_name: formData.get('product_name'),
                    product_code: formData.get('product_code'),
                    description: formData.get('description'),
                    price: formData.get('price'),
                    status: 'ACTIVE'
                });
            }}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input name="product_name" placeholder="Product Name" required />
                </div>
                <div className="form-group">
                    <label>Product Code</label>
                    <input name="product_code" placeholder="Product Code" required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" placeholder="Description" required />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input name="price" type="number" placeholder="Price" required />
                </div>
                <div className="form-actions">
                    <button type="submit">Add Product</button>
                    <button type="button" onClick={() => setShowProductForm(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );

    const SignatoryForm = () => (
        <div className="form-container">
            <h3>Add New Signatory</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddSignatory({
                    name: formData.get('name'),
                    designation: formData.get('designation'),
                    email_id: formData.get('email_id'),
                    mobile_no: formData.get('mobile_no'),
                    pan_no: formData.get('pan_no'),
                    status: 'ACTIVE'
                });
            }}>
                <div className="form-group">
                    <label>Name</label>
                    <input name="name" placeholder="Name" required />
                </div>
                <div className="form-group">
                    <label>Designation</label>
                    <input name="designation" placeholder="Designation" required />
                </div>
                <div className="form-group">
                    <label>Email ID</label>
                    <input name="email_id" type="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input name="mobile_no" placeholder="Mobile Number" required />
                </div>
                <div className="form-group">
                    <label>PAN Number</label>
                    <input name="pan_no" placeholder="PAN Number" required />
                </div>
                <div className="form-actions">
                    <button type="submit">Add Signatory</button>
                    <button type="button" onClick={() => setShowSignatoryForm(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );

    if (!orgDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="complete-org-container">
            <div className="org-header">
                <h1>{orgDetails.organization_id}</h1>
                <div className="tab-buttons">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    >
                        Organization Details
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('signatories')}
                        className={`tab-button ${activeTab === 'signatories' ? 'active' : ''}`}
                    >
                        Signatories
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === 'details' && renderOrgDetails()}
                {activeTab === 'products' && (
                    <div className="products-section">
                        <div className="section-header">
                            <h2>Products  {organizationId}</h2>
                            <button onClick={() => setShowProductForm(true)} className="add-button">
                                <Plus size={16} /> Add Product
                            </button>
                        </div>
                        {showProductForm && <ProductForm />}
                        <OrgProducts products={products} onProductUpdate={fetchProducts} />
                    </div>
                )}

                {activeTab === 'signatories' && (
                    <div className="signatories-section">
                        <div className="section-header">
                            <h2>Signatories {organizationId}</h2>
                            <button onClick={() => setShowSignatoryForm(true)} className="add-button">
                                <Plus size={16} /> Add Signatory
                            </button>
                        </div>
                        {showSignatoryForm && <SignatoryForm />}
                        <OrgSignatories signatories={signatories} onSignatoryUpdate={fetchSignatories} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompleteOrg;

