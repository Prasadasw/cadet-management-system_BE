// This file defines all model associations

module.exports = (sequelize) => {
  const { 
    Classroom, 
    Cadet, 
    ClassroomCadet,
    // Import other models as needed
  } = sequelize.models;

  // Classroom and Cadet have a many-to-many relationship through ClassroomCadet
  Classroom.belongsToMany(Cadet, {
    through: ClassroomCadet,
    foreignKey: 'classroomId',
    otherKey: 'cadetId',
    as: 'cadets'
  });

  Cadet.belongsToMany(Classroom, {
    through: ClassroomCadet,
    foreignKey: 'cadetId',
    otherKey: 'classroomId',
    as: 'classrooms'
  });

  // ClassroomCadet belongs to Classroom and Cadet
  ClassroomCadet.belongsTo(Classroom, {
    foreignKey: 'classroomId',
    as: 'classroom'
  });

  ClassroomCadet.belongsTo(Cadet, {
    foreignKey: 'cadetId',
    as: 'cadet'
  });

  // Add any additional associations here
};
