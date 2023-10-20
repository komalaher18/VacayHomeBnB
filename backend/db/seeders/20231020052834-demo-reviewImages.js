'use strict';
/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url:
      },
      {
        reviewId: 2,
        url:,
      },
      {
        reviewId: 3,
        url:,
      },
    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
