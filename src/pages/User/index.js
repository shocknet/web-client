import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import Moment from "moment";
import CopyClipboard from "react-copy-to-clipboard";
import { isIOS } from "react-device-detect";

import {
  getUserWall,
  resetUserWall,
  resetUserData,
  getUserProfile,
  getUserAvatar,
  updateUserProfile,
  getUserHeader
} from "../../actions/UserActions";
import { generateGunPair } from "../../actions/AuthActions";
import { payUser, resetPaymentRequest } from "../../actions/TransactionActions";
import { listenPath, gunUser } from "../../utils/Gun";
import { webTorrentClient, attachMedia } from "../../utils/Torrents";

import Loader from "../../common/Loader";

// Assets
import defaultBanner from "../../images/banner-bg.jpg";
import av1 from "../../images/av1.jpg";
import shockLogo from "../../images/lightning-logo.svg";
import "./css/index.css";
import ReactTooltip from "react-tooltip";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

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
  // Reserved for future use
  // eslint-disable-next-line no-unused-vars
  const [userLoading, setUserLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const [isOnlineApp, setIsOnlineApp] = useState(false);
  const [isOnlineNode, setIsOnlineNode] = useState(false);
  const [copied, setCopied] = useState(false);

  const [onlineCheckTimer, setOnlineCheckTimer] = useState(null);
  const [tipMetadata, setTipMetadata] = useState({ targetType: "user" });

  const publicKey = params.userId;

  const fetchUserData = useCallback(async () => {
    try {
      setUserLoading(true);
      dispatch(resetUserData());
      const user = await dispatch(getUserProfile(publicKey));
      console.log(user);
      setUserLoading(false);
      // Load user avatar in the background
      dispatch(getUserHeader(publicKey));
      await dispatch(getUserAvatar(publicKey));
    } catch (err) {
      console.error(err);
      setUserLoading(false);
    }
  }, [dispatch, publicKey]);

  const fetchUserWall = useCallback(async () => {
    try {
      console.log("Setting Loading status to:", true);
      setWallLoading(true);
      dispatch(resetUserWall());
      await dispatch(getUserWall(publicKey));
      console.log("Setting Loading status to:", false);
      setWallLoading(false);
    } catch (err) {
      console.error(err);
      console.log("Setting Loading status to:", false);
      setWallLoading(false);
    }
  }, [dispatch, publicKey]);

  const sendTip = useCallback(async () => {
    try {
      setTipLoading(true);
      await dispatch(
        payUser({
          senderPair: me,
          recipientPublicKey: publicKey,
          amount: tipAmount,
          metadata: tipMetadata
        })
      );
      setTipLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, me, publicKey, tipAmount, tipMetadata]);

  const openTipModal = (metadata = { targetType: "spontaneousPayment" }) => {
    setTipMetadata(metadata);
    setTipModalOpen(true);
  };

  const closeTipModal = useCallback(() => {
    setTipModalOpen(false);
    setTipMetadata({});
    if (paymentRequest) {
      dispatch(resetPaymentRequest());
      setTipLoading(false);
    }
  }, [dispatch, paymentRequest]);

  const initializeUserWall = useCallback(async () => {
    await fetchUserData();
    await dispatch(generateGunPair());
    fetchUserWall();
  }, [dispatch, fetchUserData, fetchUserWall]);

  useEffect(() => {
    initializeUserWall();

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
      path: "Profile/bio",
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
  }, [dispatch, initializeUserWall, publicKey]);

  useEffect(() => {
    attachMedia(
      wall.posts.filter(post => post.type === "post").map(post => post),
      false
    );
  }, [wall.posts]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const setCopiedStatus = useCallback(() => {
    setCopied(true);
    ReactTooltip.rebuild();
    setTimeout(() => {
      setCopied(false);
      ReactTooltip.rebuild();
    }, 500);
  }, []);

  const username = profile.displayName ?? profile.alias;

  const renderPost = useCallback(
    post => {
      const avatar = profile.avatar
        ? `data:image/png;base64,${profile.avatar}`
        : av1;

      if (post.type === "shared") {
        return (
          <Suspense
            fallback={
              <div className="post-loading">
                <Loader text="Loading Post..." />
              </div>
            }
            key={post.id}
          >
            <SharedPost
              postID={post.id}
              postPublicKey={post.originalAuthor}
              sharedPostId={post.id}
              sharedTimestamp={post.date}
              sharerAvatar={avatar}
              sharerPublicKey={publicKey}
              sharerUsername={username}
              isOnlineNode={isOnlineNode}
              openTipModal={openTipModal}
            />
          </Suspense>
        );
      }

      if (post.type === "post") {
        return (
          <Suspense
            fallback={
              <div className="post-loading">
                <Loader text="Loading Post..." />
              </div>
            }
            key={post.id}
          >
            <Post
              timestamp={post.date}
              contentItems={post.contentItems}
              username={username}
              avatar={avatar}
              publicKey={publicKey}
              openTipModal={openTipModal}
              webTorrentClient={webTorrentClient}
              page={post.page}
              id={post.id}
              tipValue={post.tipValue ?? 0}
              tipCounter={post.tipCounter ?? 0}
              isOnlineNode={isOnlineNode}
            />
          </Suspense>
        );
      }
    },
    [isOnlineNode, profile.avatar, publicKey, username]
  );

  return (
    <div className="user-page">
      <div
        className="top-banner"
        style={{
          backgroundImage: `url(${
            profile.header
              ? `data:image/png;base64,${profile.header}`
              : defaultBanner
          })`
        }}
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
          <div className="user-info">
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
          </div>

          <div
            className="send-tip-btn"
            onClick={() => openTipModal()}
            style={{
              opacity: isOnlineNode ? 1 : 0.5,
              cursor: isOnlineNode ? "pointer" : "default"
            }}
            data-tip={
              !isOnlineNode ? "You can only tip users with online nodes" : null
            }
          >
            <img src={shockLogo} alt="Bitcoin Lightning" />
            <p>Send Tip</p>
          </div>
        </div>
      </div>

      <div className="tabs-holder">
        <p className="tab active">Feed</p>
      </div>
      <div className="posts-holder">
        {wall.posts.map(post => renderPost(post))}
      </div>
      {wallLoading ? (
        <Loader text={`Loading ${wall.page >= 0 ? "More" : "Wall"} Posts...`} />
      ) : null}
      {tipModalOpen ? (
        <div className="tip-modal-container">
          <div className="tip-modal-overlay" onClick={closeTipModal}></div>
          <div className="tip-modal">
            {tipLoading ? (
              <div className="tip-modal-loading">
                <Loader text="Submitting Tip Request..." />
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
                <div className="tip-modal-qr-code-container">
                  <QRCode
                    className="tip-modal-qr-code"
                    value={paymentRequest}
                    size={210}
                    bgColor="#4db1ff"
                    fgColor="#1b2129"
                  />
                </div>
                <div className="tip-modal-action-btns">
                  <a
                    href={`lightning:${paymentRequest}`}
                    className="tip-modal-action-btn"
                  >
                    PAY INVOICE
                  </a>
                  <CopyClipboard text={paymentRequest} onCopy={setCopiedStatus}>
                    <div className="tip-modal-action-btn">
                      {copied ? "INVOICE COPIED!" : "COPY INVOICE"}
                    </div>
                  </CopyClipboard>
                </div>
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
              <div className="tip-modal-footer" onClick={() => sendTip()}>
                <div className="tip-modal-submit">SEND TIP</div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {!isIOS ? (
        <a
          href="https://github.com/shocknet/wallet/releases"
          target="_blank"
          rel="noreferrer noopener"
          className="download-shockwallet-btn"
        >
          <i className="download-shockwallet-btn-icon fab fa-android"></i>
          <p className="download-shockwallet-btn-text">Download ShockWallet</p>
        </a>
      ) : null}
    </div>
  );
};

export default UserPage;
