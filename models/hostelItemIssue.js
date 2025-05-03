'use strict';
module.exports = (sequelize, DataTypes) => {
  const HostelItemIssue = sequelize.define('HostelItemIssue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cadetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cadets',
        key: 'id'
      }
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'HostelItemIssue',
    tableName: 'hostel_item_issues',
    timestamps: true
  });

  HostelItemIssue.associate = function(models) {
    HostelItemIssue.belongsTo(models.Cadet, { 
      foreignKey: 'cadetId',
      as: 'cadet'
    });
  };

  return HostelItemIssue;
};
