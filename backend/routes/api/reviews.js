const express = require('express');
const { Spot , SpotImage, User, Review, ReviewImage} = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors , newhandleValidationErrors} = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    // handleValidationErrors,
    newhandleValidationErrors
];

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

// Add an Image to a Review based on the Review's id

router.post("/:reviewId/images", requireAuth ,async(req, res) =>{
    const userId = req.user.id
    const review = await Review.findByPk(req.params.reviewId, {
        include : ReviewImage,
    });

     if(!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    if(review.userId !==userId  ){
        res.status(403).json({ "message": "Forbidden" });
    };

    if(review.ReviewImages.length > 10){
        return res.status(403).json({ "message": "Maximum number of images for this resource was reached" });
    }

    const createReviewImage = await ReviewImage.create({
        reviewId: review.id,
        ...req.body,
    });
    const newReviewImage = {};
    newReviewImage.id = createReviewImage.id;
    newReviewImage.url = createReviewImage.url;

    return res.json(newReviewImage);
});

// Edit a Review

router.put("/:reviewId", [requireAuth, ...validateReview],  async(req, res) =>{
    const userId = req.user.id;
    const reviewInfo = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    if(!review){
        return res.status(404).json({ "message": "Review couldn't be found"});
    }

    if(review.userId !== userId){
        res.status(403).json({ "message": "Forbidden" });
    }

    const editedReview = await review.update(reviewInfo);
    res.json(editedReview)
});

// Delete a Review

router.delete("/:reviewId", requireAuth, async(req, res) =>{
    const userId = req.user.id;
    const deleteReview = await Review.findByPk(req.params.reviewId);

    if(!deleteReview) {
       return res.status(404).json({ "message": "Review couldn't be found" });
    }

    if(userId !== deleteReview.userId) {
        res.status(403).json({ "message": "Forbidden" });
    }

    await deleteReview.destroy();
    res.status(200).json({ message: "Successfully deleted"});

})





module.exports = router;
