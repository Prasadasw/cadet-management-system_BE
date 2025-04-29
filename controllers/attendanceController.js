const { Attendance, Cadet } = require('../models');
const { Op } = require('sequelize');

// Mark attendance for multiple cadets
exports.markAttendance = async (req, res) => {
  try {
    const { date, attendances } = req.body;

    if (!date || !attendances || !Array.isArray(attendances)) {
      return res.status(400).json({ 
        message: 'Date and attendances array are required' 
      });
    }

    const attendanceRecords = await Promise.all(
      attendances.map(async (attendance) => {
        const { cadetId, status, remark } = attendance;
        
        // Check if cadet exists
        const cadet = await Cadet.findByPk(cadetId);
        if (!cadet) {
          throw new Error(`Cadet with ID ${cadetId} not found`);
        }

        // Create or update attendance record
        const [record, created] = await Attendance.findOrCreate({
          where: { cadetId, date },
          defaults: { status, remark }
        });

        if (!created) {
          await record.update({ status, remark });
        }

        return record;
      })
    );

    res.status(201).json({
      message: 'Attendance marked successfully',
      data: attendanceRecords
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendance = await Attendance.findAll({
      where: { date },
      include: [{
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'fullName', 'chestNumber', 'battalionId']
      }]
    });

    res.status(200).json({ data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// Get attendance history for a cadet
exports.getCadetAttendanceHistory = async (req, res) => {
  try {
    const { cadetId } = req.params;
    const { startDate, endDate } = req.query;

    const whereClause = { cadetId };
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      include: [{
        model: Cadet,
        as: 'cadet',
        attributes: ['id', 'fullName', 'chestNumber', 'battalionId']
      }]
    });

    // Calculate attendance statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const absentDays = attendance.filter(a => a.status === 'Absent').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      data: {
        attendance,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage: attendancePercentage.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
}; 