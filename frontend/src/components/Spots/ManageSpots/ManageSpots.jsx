import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import "./ManageSpots.css";
import OpenModalButton from "../../OpenModalButton/OpenModalButton.jsx";
import SpotDeleteModal from "../../SpotDeleteModal/SpotDeleteModal";

import { spotsCurrentUser } from "../../../store/spots";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const spotsObject = useSelector((state) => state.spots.current);
  const spots = Object.values(spotsObject);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(spotsCurrentUser()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Manage Spots</h2>
      {spots.length === 0 && (
        <button onClick={() => navigate("/spots/new")}>
          Create a New Spot
        </button>
      )}

      <div>
        {spots.map((spot) => (
          <div key={spot.id}>
            <NavLink to={`/spots/${spot.id}`} title={spot.name}>
              <div>
                <img src={spot.previewImage} alt="preview" />
              </div>
              <div>
                <div>
                  {spot.city}, {spot.state}
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>{spot.avgRating}</span>
                </div>
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
              </div>
            </NavLink>
            <div>
              <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>
                Update
              </button>
              <OpenModalButton
                className="action-button"
                buttonText="Delete"
                modalComponent={<SpotDeleteModal spotId={spot.id} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;
