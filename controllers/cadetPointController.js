const { CadetPoint, Cadet } = require('../models');

exports.addPoints = async (req, res) => {
  try {
    const { cadetId } = req.params;
    const { points, reason } = req.body;

    if (!points || !reason) {
      return res.status(400).json({ message: 'Points and reason are required' });
    }

    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    const cadetPoint = await CadetPoint.create({
      cadetId,
      points,
      reason
    });

    res.status(201).json({
      message: 'Points added successfully',
      data: cadetPoint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCadetPoints = async (req, res) => {
  try {
    const { cadetId } = req.params;

    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      return res.status(404).json({ message: 'Cadet not found' });
    }

    const points = await CadetPoint.findAll({
      where: { cadetId },
      order: [['createdAt', 'DESC']]
    });

    const totalPositivePoints = points.reduce((sum, point) => {
      return sum + (point.points > 0 ? point.points : 0);
    }, 0);

    const totalNegativePoints = points.reduce((sum, point) => {
      return sum + (point.points < 0 ? point.points : 0);
    }, 0);

    res.status(200).json({
      data: {
        points,
        totalPositivePoints,
        totalNegativePoints,
        overallScore: totalPositivePoints + totalNegativePoints
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 