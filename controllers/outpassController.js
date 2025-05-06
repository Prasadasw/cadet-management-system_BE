const models = require('../models');
const { Op } = require('sequelize');

const { OutpassRequest, Cadet, Parent } = models;

exports.createOutpass = async (req, res) => {
  try {
    const { cadetId, reason, fromDateTime, toDateTime } = req.body; 
    //hello
    // Find cadet and associated parent with detailed information
    const cadet = await Cadet.findByPk(cadetId, {
      include: [
        { 
          model: Parent, 
          as: 'parent',
          attributes: ['id', 'fullName', 'email', 'contactNumber'] 
        }
      ],
      attributes: ['id', 'fullName', 'registrationNumber']
    });

    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    // Create outpass request with enhanced details
    const outpassRequest = await OutpassRequest.create({
      cadetId,
      reason,
      fromDateTime,
      toDateTime,
      parentId: cadet.parent ? cadet.parent.id : null,
      status: 'pending' // Default initial status
    });

    // Fetch the full outpass request with associated models
    const fullOutpassRequest = await OutpassRequest.findByPk(outpassRequest.id, {
      include: [
        { 
          model: Cadet, 
          as: 'cadet',
          attributes: ['id', 'fullName', 'registrationNumber'] 
        },
        { 
          model: Parent, 
          as: 'parent',
          attributes: ['id', 'name', 'email', 'contactNumber'] 
        }
      ]
    });

    res.status(201).json({
      message: 'Outpass request created successfully',
      outpassRequest: fullOutpassRequest,
      cadetDetails: cadet
    });
  } catch (error) {
    console.error('Outpass Creation Error:', error);
    res.status(500).json({ 
      message: 'Error creating outpass', 
      error: error.message,
      details: error.stack 
    });
  }
};

