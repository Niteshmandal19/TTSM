// ticketController.js
const Ticket = require('../models/Ticket');
const User = require('../models/User'); // Import User model
const Comment = require('../models/Comment')
const sequelize = require('../config/database'); // Import sequelize
const path = require('path');
const { Op } = require('sequelize');
const TicketStatusLog = require('../models/TicketStatusLog'); // Update the path as per your project structure
const fs = require('fs').promises;
const multer = require('multer');

// const { User, Ticket, Comment } = require('../models');



const createTicket = async (req, res) => {
  const transaction = await sequelize.transaction();
  // In your ticket creation controller
  try {
    const {
      project,
      issueType,
      requestType,
      title,
      description,
      assignee,
      priority,
      impact,
      status = 'Open',
      initialComment // Optional initial comment
    } = req.body;

    const created_by = req.user.id;
    const organization_id = req.user.organization_id;
    const userId = req.user.id; // Assuming user ID is available in the request

    const ticketData = {
      project,
      issueType,
      requestType,
      title,
      description,
      assignee,
      priority,
      impact,
      created_by,
      organization_id,
      status
    };
    console.log(ticketData);

    if (req.file) {
      ticketData.attachment = req.file.path;
      ticketData.attachmentOriginalName = req.file.originalname;
    }

    // Create ticket within transaction
    const newTicket = await Ticket.create(ticketData, { transaction });

    // Create initial comment if provided
    if (initialComment) {
      await Comment.create({
        content: initialComment,
        ticketId: newTicket.id,
        userId: userId
      }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();

    console.error('Ticket creation error:', error);
    res.status(500).json({
      message: 'Failed to create ticket',
      error: error.message
    });
  }
};



const getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'email'],
            }
          ],
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name'],
        }
      ],
      order: [[{ model: Comment, as: 'comments' }, 'created_at', 'ASC']], // Updated to use created_at
    });

    if (!ticket) {
      console.warn(`No ticket found with ID: ${id}`);
      return res.status(404).json({ message: 'Ticket not found' });
    }

    console.debug(`Ticket found: ${JSON.stringify(ticket, null, 2)}`);

    res.json(ticket);
  } catch (error) {
    console.error(`Error fetching ticket details for ID ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Failed to fetch ticket details',
      error: error.message,
    });
  }
};


// New function to get ticket details
// const getComments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ticket = await Ticket.findByPk(id, {
//       include: [
//         {
//           model: Comment,
//           as: 'comments',
//           include: [
//             {
//               model: User,
//               as: 'user',
//               attributes: ['id', 'username', 'email']
//             }
//           ]
//         }
//       ]
//     });

//     if (!ticket) {
//       return res.status(404).json({ message: 'Ticket not found' });
//     }

//     res.json(ticket.comments); // Return only comments
//   } catch (error) {
//     console.error('Error fetching ticket details:', error);
//     res.status(500).json({
//       message: 'Failed to fetch ticket details',
//       error: error.message
//     });
//   }
// };



// const createComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//   const { content } = req.body;
//   const userId = req.user.id;
//   const ticketId = id;



//     // Validate inputs
//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Comment content cannot be empty' });
//     }

//     if (!ticketId) {
//       return res.status(400).json({ message: 'Ticket ID is required' });
//     }

//     console.log("create-comment-userID", userId);

//     // Optional: Verify ticket exists
//     const ticket = await Ticket.findByPk(ticketId);
//     if (!ticket) {
//       return res.status(404).json({ message: 'Ticket not found' });
//     }
//     console.log("createcommet", ticketId, userId);

//     const comment = await Comment.create({
//       ticket_id:ticketId,
//       user_id:userId,
//       content: content.trim()
//     });

//     res.status(201).json(comment);
//   } catch (error) {
//     console.error('Comment creation error:', error);
//     res.status(500).json({
//       message: 'Error creating comment',
//       details: error.message,
//       // Optional: include more error details for debugging
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };


const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userOrganizationId = req.user.organization_id;

    let queryOptions = {
      where: { ticket_id: id }
    };

    // If user is not from IBDIC, exclude internal comments
    if (userOrganizationId !== 'IBDIC') {
      queryOptions.where.type = {
        [Op.ne]: 'internal'  // Op should be imported from sequelize
      };
    }

    const comments = await Comment.findAll({
      ...queryOptions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'organization_id']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Modify your createComment controller
// const createComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content, type } = req.body;
//     const userId = req.user.id;
//     const userOrganizationId = req.user.organization_id;

//     // Validate inputs
//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Comment content cannot be empty' });
//     }

//     // Check if user can create internal comments
//     if (type === 'internal' && userOrganizationId !== 'IBDIC') {
//       return res.status(403).json({ 
//         message: 'Only IBDIC users can create internal comments' 
//       });
//     }

//     const ticket = await Ticket.findByPk(id);
//     if (!ticket) {
//       return res.status(404).json({ message: 'Ticket not found' });
//     }

//     const comment = await Comment.create({
//       ticket_id: id,
//       user_id: userId,
//       content: content.trim(),
//       type: type,
//       is_internal: type === 'internal'
//     });

//     // Fetch the created comment with user details
//     const createdComment = await Comment.findByPk(comment.id, {
//       include: [{
//         model: User,
//         as: 'user',
//         attributes: ['id', 'first_name', 'last_name', 'email', 'organization_id']
//       }]
//     });

//     res.status(201).json(createdComment);
//   } catch (error) {
//     console.error('Comment creation error:', error);
//     res.status(500).json({
//       message: 'Error creating comment',
//       error: error.message
//     });
//   }
// };


// const createComment = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { content, type } = req.body;
//     const userId = req.user.id;
//     const file = req.file; // Assuming you're using multer for file uploads

//     if (!content || content.trim() === '') {
//       return res.status(400).json({ message: 'Comment content cannot be empty' });
//     }

//     const commentData = {
//       ticket_id: id,
//       user_id: userId,
//       content: content.trim(),
//       type: type,
//       is_internal: type === 'internal'
//     };

//     // If there's a file, add attachment info
//     if (file) {
//       commentData.attachment = file.filename;
//       commentData.attachmentOriginalName = file.originalname;
//       commentData.attachmentType = file.mimetype;
//     }

//     const comment = await Comment.create(commentData, { transaction });

//     const createdComment = await Comment.findByPk(comment.id, {
//       include: [{
//         model: User,
//         as: 'user',
//         attributes: ['id', 'first_name', 'last_name', 'email']
//       }],
//       transaction
//     });

//     await transaction.commit();
//     res.status(201).json(createdComment);
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Comment creation error:', error);
//     res.status(500).json({
//       message: 'Error creating comment',
//       error: error.message
//     });
//   }
// };

// const downloadCommentAttachment = async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const comment = await Comment.findByPk(commentId);

//     if (!comment || !comment.attachment) {
//       return res.status(404).json({ message: 'Attachment not found' });
//     }

//     const filePath = path.join(__dirname, '../uploads', comment.attachment);
//     res.download(filePath, comment.attachmentOriginalName);
//   } catch (error) {
//     console.error('Error downloading attachment:', error);
//     res.status(500).json({ message: 'Error downloading attachment' });
//   }
// };


const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comments/');
  },
  filename: (req, file, cb) => {
    cb(null, `comment-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Multer upload configuration for comments
const uploadComment = multer({
  storage: commentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// Create comment with attachment support
const createComment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { content, type } = req.body;

    // Debug logging
    console.log('Request body:', req.body);
    console.log('Type:', type);

    // Explicit type validation
    if (!type) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Comment type is required',
        receivedType: type,
        body: req.body
      });
    }

    // Check if ticket exists and user has access
    const ticket = await Ticket.findOne({
      where: {
        id,
        organization_id
      },
    });

    if (!ticket) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Prepare comment data
    const commentData = {
      content: content || 'File attachment',
      type,
      user_id: userId,
      ticket_id: id,
      organization_id
    };

    // Add file information if present
    if (req.file) {
      commentData.attachment = req.file.path;
      commentData.attachmentOriginalName = req.file.originalname;
      commentData.attachmentMimeType = req.file.mimetype;
    }

    // Create comment within transaction
    const comment = await Comment.create(commentData, { transaction });

    // Fetch the created comment with user details
    const createdComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['first_name', 'last_name'],
      }],
    });

    // Commit transaction
    await transaction.commit();

    res.status(201).json(createdComment);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating comment:', error);
    res.status(500).json({
      message: 'Failed to create comment',
      error: error.message,
      requestBody: req.body // Include request body in error response for debugging
    });
  }
};



