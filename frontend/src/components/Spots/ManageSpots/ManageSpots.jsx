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
      <h2>Manage Your Spots</h2>
      {spots.length === 0 && (
        <button className="button-click" onClick={() => navigate("/spots/new")}>
          Create a New Spot
        </button>
      )}

      <div className="div-grid">
        {spots.map((spot) => (
          <div key={spot.id} className="div-spot">
            <NavLink
              className="div-spot-A"
              to={`/spots/${spot.id}`}
              title={spot.name}
            >
              <div className="div-spot-img">
                <img className="image" src={spot.previewImage} alt="preview" />
              </div>
              <div className="div-location-stars">
                <div>
                  {spot.city}, {spot.state}
                </div>
                <div>
                  <i className="fa-solid fa-star"></i>{" "}
                  <span style={{ fontWeight: "bold" }}>{spot.avgRating}</span>
                </div>
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
              </div>
            </NavLink>
            <div className="buttons">
              <button
                className="button-click"
                onClick={() => navigate(`/spots/${spot.id}/edit`)}
              >
                Update
              </button>
              <OpenModalButton
                className="button-click"
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
