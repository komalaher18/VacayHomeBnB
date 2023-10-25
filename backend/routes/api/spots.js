const express = require('express');
const { Spot , SpotImage, User} = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
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

  handleValidationErrors
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
