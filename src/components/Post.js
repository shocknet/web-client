import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import { useEmblaCarousel } from "embla-carousel/react";
import classNames from "classnames";
import { updateWallPost } from "../actions/UserActions";
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
  const [carouselRef, carouselAPI] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "center"
  });

  const [sliderLength, setSliderLength] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const TipRibbon = () =>
    tipValue > 0 ? (
      <div className="ribbon-container">
        <p className="ribbon-title">Total Tips</p>
        <p className="ribbon-value">
          {tipCounter} {tipCounter === 1 ? "Tip" : "Tips"}
        </p>
      </div>
    ) : null;

  const parseContent = ([key, item], index) => {
    if (item.type === "text/paragraph") {
      return <p key={key}>{item.text}</p>;
    }

    if (item.type === "image/embedded") {
      return (
        <div className="media-container" key={`${key}-${index}`}>
          <img
            className={`torrent-img-${id}-${key}`}
            alt="Post Media"
            data-torrent={item.magnetURI}
            data-file-key={index}
            key={key}
          />
          <TipRibbon />
        </div>
      );
    }

    if (item.type === "video/embedded") {
      return (
        <div className="media-container" key={`${key}-${index}`}>
          <div
            className="video-container"
            style={{
              cursor: "pointer"
            }}
          >
            <video
              className={`torrent-video torrent-video-${id}-${key}`}
              data-torrent={item.magnetURI}
              data-file-key={index}
              key={key}
              controls
              data-played="false"
            />
            <TipRibbon />
          </div>
        </div>
      );
    }

    return null;
  };

  // useEffect(() => {
  //   attachMedia();
  // }, [contentItems.length]);

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
    listenPath({
      path: `posts/${id}/tipCounter`,
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
      path: `posts/${id}/tipValue`,
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
  }, [dispatch, id, page, publicKey]);

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

    openTipModal({
      targetType: "post",
      postID: id
    });
  }, [id, isOnlineNode, openTipModal]);

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
          <div className="tip-icon icon-thin-feed"></div>
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
      </div>
    </div>
  );
};

export default Post;
