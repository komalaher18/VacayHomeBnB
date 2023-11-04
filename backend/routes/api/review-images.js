const express = require('express');
const { Review , ReviewImage} = require("../../db/models");
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


// Delete an existing image for a Review.

router.delete("/:imageId", requireAuth, async(req, res)=>{
    const userId = req.user.id;
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
        include: Review
    });

     if(!reviewImage){
        return res.status(404).json({ "message": "Review Image couldn't be found"});
    }
    if(reviewImage.Review.userId !== userId){
        return res.status(403).json({ "message": "Forbidden"});
    }

    await reviewImage.destroy();
    res.status(200).json({ message: "Successfully deleted"});
})


module.exports = router;
