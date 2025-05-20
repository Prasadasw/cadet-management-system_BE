const { employee, employeeAttendance } = require('../models');

exports.addAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remark } = req.body;

    // Optional: Prevent duplicate attendance for same employee on same date
    const existing = await employeeAttendance.findOne({ where: { employeeId, date } });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date.' });
    }

    const attendance = await employeeAttendance.create({
      employeeId,
      date,
      status,
      remark,
    });

    res.status(201).json({ message: 'Attendance marked successfully', data: attendance });
  } catch (error) {
    console.error('Attendance Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
