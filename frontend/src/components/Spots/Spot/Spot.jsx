import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getASpot } from "../../../store/spots";
import "./Spot.css";

const Spot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.entries[spotId]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getASpot(spotId)).then(() => setIsLoading(false));
  }, [dispatch, spotId]);

  if (isLoading) return <h1>Loading...</h1>;

  const {
    city,
    state,
    country,
    name,
    SpotImages,
    Owner: { firstname, lastName },
    description,
    price,
    // Reviews,
    // avgStarRating,
    // numReviews,
  } = spot;

  const previewImg = SpotImages.find((img) => img.preview === true);
  const otherImg = SpotImages.filter((img) => img.preview !== true);

  return (
    <div className="div-spot">
      <div>
        <h1>{name}</h1>
      </div>
      <div>
        <h3>
          {city}, {state}, {country}
        </h3>
      </div>
      <div className="div-images">
        <img
          className="div-preview-image"
          src={previewImg ? previewImg.url : ""}
          alt="previewImage"
        />
        {otherImg.map((img) => (
          <img
            className="img-other"
            key={img.url}
            src={img.url}
            alt="otherImage"
          />
        ))}
      </div>
      <div className="div-spot-images">
        <div>
          <h2>
            Hosted by {firstname} {lastName}
          </h2>
          <p>{description}</p>
        </div>
        <div className="div-price">
          <div>
            <span>${price}</span> night
          </div>
        </div>
        <div>
          <button
            className="reserve-button"
            onClick={() => alert("Feature Comming Soon...")}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default Spot;
