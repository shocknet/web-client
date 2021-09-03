import React, { useCallback, useEffect, useState } from "react";
import { useEmblaCarousel } from "embla-carousel/react";
import classNames from "classnames";
import "./css/index.css";
import Video from "../Video";
import Stream from "../Stream";
import Image from "../Image";

const MediaCarousel = ({
  id,
  timestamp,
  avatar,
  tipCounter,
  tipValue,
  contentItems
}) => {
  const [carouselRef, carouselAPI] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "center",
    draggable: false
  });
  const [sliderLength, setSliderLength] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const parseContent = useCallback(
    ([key, item], index) => {
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
            item={item}
            index={index}
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
    },
    [id, tipCounter, tipValue]
  );

  useEffect(() => {
    if (!carouselAPI) {
      return;
    }

    carouselAPI.on("scroll", updateActiveSlide);
    window.addEventListener("keydown", handleUserKeyDown);

    return () => {
      window.removeEventListener("keydown", handleUserKeyDown);
      carouselAPI.off("scroll", updateActiveSlide);
    };
  }, [carouselAPI, sliderLength, handleUserKeyDown, updateActiveSlide]);

  useEffect(() => {
    if (!carouselAPI) {
      return;
    }

    setSliderLength(carouselAPI.scrollSnapList().length);
  }, [carouselAPI]);

  return (
    <div className="media-content-carousel">
      {sliderLength > 1 ? (
        <div className="media-carousel-controls-container">
          <div
            className="media-carousel-arrow fas fa-angle-left"
            onClick={prevSlide}
          />
          <div className="media-carousel-pages">
            {Array.from({ length: sliderLength }).map((_, key) => (
              <div
                className={classNames({
                  "media-carousel-page": true,
                  "active-carousel-page": activeSlide === key
                })}
                onClick={() => carouselAPI?.scrollTo(key)}
              />
            ))}
          </div>
          <div
            className="media-carousel-arrow fas fa-angle-right"
            onClick={nextSlide}
          />
        </div>
      ) : null}
      <div className="media-content-root" ref={carouselRef}>
        <div className="media-content-container">
          {contentItems.map(parseContent)}
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel;
