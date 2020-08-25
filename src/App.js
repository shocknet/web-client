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

function App() {
  return (
    <div className="App">
      <div className="user-page">
        <div
          className="top-banner"
          style={{ backgroundImage: `url(${bannerbg})` }}
        ></div>
        <div className="user-details">
          <div
            className="main-av"
            style={{ backgroundImage: `url(${av1})` }}
          ></div>

          <div className="details">
            <p className="username">USERNAME HERE</p>

            <div className="activity">
              <p className="status">Active Recently</p>
              <p className="date">11:00AM - 11:00PM</p>
            </div>

            <div className="desc">
              <p className="title">Title here</p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
                reprehenderit.
              </p>
            </div>

            <div className="followers">
              <div className="av-heads">
                <div
                  className="av"
                  style={{ backgroundImage: `url(${av2})` }}
                ></div>
                <div
                  className="av"
                  style={{ backgroundImage: `url(${av3})` }}
                ></div>
              </div>
              <p>Followed by username, username, and 4 others you know</p>
            </div>
          </div>

          <div className="send-tip-btn">
            <img src={shockLogo} alt="" />
            <p>Send Tip</p>
          </div>
        </div>

        <div className="tabs-holder">
          <p className="tab active">Feed</p>
          <p className="tab">Services</p>
        </div>
        <div className="posts-holder">
          <div className="post">
            <div className="head">
              <div className="user">
                <div
                  className="av"
                  style={{ backgroundImage: `url(${av1})` }}
                ></div>
                <div className="details">
                  <p>Username Here</p>
                  <p>3 hours ago</p>
                </div>
              </div>
            </div>

            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Possimus cumque quo vel itaque consequuntur necessitatibus
                temporibus maxime officia quasi? Sequi sit maiores rem quaerat
                doloribus accusamus eum in consequatur amet? Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Vero qui dolores ullam
                autem alias inventore nobis, consequatur vel, dignissimos nulla
                enim quidem beatae porro harum culpa libero. Veniam, labore
                officia.
              </p>

              <img src={av4} alt="" />
            </div>

            <div className="actions">
              <img src="" alt="" />
              <i class="fas fa-external-link-alt"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(App);
