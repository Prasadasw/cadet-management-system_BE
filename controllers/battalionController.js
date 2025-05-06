const { Battalion, Cadet, CadetPoint } = require('../models');
const { Op } = require('sequelize');

exports.getAllBattalions = async (req, res) => {
  try {
    const battalions = await Battalion.findAll({
      include: [{
        model: Cadet,
        as: 'cadets',
        attributes: ['id', 'fullName', 'registrationNumber', 'batchYear'],
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
        attributes: ['id', 'fullName', 'registrationNumber', 'batchYear'],
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

// Create a new battalion
exports.createBattalion = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Battalion name is required' });
    }

    const existingBattalion = await Battalion.findOne({ where: { name } });
    if (existingBattalion) {
      return res.status(409).json({ message: 'Battalion with this name already exists' });
    }

    const newBattalion = await Battalion.create({ name });
    res.status(201).json({ message: 'Battalion created successfully', data: newBattalion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update an existing battalion
exports.updateBattalion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Battalion name is required' });
    }

    const battalion = await Battalion.findByPk(id);
    if (!battalion) {
      return res.status(404).json({ message: 'Battalion not found' });
    }

    const existingBattalion = await Battalion.findOne({ 
      where: { 
        name, 
        id: { [Op.ne]: id } 
      } 
    });
    if (existingBattalion) {
      return res.status(409).json({ message: 'Battalion with this name already exists' });
    }

    battalion.name = name;
    await battalion.save();

    res.status(200).json({ message: 'Battalion updated successfully', data: battalion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a battalion
exports.deleteBattalion = async (req, res) => {
  try {
    const { id } = req.params;

    const battalion = await Battalion.findByPk(id);
    if (!battalion) {
      return res.status(404).json({ message: 'Battalion not found' });
    }

    // Check if battalion has any cadets before deleting
    const cadetCount = await Cadet.count({ where: { battalionId: id } });
    if (cadetCount > 0) {
      return res.status(400).json({ message: 'Cannot delete battalion with active cadets' });
    }

    await battalion.destroy();
    res.status(200).json({ message: 'Battalion deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};