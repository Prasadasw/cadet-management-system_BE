// controllers/classroomRoutineAttendanceController.js
const { ClassroomRoutineAttendance, ClassroomRoutine, Cadet, User, Classroom } = require('../models');
const { Op } = require('sequelize');

// Mark attendance for multiple cadets in a routine
exports.markAttendance = async (req, res) => {
  const transaction = await ClassroomRoutineAttendance.sequelize.transaction();
  
  try {
    const { routineId } = req.params;
    const { attendanceData, markedById } = req.body;

    // Validate routine exists
    const routine = await ClassroomRoutine.findByPk(routineId, {
      include: [{
        model: Classroom,
        as: 'classroom'
      }]
    });

    if (!routine) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Validate user exists and has permission
    const user = await User.findByPk(markedById);
    if (!user) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid user'
      });
    }

    // Process each attendance record
    const results = await Promise.all(attendanceData.map(async (record) => {
      const { cadetId, status, remarks } = record;

      // Validate cadet exists and is in the classroom
      const cadet = await Cadet.findByPk(cadetId, {
        include: [{
          model: Classroom,
          as: 'classrooms',
          where: { id: routine.classroomId }
        }]
      });

      if (!cadet) {
        throw new Error(`Cadet with ID ${cadetId} not found in this classroom`);
      }

      // Create or update attendance record
      const [attendance, created] = await ClassroomRoutineAttendance.upsert({
        routineId,
        cadetId,
        status,
        remarks,
        markedById
      }, {
        transaction,
        returning: true
      });

      return attendance;
    }));

    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: results
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error marking attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific routine
exports.getRoutineAttendance = async (req, res) => {
  try {
    const { routineId } = req.params;

    const attendance = await ClassroomRoutineAttendance.findAll({
      where: { routineId },
      include: [
        {
          model: Cadet,
          as: 'cadet',
          attributes: ['id', 'fullName', 'registrationNumber']
        },
        {
          model: User,
          as: 'markedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [
        ['status', 'ASC'],
        [{ model: Cadet, as: 'cadet' }, 'fullName', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// Get attendance with filters (date range, classroom, routine, cadet)
exports.getAttendanceReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      classroomId, 
      routineId,
      cadetId,
      status
    } = req.query;

    const where = {};
    const routineWhere = {};
    const include = [
      {
        model: ClassroomRoutine,
        as: 'routine',
        attributes: ['id', 'activity', 'date', 'startTime', 'endTime'],
        include: [{
          model: Classroom,
          as: 'classroom',
          attributes: ['id', 'className']
        }]
      },
      {
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'fullName', 'registrationNumber']
      },
      {
        model: User,
        as: 'markedBy',
        attributes: ['id', 'name', 'email']
      }
    ];

    // Apply filters
    if (startDate && endDate) {
      routineWhere.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      routineWhere.date = { [Op.gte]: startDate };
    } else if (endDate) {
      routineWhere.date = { [Op.lte]: endDate };
    }

    if (classroomId) {
      routineWhere.classroomId = classroomId;
    }

    if (routineId) {
      where.routineId = routineId;
    }

    if (cadetId) {
      where.cadetId = cadetId;
    }

    if (status) {
      where.status = status;
    }

    // Add routine where conditions to include
    if (Object.keys(routineWhere).length > 0) {
      include[0].where = routineWhere;
    }

    const attendance = await ClassroomRoutineAttendance.findAll({
      where,
      include,
      order: [
        [{ model: ClassroomRoutine, as: 'routine' }, 'date', 'DESC'],
        [{ model: ClassroomRoutine, as: 'routine' }, 'startTime', 'ASC'],
        [{ model: Cadet, as: 'cadet' }, 'fullName', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate attendance report',
      error: error.message
    });
  }
};

// Get attendance summary (counts by status)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { classroomId, startDate, endDate } = req.query;

    const where = {};
    const routineWhere = {};

    if (classroomId) {
      routineWhere.classroomId = classroomId;
    }

    if (startDate && endDate) {
      routineWhere.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Get all attendance records matching the filters
    const attendanceRecords = await ClassroomRoutineAttendance.findAll({
      where,
      include: [{
        model: ClassroomRoutine,
        as: 'routine',
        where: routineWhere,
        attributes: ['id']
      }]
    });

    // Calculate summary
    const summary = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      excused: attendanceRecords.filter(r => r.status === 'excused').length
    };

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error generating attendance summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate attendance summary',
      error: error.message
    });
  }
};