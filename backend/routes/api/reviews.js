const express = require('express');
const { Spot , SpotImage, User, Review, ReviewImage} = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors , newHandleValidationErrors} = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();




// Get all Reviews of the Current User

router.get("/current",requireAuth, async( req, res) =>{
    const userId = req.user.id
    const allReviews = await Review.findAll({
       where: { userId},
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "updatedAt", "createdAt", "avgRating"],
                },

            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
        ]
    });

       const reviews = allReviews.map(review => {
        const { Spot, ReviewImage, ...reviewInfo} = review.toJSON()
        const editedReviews = {...reviewInfo, Spot, ReviewImage}
        return editedReviews;
    });
    res.json({ Reviews: reviews });
});





module.exports = router;
