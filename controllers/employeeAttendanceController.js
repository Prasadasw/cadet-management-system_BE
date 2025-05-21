const { employee, employeeAttendance } = require('../models');

// Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const attendance = await employeeAttendance.findAll({
      where: { date },
      include: [
        {
          model: employee,
          as: 'employee',  // Specify the alias used in the association
          attributes: ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'designation']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this date' });
    }

    res.status(200).json({ data: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Date and at least one attendance record is required' });
    }

    const results = [];
    const errors = [];

    // Process each attendance record
    for (const record of records) {
      const { employeeId, status, remark } = record;

      try {
        // Check for existing attendance for this employee on this date
        const existing = await employeeAttendance.findOne({ 
          where: { employeeId, date } 
        });

        if (existing) {
          errors.push(`Attendance already marked for employee ID ${employeeId} on ${date}`);
          continue;
        }

        // Create new attendance record
        const attendance = await employeeAttendance.create({
          employeeId,
          date,
          status: status.toLowerCase(), // Convert to lowercase to match ENUM
          remark: remark || '',
        });

        results.push(attendance);
      } catch (error) {
        console.error(`Error processing attendance for employee ${employeeId}:`, error);
        errors.push(`Failed to process attendance for employee ID ${employeeId}`);
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return res.status(400).json({
        message: 'Failed to mark attendance',
        errors,
      });
    }

    res.status(201).json({
      message: `Successfully marked ${results.length} attendance record(s)`,
      data: results,
      ...(errors.length > 0 && {
        warnings: errors,
        warningCount: errors.length
      })
    });
  } catch (error) {
    console.error('Attendance Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
