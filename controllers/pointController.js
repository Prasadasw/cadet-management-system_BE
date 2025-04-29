const { Point } = require('../models');

exports.addPoint = async (req, res) => {
  try {
    const { cadetId, pointType, points, reason } = req.body;

    const newPoint = await Point.create({
      cadetId,
      pointType,
      points,
      reason
    });

    res.status(201).json({ success: true, message: 'Point added successfully!', data: newPoint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPointsByCadet = async (req, res) => {
  try {
    const { cadetId } = req.params;
    const points = await Point.findAll({ where: { cadetId } });

    res.status(200).json({ success: true, data: points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deletePoint = async (req, res) => {
  try {
    const { id } = req.params;
    await Point.destroy({ where: { id } });

    res.status(200).json({ success: true, message: 'Point deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
