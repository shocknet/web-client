import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useLayoutEffect
} from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useInView from "react-cool-inview";
import { Helmet } from "react-helmet";
import { updateWallPost } from "../../actions/UserActions";
import { openModal } from "../../actions/TipActions";
import { gunUser, fetchPath } from "../../utils/Gun";
import { attachMedia } from "../../utils/Torrents";
import MediaCarousel from "./components/Media";
import ShareBtn from "./components/ShareBtn";
import "./css/index.css";
import { getMediaMetadata, getPostDescription } from "../../utils/Post";

const STATIC_THUMBNAIL = `${window.location.origin}/link-static.jpg`;

const Post = ({
  id,
  timestamp,
  avatar,
  tipCounter,
  tipValue,
  publicKey,
  contentItems = {},
  username,
  isOnlineNode,
  pinned
}) => {
  const dispatch = useDispatch();
  const { observe } = useInView({
    trackVisibility: false,
    unobserveOnEnter: true,
    onEnter: () => {
      const post = { contentItems, id };
      attachMedia([post], false);
    }
  });

  const [liveStatus, setLiveStatus] = useState("");
  const [viewersCounter, setViewersCounter] = useState(0);

  const mediaContent = useMemo(
    () =>
      Object.entries(contentItems).filter(
        ([_, item]) => item.type !== "text/paragraph"
      ),
    [contentItems]
  );

  const mediaMetadata = useMemo(
    () => getMediaMetadata(Object.values(contentItems)),
    [contentItems]
  );

  const textContent = useMemo(
    () =>
      Object.entries(contentItems).filter(
        ([_, item]) => item.type === "text/paragraph"
      ),
    [contentItems]
  );

  const getMediaType = useCallback(mediaItem => {
    if (mediaItem.type === "stream") {
      return "video";
    }

    return mediaItem.type;
  }, []);

  const tipPost = useCallback(() => {
    if (!isOnlineNode) {
      return;
    }

    dispatch(
      openModal({
        targetType: "tip",
        ackInfo: id
      })
    );
  }, [dispatch, id, isOnlineNode]);

  useEffect(() => {
    fetchPath({
      path: `posts/${id}/tipsSet`,
      gunPointer: gunUser(publicKey),
      method: "once"
    }).then(data => {
      console.log({ tipData: data });
      const tipSet = data
        ? Object.values(data).filter(item => typeof item === "string")
        : [];
      const lenSet = tipSet.length;
      const tot =
        lenSet > 0
          ? tipSet.reduce((acc, val) => Number(val) + Number(acc), 0)
          : 0;
      dispatch(
        updateWallPost({
          postID: id,
          data: {
            tipValue: tot,
            tipCounter: lenSet
          }
        })
      );
    });
  }, [dispatch, id, publicKey]);

  //effect for liveStatus and viewers counter
  useEffect(() => {
    const values = Object.values(contentItems);
    const videoContent = values.find(
      item => item.type === "video/embedded" && item.liveStatus === "wasLive"
    );
    const streamContent = values.find(
      item => item.type === "stream/embedded" && item.liveStatus === "live"
    );
    let status = "";
    if (videoContent) {
      status = "was Live";
    }
    if (streamContent) {
      status = "is Live";
      if (streamContent.viewersCounter) {
        setViewersCounter(streamContent.viewersCounter);
      }
    }
    if (status) {
      setLiveStatus(status);
    }
  }, [contentItems, setLiveStatus]);

  useEffect(() => {
    Tooltip.rebuild();
  }, []);

  useLayoutEffect(() => {
    if (pinned) {
      window.prerenderReady = true;
    }
  }, [pinned]);

  return (
    <div className="post">
      {pinned && (
        <Helmet>
          <meta property="og:title" content={username} />
          <meta property="twitter:title" content={username} />
          <meta
            property="og:description"
            content={getPostDescription({
              contentItems: Object.values(contentItems),
              username
            })}
          />
        </Helmet>
      )}
      {mediaMetadata.map(item => {
        const type = getMediaType(item);
        return (
          <>
            <Helmet>
              <meta property={`og:${type}:width`} content="600" />
              <meta property={`og:${type}:height`} content="314" />
              <meta property={`og:${type}`} content={item.url} />
            </Helmet>
            {type === "video" && (
              <Helmet>
                <meta property="og:image:width" content="600" />
                <meta property="og:image:height" content="314" />
                <meta
                  property="og:image"
                  content={item.thumbnail ?? STATIC_THUMBNAIL}
                />
                <meta property="twitter:image:width" content="600" />
                <meta property="twitter:image:height" content="314" />
                <meta
                  property="twitter:image"
                  content={item.thumbnail ?? STATIC_THUMBNAIL}
                />
              </Helmet>
            )}
          </>
        );
      })}
      <div className="head">
        <div className="user">
          <Link
            className="av"
            to={`/${publicKey}`}
            style={{
              backgroundImage: `url(${avatar})`
            }}
          />
          <div className="details">
            <div className="username">
              <Link to={`/${publicKey}`}>{username}</Link>
              {liveStatus && (
                <p className="liveStatus">
                  {liveStatus}
                  <i
                    className={`fas fa-circle liveStatusIcon ${
                      liveStatus === "is Live" ? "liveIcon" : ""
                    }`}
                  ></i>
                  {liveStatus === "is Live" && (
                    <span> | {viewersCounter} watching</span>
                  )}
                </p>
              )}
            </div>
            <p>{moment.utc(timestamp).fromNow()}</p>
          </div>
        </div>
        <ShareBtn
          publicKey={publicKey}
          id={id}
          username={username}
          pinned={pinned}
          contentItems={contentItems}
        />
      </div>

      <div className="content" ref={observe}>
        {textContent.map(([key, item]) => (
          <p key={key}>{item.text}</p>
        ))}
        <MediaCarousel
          contentItems={mediaContent}
          id={id}
          timestamp={timestamp}
          avatar={avatar}
          tipCounter={tipCounter}
          tipValue={tipValue}
        />
      </div>

      <div className="actions">
        <div
          className="icon-tip-btn"
          data-tip="Tip this post"
          onClick={tipPost}
        >
          <i className="tip-icon icon-thin-feed"></i>
        </div>
        <Tooltip backgroundColor="#3a4d67" effect="solid" />
      </div>
    </div>
  );
};

export default Post;
