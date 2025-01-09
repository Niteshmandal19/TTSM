const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Filter = sequelize.define('Filter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    field: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    operator: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'filters',
    timestamps: true
  });

  Filter.associate = (models) => {
    Filter.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    Filter.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });
  };

module.exports = Filter;