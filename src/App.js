import React, { Suspense } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import Tooltip from "react-tooltip"
import "./styles/App.css";
import Loader from "./components/Loader";

const UserPage = React.lazy(() => import("./pages/User"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/:userId" component={UserPage} />
          <Redirect to="/qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg" />
        </Switch>
      </Suspense>
      <Tooltip backgroundColor="#3a4d67" effect="solid" />
    </div>
  );
}

export default withRouter(App);
