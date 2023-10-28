const express = require('express');
const { Spot , SpotImage, User, Review, ReviewImage} = require("../../db/models");
const { check } = require('express-validator');

const { handleValidationErrors, newhandleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
check('lat')
    .exists({ checkFalsy: true })
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude is not valid'),
check('lng')
    .exists({ checkFalsy: true })
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude is not valid'),
check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50})
    .withMessage('Name must be less than 50 characters'),
check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0})
    .withMessage('Price per day is required'),

//   handleValidationErrors

];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    // handleValidationErrors,
    newHandleValidationErrors


];

// Get all Spots
router.get("/", async( req, res) => {
    const Spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                where: { preview: true },
                attributes: ["url"],
            }
        ],
    });
    const previewSpots = Spots.reduce((acc, spot) =>{
        const { SpotImages, ...spotInfo } = spot.toJSON();
        const previewSpot = { ...spotInfo, previewImage: ""};
        if (SpotImages.length) previewSpot.previewImage = SpotImages[0].url;
        acc.push(previewSpot);
        return acc;
    }, []);
    return res.json({Spots : previewSpots});
});

// Get all Spots owned by the Current User;
router.get("/current", requireAuth, async(req, res) => {
    const userId = req.user.id
    const allSpots = await Spot.findAll({
        where: { ownerId : userId},
        include: [{
            model: SpotImage,
            where:{ preview: true},
            attributes: ["url"]
        }]
    });
    const previewSpots = allSpots.reduce((acc, spot) =>{
        const { SpotImages, ...spotInfo } = spot.toJSON();
        const previewSpot = { ...spotInfo, previewImage: ""};
        if (SpotImages.length) previewSpot.previewImage = SpotImages[0].url;
        acc.push(previewSpot);
        return acc;
    }, [])
    return res.json({Spots : previewSpots});
});



// Get details of a Spot from an id

router.get("/:spotId", async(req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [{
            model: SpotImage,
            attributes: ["id", "url", "preview"],
        },
        {
            model: User,
            as : 'Owner',
            attributes: ["id", "firstname", "lastName"]
        }]
    });

    if ( !spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };
    res.json(spot);
});


// Get all Reviews by a Spot's id

router.get("/:spotId/reviews", async(req, res, next) =>{
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    const reviews = await Review.findAll({
        where :{ spotId: req.params.spotId},
        include:[
            {
            model: User,
            attributes:["id", "firstName", "lastName"],
        },
        {
            model: ReviewImage,
            attributes: ["id", "url"]
        }
    ]
    });
    res.json({ Reviews: reviews })
});

// Create a Review for a Spot based on the Spot's id

// router.post("/:spotId/reviews", [requireAuth, ...validateReview] ,async(req, res) =>{
//     const {user} = req;
//     const spot = await Spot.findByPk(req.params.spotId);
//     if(!spot) {
//         return res.status(404).json({ "message": "Spot couldn't be found" });
//     };

//     const review = await Review.findOne({
//         where : { userId: user.id, spotId: req.params.spotId},
//     });

//     if(review) {
//         return res.status(500).json({ "message": "User already has a review for this spot" });
//     };

//     const createReview = await Review.create({
//         userId : user.id,
//         spotId : req.params.spotId,
//         ...req.body,

//     })
//     res.status(201).json(createReview)

// })



// Create a Spot

router.post("/", [requireAuth, ...validateSpot] ,async(req, res) =>{
    const userId = req.user.id
    const spotInfo = req.body;

    const newSpot = await Spot.create({
        ownerId: userId, ...spotInfo
    })

    res.status(201).json(newSpot);
} );


// Add an Image to a Spot based on the Spot's id

router.post("/:spotId/images", requireAuth, async(req, res, next) =>{
    const userId = req.user.id
    const { url, preview} = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    }
    if(spot.ownerId !==userId  ){
        res.status(403).json({ "message": "Forbidden" });
    };
    const spotId = req.params.spotId;
    const createSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    });
    const newImage = {};
    newImage.id = createSpotImage.id;
    newImage.url = createSpotImage.url;
    newImage.preview = createSpotImage.preview;

    return res.json(newImage);

})


// Edit a Spot

router.put("/:spotId", [requireAuth, ...validateSpot],  async(req, res, next) => {
    const userId = req.user.id
    const spotInfo = req.body
    const spot = await Spot.findByPk(req.params.spotId);

    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });

    };

    if(spot.ownerId !== userId){
        res.status(403).json({ "message": "Forbidden" });
    }

    const newSpot =  await spot.update(spotInfo);
    res.json(newSpot);
});

// Delete a Spot

router.delete("/:spotId", requireAuth, async(req, res, next) =>{
    const userId = req.user.id
    const deleteSpot = await Spot.findByPk(req.params.spotId);

    if(!deleteSpot) {
       return res.status(404).json({ "message": "Spot couldn't be found" });
    }

    if(userId !== deleteSpot.ownerId) {
        res.status(403).json({ "message": "Forbidden" });
    }

    await deleteSpot.destroy();
    res.status(200).json({ message: "Successfully deleted"});

});



module.exports = router;