// Download comment attachment
const downloadCommentAttachment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [{
        model: Ticket,
        where: { organization_id: req.user.organization_id }
      }]
    });

    if (!comment || !comment.attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Get the filename from the full path
    const filename = path.basename(comment.attachment);

    // Construct path relative to backend directory
    const uploadDir = path.join(__dirname, '../uploads/comments');
    let filePath = path.join(uploadDir, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        message: 'File not found on server'
      });
    }

    // Get file extension and content type
    const fileExtension = path.extname(comment.attachmentOriginalName).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif'
    };

    const contentType = mimeTypes[fileExtension] || 'application/octet-stream';

    // Read and send file
    const fileBuffer = await fs.readFile(filePath);

    res.set({
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(comment.attachmentOriginalName)}"`,
    });

    return res.send(fileBuffer);

  } catch (error) {
    console.error('Error downloading comment attachment:', error);
    return res.status(500).json({
      message: 'Error downloading file',
      error: error.message
    });
  }
};



// const updateStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   const userId = req.user.id;

//   const transaction = await sequelize.transaction();

//   try {
//     const existingTicket = await Ticket.findByPk(id, { transaction });

//     if (!existingTicket) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Ticket not found' });
//     }

//     if (existingTicket.status === status) {
//       await transaction.rollback();
//       return res.status(200).json(existingTicket);
//     }

