'use strict';
/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url:"https://images.app.goo.gl/MKPwjzoYyzPLryLG6",
      },
      {
        reviewId: 2,
        url:"https://images.app.goo.gl/YrzDphdvWk46LbSn9",
      },
      {
        reviewId: 3,
        url:"https://images.app.goo.gl/4wtqzPh3xNAw3Rbp8",
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
