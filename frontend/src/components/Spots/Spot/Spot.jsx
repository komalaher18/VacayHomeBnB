import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getASpot, spotIdReview } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton/OpenModalButton.jsx";
import ReviewFormModal from "../../ReviewFormModal/ReviewFormModal.jsx";
import ReviewDeleteModal from "../../ReviewDeleteModal/ReviewDeleteModal.jsx";

import "./Spot.css";

const Spot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.entries[spotId]);
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);

  const spotFetch = () => {
    setIsLoading(true);
    setReviewLoading(true);
    dispatch(getASpot(spotId)).then(() => setIsLoading(false));
    dispatch(spotIdReview(spotId)).then(() => setReviewLoading(false));
  };

  useEffect(() => {
    dispatch(getASpot(spotId)).then(() => setIsLoading(false));
    dispatch(spotIdReview(spotId)).then(() => setReviewLoading(false));
  }, [dispatch, spotId]);

  if (isLoading || reviewLoading) return <h1>Loading...</h1>;

  const {
    city,
    state,
    country,
    name,
    SpotImages,
    Owner: { firstname, lastName },
    ownerId,
    description,
    price,
    Reviews,
    avgStarRating,
    numReviews,
  } = spot;

  // console.log("*******", Reviews);
  // console.log("****", avgStarRating);
  const currentUserReview =
    Reviews && sessionUser
      ? Reviews.find((rev) => rev.userId === sessionUser.id)
      : undefined;

  const previewImg = SpotImages.find((img) => img.preview === true);
  const otherImgs = SpotImages.filter((img) => img.preview !== true);

  const reviewComponent = (
    <div>
      <i className="fa-solid fa-star"></i>{" "}
      {numReviews ? (
        <>
          {avgStarRating} . {numReviews} {numReviews > 1 ? "reviews" : "review"}
        </>
      ) : (
        "New"
      )}
    </div>
  );

  return (
    <div className="div-spot-detail">
      <div>
        <h1>{name}</h1>
      </div>
      <div>
        <h3 className="location-head">
          {city}, {state}, {country}
        </h3>
      </div>
      <div className="div-images">
        <img
          className="div-preview-image"
          src={previewImg ? previewImg.url : ""}
          alt="previewImage"
        />
        {otherImgs.map((img) => (
          <img
            className="img-other"
            key={img.id}
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
        <div className="div-price-box">
          <div className="div-content">
            <div>
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                ${price}
              </span>{" "}
              night
            </div>
            <div>{reviewComponent}</div>
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
      <div>
        <div className="review-heading">{reviewComponent}</div>
        <div className="review-post">
          {sessionUser && sessionUser.id !== ownerId && !currentUserReview && (
            <>
              <OpenModalButton
                className="button-post-review"
                buttonText="Post Your Review"
                modalComponent={
                  <ReviewFormModal spotId={spotId} spotFetch={spotFetch} />
                }
              />
              {Reviews && !Reviews.length && (
                <p>Be the first to post a review</p>
              )}
            </>
          )}
        </div>
        <div>
          {Reviews &&
            Reviews.sort(
              (rev1, rev2) =>
                new Date(rev2.createdAt) - new Date(rev1.createdAt)
            ).map((rev) => (
              <div key={rev.id} className="firstname-review">
                <div>{rev.User.firstName}</div>
                <div className="date-review">
                  {new Date(rev.createdAt).toLocaleString("default", {
                    month: "long",
                  })}
                  &nbsp;
                  {new Date(rev.createdAt).getFullYear()}
                </div>
                <p>{rev.review}</p>
                {sessionUser && rev.User.id === sessionUser.id && (
                  <OpenModalButton
                    className="delete-review-button"
                    buttonText="Delete"
                    modalComponent={
                      <ReviewDeleteModal
                        reviewId={rev.id}
                        spotFetch={spotFetch}
                      />
                    }
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Spot;
