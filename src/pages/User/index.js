import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import WebTorrent from "webtorrent";
import { useParams } from "react-router-dom";
import {
  getUserWall,
  getWallTotalPages,
  resetUserWall,
  resetUserData,
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
import InfiniteScroll from "react-infinite-scroller";

const webTorrentClient = new WebTorrent();

const UserPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const wall = useSelector(({ user }) => user.wall);
  const profile = useSelector(({ user }) => user.profile);
  const [userLoading, setUserLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);

  const publicKey = params.userId;

  const fetchUserData = useCallback(async () => {
    try {
      setUserLoading(true);
      dispatch(resetUserData());
      const user = await dispatch(getUserProfile(publicKey));
      console.log(user);
      setUserLoading(false);
    } catch (err) {
      console.error(err);
      setUserLoading(false);
    }
  }, [dispatch, publicKey]);

  const fetchUserWallPages = async () => {
    try {
      console.log("Setting Loading status to:", true);
      setWallLoading(true);
      dispatch(resetUserWall());
      const totalPages = await dispatch(getWallTotalPages(publicKey));
      if (totalPages > 0) {
        await dispatch(getUserWall(publicKey));
      }
      console.log("Setting Loading status to:", false);
      setWallLoading(false);
    } catch (err) {
      console.error(err);
      console.log("Setting Loading status to:", false);
      setWallLoading(false);
    }
  };

  const loadMorePosts = async page => {
    try {
      console.log("Setting Loading status to (loadMorePosts):", true);
      setWallLoading(true);
      await dispatch(getUserWall(publicKey, page));
      console.log("Setting Loading status to (loadMorePosts):", false);
      setWallLoading(false);
    } catch (error) {
      console.log("Setting Loading status to (loadMorePosts):", false);
      setWallLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserWallPages();
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
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          hasMore={wall.page < wall.totalPages && !wallLoading}
          loadMore={loadMorePosts}
          useWindow={true}
        >
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
        </InfiniteScroll>
        {wallLoading ? (
          <div className="loading-wall">
            <div className="loading-wall-icon">
              <span class="loading-circle loading-circle-1"></span>
              <span class="loading-circle loading-circle-2"></span>
              <span class="loading-circle loading-circle-3"></span>
              <span class="loading-circle loading-circle-4"></span>
              <span class="loading-circle loading-circle-5"></span>
            </div>
            <div className="loading-wall-text">
              Loading {wall.page >= 0 ? "More" : "Wall"} Posts...
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserPage;
