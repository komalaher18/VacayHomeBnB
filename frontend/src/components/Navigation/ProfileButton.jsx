import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem.jsx";
import LoginFormModal from "../LoginFormModal/LoginFormModal.jsx";
import SignupFormModal from "../SignupFormModal/SignupFormModal.jsx";
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="button-menu" onClick={toggleMenu}>
        <i className="fas fa-regular fa-bars fa-lg menu-button-icon" />
        <i className="fas fa-user-circle fa-lg menu-button-icon" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div>
              <div>Hello, {user.username}</div>
              {/* <div>
                {user.firstName} {user.lastName}
              </div> */}
              <div>{user.email}</div>
            </div>

            <NavLink
              className="nav-manage-spot"
              to="/spots/current"
              onClick={closeMenu}
            >
              Manage Spots
            </NavLink>

            <div className="div-logout">
              <button className="button-logout" onClick={logout}>
                Log Out
              </button>
            </div>
          </>
        ) : (
          <div className="div-profile">
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
