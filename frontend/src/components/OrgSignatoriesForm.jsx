// import React, { useState } from 'react';
// import './OrgMasterCreationForm.css'; // Using same CSS for consistency

// const OrgSignatoriesForm = ({ organisationId, numSignatories, onComplete, onCancel }) => {
//     const [currentSignatoryIndex, setCurrentSignatoryIndex] = useState(0);
//     const [signatories, setSignatories] = useState(Array(numSignatories).fill({
//         organisation_id: organisationId,
//         designation: '',
//         pan_no: '',
//         email_id: '',
//         mobile_no: '',
//         status: 'Active',
//         date_creation: new Date().toISOString()
//     }));

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSignatories(prev => {
//             const newSignatories = [...prev];
//             newSignatories[currentSignatoryIndex] = {
//                 ...newSignatories[currentSignatoryIndex],
//                 [name]: value
//             };
//             return newSignatories;
//         });
//     };

//     const handleNext = async (e) => {
//         e.preventDefault();
        
//         if (currentSignatoryIndex < numSignatories - 1) {
//             setCurrentSignatoryIndex(prev => prev + 1);
//         } else {
//             try {
//                 const response = await fetch('/api/signatories', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(signatories)
//                 });

//                 if (response.ok) {
//                     alert('All signatories added successfully!');
//                     onComplete();
//                 } else {
//                     const errorData = await response.json();
//                     alert(`Error: ${errorData.message || 'Failed to add signatories'}`);
//                 }
//             } catch (error) {
//                 console.error('Submission error:', error);
//                 alert('An error occurred while submitting signatories data.');
//             }
//         }
//     };

//     const handlePrevious = () => {
//         setCurrentSignatoryIndex(prev => Math.max(0, prev - 1));
//     };

//     return (
//         <div className="org-master-form-overlay">
//             <div className="org-master-form-container">
//                 <form onSubmit={handleNext} className="org-master-form">
//                     <h2>Organization Signatories Details</h2>
//                     <div className="signatory-progress">
//                         <h3>Signatory {currentSignatoryIndex + 1} of {numSignatories}</h3>
//                         <div className="progress-indicator">
//                             {Array(numSignatories).fill(0).map((_, index) => (
//                                 <div
//                                     key={index}
//                                     className={`progress-dot ${index === currentSignatoryIndex ? 'active' : ''} 
//                                               ${index < currentSignatoryIndex ? 'completed' : ''}`}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="designation">Designation</label>
//                         <input 
//                             type="text"
//                             id="designation"
//                             name="designation"
//                             value={signatories[currentSignatoryIndex].designation}
//                             onChange={handleChange}
//                             required
//                             maxLength="50"
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="pan_no">PAN Number</label>
//                         <input 
//                             type="text"
//                             id="pan_no"
//                             name="pan_no"
//                             value={signatories[currentSignatoryIndex].pan_no}
//                             onChange={handleChange}
//                             required
//                             maxLength="10"
//                             pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
//                             title="Please enter a valid PAN number (e.g., ABCDE1234F)"
//                         />
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group">
//                             <label htmlFor="email_id">Email ID</label>
//                             <input 
//                                 type="email"
//                                 id="email_id"
//                                 name="email_id"
//                                 value={signatories[currentSignatoryIndex].email_id}
//                                 onChange={handleChange}
//                                 required
//                                 maxLength="100"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="mobile_no">Mobile Number</label>
//                             <input 
//                                 type="tel"
//                                 id="mobile_no"
//                                 name="mobile_no"
//                                 value={signatories[currentSignatoryIndex].mobile_no}
//                                 onChange={handleChange}
//                                 required
//                                 pattern="[0-9]{10}"
//                                 maxLength="10"
//                                 title="Please enter a valid 10-digit mobile number"
//                             />
//                         </div>
//                     </div>

//                     <div className="form-actions">
//                         <button 
//                             type="button" 
//                             className="cancel-btn" 
//                             onClick={onCancel}
//                         >
//                             Cancel
//                         </button>
//                         {currentSignatoryIndex > 0 && (
//                             <button 
//                                 type="button" 
//                                 className="previous-btn" 
//                                 onClick={handlePrevious}
//                             >
//                                 Previous
//                             </button>
//                         )}
//                         <button 
//                             type="submit" 
//                             className="submit-btn"
//                         >
//                             {currentSignatoryIndex === numSignatories - 1 ? 'Submit All' : 'Next Signatory'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default OrgSignatoriesForm;