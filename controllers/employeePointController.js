
const { employeePoint, employee } = require('../models');

exports.addPoint = async (req, res) => {
  try {
    const { employeeId, points, type, remark, date } = req.body;

    if (!['positive', 'negative'].includes(type)) {
      return res.status(400).json({ message: 'Invalid point type' });
    }

    const pointEntry = await employeePoint.create({
      employeeId,
      points,
      type,
      remark,
      date,
    });

    res.status(201).json({ message: 'Point recorded successfully', data: pointEntry });
  } catch (error) {
    console.error('Point Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPointHistory = async (req, res) => {
    try {
      const { employeeId } = req.params;
  
      const points = await employeePoint.findAll({
        where: { employeeId },
        order: [['date', 'DESC']],
        include: [{ 
          model: employee, 
          as: 'employee',
          attributes: ['firstName', 'lastName'] 
        }]
      });
  
      const totalPositive = points
        .filter(p => p.type === 'positive')
        .reduce((sum, p) => sum + p.points, 0);
  
      const totalNegative = points
        .filter(p => p.type === 'negative')
        .reduce((sum, p) => sum + p.points, 0);
  
      res.status(200).json({
        employeeId,
        employeeName: points[0]?.employee
          ? `${points[0].employee.firstName} ${points[0].employee.lastName}`
          : 'N/A',
        totalPositive,
        totalNegative,
        netTotal: totalPositive - totalNegative,
        history: points
      });
    } catch (err) {
      console.error('Error fetching point history:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Update
exports.updatePoint = async (req, res) => {
    try {
      const { id } = req.params;
      const { employeeId, points, type, remark, date } = req.body;
  
      const point = await employeePoint.findByPk(id);
      if (!point) return res.status(404).json({ message: 'Point record not found' });
  
      await point.update({ employeeId, points, type, remark, date });
  
      res.status(200).json({ message: 'Point updated successfully', data: point });
    } catch (error) {
      console.error('Update Point Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Delete
  exports.deletePoint = async (req, res) => {
    try {
      const { id } = req.params;
  
      const point = await employeePoint.findByPk(id);
      if (!point) return res.status(404).json({ message: 'Point record not found' });
  
      await point.destroy();
  
      res.status(200).json({ message: 'Point deleted successfully' });
    } catch (error) {
      console.error('Delete Point Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
