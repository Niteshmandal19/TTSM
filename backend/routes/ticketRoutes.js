const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Ticket = require('../models/Ticket');
const User = require('../models/User')
const fs = require('fs').promises;


const authMiddleware = require('../middleware/authMiddleware');
const {
  createTicket,
  getTicketDetails,
  getComments,
  createComment,
  updateStatus,
  updateComment,
  deleteComment,
  uploadComment,
  downloadCommentAttachment
} = require('../controllers/ticketController');


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tickets/');
  },
  filename: (req, file, cb) => {
    cb(null, `ticket-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// Create ticket route
router.post('/create-ticket',
  authMiddleware,
  upload.single('attachment'),
  createTicket
);
router.post('/create-comments/:id',
  authMiddleware,
  createComment
);


router.put('/update-status/:id',
  authMiddleware,
  updateStatus
);


// Get ticket details route
router.get('/complete-incidents/:id', authMiddleware, getTicketDetails);
router.get('/comments/:id', authMiddleware, getComments);
router.put('/comments/:id', authMiddleware, updateComment);
router.delete('/comments/:id', authMiddleware, deleteComment);

router.post('/tickets/create-comments/:id',
  authMiddleware,
  uploadComment.single('attachment'),
  createComment
);

router.get('/comments/:commentId/attachment',
  authMiddleware,
  downloadCommentAttachment
);




// Fetch all tickets route
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get organization_id from the authenticated user
    const { organization_id } = req.user;

    // Determine filter condition
    const whereCondition =
      organization_id === 'IBDIC'
        ? {} // No filter for IBDIC; fetch all tickets
        : { organization_id }; // Filter by user's organization_id

    // Fetch tickets based on the filter condition
    const tickets = await Ticket.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['first_name', 'last_name'] // Select only necessary columns
        }
        , {
          model: User,
          as: 'assignedTo',
          attributes: ['first_name', 'last_name'] // Select only necessary columns
        }
      ]
      ,
      attributes: [
        'id',
        'title',
        'project',
        'issueType',
        'requestType',
        'description',
        'assignee',
        'priority',
        'created_by',
        'status',
        'createdAt',
        'organization_id'
      ]
    });

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      message: 'Error fetching tickets',
      error: error.message // Adding error message for debugging
    });
  }
});


router.get('/incidents/:id', authMiddleware, async (req, res) => {
  try {
    // Extract the ticket ID from URL parameters
    const ticketId = req.params.id;

    // Fetch the ticket from the database based on the ID
    const ticket = await Ticket.findOne({
      where: { id: ticketId, organization_id: req.user.organization_id },
      attributes: [
        'id',
        'title',
        'project',
        'issueType',
        'requestType',
        'description',
        'assignee',
        'priority',
        'created_by',
        'status',
        'createdAt',
        'organization_id',
      ],
    });

    // If ticket is not found, return 404 error
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Return the ticket details
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
});


router.get('/download-attachment/:ticketId', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: {
        id: req.params.ticketId,
        organization_id: req.user.organization_id
      }
    });

    if (!ticket || !ticket.attachment) {
      console.log('Ticket or attachment not found:', ticket);
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Get the filename from the full path
    const filename = path.basename(ticket.attachment);
    console.log('Filename:', filename);

    // Construct path relative to backend directory
    const uploadDir = path.join(__dirname, '../uploads/tickets');
    const filePath = path.join(uploadDir, filename);

    console.log('Upload directory:', uploadDir);
    console.log('File path:', filePath);

    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('File exists at:', filePath);
    } catch (error) {
      console.log('File access error:', error);
      // Try alternative path
      const altPath = path.join(process.cwd(), ticket.attachment);
      console.log('Trying alternative path:', altPath);

      try {
        await fs.access(altPath);
        console.log('File exists at alternative path');
        // If alternative path exists, use it
        filePath = altPath;
      } catch (altError) {
        console.log('Alternative path also failed:', altError);
        return res.status(404).json({
          message: 'File not found on server',
          originalPath: ticket.attachment,
          triedPaths: [filePath, altPath]
        });
      }
    }

    // Get file extension and content type
    const fileExtension = path.extname(ticket.attachmentOriginalName).toLowerCase();
    let contentType = 'application/octet-stream';

    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif'
    };

    contentType = mimeTypes[fileExtension] || contentType;

    // Read and send file
    const fileBuffer = await fs.readFile(filePath);

    res.set({
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(ticket.attachmentOriginalName)}"`,
    });

    return res.send(fileBuffer);

  } catch (error) {
    console.error('Error in download route:', error);
    return res.status(500).json({
      message: 'Error downloading file',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;


