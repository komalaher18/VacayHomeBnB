import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation.jsx";
import * as sessionActions from "./store/session";
import Spots from "./components/Spots/Spots.jsx";
import Spot from "./components/Spots/Spot/Spot.jsx";
import CreateNewSpot from "./components/Spots/CreateNewSpot/CreateNewSpot.jsx";
import ManageSpots from "./components/Spots/ManageSpots/ManageSpots.jsx";
import UpdateSpot from "./components/Spots/UpdateSpot/UpdateSpot.jsx";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",

        element: <Spots />,
      },
      {
        path: "/spots/new",
        element: <CreateNewSpot />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/spots/:spotId",
        element: <Spot />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpot />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
