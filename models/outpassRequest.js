const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutpassRequest extends Model {
    static associate(models) {
      OutpassRequest.belongsTo(models.Cadet, {
        foreignKey: 'cadetId',
        as: 'cadet',
      });

      OutpassRequest.belongsTo(models.Parent, {
        foreignKey: 'parentId',
        as: 'parent',
      });
    }
  }

  OutpassRequest.init(
    {
      cadetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fromDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      toDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      parentApprovalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // can be: pending | approved | rejected
      },
      adminFinalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // can be: pending | approved | rejected
      },
      outTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      inTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'OutpassRequest',
      tableName: 'outpass_requests',
      timestamps: true,
    }
  );

  return OutpassRequest;
};
