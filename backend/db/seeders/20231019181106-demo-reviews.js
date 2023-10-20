'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 3,
        review: "Highly recommended to experience",
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: "Worth to stay",
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: "Good Place",
        stars: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: "Good Place",
        stars: 3
      }

    ], {validate : true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2 , 3] }
    }, {});
  }
};
