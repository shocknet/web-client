import React from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import "./styles/App.css";
import UserPage from "./pages/User";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/user/:userId" component={UserPage} />
        <Redirect to="/user/eORdYM1KJadT0NQPWHVPutFpOwyI42bfeofpZ1BcBKQ.rP_ELV6YC-JNsKvCsVfafSwFXTL_yRnL8kvUIz2Rdnw" />
      </Switch>
    </div>
  );
}

export default withRouter(App);
