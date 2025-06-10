'use strict';

module.exports = (sequelize, DataTypes) => {
  const CadetMobileSubmission = sequelize.define('CadetMobileSubmission', {
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
    cadetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileSubmission: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mobileReturn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  }, {
    tableName: 'cadet_mobile_submissions',
    indexes: [
      {
        unique: true,
        fields: ['cadetId', 'date'],
      },
    ],
  });

  CadetMobileSubmission.associate = function(models) {
    CadetMobileSubmission.belongsTo(models.Cadet, {
      foreignKey: 'cadetId',
      as: 'cadet',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return CadetMobileSubmission;
};