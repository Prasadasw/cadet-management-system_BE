const { Battalion, Cadet, CadetPoint } = require('../models');
const { Op } = require('sequelize');

exports.getAllBattalions = async (req, res) => {
  try {
    const battalions = await Battalion.findAll({
      include: [{
        model: Cadet,
        as: 'cadets',
        include: [{
          model: CadetPoint,
          as: 'points'
        }]
      }]
    });

    const battalionsWithStats = battalions.map(battalion => {
      const cadets = battalion.cadets;
      const totalPositivePoints = cadets.reduce((sum, cadet) => {
        return sum + cadet.points.reduce((pointSum, point) => {
          return pointSum + (point.points > 0 ? point.points : 0);
        }, 0);
      }, 0);

      const totalNegativePoints = cadets.reduce((sum, cadet) => {
        return sum + cadet.points.reduce((pointSum, point) => {
          return pointSum + (point.points < 0 ? point.points : 0);
        }, 0);
      }, 0);

      return {
        id: battalion.id,
        name: battalion.name,
        cadetCount: cadets.length,
        totalPositivePoints,
        totalNegativePoints,
        overallScore: totalPositivePoints + totalNegativePoints
      };
    });

    res.status(200).json({ data: battalionsWithStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getBattalionById = async (req, res) => {
  try {
    const { id } = req.params;
    const battalion = await Battalion.findByPk(id, {
      include: [{
        model: Cadet,
        as: 'cadets',
        include: [{
          model: CadetPoint,
          as: 'points'
        }]
      }]
    });

    if (!battalion) {
      return res.status(404).json({ message: 'Battalion not found' });
    }

    const cadets = battalion.cadets;
    const totalPositivePoints = cadets.reduce((sum, cadet) => {
      return sum + cadet.points.reduce((pointSum, point) => {
        return pointSum + (point.points > 0 ? point.points : 0);
      }, 0);
    }, 0);

    const totalNegativePoints = cadets.reduce((sum, cadet) => {
      return sum + cadet.points.reduce((pointSum, point) => {
        return pointSum + (point.points < 0 ? point.points : 0);
      }, 0);
    }, 0);

    const battalionWithStats = {
      id: battalion.id,
      name: battalion.name,
      cadetCount: cadets.length,
      totalPositivePoints,
      totalNegativePoints,
      overallScore: totalPositivePoints + totalNegativePoints,
      cadets: cadets.map(cadet => ({
        id: cadet.id,
        fullName: cadet.fullName,
        chestNumber: cadet.chestNumber,
        points: cadet.points
      }))
    };

    res.status(200).json({ data: battalionWithStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 