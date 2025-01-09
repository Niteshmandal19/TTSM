// const sequelize = require('./config/database');
// const User = require('./User');
// const Comment = require('./Comment');
// const Ticket = require('./Ticket');


// function initializeAssociations() {
//   // Call associate methods if they exist
//   if (User.associate) User.associate({ Ticket, Comment });
//   if (Ticket.associate) Ticket.associate({ User, Comment });
//   if (Comment.associate) Comment.associate({ User, Ticket });
// }

// initializeAssociations();

// // Load models
// const models = { User, Comment, Ticket };

// // Define associations
// Object.keys(models).forEach((modelName) => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

// // Export models and sequelize instance
// module.exports = { 
//   User,
//   Ticket,
//   Comment
//  };
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models directly
const User = require('./User');
const Comment = require('./Comment');
const Ticket = require('./Ticket');
const Filter = require('./Filter');

// Create models object
const models = {
  User,
  Ticket,
  Comment,
  Filter
};

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize
};