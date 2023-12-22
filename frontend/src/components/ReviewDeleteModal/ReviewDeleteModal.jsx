import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import "./ReviewDeleteModal.css";
import { deleteReview } from "../../store/reviews";

const ReviewDeleteModal = ({ reviewId, spotFetch }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className="div-review-dlt">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>

      <button
        className="rev-dlt-button-yes"
        onClick={() =>
          dispatch(deleteReview(reviewId)).then(() => {
            spotFetch();
            closeModal();
          })
        }
      >
        Yes (Delete Review)
      </button>
      <button className="rev-dlt-button-no" onClick={() => closeModal()}>
        No (Keep Review)
      </button>
    </div>
  );
};
export default ReviewDeleteModal;
