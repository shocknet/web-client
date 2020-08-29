import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import WebTorrent from "webtorrent";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import QRCode from "react-qr-code";
import {
  getUserWall,
  getWallTotalPages,
  resetUserWall,
  resetUserData,
  getUserProfile,
  getUserAvatar
} from "../../actions/UserActions";
import Post from "../../components/Post";

// Assets
import bannerbg from "../../images/banner-bg.jpg";
import av1 from "../../images/av1.jpg";
import shockLogo from "../../images/lightning-logo.svg";
import "./css/index.css";
import { generateGunPair } from "../../actions/AuthActions";
import { payUser, resetPaymentRequest } from "../../actions/TransactionActions";

const webTorrentClient = new WebTorrent();

const UserPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const wall = useSelector(({ user }) => user.wall);
  const profile = useSelector(({ user }) => user.profile);
  const me = useSelector(({ auth }) => auth.pair);
  const paymentRequest = useSelector(
    ({ transaction }) => transaction.paymentRequest
  );
  const [userLoading, setUserLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  const publicKey = params.userId;

  const fetchUserData = useCallback(async () => {
    try {
      setUserLoading(true);
      dispatch(resetUserData());
      const user = await dispatch(getUserProfile(publicKey));
      console.log(user);
      setUserLoading(false);
      // Load user avatar in the background
      await dispatch(getUserAvatar(publicKey));
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

  const tipUser = async () => {
    try {
      setTipLoading(true);
      await dispatch(payUser(me, publicKey, tipAmount));
      setTipLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const closeTipModal = () => {
    setTipModalOpen(false);
    if (paymentRequest) {
      dispatch(resetPaymentRequest());
      setTipLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserWallPages();
    dispatch(generateGunPair());
  }, [fetchUserData]);

  const username = profile.displayName ?? profile.alias;

  return (
    <div className="user-page">
      <div
        className="top-banner"
        style={{ backgroundImage: `url(${bannerbg})` }}
      ></div>
      <div className="user-details">
        <div
          className="main-av"
          style={{
            backgroundImage: `url(${
              `data:image/png;base64,${profile.avatar}` ?? av1
            })`
          }}
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

        <div className="send-tip-btn" onClick={() => setTipModalOpen(true)}>
          <img src={shockLogo} alt="Bitcoin Lightning" />
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
        hasMore={wall.page < wall.totalPages - 1 && !wallLoading}
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
      {tipModalOpen ? (
        <div className="tip-modal-container">
          <div className="tip-modal-overlay" onClick={closeTipModal}></div>
          <div className="tip-modal">
            {tipLoading ? (
              <div className="tip-modal-loading">
                <div className="loading-wall">
                  <div className="loading-wall-icon">
                    <span class="loading-circle loading-circle-1"></span>
                    <span class="loading-circle loading-circle-2"></span>
                    <span class="loading-circle loading-circle-3"></span>
                    <span class="loading-circle loading-circle-4"></span>
                    <span class="loading-circle loading-circle-5"></span>
                  </div>
                  <div className="loading-wall-text">
                    Submitting Tip Request...
                  </div>
                </div>
              </div>
            ) : null}
            <div className="tip-modal-head">
              <div className="tip-modal-title">Send Tip</div>
            </div>
            {paymentRequest ? (
              <div className="tip-modal-content">
                <p className="tip-modal-instructions">
                  We've successfully generated an invoice for you to tip, please
                  scan the QR Code below using a Lightning wallet to pay it!
                </p>
                <QRCode
                  className="tip-modal-qr-code"
                  value={paymentRequest}
                  size={250}
                  bgColor="#2a384a"
                  fgColor="#4080b2"
                />
              </div>
            ) : (
              <div className="tip-modal-content">
                <p className="tip-modal-instructions">
                  Please specify the amount of sats you'd like to tip this user
                  with below and we'll generate an invoice for you to scan.
                </p>
                <input
                  className="tip-modal-input"
                  value={tipAmount}
                  onChange={e => setTipAmount(e.target.value)}
                />
              </div>
            )}
            {!paymentRequest ? (
              <div className="tip-modal-footer">
                <div className="tip-modal-submit" onClick={tipUser}>
                  SEND TIP
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserPage;
