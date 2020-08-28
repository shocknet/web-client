import React from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import "./styles/App.css";
import UserPage from "./pages/User";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/user/:userId" component={UserPage} />
        <Redirect to="/user/qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg" />
      </Switch>
    </div>
  );
}

export default withRouter(App);
