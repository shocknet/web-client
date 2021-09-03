import React, {
  useEffect,
  useState,
  useCallback,
  Suspense,
  useMemo
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Tooltip from "react-tooltip";
import Helmet from "react-helmet";

import {
  getUserWall,
  resetUserWall,
  resetUserData,
  getUserProfile,
  getUserAvatar,
  updateUserProfile,
  getUserHeader,
  getPinnedPost
} from "../../actions/UserActions";
import { openModal } from "../../actions/TipActions";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { listenPath, gunUser } from "../../utils/Gun";
import { crawlerAwait } from "../../utils/Promise";

import Loader from "../../common/Loader";
import Divider from "../../common/Divider";
import TipModal from "../../common/TipModal";

import defaultBanner from "../../images/banner-bg.jpg";
import av1 from "../../images/av1.jpg";
import shockLogo from "../../images/lightning-logo.svg";
import "./css/index.css";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const UserPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { userId: publicKey } = params;
  const wall = useSelector(({ user }) => user.wall);
  const profile = useSelector(({ user }) => user.profile);

  const { isOnlineApp, isOnlineNode } = useOnlineStatus(publicKey);
  const [userLoading, setUserLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);

  const username = useMemo(
    () => profile.displayName ?? profile.alias,
    [profile]
  );

  const fetchUserData = useCallback(async () => {
    try {
      setUserLoading(true);
      dispatch(resetUserData());
      await dispatch(getUserProfile(publicKey));

      // Wait for user avatar/header if crawler is visiting the site
      await crawlerAwait(
        dispatch(getUserHeader(publicKey)),
        dispatch(getUserAvatar(publicKey))
      );
      setUserLoading(false);
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

  const openTipModal = useCallback(() => {
    dispatch(openModal({ targetType: "spontaneousPayment" }));
  }, [dispatch]);

  const initializeUserWall = useCallback(async () => {
    const { postId, userId, type } = params;
    await fetchUserData();
    fetchUserWall();

    dispatch(
      getPinnedPost({
        postId,
        publicKey: userId,
        type
      })
    );
  }, [dispatch, fetchUserData, fetchUserWall, params]);

  const renderPost = useCallback(
    post => {
      if (!post) {
        return;
      }

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
              pinned={post.pinned}
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
              page={post.page}
              id={post.id}
              tipValue={post.tipValue ?? 0}
              tipCounter={post.tipCounter ?? 0}
              isOnlineNode={isOnlineNode}
              pinned={post.pinned}
              post={post}
            />
          </Suspense>
        );
      }
    },
    [isOnlineNode, profile.avatar, publicKey, username]
  );

  useEffect(() => {
    initializeUserWall();

    // Subscribe for updates
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
      displayNameListener.off();
      bioListener.off();
    };
  }, [dispatch, initializeUserWall, publicKey]);

  useEffect(() => {
    if (!userLoading) {
      window.prerenderReady = true;
    }
  }, [userLoading]);

  return (
    <div className="user-page">
      <Helmet>
        <meta property="og:title" content={username} />
        <meta property="twitter:title" content={username} />
        <meta property="og:description" content={profile.bio} />
      </Helmet>
      <div
        className="top-banner"
        style={{
          backgroundImage: `url(${
            profile.header
              ? `data:image/png;base64,${profile.header}`
              : defaultBanner
          })`
        }}
      />
      <div className="user-details">
        <div
          className="main-av"
          style={{
            backgroundImage: `url(${
              profile.avatar ? `data:image/png;base64,${profile.avatar}` : av1
            })`
          }}
        />

        <div className="details">
          <div className="user-info">
            <p className="username">{username}</p>

            <div className="activity">
              <p
                className="status"
                style={{
                  color: isOnlineApp
                    ? "#01a33d"
                    : isOnlineNode
                    ? "#f2a900"
                    : "#888"
                }}
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
            onClick={openTipModal}
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

          <Tooltip backgroundColor="#3a4d67" effect="solid" />
        </div>
      </div>

      <div className="tabs-holder">
        <p className="tab active">Feed</p>
      </div>
      <div className="posts-holder">
        {renderPost(wall.pinnedPost)}
        {wall.pinnedPost && <Divider text="More Posts" />}
        {wall.posts.map(renderPost)}
      </div>
      {wallLoading ? (
        <Loader text={`Loading ${wall.page >= 0 ? "More" : "Wall"} Posts...`} />
      ) : null}
      <TipModal publicKey={publicKey} />
    </div>
  );
};

export default UserPage;
