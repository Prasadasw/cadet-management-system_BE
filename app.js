require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const cadetRoutes = require('./routes/cadetRoutes');
const pointRoutes = require('./routes/pointRoutes');
const battalionRoutes = require('./routes/battalionRoutes');
const cadetPointRoutes = require('./routes/cadetPointRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dailyActivityRoutes = require('./routes/dailyActivityRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const hostelInventoryRoutes = require('./routes/hostelInventoryRoutes');
const parentAuthRoutes = require('./routes/parentAuthRoutes');
const parentRoutes = require('./routes/parentRoutes');
const outpassRoutes = require('./routes/outpassRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeAttendanceRoutes = require('./routes/employeeAttendanceRoutes');
const employeePointRoutes = require('./routes/employeePointRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mobileSubmissionRoutes = require('./routes/mobileSubmissionRoutes');
const cadetMobileSubmissionRoutes = require('./routes/cadetMobileSubmissionRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const classroomCadetRoutes = require('./routes/classroomCadetRoutes');
const classroomRoutineRoutes = require('./routes/classroomRoutineRoutes');
const classroomRoutineAttendanceRoutes = require('./routes/classroomRoutineAttendanceRoutes');
const roleRoutes = require('./routes/role.routes'); // RBAC routes

const sequelize = require('./config/database');
const models = require('./models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((error) => {
    console.error('Unable to synchronize database:', error);
  });

// API Routes
app.use('/api/points', pointRoutes);
app.use('/api/cadets', cadetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/battalions', battalionRoutes);
app.use('/api/cadet-points', cadetPointRoutes);
app.use('/api/roles', roleRoutes); 
app.use('/api/attendance', attendanceRoutes);
app.use('/api/activities', dailyActivityRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/hostel-inventory', hostelInventoryRoutes); 
app.use('/api/parent', parentRoutes);
app.use('/api/parent', parentAuthRoutes);
app.use('/api/outpass', outpassRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-attendance', employeeAttendanceRoutes);
app.use('/api/employee-points', employeePointRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mobile-submission', mobileSubmissionRoutes);
app.use('/api/cadet-mobile-submission', cadetMobileSubmissionRoutes); 
app.use('/api/classrooms', classroomRoutes); 
app.use('/api/classrooms', classroomCadetRoutes); 
app.use('/api/classroom-routines', classroomRoutineRoutes);
app.use('/api/classroom-attendance', classroomRoutineAttendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: err.message
    });
  }

  // Handle validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));