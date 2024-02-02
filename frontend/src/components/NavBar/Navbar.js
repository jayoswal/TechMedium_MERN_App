import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { useReducer } from "react";

import "./Navbar.css";
import { UserContext } from "../../App";

function Navbar() {
  useEffect(() => {
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
  }, []);

  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  function logout() {
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    navigate("/login");
  }

  function NavList() {
    if (state) {
      return [
        <li key={"1"}>
          <Link to="/create-post">Create Post</Link>
        </li>,
        <li key={"2"}>
          <Link to="/profile">Profile</Link>
        </li>,
        <li key={"5"}>
          <button onClick={logout} className="btn #e57373 red lighten-2">
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={"3"}>
          <Link to="/login">Login</Link>
        </li>,
        <li key={"4"}>
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  }

  return (
    <div>
      <nav>
        <div className="nav-wrapper grey darken-3">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            TechMedium
          </Link>
          <Link to="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </Link>
          <ul className="right hide-on-med-and-down">{NavList()}</ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {NavList()}
      </ul>
    </div>
  );
}

export default Navbar;
