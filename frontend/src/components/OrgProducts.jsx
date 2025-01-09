
// import React from 'react';
// import axios from 'axios';

// const OrgProducts = ({ products, onProductUpdate }) => {
//     const handleInputChange = (index, field, value) => {
//         const updatedProducts = [...products];
//         updatedProducts[index] = {
//             ...updatedProducts[index],
//             [field]: value
//         };
//         onProductUpdate(updatedProducts);
//     };

//     return (
//         <div className="products-section">
//             <h3>Products</h3>
//             <div className="products-table-container">
//                 <table className="products-table">
//                     <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>Product Code</th>
//                             <th>Description</th>
//                             <th>Price</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((product, index) => (
//                             <tr key={product.id}>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         value={product.product_name}
//                                         onChange={(e) => handleInputChange(index, 'product_name', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         value={product.product_code}
//                                         onChange={(e) => handleInputChange(index, 'product_code', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         value={product.description}
//                                         onChange={(e) => handleInputChange(index, 'description', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         value={product.price}
//                                         onChange={(e) => handleInputChange(index, 'price', e.target.value)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={product.status}
//                                         onChange={(e) => handleInputChange(index, 'status', e.target.value)}
//                                     >
//                                         <option value="ACTIVE">Active</option>
//                                         <option value="INACTIVE">Inactive</option>
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <button
//                                         onClick={() => handleProductUpdate(product.id, index)}
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

// export default OrgProducts;


// OrgProducts.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Edit2, Save, X } from 'lucide-react';

const OrgProducts = ({ products, onProductUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditData(product);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (productId) => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update-products/${productId}`, editData);
            onProductUpdate(); // Refresh the products list
            setEditingId(null);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    return (
        <div className="products-section">
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Code</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {editingId === product.id ? (
                                        <input
                                            type="text"
                                            value={editData.product_name}
                                            onChange={(e) => handleInputChange('product_name', e.target.value)}
                                        />
                                    ) : (
                                        product.product_name
                                    )}
                                </td>
                                <td>
                                    {editingId === product.id ? (
                                        <input
                                            type="text"
                                            value={editData.product_code}
                                            onChange={(e) => handleInputChange('product_code', e.target.value)}
                                        />
                                    ) : (
                                        product.product_code
                                    )}
                                </td>
                                <td>
                                    {editingId === product.id ? (
                                        <input
                                            type="text"
                                            value={editData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                    ) : (
                                        product.description
                                    )}
                                </td>
                                <td>
                                    {editingId === product.id ? (
                                        <input
                                            type="number"
                                            value={editData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                        />
                                    ) : (
                                        product.price
                                    )}
                                </td>
                                <td>
                                    {editingId === product.id ? (
                                        <select
                                            value={editData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    ) : (
                                        product.status
                                    )}
                                </td>
                                <td>
                                    {editingId === product.id ? (
                                        <div className="button-group">
                                            <button
                                                onClick={() => handleSave(product.id)}
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
                                            onClick={() => handleEdit(product)}
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

export default OrgProducts;