//     // Store previous status before updating
//     existingTicket.previousStatus = existingTicket.status;
//     existingTicket.status = status;
//     await existingTicket.save({ transaction });

//     const user = await User.findByPk(userId, {
//       attributes: ['id', 'first_name'],
//       transaction
//     });

//     // Fixed column names to match database schema
//     await Comment.create({
//       ticket_id: id,         // Changed from ticketId
//       user_id: userId,       // Changed from userId
//       content: `${user.first_name} changed the ticket status from ${existingTicket.previousStatus} to ${status}`,
//       type: 'system'
//     }, { transaction });

//     await TicketStatusLog.create({
//       ticket_id: id,
//       previousStatus: existingTicket.previousStatus,
//       newStatus: status,
//       changedById: userId
//     }, { transaction });

//     const updatedTicket = await Ticket.findByPk(id, {
//       include: [
//         {
//           model: User,
//           as: 'assignedTo',
//           attributes: ['id', 'first_name', 'email']
//         },
//         {
//           model: User,
//           as: 'creator',
//           attributes: ['id', 'first_name', 'email']
//         },
//         {
//           model: Comment,
//           as: 'comments',
//           include: [{
//             model: User,
//             as: 'user',
//             attributes: ['id', 'first_name', 'email']
//           }]
//         }
//       ],
//       transaction
//     });

//     await transaction.commit();
//     res.status(200).json(updatedTicket);
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error updating ticket:', error);
//     res.status(500).json({
//       message: 'Error updating ticket',
//       error: error.message
//     });
//   }
// };

// const updateStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   const userId = req.user.id;

//   const transaction = await sequelize.transaction();

//   try {
//     const existingTicket = await Ticket.findByPk(id, { transaction });

//     if (!existingTicket) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Ticket not found' });
//     }

//     if (existingTicket.status === status) {
//       await transaction.rollback();
//       return res.status(200).json(existingTicket);
//     }

//     const oldStatus = existingTicket.status;
//     existingTicket.status = status;
//     await existingTicket.save({ transaction });

//     // Create the status change comment
//     // await Comment.create({
//     //   ticket_id: id,
//     //   user_id: userId,
//     //   content: `Status changed from ${oldStatus} to ${status}`,
//     //   type: 'status_change',
//     //   is_internal: false
//     // }, { transaction });

//     const statusComment = await Comment.create({
//       ticket_id: id,
//       user_id: userId,
//       content: JSON.stringify({
//         oldStatus: oldStatus,
//         newStatus: status
//       }),
//       type: 'status_change',
//       is_internal: false
//     }, { transaction });

