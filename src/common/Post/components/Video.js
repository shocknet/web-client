import React, { useRef } from "react";
import useInView from "react-cool-inview";
import TipRibbon from "./TipRibbon";
import "../../../styles/video.js.css";
import "../css/index.css";

const Video = ({ id, item, index, postId, tipValue, tipCounter }) => {
  const videoRef = useRef();
  const { inView, observe } = useInView({
    trackVisibility: true,
    delay: 100,
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
          className={`torrent-video torrent-video-${postId}-${id} torrent-video-${postId}`}
          data-torrent={item.magnetURI}
          data-file-key={index}
          controls
          data-played="false"
          ref={videoRef}
          autoPlay={inView}
        />
        <TipRibbon tipCounter={tipCounter} tipValue={tipValue} />
      </div>
    </div>
  );
};

export default Video;
