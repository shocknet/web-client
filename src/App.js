import React from "react";
import { withRouter, Switch, Redirect, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./styles/App.css";
import bannerbg from "./images/banner-bg.jpg";
import av1 from "./images/av1.jpg";
import av2 from "./images/av2.jpg";
import av3 from "./images/av3.jpg";
import av4 from "./images/av4.jpg";
import shockLogo from "./images/shock-logo.png";
import UserPage from "./pages/User";

function App() {
  return (
    <div className="App">
      <Route exact path="/user/:userId" component={UserPage} />
      <Redirect to="/user/demo" />
    </div>
  );
}

export default withRouter(App);
