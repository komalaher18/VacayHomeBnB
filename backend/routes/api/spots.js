const express = require('express');
const { Spot , SpotImage, User, Review, ReviewImage, Booking} = require("../../db/models");
const { check } = require('express-validator');
const Op = require("sequelize").Op;
const { handleValidationErrors, newhandleValidationErrors } = require('../../utils/validation');
const {setTokenCookie, requireAuth } = require('../../utils/auth');

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
newhandleValidationErrors

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
    newhandleValidationErrors
];


const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage("Start date is required"),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage("End date is required"),
        newhandleValidationErrors
];


const validateQuery = [
    check('page')
    .default (1)
    .isInt({ min: 1, max: 10 })
    .withMessage('Page must be greater than or equal to 1'),
    check('size')
    .default (20)
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
    .isFloat({ min: -90, max: 90 })
    .optional()
    .withMessage("Maximum latitude is invalid"),
    check('minLat')
    .isFloat({ min: -90, max: 90 })
    .optional()
    .withMessage("Minimum latitude is invalid"),
    check('minLng')
    .isFloat({ min: -180, max: 180 })
    .optional()
    .withMessage("Minimum longitude is invalid"),
    check('maxLng')
    .isFloat({ min: -180, max: 180 })
    .optional()
    .withMessage("Maximum longitude is invalid"),
    check('minPrice')
    .isFloat({ min: 0 })
    .optional()
    .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
    .isFloat({ min: 0 })
    .optional()
    .withMessage("Maximum price must be greater than or equal to 0"),
    // handleValidationErrors,
    newhandleValidationErrors

]

// Get all Spots
router.get("/",validateQuery,async( req, res) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    const limit = size || 20;
    const offset = limit * ((page || 1) -1);

    const where = {};
    if(minLat) where.lat = { [Op.gte]:(minLat)};
    if(maxLat) where.lat = { [Op.lte] :(maxLat)};
    if(minLng) where.lng = { [Op.gte] :(minLng)};
    if(maxLng) where.lng = { [Op.lte] :(maxLng)};
    if(minPrice) where.price = { [Op.gte]: (minPrice)};
    if(maxPrice) where.price = { [Op.lte]: (maxPrice)};

    const allSpots = await Spot.findAll({
        where,
        include: [
            {
                model: SpotImage,

                where: { preview: true },
                attributes: ["url"],

            },


        ],
        limit,
        offset,
    });
    const previewSpots = allSpots.map(spot =>{
        const { SpotImages, ...spotInfo } = spot.toJSON();
        const editedSpot = { ...spotInfo};
        return editedSpot;
    })
    return res.json({Spots :previewSpots, page:page || 1, size: limit});
});

// Get all Spots owned by the Current User;
router.get("/current", requireAuth, async(req, res) => {
    const userId = req.user.id
    const spots = await Spot.findAll({
        where: { ownerId : userId},
        include: [
            {
                model: SpotImage,
                where:{ preview: true},
                attributes: ["url"]
            },

        ],
    });
    const previewSpots = spots.map(spot =>{
        const { SpotImages, ...spotInfo } = spot.toJSON();
        const editedSpot = { ...spotInfo};
        return editedSpot;
    })

    return res.json({Spots : previewSpots});
});


// Get details of a Spot from an id
router.get("/:spotId", async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [{
            model: SpotImage,
            attributes: ["id", "url", "preview"],
        },
        {
            model: User,
            as : 'Owner',
            attributes: ["id", "firstName", "lastName"]
        },
        {
            model: Review,
            attributes: ["stars"],
        },
    ]
});
if ( !spot) {
    return res.status(404).json({ "message": "Spot couldn't be found" });
};
const { Reviews, User:Owner, SpotImages, previewImage, avgRating,...spotInfo} = spot.toJSON();
// console.log("****", spot)
const editedSpot = {
    ...spotInfo,
    numReviews: Reviews.length,
    avgStarRating: 0,
    SpotImages,
}
let sum = 0;

if(Reviews.length){
    const starCount = Reviews.reduce((sum, rev) => sum + rev.stars, 0);
    editedSpot.avgStarRating = Number(starCount/Reviews.length).toFixed(1);
}
    res.json(editedSpot);
});



