import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import { updateWallPost } from "../actions/UserActions";
import { getCachedFile, renderCachedFile, saveFile } from "../utils/Cache";
import lightning from "../images/lightning-logo.svg";
import "./css/Post.css";
import { listenPath, gunUser } from "../utils/Gun";
import Counter from "./Counter";

const Post = ({
  id,
  timestamp,
  avatar,
  page,
  tipCounter,
  tipValue,
  publicKey,
  openTipModal,
  contentItems = {},
  username,
  webTorrentClient,
  isOnlineNode
}) => {
  const dispatch = useDispatch();
  const [playState, setPlayState] = useState(false);

  const playVideo = (e, selector) => {
    e.stopPropagation();
    if (playState) {
      return;
    }
    setPlayState(true);
    const video = document.querySelector(selector);
    video.play();
  };

  const parseContent = ([key, item], index) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <div className="media-container">
          <img
            className={`torrent-img-${id}-${key}`}
            data-torrent={item.magnetURI}
            data-file-key={index}
            key={key}
          />
          {tipValue > 0 ? (
            <div className="ribbon-container">
              <p className="ribbon-title">Total Tips</p>
              <p className="ribbon-value">{tipValue} Sats</p>
            </div>
          ) : null}
        </div>
      );
    }

    if (item.type === "video/embedded") {
      return (
        <div className="media-container">
          <div
            className="video-container"
            style={{
              cursor: !playState ? "pointer" : "auto"
            }}
            // onClick={e => playVideo(e, `.torrent-video-${id}-${key}`)}
          >
            {/* {!playState ? (
              <div className="video-play-button">
                <i className="fas fa-play"></i>
              </div>
            ) : null} */}
            <video
              className={`torrent-video torrent-video-${id}-${key}`}
              data-torrent={item.magnetURI}
              data-file-key={index}
              key={key}
              controls
              // {...(playState ? { controls: true } : { controls: false })}
              data-played={`${playState}`}
            />
          </div>
          {tipValue > 0 ? (
            <div className="ribbon-container">
              <p className="ribbon-title">Total Tips</p>
              <p className="ribbon-value">{tipValue} Sats</p>
            </div>
          ) : null}
        </div>
      );
    }

    return null;
  };

  // useEffect(() => {
  //   attachMedia();
  // }, [contentItems.length]);

  useEffect(() => {
    listenPath({
      path: `wall/pages/${page}/posts/${id}/tipCounter`,
      gunPointer: gunUser(publicKey),
      callback: data => {
        dispatch(
          updateWallPost({
            postID: id,
            data: {
              tipCounter: data
            }
          })
        );
      }
    });
    listenPath({
      path: `wall/pages/${page}/posts/${id}/tipValue`,
      gunPointer: gunUser(publicKey),
      callback: data => {
        dispatch(
          updateWallPost({
            postID: id,
            data: {
              tipValue: data
            }
          })
        );
      }
    });
  }, [dispatch]);

  const tipPost = useCallback(() => {
    if (!isOnlineNode) {
      return;
    }

    openTipModal({
      targetType: "post",
      postID: id,
      postPage: page
    });
  }, [id, page]);

  useEffect(() => {
    Tooltip.rebuild();
  }, []);

  return (
    <div className="post">
      <div className="head">
        <div className="user">
          <div
            className="av"
            style={{
              backgroundImage: `url(${avatar})`
            }}
          ></div>
          <div className="details">
            <p>{username}</p>
            <p>{moment.utc(timestamp).fromNow()}</p>
          </div>
        </div>
      </div>

      <div className="content">
        {Object.entries(contentItems).map(parseContent)}
      </div>

      <div className="actions">
        <div
          className="tip-btn-container"
          onClick={tipPost}
          data-tip={
            isOnlineNode
              ? tipCounter > 0
                ? `${tipValue} Sats tipped so far`
                : null
              : "You can only tip online users"
          }
          style={{
            opacity: isOnlineNode ? 1 : 0.5,
            cursor: isOnlineNode ? "pointer" : "default"
          }}
        >
          <div className="tip-btn-icon">
            <img src={lightning} alt="Send Tip" />
          </div>
          <div className="tip-btn-text">
            <Counter value={tipCounter} /> {tipCounter === 1 ? "Tip" : "Tips"}
          </div>
        </div>
        <i className="fas fa-external-link-alt"></i>
      </div>
    </div>
  );
};

export default Post;
