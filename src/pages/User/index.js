import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import WebTorrent from "webtorrent";
import { useParams } from "react-router-dom";
import {
  getUserWall,
  getWallTotalPages,
  resetUserWall,
  getUserProfile
} from "../../actions/UserActions";
import Post from "../../components/Post";

// Assets
import bannerbg from "../../images/banner-bg.jpg";
import av1 from "../../images/av1.jpg";
import av2 from "../../images/av2.jpg";
import av3 from "../../images/av3.jpg";
import shockLogo from "../../images/lightning-logo.svg";
import "./css/index.css";

const webTorrentClient = new WebTorrent();

const UserPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const wall = useSelector(({ user }) => user.wall);
  const profile = useSelector(({ user }) => user.profile);
  const [loading, setLoading] = useState(true);

  const publicKey = params.userId;

  const fetchUserData = useCallback(async () => {
    dispatch(resetUserWall());
    const user = await dispatch(getUserProfile(publicKey));
    console.log(user);
  }, [dispatch, publicKey]);

  const fetchUserWall = async (tries = 0) => {
    if (tries > 3) {
      return;
    }
    try {
      dispatch(resetUserWall());
      const totalPages = await dispatch(getWallTotalPages(publicKey));
      console.log("Total Pages:", totalPages);
      if (totalPages > 0) {
        const posts = await dispatch(getUserWall(publicKey));
        console.log("Posts:", JSON.stringify(posts));
        if (!posts || JSON.stringify(posts).length <= 1) {
          return setTimeout(() => fetchUserWall(tries + 1), 500);
        }
      }

      if (totalPages === 0) {
        return setTimeout(() => fetchUserWall(tries + 1), 500);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setTimeout(() => fetchUserWall(tries + 1), 500);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserWall();
  }, [fetchUserData]);

  const username = profile.displayName ?? profile.alias;

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
            style={{ backgroundImage: `url(${profile.avatar ?? av1})` }}
          ></div>

          <div className="details">
            <p className="username">{username}</p>

            <div className="activity">
              <p className="status">Active Recently</p>
            </div>

            {profile.bio ? (
              <div className="desc">
                <p className="title">Bio</p>
                <p>{profile.bio}</p>
              </div>
            ) : null}

            {/* <div className="followers">
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
            </div> */}
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
          {wall.posts.map(post => {
            return (
              <Post
                timestamp={post.date}
                contentItems={post.contentItems}
                username={username}
                webTorrentClient={webTorrentClient}
                key={post.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
