import React, { useRef, useState } from "react";
import useInView from "react-cool-inview";
import videojs from "video.js";
import TipRibbon from "./TipRibbon";
import "../../../styles/video.js.css";
import "../css/index.css";

const Video = ({ id, item, index, postId, tipValue, tipCounter }) => {
  const videoRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const { observe } = useInView({
    trackVisibility: true,
    delay: 100,
    onEnter: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    onLeave: () => {
      if (!videoRef.current) {
        return;
      }

      videoRef.current.pause();
    }
  });

  return (
    <div className="media-container">
      <div
        className="video-container"
        style={{
          cursor: "pointer"
        }}
        ref={observe}
      >
        <video
          className={`torrent-video torrent-video-${postId}-${id} torrent-video-${postId} video-js vjs-default-skin`}
          data-torrent={item.magnetURI}
          data-file-key={index}
          controls
          data-played="false"
          ref={videoRef}
        />
        <TipRibbon tipCounter={tipCounter} tipValue={tipValue} />
      </div>
    </div>
  );
};

export default Video;