//     // Log the status change
//     await TicketStatusLog.create({
//       ticket_id: id,
//       previousStatus: oldStatus,
//       newStatus: status,
//       changedById: userId
//     }, { transaction });

//     const updatedTicket = await Ticket.findByPk(id, {
//       include: [
//         {
//           model: User,
//           as: 'assignedTo',
//           attributes: ['id', 'first_name', 'email']
//         },
//         {
//           model: User,
//           as: 'creator',
//           attributes: ['id', 'first_name', 'email']
//         },
//         {
//           model: Comment,
//           as: 'comments',
//           include: [{
//             model: User,
//             as: 'user',
//             attributes: ['id', 'first_name', 'email']
//           }]
//         }
//       ],
//       transaction
//     });

//     await transaction.commit();
//     res.status(200).json(existingTicket);
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error updating ticket:', error);
//     res.status(500).json({
//       message: 'Error updating ticket',
//       error: error.message
//     });
//   }
// };


const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing ticket with necessary associations
    const existingTicket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      transaction
    });

    // Check if ticket exists
    if (!existingTicket) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // If status hasn't changed, return early
    if (existingTicket.status === status) {
      await transaction.rollback();
      return res.status(200).json(existingTicket);
    }

    // Store old status and update to new status
    const oldStatus = existingTicket.status;
    existingTicket.status = status;
    await existingTicket.save({ transaction });

    // Get user info for the status change comment
    const user = await User.findByPk(userId, {
      attributes: ['id', 'first_name', 'last_name'],
      transaction
    });

    // Create status change comment
    const statusComment = await Comment.create({
      ticket_id: id,
      user_id: userId,
      content: JSON.stringify({
        oldStatus: oldStatus,
        newStatus: status
      }),
      type: 'status_change',
      is_internal: false
    }, { transaction });

    // Create status change log entry
    await TicketStatusLog.create({
      ticket_id: id,
      previousStatus: oldStatus,
      newStatus: status,
      changedById: userId
    }, { transaction });

    // Fetch the updated ticket with all necessary associations
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }]
        }
      ],
      transaction
    });

    // Optional: Add notification logic here
    try {
      // Notify assigned user if status changes to "In Progress"
      if (status === 'In Progress' && updatedTicket.assignedTo) {
        // Add your notification logic here
        // Example: await sendStatusChangeNotification(updatedTicket.assignedTo.email, oldStatus, status);
      }

      // Notify creator if status changes to "Resolved"
      if (status === 'Resolved' && updatedTicket.creator) {
        // Add your notification logic here
        // Example: await sendStatusChangeNotification(updatedTicket.creator.email, oldStatus, status);
      }
    } catch (notificationError) {
      // Log notification error but don't fail the transaction
      console.error('Notification error:', notificationError);
    }

    // Commit the transaction
    await transaction.commit();

    // Send response
    res.status(200).json({
      ticket: updatedTicket,
      statusComment,
      message: 'Ticket status updated successfully'
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();

    console.error('Error updating ticket status:', error);

    // Send appropriate error response
    res.status(500).json({
      message: 'Error updating ticket status',
      error: error.message
    });
  }
};


const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type } = req.body;
    const userId = req.user.id;

    // Validate inputs
    const validationErrors = [];
    const VALID_TYPES = ['internal', 'open', 'system', 'status_change'];

    if (!content || content.trim() === '') {
      validationErrors.push('Comment content cannot be empty');
    }

    if (!type || !VALID_TYPES.includes(type)) {
      validationErrors.push('Comment type must be one of: internal, open, system, or status_change');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is authorized to edit this comment
    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Additional validation: Users should not be able to create/edit system or status_change comments
    if (['system', 'status_change'].includes(type)) {
      return res.status(403).json({ 
        message: 'Users cannot create or modify system or status change comments' 
      });
    }

    // Update both content and type
    comment.content = content.trim();
    comment.type = type;
    await comment.save();

    // Return updated comment
    const updatedComment = await Comment.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      message: 'Error updating comment',
      error: error.message
    });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is authorized to delete this comment
    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      message: 'Error deleting comment',
      error: error.message
    });
  }
};



module.exports = {
  createTicket,
  getTicketDetails,
  getComments,
  createComment,
  updateStatus,
  updateComment,
  deleteComment,
  downloadCommentAttachment,
  uploadComment
};
