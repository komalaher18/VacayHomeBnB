import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "./ReviewFormModal.css";
import { useModal } from "../../context/Modal";
import * as reviewsActions from "../../store/spots";

const ReviewFormModal = ({ spotId, spotFetch }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState({});
  const [starCount, setStarCount] = useState(null);
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  const starSelect = () => {
    setStars(starCount);
  };

  const starHovering = (num) => {
    setStarCount(num);
  };

  let fiveStars = [1, 2, 3, 4, 5];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(
        reviewsActions.addReviewToSpot(spotId, review, stars, sessionUser)
      );
      spotFetch();
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h1>How was your stay?</h1>
      {Object.keys(errors).length !== 0 && (
        <p>{`Errors: ${Object.keys(errors)}`}</p>
      )}
      <textarea
        type="textarea"
        className="input-review"
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      <div className="star-container">
        {fiveStars.map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star star ${
              star <= (starCount || stars) ? "active" : ""
            }`}
            onMouseEnter={() => starHovering(star)}
            onMouseLeave={() => starHovering(null)}
            onClick={starSelect}
          ></i>
        ))}
        <label>Stars</label>
      </div>
      <button
        className="review-submit"
        disabled={review.length < 10 || stars < 1}
        onClick={handleSubmit}
      >
        Submit Your Review
      </button>
    </form>
  );
};

export default ReviewFormModal;
