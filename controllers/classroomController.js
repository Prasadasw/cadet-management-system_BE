const { Classroom } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Create a new classroom
exports.createClassroom = async (req, res) => {
  try {
    const { className, description } = req.body;
    
    // Check if classroom with same name already exists (case-insensitive)
    const existingClassroom = await Classroom.findOne({
      where: { 
        className: { [Op.like]: Sequelize.fn('LOWER', className) },
        deletedAt: null
      }
    });

    if (existingClassroom) {
      return res.status(400).json({
        success: false,
        message: 'Classroom with this name already exists'
      });
    }

    const classroom = await Classroom.create({
      className,
      description,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: classroom
    });
  } catch (error) {
    console.error('Error creating classroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create classroom',
      error: error.message
    });
  }
};

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { deletedAt: null };
    
    if (status) {
      where.status = status;
    }

    const classrooms = await Classroom.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: classrooms
    });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch classrooms',
      error: error.message
    });
  }
};

// Get classroom by ID
exports.getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findOne({
      where: { id, deletedAt: null }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: classroom
    });
  } catch (error) {
    console.error('Error fetching classroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom',
      error: error.message
    });
  }
};

// Update classroom
exports.updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, description, status } = req.body;

    const classroom = await Classroom.findOne({
      where: { id, deletedAt: null }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    // Check if another classroom with the same name exists (case-insensitive)
    if (className && className !== classroom.className) {
      const existingClassroom = await Classroom.findOne({
        where: { 
          className: { [Op.like]: Sequelize.fn('LOWER', className) },
          id: { [Op.ne]: id },
          deletedAt: null
        }
      });

      if (existingClassroom) {
        return res.status(400).json({
          success: false,
          message: 'Another classroom with this name already exists'
        });
      }
    }

    await classroom.update({
      className: className || classroom.className,
      description: description !== undefined ? description : classroom.description,
      status: status || classroom.status
    });

    return res.status(200).json({
      success: true,
      message: 'Classroom updated successfully',
      data: classroom
    });
  } catch (error) {
    console.error('Error updating classroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update classroom',
      error: error.message
    });
  }
};

// Delete classroom (soft delete)
exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findOne({
      where: { id, deletedAt: null }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found or already deleted'
      });
    }

    await classroom.destroy();

    return res.status(200).json({
      success: true,
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting classroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete classroom',
      error: error.message
    });
  }
};
