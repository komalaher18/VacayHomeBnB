import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  //   return (
  //     <ul>
  //       <li>
  //         <NavLink to="/">Home</NavLink>
  //       </li>
  //       {isLoaded && (
  //         <li>
  //           <ProfileButton user={sessionUser} />
  //         </li>
  //       )}
  //     </ul>
  //   );
  // }

  return (
    <nav className="nav">
      <NavLink className="nav-home-button" to="/">
        <i className="fa-solid fa-landmark"></i> VacayHomeBnB
      </NavLink>
      {isLoaded && (
        <div>
          {sessionUser && (
            <NavLink className="nav-new-spot" to="/spots/new">
              Create a new spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
