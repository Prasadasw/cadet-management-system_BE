const { Cadet } = require('../models');

exports.createCadet = async (req, res) => {
  try {
    const { 
      fullName, 
      chestNumber, 
      battalionId, 
      hostelId, 
      roomNumber, 
      age, 
      address, 
      schoolDetails, 
      parentsDetails, 
      parentContactNumber, 
      relationship, 
      emailId, 
      mobileSubmitted,
      batchYear 
    } = req.body;

    const existingCadet = await Cadet.findOne({ where: { chestNumber } });
    if (existingCadet) {
      return res.status(400).json({ message: "Cadet with this chest number already exists" });
    }

    const newCadet = await Cadet.create({
      fullName,
      chestNumber,
      battalionId,
      hostelId,
      roomNumber,
      age,
      address,
      schoolDetails,
      parentsDetails,
      parentContactNumber,
      relationship,
      emailId,
      mobileSubmitted,
      batchYear,
      initialPoints: 0
    });

    res.status(201).json({ message: 'Cadet created successfully', data: newCadet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateCadet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const cadet = await Cadet.findByPk(id);
    if (!cadet) {
      return res.status(404).json({ message: "Cadet not found" });
    }

    await cadet.update(updateData);
    res.status(200).json({ message: 'Cadet updated successfully', data: cadet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteCadet = async (req, res) => {
  try {
    const { id } = req.params;

    const cadet = await Cadet.findByPk(id);
    if (!cadet) {
      return res.status(404).json({ message: "Cadet not found" });
    }

    await cadet.destroy();
    res.status(200).json({ message: 'Cadet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCadet = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        message: "Invalid cadet ID", 
        error: "Please provide a valid cadet ID" 
      });
    }
    
    const cadet = await Cadet.findByPk(id);
    if (!cadet) {
      return res.status(404).json({ message: "Cadet not found" });
    }
    
    res.status(200).json({ data: cadet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAllCadets = async (req, res) => {
  try {
    const cadets = await Cadet.findAll();
    res.status(200).json({ 
      message: 'Cadets retrieved successfully', 
      data: cadets 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCadetByChestNumber = async (req, res) => {
  try {
    const { chestNumber } = req.params;
    
    if (!chestNumber || chestNumber === 'undefined') {
      return res.status(400).json({ 
        message: "Invalid chest number", 
        error: "Please provide a valid chest number" 
      });
    }
    
    const cadet = await Cadet.findOne({ where: { chestNumber } });
    if (!cadet) {
      return res.status(404).json({ message: "Cadet not found" });
    }
    
    res.status(200).json({ data: cadet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCadetsByBattalion = async (req, res) => {
  try {
    const { battalionId } = req.params;
    
    const cadets = await Cadet.findAll({
      where: { battalionId },
      order: [['chestNumber', 'ASC']]
    });
    
    res.status(200).json({ 
      message: 'Cadets retrieved successfully', 
      data: cadets 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
