const MobileSubmission = require('../models/mobileSubmission');
const { validationResult } = require('express-validator');

// Add a new mobile submission record
exports.addMobileSubmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cadetId, date, submissionTime, submitted, note } = req.body;
    
    // Check if a record already exists for this cadet, date, and submission time
    const existingRecord = await MobileSubmission.findOne({
      where: { cadetId, date, submissionTime }
    });

    if (existingRecord) {
      return res.status(400).json({ 
        error: 'A record already exists for this cadet on the specified date and time slot' 
      });
    }

    if (existingRecord) {
      return res.status(400).json({ 
        error: 'A record already exists for this cadet on the specified date' 
      });
    }

    const submission = await MobileSubmission.create({
      cadetId,
      date,
      submissionTime,
      submitted: submitted || false,
      note: note || null
    });

    res.status(201).json({
      message: 'Mobile submission record created successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error creating mobile submission:', error);
    res.status(500).json({ error: 'Failed to create mobile submission record' });
  }
};

// Update an existing mobile submission record
exports.updateMobileSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { morningSubmitted, eveningReturned, note } = req.body;

    const submission = await MobileSubmission.findByPk(id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Mobile submission record not found' });
    }

    // Update only the fields that are provided in the request
    if (morningSubmitted !== undefined) submission.morningSubmitted = morningSubmitted;
    if (eveningReturned !== undefined) submission.eveningReturned = eveningReturned;
    if (note !== undefined) submission.note = note;

    await submission.save();

    res.json({
      message: 'Mobile submission record updated successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error updating mobile submission:', error);
    res.status(500).json({ error: 'Failed to update mobile submission record' });
  }
};

// Get mobile submission record for a specific cadet and date
exports.getMobileSubmission = async (req, res) => {
  try {
    const { cadetId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const submission = await MobileSubmission.findOne({
      where: { cadetId, date }
    });

    if (!submission) {
      return res.status(404).json({ 
        message: 'No mobile submission record found for the specified cadet and date',
        data: null
      });
    }

    res.json({
      message: 'Mobile submission record retrieved successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error fetching mobile submission:', error);
    res.status(500).json({ error: 'Failed to fetch mobile submission record' });
  }
};
