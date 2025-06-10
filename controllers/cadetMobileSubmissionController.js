const { CadetMobileSubmission, Cadet } = require('../models');
const { validationResult } = require('express-validator');

// Add a new cadet mobile submission record
exports.addCadetMobileSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cadetId, cadetName, mobileSubmission, mobileReturn, note, date } = req.body;
    
    // Check if a record already exists for this cadet and date
    const existingRecord = await CadetMobileSubmission.findOne({
      where: { cadetId, date }
    });

    if (existingRecord) {
      return res.status(400).json({ 
        error: 'A record already exists for this cadet on the specified date' 
      });
    }

    // Verify that the cadet exists
    const cadet = await Cadet.findByPk(cadetId);
    if (!cadet) {
      return res.status(404).json({ error: 'Cadet not found' });
    }

    const submission = await CadetMobileSubmission.create({
      cadetId,
      cadetName,
      mobileSubmission: mobileSubmission || false,
      mobileReturn: mobileReturn || false,
      note: note || null,
      date
    });

    res.status(201).json({
      message: 'Cadet mobile submission record created successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error creating cadet mobile submission:', error);
    res.status(500).json({ error: 'Failed to create cadet mobile submission record' });
  }
};

// Update an existing cadet mobile submission record
exports.updateCadetMobileSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { cadetName, mobileSubmission, mobileReturn, note } = req.body;

    const submission = await CadetMobileSubmission.findByPk(id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Cadet mobile submission record not found' });
    }

    // Update only the fields that are provided in the request
    if (cadetName !== undefined) submission.cadetName = cadetName;
    if (mobileSubmission !== undefined) submission.mobileSubmission = mobileSubmission;
    if (mobileReturn !== undefined) submission.mobileReturn = mobileReturn;
    if (note !== undefined) submission.note = note;

    await submission.save();

    res.json({
      message: 'Cadet mobile submission record updated successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error updating cadet mobile submission:', error);
    res.status(500).json({ error: 'Failed to update cadet mobile submission record' });
  }
};

// Get cadet mobile submission record by ID
exports.getCadetMobileSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await CadetMobileSubmission.findByPk(id);

    if (!submission) {
      return res.status(404).json({ 
        message: 'No cadet mobile submission record found with the specified ID',
        data: null
      });
    }

    res.json({
      message: 'Cadet mobile submission record retrieved successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error fetching cadet mobile submission:', error);
    res.status(500).json({ error: 'Failed to fetch cadet mobile submission record' });
  }
};

// Get cadet mobile submission record for a specific cadet and date
exports.getCadetMobileSubmission = async (req, res) => {
  try {
    const { cadetId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const submission = await CadetMobileSubmission.findOne({
      where: { cadetId, date }
    });

    if (!submission) {
      return res.status(404).json({ 
        message: 'No cadet mobile submission record found for the specified cadet and date',
        data: null
      });
    }

    res.json({
      message: 'Cadet mobile submission record retrieved successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error fetching cadet mobile submission:', error);
    res.status(500).json({ error: 'Failed to fetch cadet mobile submission record' });
  }
};

// Get all cadet mobile submissions for a specific date
exports.getCadetMobileSubmissionsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const submissions = await CadetMobileSubmission.findAll({
      where: { date },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Cadet mobile submissions retrieved successfully',
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching cadet mobile submissions by date:', error);
    res.status(500).json({ error: 'Failed to fetch cadet mobile submissions' });
  }
};

// Get all cadet mobile submissions
exports.getAllCadetMobileSubmissions = async (req, res) => {
  try {
    const submissions = await CadetMobileSubmission.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      message: 'All cadet mobile submissions retrieved successfully',
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching all cadet mobile submissions:', error);
    res.status(500).json({ error: 'Failed to fetch cadet mobile submissions' });
  }
};

// Delete a cadet mobile submission record
exports.deleteCadetMobileSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await CadetMobileSubmission.findByPk(id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Cadet mobile submission record not found' });
    }

    await submission.destroy();

    res.json({
      message: 'Cadet mobile submission record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cadet mobile submission:', error);
    res.status(500).json({ error: 'Failed to delete cadet mobile submission record' });
  }
};