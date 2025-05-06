'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Update existing records with a unique registration number
    const cadets = await queryInterface.sequelize.query(
      'SELECT id FROM Cadets',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let cadet of cadets) {
      await queryInterface.sequelize.query(
        `UPDATE Cadets SET registrationNumber = 'REG-${cadet.id}' WHERE id = ${cadet.id}`,
        { type: Sequelize.QueryTypes.UPDATE }
      );
    }
  },

  async down (queryInterface, Sequelize) {
    // Optional: If you want to revert the changes
    await queryInterface.sequelize.query(
      'UPDATE Cadets SET registrationNumber = NULL',
      { type: Sequelize.QueryTypes.UPDATE }
    );
  }
};
