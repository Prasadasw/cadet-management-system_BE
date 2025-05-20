require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const cadetRoutes = require('./routes/cadetRoutes');
const pointRoutes = require('./routes/pointRoutes');
const battalionRoutes = require('./routes/battalionRoutes');
const cadetPointRoutes = require('./routes/cadetPointRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dailyActivityRoutes = require('./routes/dailyActivityRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const parentAuthRoutes = require('./routes/parentAuthRoutes');
const parentRoutes = require('./routes/parentRoutes');
const outpassRoutes = require('./routes/outpassRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeAttendanceRoutes = require('./routes/employeeAttendanceRoutes');
const employeePointRoutes = require('./routes/employeePointRoutes');

const sequelize = require('./config/database');
const models = require('./models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((error) => {
    console.error('Unable to synchronize database:', error);
  });

app.use('/api/points', pointRoutes);
app.use('/api/cadets', cadetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/battalions', battalionRoutes);
app.use('/api/cadet-points', cadetPointRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/activities', dailyActivityRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/parent', parentAuthRoutes);
app.use('/api/outpass', outpassRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-attendance', employeeAttendanceRoutes);
app.use('/api/employee-points', employeePointRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
