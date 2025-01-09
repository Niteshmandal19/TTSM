// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Comment = sequelize.define('Comment', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   ticket_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Tickets',
//       key: 'id'
//     }
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Users',
//       key: 'id'
//     }
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     field: 'created_at',
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   sequelize,
//   tableName: 'comments',
//   timestamps: true,
//   createdAt: 'created_at',
//   // updatedAt: 'updated_at'
// });

// // Move associations to a separate function
// Comment.associate = (models) => {
//   Comment.belongsTo(models.Ticket, {
//     foreignKey: 'ticket_id',
//     as: 'ticket'
//   });
//   Comment.belongsTo(models.User, {
//     foreignKey: 'user_id',
//     as: 'user'
//   });
// };

// module.exports = Comment;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tickets',
      key: 'id'
    },
    field: 'ticket_id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_internal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  type: {
    type: DataTypes.ENUM('internal', 'open', 'system', 'status_change'),
    allowNull: false
  },
  attachment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachmentOriginalName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachmentType: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'comments',
  timestamps: false,
  underscored: true,
});

Comment.associate = (models) => {
  Comment.belongsTo(models.Ticket, {
    foreignKey: 'ticket_id',
    as: 'ticket'
  });
  
  Comment.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Comment;