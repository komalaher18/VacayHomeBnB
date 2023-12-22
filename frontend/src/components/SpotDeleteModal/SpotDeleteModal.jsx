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
    <div className="div-spot-dlt">
      <h1>Confirm Delete</h1>
      <p className="p">
        Are you sure you want to remove this spot from the listings?
      </p>
      <button className="button-yes" value="Yes" onClick={handleDelete}>
        Yes (Delete Spot)
      </button>
      <button className="button-no" value="No" onClick={handleDelete}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default SpotDeleteModal;