exports.getCadetOutpasses = async (req, res) => {
  try {
    const { cadetId } = req.params;

    // Verify cadet exists
    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    const outpasses = await OutpassRequest.findAll({
      where: { cadetId },
      include: [{ model: Parent, as: 'parent' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(outpasses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cadet outpasses', error: error.message });
  }
};
// Get all outpasses for a parent's cadet(s)
// Get all outpasses for a parent's cadet(s)
exports.getParentCadetOutpasses = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Find parent with associated cadets
    const parent = await Parent.findByPk(parentId, {
      include: [{
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'chestNumber'] // Using chestNumber instead of registrationNumber
      }]
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Get all cadet IDs for this parent
    const cadetIds = parent.cadet ? [parent.cadet.id] : [];

    // Get all outpasses for these cadets
    const outpasses = await OutpassRequest.findAll({
      where: { cadetId: { [Op.in]: cadetIds } },
      include: [
        { 
          model: Cadet, 
          as: 'cadet',
          attributes: ['id', 'fullName', 'chestNumber'] // Using chestNumber instead of registrationNumber
        },
        {
          model: Parent,
          as: 'parent',
          attributes: ['id', 'fullName', 'contactNumber'] // Added contactNumber
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      parentId,
      cadetCount: cadetIds.length,
      outpasses
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching parent cadet outpasses', 
      error: error.message 
    });
  }
};

exports.parentApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const outpassRequest = await OutpassRequest.findByPk(id, {
      include: [{ model: Parent, as: 'parent' }, { model: Cadet, as: 'cadet' }]
    });

    if (!outpassRequest) {
      return res.status(404).json({ message: 'Outpass request not found' });
    }

    // Validate that the parent making the request is the correct parent
    const parent = await Parent.findOne({
      where: { cadetId: outpassRequest.cadetId }
    });

    if (!parent) {
      return res.status(403).json({ message: 'Unauthorized parent approval' });
    }

    outpassRequest.parentApprovalStatus = status;
    await outpassRequest.save();

    // Notification removed as per user request

    res.json(outpassRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating parent approval', error: error.message });
  }
};

exports.adminUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const outpassRequest = await OutpassRequest.findByPk(id, {
      include: [{ model: Cadet, as: 'cadet' }, { model: Parent, as: 'parent' }]
    });

    if (!outpassRequest) {
      return res.status(404).json({ message: 'Outpass request not found' });
    }

    // Ensure the request has been approved by parent
    if (outpassRequest.parentApprovalStatus !== 'approved') {
      return res.status(400).json({ message: 'Parent approval is required before admin status update' });
    }

    outpassRequest.adminFinalStatus = status;
    await outpassRequest.save();

    // Notify parent about admin's decision
    if (outpassRequest.parent) {
      emitToParent(outpassRequest.parent.id, 'adminUpdate', outpassRequest);
    }

    res.json(outpassRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin status', error: error.message });
  }
};

exports.updateOutpassTimes = async (req, res) => {
  try {
    const { id } = req.params;
    const { outTime, inTime } = req.body;

    const outpassRequest = await OutpassRequest.findByPk(id, {
      include: [{ model: Cadet, as: 'cadet' }]
    });

    if (!outpassRequest) {
      return res.status(404).json({ message: 'Outpass request not found' });
    }

    // Ensure admin has approved the request
    if (outpassRequest.adminFinalStatus !== 'approved') {
      return res.status(400).json({ message: 'Outpass must be approved before updating times' });
    }

    outpassRequest.outTime = outTime;
    outpassRequest.inTime = inTime;
    await outpassRequest.save();

    // Notify cadet about time update (optional)
    emitToParent(`cadet:${outpassRequest.cadetId}`, 'outpassTimeUpdate', outpassRequest);

    res.json(outpassRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating outpass times', error: error.message });
  }
};

exports.getCadetOutpasses = async (req, res) => {
  try {
    const { cadetId } = req.params;

    // Verify cadet exists
    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    const outpasses = await OutpassRequest.findAll({
      where: { cadetId },
      include: [{ model: Parent, as: 'parent' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(outpasses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cadet outpasses', error: error.message });
  }
};

exports.getParentCadetOutpasses = async (req, res) => {

  try {
    const { parentId } = req.params;

    // Verify cadet exists
    const cadet = await Cadet.findByPk(parentId);
    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    const outpasses = await OutpassRequest.findAll({
      where: { parentId },
      include: [{ model: Parent, as: 'parent' }],
      order: [['createdAt', 'DESC']]
    });

    res.json(outpasses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cadet outpasses', error: error.message });
  }
};

exports.getSingleOutpass = async (req, res) => {
  try {
    const { id } = req.params;

    const outpassRequest = await OutpassRequest.findByPk(id, {
      include: [
        { model: Cadet, as: 'cadet' },
        { model: Parent, as: 'parent' }
      ]
    });

    if (!outpassRequest) {
      return res.status(404).json({ message: 'Outpass request not found' });
    }

    res.json(outpassRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching outpass', error: error.message });
  }
};

// List outpasses with optional filtering
exports.listOutpasses = async (req, res) => {
  try {
    const { cadetId, status, parentId, adminStatus } = req.query;

    // Build where clause based on query parameters
    const whereClause = {};
    if (cadetId) whereClause.cadetId = cadetId;
    if (parentId) {
      if (parentId === 'current-user-parent-id') {
        const parent = await Parent.findOne({
          where: { id: req.parentId }
        });
        if (parent) {
          const cadets = await Cadet.findAll({
            where: { parentId: parent.id }
          });
          whereClause.cadetId = { [Op.in]: cadets.map(cadet => cadet.id) };
        }
      } else {
        const parent = await Parent.findOne({
          where: { id: parentId }
        });
        if (parent) {
          const cadets = await Cadet.findAll({
            where: { parentId: parent.id }
          });
          whereClause.cadetId = { [Op.in]: cadets.map(cadet => cadet.id) };
        }
      }
    }
    
    // Handle status filtering
    if (status) {
      whereClause.parentApprovalStatus = status;
    }
    if (adminStatus) {
      whereClause.adminFinalStatus = adminStatus;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch outpasses
    const { count, rows: outpasses } = await OutpassRequest.findAndCountAll({
      where: whereClause,
      include: [
        { model: Cadet, as: 'cadet' },
        { model: Parent, as: 'parent' }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      total: count,
      page,
      limit,
      outpasses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching outpasses', error: error.message });
  }
};
