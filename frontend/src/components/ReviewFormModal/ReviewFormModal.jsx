import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addReviewToSpot } from "../../store/spots";
import "./ReviewFormModal.css";
import { useModal } from "../../context/Modal";

const ReviewFormModal = ({ spotId, spotFetch }) => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = () => {
    setError();
    dispatch(addReviewToSpot(spotId, review, stars, sessionUser))
      .then(() => {
        spotFetch();
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setError(data.message);
        }
      });
  };

  return (
    <div className="review-form">
      <h2 className="font">How was your stay?</h2>
      <p className="err">{error}</p>
      <textarea
        className="textarea"
        value={review}
        onChange={(e) => {
          setError("");
          setReview(e.target.value);
        }}
        required
        placeholder="Leave your review here.."
      ></textarea>

      <div className="star-rating">
        <div className="star">
          <input
            type="radio"
            id="star5"
            name="rating"
            value={stars}
            onChange={() => setStars(5)}
          />
          <label htmlFor="star5" title="text">
            5 stars
          </label>
          <input
            type="radio"
            name="rating"
            id="star4"
            value={stars}
            onChange={() => setStars(4)}
          />
          <label htmlFor="star4" title="text">
            4 stars
          </label>
          <input
            type="radio"
            name="rating"
            id="star3"
            value={stars}
            onChange={() => setStars(3)}
          />
          <label htmlFor="star3" title="text">
            3 stars
          </label>
          <input
            type="radio"
            id="star2"
            name="rating"
            value={stars}
            onChange={() => setStars(2)}
          />
          <label htmlFor="star2" title="text">
            2 stars
          </label>
          <input
            type="radio"
            id="star1"
            name="rating"
            value={stars}
            onChange={() => setStars(1)}
          />
          <label htmlFor="star1" title="text">
            1 star
          </label>
        </div>
        Stars
      </div>

      <button
        className="review-submit"
        disabled={review.length < 10 || stars < 1}
        onClick={handleSubmit}
      >
        Submit Your Review
      </button>
    </div>
  );
};

export default ReviewFormModal;
