const db = require('../models');
const { Op } = require('sequelize');

// Get all cadets in a specific hostel
exports.getCadetsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    
    if (!hostelId) {
      return res.status(400).json({ error: 'Hostel ID is required' });
    }

    const allocations = await db.HostelCadetAllocation.findAll({
      where: { 
        hostelId,
        releaseDate: null // Only get current allocations
      },
      include: [
        {
          model: db.Cadet,
          as: 'cadet',
          attributes: ['id', 'fullName', 'registrationNumber', 'chestNumber', 'batchYear', 'emailId']
        },
        {
          model: db.Room,
          as: 'room',
          attributes: ['id', 'roomNumber']
        }
      ],
      order: [
        [{ model: db.Room, as: 'room' }, 'roomNumber', 'ASC'],
        [{ model: db.Cadet, as: 'cadet' }, 'fullName', 'ASC']
      ]
    });

    // Transform the data to a cleaner format
    const cadets = allocations.map(allocation => ({
      id: allocation.cadet.id,
      fullName: allocation.cadet.fullName,
      registrationNumber: allocation.cadet.registrationNumber,
      chestNumber: allocation.cadet.chestNumber,
      batchYear: allocation.cadet.batchYear,
      email: allocation.cadet.emailId,
      roomNumber: allocation.room ? allocation.room.roomNumber : null,
      allocationDate: allocation.allocationDate
    }));

    res.json(cadets);
  } catch (error) {
    console.error('Error fetching cadets by hostel:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cadets', 
      details: error.message 
    });
  }
};

// Get all issued items
exports.getIssuedItems = async (req, res) => {
  try {
    const issuedItems = await db.HostelItemIssue.findAll({
      include: [
        {
          model: db.Cadet,
          as: 'cadet',
          attributes: ['id', 'fullName', 'registrationNumber', 'chestNumber']
        }
      ],
      attributes: ['id', 'itemName', 'issueDate'],
      order: [['issueDate', 'DESC']]
    });
    
    res.json(issuedItems);
  } catch (error) {
    console.error('Error fetching issued items:', error);
    res.status(500).json({ error: 'Failed to fetch issued items', details: error.message });
  }
};

exports.createHostel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const hostel = await db.Hostel.create({ name, description });
    res.status(201).json(hostel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await db.Hostel.findAll({
      include: [{ 
        model: db.Room, 
        as: 'rooms',
        include: [{
          model: db.Hostel,
          as: 'hostel'
        }]
      }]
    });
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { hostelId, roomNumber, capacity } = req.body;
    const room = await db.Room.create({ hostelId, roomNumber, capacity });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.allocateCadetToRoom = async (req, res) => {
  try {
    const { cadetId, hostelId, roomId, allocationDate } = req.body;
    
    // Find room and its hostel if hostelId is not provided
    const room = await db.Room.findByPk(roomId, {
      include: [{
        model: db.Hostel,
        as: 'hostel'
      }]
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Use hostelId from room if not provided in the request
    const effectiveHostelId = hostelId || room.hostel.id;
    
    // Check room capacity
    const currentAllocations = await db.HostelCadetAllocation.count({
      where: {
        roomId,
        releaseDate: null
      }
    });
    
    if (currentAllocations >= room.capacity) {
      return res.status(400).json({ error: 'Room is at full capacity' });
    }
    
    // Release previous allocation if exists
    await db.HostelCadetAllocation.update(
      { releaseDate: new Date() },
      { 
        where: { 
          cadetId, 
          releaseDate: null 
        } 
      }
    );
    
    const allocation = await db.HostelCadetAllocation.create({
      cadetId, 
      hostelId: effectiveHostelId, 
      roomId, 
      allocationDate
    });
    
    res.status(201).json(allocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.issueItemToCadet = async (req, res) => {
  try {
    const { cadetId, itemName, issueDate } = req.body;
    const itemIssue = await db.HostelItemIssue.create({ cadetId, itemName, issueDate });
    res.status(201).json(itemIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markHostelAttendance = async (req, res) => {
  try {
    const { cadetId, date, status } = req.body;
    const [attendance, created] = await db.HostelAttendance.findOrCreate({
      where: { cadetId, date },
      defaults: { status }
    });
    
    if (!created) {
      attendance.status = status;
      await attendance.save();
    }
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateReports = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.query;
    
    switch (reportType) {
      case 'room_allocations':
        const roomAllocations = await db.HostelCadetAllocation.findAll({
          where: {
            allocationDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [
            { model: db.Cadet },
            { model: db.Room },
            { model: db.Hostel }
          ]
        });
        res.json(roomAllocations);
        break;
      
      case 'item_issues':
        const itemIssues = await db.HostelItemIssue.findAll({
          where: {
            issueDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [{ model: db.Cadet }]
        });
        res.json(itemIssues);
        break;
      
      case 'attendance_logs':
        const attendanceLogs = await db.HostelAttendance.findAll({
          where: {
            date: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [{ model: db.Cadet }]
        });
        res.json(attendanceLogs);
        break;
      
      default:
        res.status(400).json({ error: 'Invalid report type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rooms for a specific hostel
exports.getRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const rooms = await db.Room.findAll({
      where: { hostelId },
      include: [{
        model: db.Hostel,
        as: 'hostel',
        attributes: ['id', 'name']
      }]
    });
    
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found for this hostel' });
    }
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
