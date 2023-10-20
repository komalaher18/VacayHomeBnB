'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Spot } = require("../models");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "The Golden Bay",
        description: "Beautiful views in every direction-inside and out.",
        price: 320,


      },
      {
        ownerId : 2,
        address : "3712 Heritage Lane",
        city : "Los Angeles",
        state : "California",
        country: "United States Of America",
        lat: 33.99841,
        lng: -118.46122,
        name: "OceanView Resort",
        description: "Extraordinary views of the Pacific Ocean",
        price: 300,
      },

      {
        ownerId : 3,
        address : "721 Davenport Blvd",
        city : "San Diego",
        state : "California",
        country: "United States Of America",
        lat: 32.70171,
        lng: -117.05684,
        name: "The Skyline",
        description: "amazing views of Downtown San Diego",
        price: 280,
      }
    ], { validate : true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["The Golden Bay", "OceanView Resort", "The Skyline"] }
    }, {});
  }
};
