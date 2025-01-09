const Filter = require('../models/Filter');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all filters
const getAllFilters = async (req, res) => {
  try {
    const filters = await Filter.findAll({
      attributes: ['id', 'field', 'operator', 'value'],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(filters);
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
};

// Create a new filter
const createFilter = async (req, res) => {
  try {
    const { field, operator, value } = req.body;
    
    // Validate required fields
    if (!field || !operator || !value) {
      return res.status(400).json({ 
        error: 'All fields are required (field, operator, value)' 
      });
    }

    // Create filter with user ID from auth
    const newFilter = await Filter.create({
      field,
      operator,
      value,
      created_by: req.user.id, // Assuming req.user is set by auth middleware
      updated_by: req.user.id
    });

    // Fetch the created filter with creator info
    const filter = await Filter.findByPk(newFilter.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        }
      ]
    });

    res.status(201).json(filter);
  } catch (error) {
    console.error("Error creating filter:", error);
    res.status(500).json({ error: 'Failed to create filter' });
  }
};

// Update a filter
const updateFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, operator, value } = req.body;

    // Validate required fields
    if (!field || !operator || !value) {
      return res.status(400).json({ 
        error: 'All fields are required (field, operator, value)' 
      });
    }

    const filter = await Filter.findByPk(id);
    
    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    // Update filter
    await filter.update({
      field,
      operator,
      value,
      updated_by: req.user.id // Assuming req.user is set by auth middleware
    });

    // Fetch updated filter with creator info
    const updatedFilter = await Filter.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        }
      ]
    });

    res.status(200).json(updatedFilter);
  } catch (error) {
    console.error("Error updating filter:", error);
    res.status(500).json({ error: 'Failed to update filter' });
  }
};

// Delete a filter
const deleteFilter = async (req, res) => {
  try {
    const { id } = req.params;
    
    const filter = await Filter.findByPk(id);
    
    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    await filter.destroy();
    res.status(200).json({ message: 'Filter deleted successfully' });
  } catch (error) {
    console.error("Error deleting filter:", error);
    res.status(500).json({ error: 'Failed to delete filter' });
  }
};

module.exports = {
  getAllFilters,
  createFilter,
  deleteFilter,
  updateFilter,
};