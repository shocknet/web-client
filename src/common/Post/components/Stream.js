import React, { useRef, useEffect, useState } from "react";
import useInView from "react-cool-inview";
import TipRibbon from "./TipRibbon";
import videojs from "video.js";

const REACT_APP_SL_SEED_URI = "https://webtorrent.shock.network";
const STREAM_STATUS_URI = `${REACT_APP_SL_SEED_URI}/rtmpapi/api/streams/live`;

const Stream = ({
  id,
  item,
  index,
  postId,
  tipValue,
  tipCounter,
  hideRibbon,
  width
}) => {
  const playerDOM = useRef(null);
  const { inView, observe } = useInView({
    trackVisibility: true,
    delay: 100,
    unobserveOnEnter: true
  });
  const [isLive, setIsLive] = useState(false);
  const videoStyle = { width: "100%" };
  if (width) {
    videoStyle.width = width;
  }
  useEffect(() => {
    if (!item || !inView) {
      return;
    }

    let recheckInterval = null;
    const checkStatus = async () => {
      try {
        const [seedToken] = item.magnetURI
          .replace(/.*(\/live\/)/, "")
          .split("/index.m3u8");
        const res = await fetch(`${STREAM_STATUS_URI}/${seedToken}`);
        const resJ = await res.json();
        if (!resJ.isLive) {
          return false;
        }
        const player = videojs(playerDOM.current, {
          autoplay: true,
          muted: true,
          aspectRatio: "16:9"
        });
        player.src({
          src: item.magnetURI,
          type: "application/x-mpegURL"
        });
        /*listen for 404s from the player
        player.tech().on('retryplaylist', () => {
          console.log('retryplaylist');
        });*/
        player.play();
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    };
    checkStatus().then(isLive => {
      if (isLive) {
        setIsLive(true);
        return;
      }
      recheckInterval = setInterval(async () => {
        const isLive = await checkStatus();
        if (isLive) {
          setIsLive(true);
          clearInterval(recheckInterval);
          return;
        }
      }, 10000);
    });

    return () => {
      clearInterval(recheckInterval);
    };
  }, [item, inView]);
  return (
    <div className="media-container w-100">
      <div
        className="video-container w-100"
        style={{
          cursor: "pointer",
          width: "100%"
        }}
      >
        {!isLive && <p>The streamer has disconnected.</p>}
        <div
          style={
            isLive ? { width: "100%" } : { display: "none", width: "100%" }
          }
          ref={observe}
        >
          <video
            className="video-js vjs-default-skin"
            ref={playerDOM}
            style={videoStyle}
            preload="auto"
            controls
            muted
            autoPlay
          />
        </div>
        {!hideRibbon && (
          <TipRibbon
            tipCounter={tipCounter}
            tipValue={tipValue}
            zoomed={false}
          />
        )}
      </div>
    </div>
  );
};

export default Stream;
