// models/EmployeePoint.js

module.exports = (sequelize, DataTypes) => {
    const employeePoint = sequelize.define("employeePoint", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('positive', 'negative'),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    });
  
    employeePoint.associate = (models) => {
      employeePoint.belongsTo(models.employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    };
  
    return employeePoint;
  };
  