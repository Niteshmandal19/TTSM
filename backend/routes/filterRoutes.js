const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');
const authMiddleware = require('../middleware/authMiddleware');
const {
    createFilter,
    getAllFilters,
    updateFilter,
    deleteFilter
  } = require('../controllers/filterController');

router.get('/', authMiddleware, getAllFilters);
router.post('/', authMiddleware, createFilter);
router.put('/:id', authMiddleware, updateFilter);
router.delete('/:id', authMiddleware, deleteFilter);

module.exports = router;

