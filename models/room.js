// models/room.js
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hostelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'rooms',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['hostelId', 'roomNumber']
      }
    ]
  });

  Room.associate = (models) => {
    Room.belongsTo(models.Hostel, { 
      foreignKey: 'hostelId',
      as: 'hostel'
    });
  };

  return Room;
};
