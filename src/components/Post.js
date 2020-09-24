import React, { useEffect } from "react";
import moment from "moment";
import { getCachedFile, renderCachedFile, saveFile } from "../utils/Cache";

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
    formats: ["jpg", "png", "webp"],
    element: "img",
    options: {}
  }
};

const Post = ({
  id,
  timestamp,
  avatar,
  page,
  contentItems = {},
  username,
  webTorrentClient
}) => {
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
          const fileName = `${id}-${key}-${file.name}`;

          const element = fileType.element;
          const target = `${element}#torrent-${element}-${id}-${key}`;
          const cachedFile = await getCachedFile(fileName);

          if (cachedFile) {
            webTorrentClient.remove(item.magnetURI);
            renderCachedFile(cachedFile, target);
            return;
          }

          // Prioritizes the file
          file.select();

          file.renderTo(target, fileType.options);

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
        });
      });
  };

  const parseContent = ([key, item]) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <img
          id={`torrent-img-${id}-${key}`}
          key={key}
          style={{
            width: "100%",
            maxWidth: 800,
            maxHeight: 800,
            objectFit: "contain"
          }}
        />
      );
    }

    if (item.type === "video/embedded") {
      return (
        <video
          id={`torrent-video-${id}-${key}`}
          key={key}
          className="torrent-video"
          controls
          autoPlay
          muted
        />
      );
    }

    return null;
  };

  useEffect(() => {
    attachMedia();
  }, [contentItems.length]);

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
        <img src="" alt="" />
        <i className="fas fa-external-link-alt"></i>
      </div>
    </div>
  );
};

export default Post;