// Create a Spot
router.post("/", [requireAuth, ...validateSpot] ,async(req, res) =>{
    const userId = req.user.id
    const spotInfo = req.body;

    const newSpot = await Spot.create({
        ownerId: userId, avgRating:0, ...spotInfo
    })
    res.status(201).json(newSpot);
} );

// / // Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", [requireAuth, ...validateReview] ,async(req, res) =>{
    const {user} = req;
    const{ review , stars}= req.body;
    // const spotId = parseInt(req.params.spotId)
    const spot = await Spot.findByPk(req.params.spotId,{
         include: [{
            model: Review,
            attributes: ["stars"],
        }],
    });
    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });

    }
    const { Reviews,  avgRating } = spot.toJSON();

    const rev = await Review.findOne({
        where : { userId: user.id, spotId: req.params.spotId},

    });

    if(rev) {
        return res.status(500).json({ "message": "User already has a review for this spot" });
    }
    if(Reviews.length){
        const starCount = Reviews.reduce((sum, rev) => sum + rev.stars, 0);
         spot.update({...spot, avgRating: Number(starCount/Reviews.length + 1).toFixed(1)});
        }else{
        spot.update({...spot, avgRating: stars});
        console.log("****line265***", avgRating)
    }

    const createReview = await Review.create({
        userId : user.id,
        spotId :req.params.spotId,
        review,
        stars
    });
    res.status(201).json(createReview)
});




// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async(req, res) =>{
    const userId = req.user.id
    const { url, preview} = req.body;
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    }
    if(spot.ownerId !==userId  ){
      return  res.status(403).json({ "message": "Forbidden" });
    };
    const spotId = req.params.spotId;
    const createSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    });
    if(preview === true){
       spot.update({...spot, previewImage:url})
    }
    const newImage = {};
    newImage.id = createSpotImage.id;
    newImage.url = createSpotImage.url;
    newImage.preview = createSpotImage.preview;

    return res.json(newImage);
})


// Edit a Spot
router.put("/:spotId", [requireAuth, ...validateSpot],  async(req, res) => {
    await setTokenCookie(res, req.user);
    const userId = req.user.id

    // const spotInfo = req.body
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // console.log("********", spotInfo)
    const spot = await Spot.findByPk(req.params.spotId);


    if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if(spot.ownerId !== userId){
      return  res.status(403).json({ "message": "Forbidden" });
    }
    if (spot.ownerId === userId) {
        const newSpot = {
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        }
        await spot.update(newSpot);
        res.json({id: spot.id, ownerId: spot.ownerId, ...newSpot, createdAt: spot.createdAt, updatedAt: spot.updatedAt});
    }
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async(req, res, next) =>{
    const userId = req.user.id
    const deleteSpot = await Spot.findByPk(req.params.spotId);

    if(!deleteSpot) {
       return res.status(404).json({ "message": "Spot couldn't be found" });
    }

    if(userId !== deleteSpot.ownerId) {
       return res.status(403).json({ "message": "Forbidden" });
    }

    await deleteSpot.destroy();
    res.status(200).json({ message: "Successfully deleted"});
});


// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async(req, res) =>{
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


// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings",requireAuth, async(req, res) =>{
    const userId = req.user.id
    const spot = await Spot.findByPk(req.params.spotId);

     if(!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };
    let allBookings;

    if(spot.ownerId !== userId){
         allBookings = await Booking.findAll({
            where: { spotId: req.params.spotId },
            attributes:["spotId", "startDate", "endDate"]
        });
    } else {
        allBookings = await Booking.findAll({
            where:{spotId: req.params.spotId},
            include :{
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }
        });
        allBookings = allBookings.map(booking =>{
            const { User, ...bookingInfo} = booking.toJSON()
            const editedBooking = { User, ...bookingInfo};

            return editedBooking;
        });
    }
    res.json({ Bookings: allBookings });
});


// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings",[requireAuth, ...validateBooking],async(req, res) => {
    const userId = req.user.id
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
    return res.status(404).json({ "message": "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
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
    return  res.status(403).json({ "message": "Past bookings can't be modified" });
    }

    const bookings = await Booking.findAll({ where: { spotId: spot.id } });
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

    const validBooking = await Booking.create({
      spotId: spot.id,
      userId,
      startDate,
      endDate,
    });

    res.json(validBooking);
  }
);





module.exports = router;
