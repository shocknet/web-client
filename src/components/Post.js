import React, { useEffect } from "react";
import moment from "moment";
import av1 from "../images/av1.jpg";

const Post = ({
  timestamp,
  avatar,
  contentItems = {},
  username,
  webTorrentClient
}) => {
  const attachVideo = () => {
    Object.entries(contentItems)
      .filter(([key, item]) => item.type === "video/embedded")
      .map(([key, video]) => {
        webTorrentClient.add(video.magnetURI, torrent => {
          const file = torrent.files.find(file => file.name.endsWith(".mp4"));
          //file.appendTo('body') // append the file to the DOM

          file.renderTo(`video#${key}-torrent-video`, {
            autoplay: true,
            muted: true
          });
        });
      });
  };

  // const setVideoRef = (key, ref) => {
  //   setVideoRefs({
  //     ...videoRefs,
  //     [key]: ref
  //   });
  // };

  const parseContent = ([key, item]) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return <img key={key} src={item.text} />;
    }

    if (item.type === "video/embedded") {
      return (
        <video
          id={`${key}-torrent-video`}
          key={key}
          className="torrent-video"
          autoPlay={true}
          muted={true}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    attachVideo();
  }, [contentItems.length]);

  return (
    <div className="post">
      <div className="head">
        <div className="user">
          <div
            className="av"
            style={{
              backgroundImage: `url(${
                avatar ? `data:image/png;base64,${avatar}` : av1
              })`
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
