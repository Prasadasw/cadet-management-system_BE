const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const cadetRoutes = require('./routes/cadetRoutes');
const pointRoutes = require('./routes/pointRoutes');
const battalionRoutes = require('./routes/battalionRoutes');
const cadetPointRoutes = require('./routes/cadetPointRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const dailyActivityRoutes = require('./routes/dailyActivityRoutes');

app.use('/api/points', pointRoutes);
app.use('/api/cadets', cadetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/battalions', battalionRoutes);
app.use('/api/cadet-points', cadetPointRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/activities', dailyActivityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
