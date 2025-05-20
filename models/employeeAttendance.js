// models/EmployeeAttendance.js

module.exports = (sequelize, DataTypes) => {
    const employeeAttendance = sequelize.define("employeeAttendance", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    employeeAttendance.associate = (models) => {
      employeeAttendance.belongsTo(models.employee, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    };
  
    return employeeAttendance;
  };
  