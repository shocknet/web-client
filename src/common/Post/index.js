import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import { useEmblaCarousel } from "embla-carousel/react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import useInView from "react-cool-inview";
import { updateWallPost } from "../../actions/UserActions";
import { openModal } from "../../actions/TipActions";
import { gunUser, fetchPath } from "../../utils/Gun";
import Video from "./components/Video";
import Image from "./components/Image";
import Stream from "./components/Stream";
import ShareBtn from "./components/ShareBtn";
import "./css/index.css";
import { attachMedia } from "../../utils/Torrents";

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
  const [carouselRef, carouselAPI] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "center",
    draggable: false
  });
  const { observe } = useInView({
    trackVisibility: false,
    unobserveOnEnter: true,
    onEnter: () => {
      const post = { contentItems, id };
      attachMedia([post], false);
    }
  });

  const [sliderLength, setSliderLength] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveStatus, setLiveStatus] = useState("");
  const [viewersCounter, setViewersCounter] = useState(0);

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

  const getMediaContent = () => {
    return Object.entries(contentItems).filter(
      ([_, item]) => item.type !== "text/paragraph"
    );
  };

  const getTextContent = () => {
    return Object.entries(contentItems).filter(
      ([_, item]) => item.type === "text/paragraph"
    );
  };

  const parseContent = ([key, item], index) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <Image
          id={key}
          item={item}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
        />
      );
    }

    if (item.type === "video/embedded") {
      return (
        <Video
          id={key}
          item={item}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
        />
      );
    }

    if (item.type === "stream/embedded") {
      return (
        <Stream
          id={key}
          item={item}
          index={index}
          postId={id}
          tipCounter={tipCounter}
          tipValue={tipValue}
          key={`${id}-${index}`}
        />
      );
    }

    return null;
  };

  const nextSlide = useCallback(() => {
    if (!carouselAPI) return;

    if (carouselAPI.canScrollNext()) {
      carouselAPI.scrollNext();
    }
  }, [carouselAPI]);

  const prevSlide = useCallback(() => {
    if (!carouselAPI) return;

    if (carouselAPI.canScrollPrev()) {
      carouselAPI.scrollPrev();
    }
  }, [carouselAPI]);

  const handleUserKeyDown = useCallback(
    e => {
      if (sliderLength === 0) return;
      const { key } = e;

      if (key === "ArrowRight") {
        nextSlide();
      }

      if (key === "ArrowLeft") {
        prevSlide();
      }
    },
    [sliderLength, prevSlide, nextSlide]
  );

  const updateActiveSlide = useCallback(() => {
    setActiveSlide(carouselAPI.selectedScrollSnap());
  }, [carouselAPI, setActiveSlide]);

  useEffect(() => {
    fetchPath({
      path: `posts/${id}/tipsSet`,
      gunPointer: gunUser(publicKey),
      method: "load"
    }).then(data => {
      const tipSet = data ? Object.values(data) : [];
      const lenSet = tipSet.length;
      const tot =
        lenSet > 0 ? tipSet.reduce((acc, val) => Number(val) + Number(acc)) : 0;
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

  useEffect(() => {
    if (!carouselAPI) return;

    carouselAPI.on("scroll", updateActiveSlide);
    setSliderLength(carouselAPI.scrollSnapList().length);
    window.addEventListener("keydown", handleUserKeyDown);

    return () => {
      window.removeEventListener("keydown", handleUserKeyDown);
      carouselAPI.off("scroll", updateActiveSlide);
    };
  }, [carouselAPI, sliderLength, handleUserKeyDown, updateActiveSlide]);

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
    Tooltip.rebuild();
  }, []);

  return (
    <div className="post">
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
        {getTextContent().map(parseContent)}
        <div className="media-content-carousel">
          {sliderLength > 1 ? (
            <div className="media-carousel-controls-container">
              <div
                className="media-carousel-arrow fas fa-angle-left"
                onClick={prevSlide}
              ></div>
              <div className="media-carousel-pages">
                {Array.from({ length: sliderLength }).map((_, key) => (
                  <div
                    className={classNames({
                      "media-carousel-page": true,
                      "active-carousel-page": activeSlide === key
                    })}
                    onClick={() => carouselAPI?.scrollTo(key)}
                  ></div>
                ))}
              </div>
              <div
                className="media-carousel-arrow fas fa-angle-right"
                onClick={nextSlide}
              ></div>
            </div>
          ) : null}
          <div className="media-content-root" ref={carouselRef}>
            <div className="media-content-container">
              {getMediaContent().map(parseContent)}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <div
          className="icon-tip-btn"
          data-tip="Tip this post"
          onClick={tipPost}
        >
          <i className="tip-icon icon-thin-feed"></i>
        </div>
        {/* <div
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
        </div> */}
        <Tooltip backgroundColor="#3a4d67" effect="solid" />
      </div>
    </div>
  );
};

export default Post;
