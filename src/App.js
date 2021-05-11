import React, { Suspense } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import Loader from "./common/Loader";
import "./styles/App.css";
import "./styles/video.js.css";

const UserPage = React.lazy(() => import("./pages/User"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/user/:userId" component={UserPage} />
          <Route path="/:userId/:type/:postId" component={UserPage} />
          <Route path="/:userId" component={UserPage} />
          <Redirect to="/qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg" />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(App);
