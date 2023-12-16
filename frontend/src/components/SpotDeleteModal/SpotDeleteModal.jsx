import { useDispatch } from "react-redux";
import { removeASpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./SpotDeleteModal.css";

const SpotDeleteModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    if (e.target.value === "Yes") {
      return dispatch(removeASpot(spotId)).then(closeModal);
    } else {
      dispatch(closeModal);
    }
  };

  return (
    <div className="form-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button value="Yes" onClick={handleDelete}>
        Yes
      </button>
      <button value="No" onClick={handleDelete}>
        No
      </button>
    </div>
  );
};

export default SpotDeleteModal;
