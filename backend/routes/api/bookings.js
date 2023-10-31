const express = require('express');
const { Spot , SpotImage, Booking} = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors, newhandleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

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








// Delete a Booking
router.delete("/:bookingId", requireAuth, async(req, res) =>{
    const userId = req.user.id;
    const deleteBooking = await Booking.findByPk(req.params.bookingId);
    if(!deleteBooking) {
       return res.status(404).json({ "message": "Booking couldn't be found" });
    }

     if(userId !== deleteBooking.userId) {
        res.status(403).json({ "message": "Forbidden" });
    }

    const currentDate = new Date();
    if(currentDate > deleteBooking.startDate){
        return res.status(403).json({ "message": "Bookings that have been started can't be deleted" });
    }

    await deleteBooking.destroy();
    return res.json({"message": "Successfully deleted"})
})





module.exports = router;
