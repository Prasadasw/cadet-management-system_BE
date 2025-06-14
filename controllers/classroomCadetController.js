const { Classroom, Cadet, ClassroomCadet } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Add cadet to classroom
exports.addCadetToClassroom = async (req, res) => {
  const transaction = await ClassroomCadet.sequelize.transaction();
  
  try {
    const { classroomId } = req.params;
    const { 
      cadetId, 
      academicYear = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      status = 'active',
      joinedDate = new Date(),
      notes = null 
    } = req.body;

    // Check if classroom exists
    const classroom = await Classroom.findByPk(classroomId);
    if (!classroom) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    // Check if cadet exists
    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cadet not found'
      });
    }

    // Check if cadet is already in this classroom for the academic year
    const existingAllocation = await ClassroomCadet.findOne({
      where: {
        classroomId,
        cadetId,
        academicYear,
        [Op.or]: [
          { status: 'active' },
          { leftDate: null }
        ]
      },
      transaction
    });

    if (existingAllocation) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cadet is already in this classroom for the specified academic year'
      });
    }

    // Add cadet to classroom
    const classroomCadet = await ClassroomCadet.create({
      classroomId,
      cadetId,
      academicYear,
      status,
      joinedDate,
      notes
    }, { transaction });

    await transaction.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Cadet added to classroom successfully',
      data: classroomCadet
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding cadet to classroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add cadet to classroom',
      error: error.message
    });
  }
};

// Get all cadets in a classroom
exports.getClassroomCadets = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { status, academicYear } = req.query;

    const where = { classroomId };
    const include = [{
      model: Cadet,
      as: 'cadet',
      attributes: ['id', 'fullName', 'registrationNumber', 'chestNumber', 'batchYear', 'emailId']
    }];

    if (status) where.status = status;
    if (academicYear) where.academicYear = academicYear;
    
    const classroomCadets = await ClassroomCadet.findAll({
      where,
      include,
      order: [
        ['status', 'ASC'],
        ['joinedDate', 'DESC']
      ]
    });

    return res.status(200).json({
      success: true,
      data: classroomCadets
    });
  } catch (error) {
    console.error('Error fetching classroom cadets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom cadets',
      error: error.message
    });
  }
};

// Update cadet's classroom allocation
exports.updateClassroomCadet = async (req, res) => {
  const transaction = await ClassroomCadet.sequelize.transaction();
  
  try {
    const { allocationId } = req.params;
    const { 
      status, 
      leftDate, 
      notes,
      newClassroomId 
    } = req.body;

    const allocation = await ClassroomCadet.findByPk(allocationId, { transaction });
    
    if (!allocation) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Classroom allocation not found'
      });
    }

    // If transferring to a new classroom
    if (newClassroomId && newClassroomId != allocation.classroomId) {
      // Check if new classroom exists
      const newClassroom = await Classroom.findByPk(newClassroomId, { transaction });
      if (!newClassroom) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'New classroom not found'
        });
      }

      // Create new allocation in the new classroom
      await ClassroomCadet.create({
        classroomId: newClassroomId,
        cadetId: allocation.cadetId,
        academicYear: allocation.academicYear,
        status: 'transferred',
        joinedDate: new Date(),
        notes: `Transferred from classroom ID: ${allocation.classroomId}`
      }, { transaction });

      // Update old allocation
      allocation.status = 'transferred';
      allocation.leftDate = new Date();
      allocation.notes = `Transferred to classroom ID: ${newClassroomId}. ${notes || ''}`.trim();
    } else {
      // Just update the existing allocation
      if (status) allocation.status = status;
      if (leftDate) allocation.leftDate = leftDate;
      if (notes) allocation.notes = notes;
    }

    await allocation.save({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Classroom allocation updated successfully',
      data: allocation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating classroom allocation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update classroom allocation',
      error: error.message
    });
  }
};

// Remove cadet from classroom
exports.removeCadetFromClassroom = async (req, res) => {
  // Validate allocationId
  const { allocationId } = req.params;
  
  if (!allocationId || allocationId === 'undefined') {
    return res.status(400).json({
      success: false,
      message: 'Allocation ID is required and must be a valid number'
    });
  }

  const transaction = await ClassroomCadet.sequelize.transaction();
  
  try {
    const { status = 'withdrawn', notes } = req.body || {};

    // Validate status
    const validStatuses = ['transferred', 'graduated', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find the allocation
    const allocation = await ClassroomCadet.findByPk(allocationId, { 
      transaction,
      include: [{
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'fullName']
      }]
    });
    
    if (!allocation) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Classroom allocation not found'
      });
    }

    // Check if already removed
    if (allocation.status !== 'active') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cadet is already marked as ${allocation.status}`
      });
    }

    // Update the allocation
    const updateData = {
      status,
      leftDate: new Date(),
      notes: notes || `Removed from classroom on ${new Date().toISOString()}`
    };

    await allocation.update(updateData, { transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: `Cadet ${allocation.cadet?.fullName || ''} (ID: ${allocation.cadetId}) has been marked as ${status} successfully`,
      data: {
        allocationId: allocation.id,
        cadetId: allocation.cadetId,
        cadetName: allocation.cadet?.fullName,
        status: allocation.status,
        leftDate: allocation.leftDate
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error removing cadet from classroom:', error);
    
    // More specific error messages
    let errorMessage = 'Failed to remove cadet from classroom';
    if (error.name === 'SequelizeDatabaseError') {
      errorMessage = 'Database error occurred while processing your request';
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Validation error: ' + error.errors.map(e => e.message).join(', ');
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
