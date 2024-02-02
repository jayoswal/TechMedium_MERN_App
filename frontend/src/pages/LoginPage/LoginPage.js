import "./LoginPage.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const navigate = useNavigate();

  const { state, dispatch } = useContext(UserContext);

  const login = () => {
    // validate email
    if (!emailRegex.test(email)) {
      M.toast({
        html: "Invalid Email",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // check error field
        if (jsonResponse.error) {
          M.toast({
            html: jsonResponse.error,
            classes: "#c62828 red darken-3",
          });
        }
        // check token field means success
        else if (jsonResponse.token) {
          // clog all jsonResponse
          console.log(jsonResponse);

          M.toast({
            html: "Welcome back " + jsonResponse.userInfo.name,
            classes: "#2e7d32 green darken-3",
          });

          localStorage.setItem("token", jsonResponse.token);
          localStorage.setItem(
            "userInfo",
            JSON.stringify(jsonResponse.userInfo)
          );
          // dispatch the acction and state
          dispatch({ type: "USER", payload: jsonResponse.userInfo });

          navigate("/");
        }
      })
      .catch((error) => {
        M.toast({
          html: "Error. Contact admin",
          classes: "#c62828 red darken-3",
        });
      });
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h3 className="card-title">TechMedium</h3>

        <div className="input-field col s12">
          <input
            id="email"
            type="email"
            className="validate"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="input-field col s12">
          <input
            id="password"
            type="password"
            className="validate"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button
          onClick={() => login()}
          className="btn waves-effect waves-light light-blue darken-4"
        >
          Login
        </button>

        <div>
          New user? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};
