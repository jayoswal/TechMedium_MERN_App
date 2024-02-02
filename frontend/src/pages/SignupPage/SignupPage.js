import { useEffect, useState } from "react";
import "./SignupPage.css";
import M from "materialize-css";

import { Link, useNavigate } from "react-router-dom";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&*()-=_+])[a-zA-Z\d@#$%^&*()-=_+]+$/;

  // function to send to userdata to register api to backend
  const register = () => {
    // validate email
    if (!emailRegex.test(email)) {
      M.toast({
        html: "Invalid email format",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      M.toast({
        html: "Password must have alphabets and numbers",
        classes: "#c62828 red darken-3",
      });
      return;
    }

    // validate password alphanumeruic

    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // if jsonResponse contains error field
        if (jsonResponse.error) {
          M.toast({
            html: jsonResponse.error,
            classes: "#c62828 red darken-3",
          });
        } else {
          M.toast({
            html: jsonResponse.success,
            classes: "#2e7d32 green darken-3",
          });

          navigate("/login");
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
            id="name"
            type="text"
            className="validate"
            placeholder="Enter name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

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
          onClick={() => register()}
          className="btn waves-effect waves-light light-blue darken-4"
        >
          Signup
        </button>
        <div>
          Already a user? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};
