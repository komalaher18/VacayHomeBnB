'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING(256),
      allowNull: false,
    });
    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING(256),
      allowNull: false,
    });
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
