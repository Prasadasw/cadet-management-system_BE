const { Cadet, Parent, Battalion, Hostel, OutpassRequest } = require('../models');
const jwt = require('jsonwebtoken');

exports.getCadetDetails = async (req, res) => {
  try {
    // Use parent from middleware
    const parent = req.parent;
    
    // Find parent with cadet details
    const parentWithCadet = await Parent.findOne({ 
      where: { id: parent.id },
      include: [{
        model: Cadet,
        as: 'cadet',
        include: [{ 
          model: Battalion, 
          as: 'battalion',
          attributes: ['name'] 
        }]
      }]
    });

    if (!parentWithCadet) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const cadet = parentWithCadet.cadet;
    if (!cadet) {
      return res.status(404).json({ message: 'No cadet found for this parent' });
    }

    // Prepare cadet details
    const cadetDetails = {
      id: cadet.id,
      fullName: cadet.fullName,
      chestNumber: cadet.chestNumber,
      emailId: cadet.emailId,
      battalion: cadet.battalion ? cadet.battalion.name : null
    };

    res.status(200).json(cadetDetails);
  } catch (error) {
    console.error('Get Cadet Details Error:', error);
    res.status(500).json({ 
      message: 'Error retrieving cadet details',
      error: error.message 
    });
  }
};

// Get cadet details by parent email
exports.getCadetByParentEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Parent email is required' });
    }

    // Find parent with associated cadet details
    const parent = await Parent.findOne({
      where: { email },
      include: [{
        model: Cadet,
        as: 'cadet',
        required: true,  // Use INNER JOIN
        include: [{ 
          model: Battalion, 
          as: 'battalion',
          attributes: ['id', 'name'] 
        }]
      }],
      attributes: ['id', 'email', 'cadetId', 'fullName', 'contactNumber']
    });

    // Check if parent exists
    if (!parent) {
      return res.status(404).json({ message: 'No parent found with this email' });
    }

    // Check if cadet exists
    if (!parent.cadet) {
      return res.status(404).json({ message: 'No cadet found for this parent' });
    }

    // Prepare cadet details
    const cadetDetails = {
      cadet: {
        id: parent.cadet.id,
        fullName: parent.cadet.fullName,
        chestNumber: parent.cadet.chestNumber,
        emailId: parent.cadet.emailId,
        age: parent.cadet.age,
        address: parent.cadet.address,
        roomNumber: parent.cadet.roomNumber,
        batchYear: parent.cadet.batchYear,
        initialPoints: parent.cadet.initialPoints,
        battalion: parent.cadet.battalion ? {
          id: parent.cadet.battalion.id,
          name: parent.cadet.battalion.name
        } : null
      },
      parent: {
        id: parent.id,
        fullName: parent.fullName,
        email: parent.email,
        contactNumber: parent.contactNumber
      }
    };

    res.status(200).json(cadetDetails);
  } catch (error) {
    console.error('Get Cadet By Parent Email Error:', error);
    res.status(500).json({
      message: 'Error retrieving cadet details',
      error: error.message
    });
  }
};

// Update outpass parent approval status
exports.updateOutpassParentApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const parent = req.parent;

    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be either approved or rejected' });
    }

    // Find the outpass request
    const outpassRequest = await OutpassRequest.findOne({
      include: [{
        model: Cadet,
        as: 'cadet',
        where: { parentId: parent.id }
      }],
      where: { id }
    });

    if (!outpassRequest) {
      return res.status(404).json({ message: 'Outpass request not found or not associated with your cadet' });
    }

    // Update the outpass request
    await outpassRequest.update({
      parentApprovalStatus: status,
      parentApprovalDate: new Date()
    });

    res.status(200).json({
      message: `Outpass request ${status} by parent`,
      outpassRequest
    });
  } catch (error) {
    console.error('Update Outpass Parent Approval Error:', error);
    res.status(500).json({
      message: 'Error updating outpass parent approval',
      error: error.message
    });
  }
};
