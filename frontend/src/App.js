import Navbar from "./components/NavBar/Navbar";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// import pages for routing
import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { SignupPage } from "./pages/SignupPage/SignupPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { CreatePost } from "./pages/CreatePost/CreatePost";
import { createContext, useEffect, useReducer, useContext } from "react";
import { initialState, reducer } from "./reducers/UserReducer";

export const UserContext = createContext();

function CustomRouting() {

  const navigate = useNavigate();

  const {state, dispatch} = useContext(UserContext);



  useEffect(() => {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if(userInfo) {
      dispatch({type: 'USER', payload: userInfo});
      navigate("/");
    }
else {
  navigate("/login");
}
  }, [])

  return (

<Routes>
    <Route path="/" excat element={<HomePage />}></Route>

    <Route path="/login" excat element={<LoginPage />}></Route>

    <Route path="/signup" excat element={<SignupPage />}></Route>

    <Route path="/profile" excat element={<ProfilePage />}></Route>

    <Route path="/create-post" excat element={<CreatePost />}></Route>
  </Routes>


  );
  
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <CustomRouting />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
