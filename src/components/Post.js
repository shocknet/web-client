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

const supportedFileTypes = {
  "video/embedded": {
    formats: ["mp4", "webm"],
    element: "video",
    options: {
      autoplay: true,
      muted: true
    }
  },
  "image/embedded": {
    formats: ["jpg", "png", "webp", "jpeg"],
    element: "img",
    options: {}
  }
};

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

  const attachMedia = () => {
    Object.entries(contentItems)
      .filter(([key, item]) => supportedFileTypes[item.type])
      .map(([key, item]) => {
        webTorrentClient.add(item.magnetURI, async torrent => {
          const fileType = supportedFileTypes[item.type];
          const file = torrent.files.find(file => {
            const extension = file.name?.split(".")?.slice(-1)[0];
            return fileType.formats.includes(extension);
          });
          if (file) {
            const fileName = `${id}-${key}-${file.name}`;

            const element = fileType.element;
            const target = `${element}.torrent-${element}-${id}-${key}`;
            const cachedFile = await getCachedFile(fileName);

            if (cachedFile) {
              webTorrentClient.remove(item.magnetURI);
              renderCachedFile(cachedFile, target);
              return;
            }

            // Prioritizes the file
            // file.select();

            const torrentElements = document.querySelectorAll(
              `[data-torrent="${id}-${key}"]`
            );
            console.log("Torrent Elements:", torrentElements);
            torrentElements.forEach(torrentElement => {
              file.renderTo(torrentElement, fileType.options);
            });

            torrent.on("done", () => {
              file.getBlob((err, blob) => {
                console.log("File blob retrieved!");
                if (err) {
                  console.warn(err);
                  return;
                }
                console.log("Caching loaded file...", fileName, blob);
                saveFile(fileName, blob);
              });
            });
          }
        });
      });
  };

  const playVideo = (e, selector) => {
    e.stopPropagation();
    if (playState) {
      return;
    }
    setPlayState(true);
    const video = document.querySelector(selector);
    video.play();
  };

  const parseContent = ([key, item]) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <div className="media-container">
          <img
            className={`torrent-img-${id}-${key}`}
            data-torrent={`${id}-${key}`}
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
            onClick={e => playVideo(e, `.torrent-video-${id}-${key}`)}
          >
            {!playState ? (
              <div className="video-play-button">
                <i className="fas fa-play"></i>
              </div>
            ) : null}
            <video
              className={`torrent-video torrent-video-${id}-${key}`}
              data-torrent={`${id}-${key}`}
              key={key}
              controls={playState}
              autoPlay={playState}
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

  useEffect(() => {
    attachMedia();
  }, [contentItems.length]);

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
