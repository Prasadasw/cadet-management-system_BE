const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MobileSubmission = sequelize.define('MobileSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cadetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cadets',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  submissionTime: {
    type: DataTypes.ENUM('morning', 'evening'),
    allowNull: false,
  },
  submitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'mobile_submissions',
  indexes: [
    {
      unique: true,
      fields: ['cadetId', 'date'],
    },
  ],
});

module.exports = MobileSubmission;
