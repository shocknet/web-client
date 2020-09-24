import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import WebTorrent from "webtorrent";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import QRCode from "react-qr-code";
import Moment from "moment";
import {
  getUserWall,
  getWallTotalPages,
  resetUserWall,
  resetUserData,
  getUserProfile,
  getUserAvatar,
  updateUserProfile
} from "../../actions/UserActions";
import { generateGunPair } from "../../actions/AuthActions";
import { payUser, resetPaymentRequest } from "../../actions/TransactionActions";
import Post from "../../components/Post";

// Assets
import bannerbg from "../../images/banner-bg.jpg";
import av1 from "../../images/av1.jpg";
import shockLogo from "../../images/lightning-logo.svg";
import "./css/index.css";
import { listenPath, gunUser } from "../../utils/Gun";

const webTorrentClient = new WebTorrent();

const ONLINE_INTERVAL = 1 * 30 * 1000;

const UserPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const wall = useSelector(({ user }) => user.wall);
  const profile = useSelector(({ user }) => user.profile);
  const me = useSelector(({ auth }) => auth.pair);
  const paymentRequest = useSelector(
    ({ transaction }) => transaction.paymentRequest
  );
  // Reserved for future use @eslint-disable-next-line no-undef
  const [userLoading, setUserLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [isOnlineApp, setIsOnlineApp] = useState(false);
  const [isOnlineNode, setIsOnlineNode] = useState(false);

  const [onlineCheckTimer, setOnlineCheckTimer] = useState(null);

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

  const fetchUserWallPages = useCallback(async () => {
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
  }, [dispatch, publicKey]);

  const loadMorePosts = useCallback(
    async page => {
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
    },
    [dispatch, publicKey]
  );

  const tipUser = useCallback(
    async (metadata = { paymentType: "user" }) => {
      try {
        setTipLoading(true);
        await dispatch(
          payUser({
            senderPair: me,
            recipientPublicKey: publicKey,
            amount: tipAmount,
            metadata
          })
        );
        setTipLoading(false);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, me, publicKey, tipAmount]
  );

  const closeTipModal = useCallback(() => {
    setTipModalOpen(false);
    if (paymentRequest) {
      dispatch(resetPaymentRequest());
      setTipLoading(false);
    }
  }, [dispatch, paymentRequest]);

  useEffect(() => {
    fetchUserData();
    fetchUserWallPages();
    dispatch(generateGunPair());

    // Subscribe for updates
    const lastSeenAppListener = listenPath({
      path: "Profile/lastSeenApp",
      gunPointer: gunUser(publicKey),
      callback: event => {
        dispatch(updateUserProfile({ lastSeenApp: event }));
      }
    });

    const lastSeenNodeListener = listenPath({
      path: "Profile/lastSeenNode",
      gunPointer: gunUser(publicKey),
      callback: event => {
        dispatch(updateUserProfile({ lastSeenNode: event }));
      }
    });

    const displayNameListener = listenPath({
      path: "Profile/displayName",
      gunPointer: gunUser(publicKey),
      callback: event => {
        dispatch(updateUserProfile({ displayName: event }));
      }
    });

    const bioListener = listenPath({
      path: "bio",
      gunPointer: gunUser(publicKey),
      callback: event => {
        dispatch(updateUserProfile({ bio: event }));
      }
    });

    return () => {
      lastSeenAppListener.off();
      lastSeenNodeListener.off();
      displayNameListener.off();
      bioListener.off();
    };
  }, [fetchUserData]);

  useEffect(() => {
    if (onlineCheckTimer) {
      clearTimeout(onlineCheckTimer);
    }

    const timer = setTimeout(() => {
      const onlineThreshold = Moment.utc().subtract(ONLINE_INTERVAL, "ms");
      const isOnlineNode = profile.lastSeenNode
        ? Moment.utc(profile.lastSeenNode).isSameOrAfter(onlineThreshold)
        : false;
      const isOnlineApp = profile.lastSeenApp
        ? Moment.utc(profile.lastSeenApp).isSameOrAfter(onlineThreshold)
        : false;

      setIsOnlineNode(isOnlineNode);
      setIsOnlineApp(isOnlineApp);
    }, ONLINE_INTERVAL);

    setOnlineCheckTimer(timer);

    return () => clearTimeout(onlineCheckTimer);
  }, [profile]);

  useEffect(() => {
    const onlineThreshold = Moment.utc().subtract(1, "minutes");
    const isOnlineNode = profile?.lastSeenNode
      ? Moment.utc(profile?.lastSeenNode).isSameOrAfter(onlineThreshold)
      : false;
    const isOnlineApp = profile?.lastSeenApp
      ? Moment.utc(profile?.lastSeenApp).isSameOrAfter(onlineThreshold)
      : false;

    setIsOnlineNode(isOnlineNode);
    setIsOnlineApp(isOnlineApp);
  }, [profile]);

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
              profile.avatar ? `data:image/png;base64,${profile.avatar}` : av1
            })`
          }}
        ></div>

        <div className="details">
          <p className="username">{username}</p>

          <div className="activity">
            <p
              className="status"
              style={
                !isOnlineApp
                  ? {
                      color: isOnlineApp
                        ? "#01a33d"
                        : isOnlineNode
                        ? "#f2a900"
                        : "#888"
                    }
                  : {}
              }
            >
              {isOnlineApp
                ? "Active Recently"
                : isOnlineNode
                ? "Node Online"
                : "Node Offline"}
            </p>
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
                tipUser={tipUser}
                avatar={
                  profile.avatar
                    ? `data:image/png;base64,${profile.avatar}`
                    : av1
                }
                webTorrentClient={webTorrentClient}
                id={post.id}
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
                  size={190}
                  bgColor="#1b2129"
                  fgColor="#4db1ff"
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
