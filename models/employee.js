module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [10, 15],
        },
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return employee;
  };
  