import React, { Suspense } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import Loader from "./common/Loader";
import "./styles/App.css";

const UserPage = React.lazy(() => import("./pages/User"));
const PostPage = React.lazy(() => import("./pages/Post"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/user/:userId" component={UserPage} />
          <Route path="/:userId/:type/:postId" component={PostPage} />
          <Route path="/:userId" component={UserPage} />
          <Redirect to="/JVz7h3yUnbgMwwKxSddGenBlrE9eeDJVYWlmOr941mI.LW5PEWM3Y-DRf-UApdSN76wH6id6zR4mXNyBApihoAA" />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withRouter(App);
