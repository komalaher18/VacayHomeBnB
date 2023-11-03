const express = require('express');
const { Spot , SpotImage} = require("../../db/models");
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete an existing image for a Spot.

router.delete("/:imageId", requireAuth, async(req, res) =>{
    const userId = req.user.id;
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if(!spotImage){
        return res.status(404).json({ "message": "Spot Image couldn't be found"});
    };
    const spot = await Spot.findByPk(spotImage.spotId);
    if(spot.ownerId === userId){
        await spotImage.destroy();
         res.status(200).json({ message: "Successfully deleted"});

    } else {
        return res.status(403).json({ "message": "Forbidden"});

    }

    //     {
    //     include: Spot,
    // });

    // if(spotImage.Spot.ownerId !== userId){
    //     return res.status(403).json({ "message": "Forbidden"});
    // }

    // if(!spotImage){
    //     return res.status(404).json({ "message": "Spot Image couldn't be found"});
    // }

    // await spotImage.destroy();
    // res.status(200).json({ message: "Successfully deleted"});
})




module.exports = router;
