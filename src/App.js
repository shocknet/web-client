import React, { Suspense } from "react";
import { withRouter, Redirect, Route, Switch } from "react-router-dom";
import Loader from "./common/Loader";
import DownloadBtn from "./common/DownloadBtn";
import "./styles/App.css";
import { Helmet } from "react-helmet";

const UserPage = React.lazy(() => import("./pages/User"));
const PostPage = React.lazy(() => import("./pages/Post"));

function App() {
  return (
    <div className="App">
      <Helmet>
        <meta property="twitter:site" content="@shocknet" />
        <meta property="twitter:card" content="summary" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/user/:userId" component={UserPage} />
          <Route path="/:userId/:type/:postId" component={PostPage} />
          <Route path="/:userId" component={UserPage} />
          <Redirect to="/tcUUzRkyzXYhIZQbmopiCLREyZ_kQJqQ-C4XesecOm4.GX1Dv-eGcfKuOPobBK9Q-Sc-o697XgVCQzOCfqfimIo" />
        </Switch>
      </Suspense>
      <DownloadBtn />
    </div>
  );
}

export default withRouter(App);
