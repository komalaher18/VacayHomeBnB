import { csrfFetch } from "./csrf";

const ALL_SPOTS = "spots/ALL_SPOTS";
const A_SPOT = "spots/A_SPOT";
const CURRENT_SPOTS= "spots/CURRENT_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT"

const allSpots = (spots) => {
  return {
    type: ALL_SPOTS,
    spots,
  };
};

const ASpot = (spot) => {
    return {
        type: A_SPOT,
        spot,
    }
}

const currentUserSpots = (spots) => {
    return {
        type:CURRENT_SPOTS,
        spots,
    }
}

const deleteASpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId,
    }
}

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if(response.ok){
    const data = await response.json();
    dispatch(allSpots(data.Spots));
    return response;
}

};


export const createSpot = (spot) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        // headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(spot)
    });
    if(response.ok){
        const data= await response.json();
        dispatch(ASpot(data));
        return data;
    }
}

export const addSpotImage = (spotId, image) => async() => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify(image),
    });
    return response
}

export const getASpot = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if(response.ok){
        const data = await response.json();
        dispatch(ASpot(data));
        return data;
    }
}

export const spotsCurrentUser = () => async(dispatch) => {
    const response = await csrfFetch("/api/spots/current");
    if(response.ok){
        const data = await response.json();
        dispatch(currentUserSpots(data.Spots));
        return response;
    }
}

export const updateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(ASpot(data));
  return data;
};

export const updateSpotImage = (spotId, image) => async () => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(image),
  });
  return response;
};

export const removeASpot = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });
    dispatch(deleteASpot(spotId));
    return response
}


const initialState = { entries: {}, current: {} };
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
    case ALL_SPOTS: {
      const spots = action.spots.reduce((acc, spot) => {
        const exitingSpot = state.entries[spot.id];


        return { ...acc, [spot.id]: { ...exitingSpot, ...spot } };

      }, {});
      return { ...state, entries: spots };
    }

    case A_SPOT: {
        const existingSpot = state.entries[action.spot.id];
        return {...state, entries:{
            ...state.entries,
            [action.spot.id]: {...existingSpot, ...action.spot},
        }}
    }

    case CURRENT_SPOTS: {
        const spots = action.spots.reduce((acc, spot) => {
            return {...acc, [spot.id]:spot};
        }, {});
        return { ...state, current:spots}
    }

    case DELETE_SPOT: {
      const revEntries = { ...state.entries };
      delete revEntries[action.spotId];
      const revCurrent = { ...state.current };
      delete revCurrent[action.spotId];
      return { ...state, entries: revEntries, current: revCurrent };
    }

    default:
      return state;
}


}

export default spotsReducer;
