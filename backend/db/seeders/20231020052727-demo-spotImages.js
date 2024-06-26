'use strict';
/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://images.app.goo.gl/tBZbqdZSYhBW8dGv5",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.app.goo.gl/hvUAAL1MzfJkodJY9",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.app.goo.gl/VWsjKSAhm9kTvX8z5",
        preview: true
      }
    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
