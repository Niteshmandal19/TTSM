// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const orgController = require('../controllers/orgController');
// const { createOrgMaster } = require('../controllers/orgController'); // Correct singular import

// // Create OrgMaster route
// router.post('/create-org-master', 
//   authMiddleware, // Middleware for authentication
//   createOrgMaster  // Controller function
// );


// // Product routes
// router.post('/create-product', orgController.createProduct);
// router.get('/products/:orgId', orgController.getProductsByOrgId);

// // Signatory routes
// router.post('/create-signatory', orgController.createSignatory);
// router.get('/signatories/:orgId', orgController.getSignatoriesByOrgId);

// module.exports = router;

// module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orgController = require('../controllers/orgController');
const { createOrgMaster } = require('../controllers/orgController');

// Existing routes
router.post('/create-org-master', authMiddleware, createOrgMaster);
router.post('/create-product/:orgId', orgController.createProduct);
router.post('/create-signatory/:orgId', orgController.createSignatory);

// New routes for management
router.get('/list', authMiddleware, orgController.listOrganizations);
router.put('/update/:orgId', authMiddleware, orgController.updateOrganization);
router.put('/update-products/:orgId', authMiddleware, orgController.updateProducts);
router.put('/update-signatories/:id', authMiddleware, orgController.updateSignatories);
router.delete('/soft-delete/:orgId', authMiddleware, orgController.softDeleteOrganization);

// Product and Signatory routes remain the same
router.get('/products/:orgId', orgController.getProductsByOrgId);
router.get('/signatories/:orgId', orgController.getSignatoriesByOrgId);
router.delete('/delete/:Id', authMiddleware, orgController.deleteProduct);
router.delete('/delete/:Id', authMiddleware, orgController.deleteSignatory);

module.exports = router;