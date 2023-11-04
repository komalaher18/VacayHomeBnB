const express = require('express');
const { Spot , SpotImage, Booking} = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors, newhandleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const Op = require("sequelize").Op;

const router = express.Router();

const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage("Start date is required"),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage("End date is required"),
    newhandleValidationErrors
]


// Get all of the Current User's Bookings
router.get("/current", requireAuth, async(req, res) =>{
    const userId = req.user.id
    const allBooking = await Booking.findAll({
        where: {userId},
        include: {
            model: Spot,
            attributes: {
                exclude: ["description","createdAt", "updatedAt","avgRating"]
            }
        }
    });
    const bookings = allBooking.map(booking => {
        const { id, spotId, Spot, ...bookingInfo} = booking.toJSON()
        const editedBooking = {id, spotId, Spot, ...bookingInfo}
        return editedBooking;
    });
    res.json({Bookings: bookings})
})

// Edit Booking
router.put("/:bookingId",[requireAuth, ...validateBooking],async (req, res) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({ "message": "Booking couldn't be found" });
    }

    if (booking.userId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    if (startDate >= endDate) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        });
    }

    const newDate = new Date();
    if (Date.parse(endDate) <= newDate) {
     return res.status(403).json({ "message": "Past bookings can't be modified" });
    }

    const bookings = await Booking.findAll({ where: { spotId: booking.spotId, id:{ [Op.ne]: booking.id} } });
    for (let booking of bookings) {
      const errors = {};
      const { startDate: bookingStartDate, endDate: bookingEndDate } = booking.toJSON();
      const currentStartDate = new Date(bookingStartDate);
      const currentEndDate = new Date(bookingEndDate);
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      if(newStartDate <= currentStartDate && newEndDate >= currentStartDate &&
        currentEndDate < newEndDate && currentStartDate > newStartDate){
            errors.startDate = "Start date conflicts with an existing booking";
        }

        if(currentEndDate >= newStartDate && newStartDate >= currentStartDate){
            errors.startDate = "Start date conflicts with an existing booking";
        }

        if ((newStartDate < currentStartDate && newEndDate > currentEndDate &&
            currentEndDate >= newStartDate &&currentEndDate <= newEndDate)) {
            errors.endDate = "End date conflicts with an existing booking";
        }

        if(currentEndDate >= newEndDate && currentStartDate <= newEndDate){
            errors.endDate = "End date conflicts with an existing booking";
        }

    if (errors.startDate || errors.endDate) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            errors,
        });
      }
    }
    const editedBooking = await booking.update({ startDate, endDate})
    res.json(editedBooking);
  }
);

// Delete a Booking
router.delete("/:bookingId", requireAuth, async(req, res) =>{
    const userId = req.user.id;
    const deleteBooking = await Booking.findByPk(req.params.bookingId);
    if(!deleteBooking) {
       return res.status(404).json({ "message": "Booking couldn't be found" });
    }

     if(deleteBooking.userId!== userId ) {
     return   res.status(403).json({ "message": "Forbidden" });
    }

    const currentDate = new Date();
    if(Date.parse(deleteBooking.startDate) <= currentDate){
        return res.status(403).json({ "message": "Bookings that have been started can't be deleted" });
    }

    await deleteBooking.destroy();
    return res.json({"message": "Successfully deleted"})
})





module.exports = router;
