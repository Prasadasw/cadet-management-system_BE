// controllers/classroomRoutineController.js
const { ClassroomRoutine, Classroom } = require('../models');
const { Op } = require('sequelize');

// Create a new routine
exports.createRoutine = async (req, res) => {
  try {
    const { classroomId, activity, notes, date, startTime, endTime } = req.body;

    // Check if classroom exists
    const classroom = await Classroom.findByPk(classroomId);
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    // Check for time conflicts
    const conflict = await ClassroomRoutine.findOne({
      where: {
        classroomId,
        date,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Time conflict with existing routine',
        conflictingRoutine: conflict
      });
    }

    const routine = await ClassroomRoutine.create({
      classroomId,
      activity,
      notes,
      date,
      startTime,
      endTime
    });

    return res.status(201).json({
      success: true,
      message: 'Routine created successfully',
      data: routine
    });
  } catch (error) {
    console.error('Error creating routine:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create routine',
      error: error.message
    });
  }
};

// Get routines with filters
exports.getRoutines = async (req, res) => {
  try {
    const { classroomId, startDate, endDate, date } = req.query;
    const where = {};

    if (classroomId) where.classroomId = classroomId;
    
    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const routines = await ClassroomRoutine.findAll({
      where,
      include: [{
        model: Classroom,
        as: 'classroom',
        attributes: ['id', 'className']
      }],
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      data: routines
    });
  } catch (error) {
    console.error('Error fetching routines:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};

// Update a routine
exports.updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity, notes, date, startTime, endTime, status } = req.body;

    const routine = await ClassroomRoutine.findByPk(id);
    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Check for time conflicts (excluding current routine)
    if (date && startTime && endTime) {
      const conflict = await ClassroomRoutine.findOne({
        where: {
          id: { [Op.ne]: id },
          classroomId: routine.classroomId,
          date: date || routine.date,
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime || routine.endTime },
              endTime: { [Op.gt]: startTime || routine.startTime }
            }
          ]
        }
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict with existing routine',
          conflictingRoutine: conflict
        });
      }
    }

    await routine.update({
      activity: activity || routine.activity,
      notes: notes !== undefined ? notes : routine.notes,
      date: date || routine.date,
      startTime: startTime || routine.startTime,
      endTime: endTime || routine.endTime,
      status: status || routine.status
    });

    return res.status(200).json({
      success: true,
      message: 'Routine updated successfully',
      data: routine
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update routine',
      error: error.message
    });
  }
};

// Delete a routine
exports.deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await ClassroomRoutine.findByPk(id);
    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    await routine.destroy();

    return res.status(200).json({
      success: true,
      message: 'Routine deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete routine',
      error: error.message
    });
  }
};