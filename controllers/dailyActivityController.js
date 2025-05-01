const { DailyActivity, CadetActivityAttendance, Cadet, Battalion } = require('../models');
const { Op } = require('sequelize');

// Create a new daily activity
exports.createActivity = async (req, res) => {
  try {
    const { activityName, activityType, startDate, endDate, battalionId } = req.body;

    // Validate required fields
    if (!activityName || !activityType || !battalionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate dates for custom activities
    if (activityType === 'custom' && (!startDate || !endDate)) {
      return res.status(400).json({ message: 'Start and end dates are required for custom activities' });
    }

    const activity = await DailyActivity.create({
      activityName,
      activityType,
      startDate: activityType === 'custom' ? startDate : null,
      endDate: activityType === 'custom' ? endDate : null,
      battalionId
    });

    res.status(201).json({ data: activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await DailyActivity.findAll({
      include: [{
        model: Battalion,
        as: 'battalion'
      }]
    });
    res.status(200).json({ data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await DailyActivity.findByPk(id, {
      include: [{
        model: Battalion,
        as: 'battalion'
      }, {
        model: CadetActivityAttendance,
        as: 'attendances',
        include: [{
          model: Cadet,
          as: 'cadet'
        }]
      }]
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ data: activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Mark attendance for cadets
exports.markAttendance = async (req, res) => {
  try {
    const { activityId, date, attendances } = req.body;

    if (!activityId || !date || !attendances || !Array.isArray(attendances)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const activity = await DailyActivity.findByPk(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Create attendance records
    const attendanceRecords = await Promise.all(
      attendances.map(async (attendance) => {
        return CadetActivityAttendance.create({
          activityId,
          cadetId: attendance.cadetId,
          date,
          status: attendance.status,
          remarks: attendance.remarks
        });
      })
    );

    res.status(201).json({ data: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get attendance report for an activity
exports.getAttendanceReport = async (req, res) => {
  try {
    const { activityId, startDate, endDate } = req.query;

    const whereClause = { activityId };
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const attendances = await CadetActivityAttendance.findAll({
      where: whereClause,
      include: [{
        model: Cadet,
        as: 'cadet'
      }],
      order: [['date', 'DESC']]
    });

    // Calculate attendance statistics
    const totalDays = new Set(attendances.map(a => a.date.toISOString().split('T')[0])).size;
    const cadetStats = {};

    attendances.forEach(attendance => {
      const cadetId = attendance.cadetId;
      if (!cadetStats[cadetId]) {
        cadetStats[cadetId] = {
          cadet: attendance.cadet,
          present: 0,
          absent: 0,
          total: 0
        };
      }
      cadetStats[cadetId].total++;
      if (attendance.status === 'Present') {
        cadetStats[cadetId].present++;
      } else {
        cadetStats[cadetId].absent++;
      }
    });

    // Calculate attendance percentages
    Object.values(cadetStats).forEach(stat => {
      stat.attendancePercentage = (stat.present / stat.total) * 100;
    });

    res.status(200).json({
      data: {
        totalDays,
        cadetStats: Object.values(cadetStats)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get activities by battalion
exports.getActivitiesByBattalion = async (req, res) => {
  try {
    const { battalionId } = req.params;
    const { date } = req.query;

    const whereClause = { battalionId };
    
    // If date is provided, filter activities based on type
    if (date) {
      whereClause[Op.or] = [
        { activityType: 'daily' },
        {
          activityType: 'custom',
          startDate: { [Op.lte]: date },
          endDate: { [Op.gte]: date }
        }
      ];
    }

    const activities = await DailyActivity.findAll({
      where: whereClause,
      include: [{
        model: Battalion,
        as: 'battalion'
      }, {
        model: CadetActivityAttendance,
        as: 'attendances',
        include: [{
          model: Cadet,
          as: 'cadet'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    // Add attendance statistics
    const activitiesWithStats = activities.map(activity => {
      const totalCadets = activity.attendances.length;
      const presentCount = activity.attendances.filter(a => a.status === 'Present').length;
      const absentCount = activity.attendances.filter(a => a.status === 'Absent').length;

      return {
        ...activity.toJSON(),
        stats: {
          totalCadets,
          presentCount,
          absentCount,
          attendancePercentage: totalCadets > 0 ? (presentCount / totalCadets) * 100 : 0
        }
      };
    });

    res.status(200).json({ 
      data: activitiesWithStats,
      total: activitiesWithStats.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 