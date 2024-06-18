import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDrag } from "react-use-gesture";
import {
  CarouselContainer,
  CarouselItem,
  CarouselTrack,
  NextButton,
  PrevButton,
} from "./Carousel.styled";

export interface CarouselProps {
  isInfinite: boolean;
  children: ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ isInfinite, children }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(
    isInfinite ? children.length : 0
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const totalSlides = children.length;
  const transitionDuration = 300;
  const maxSpeed = Math.floor(totalSlides / 2);

  useEffect(() => {
    setWidth(trackRef.current?.offsetWidth || 0);
  }, []);

  useEffect(() => {
    if (isTransitioning) {
      if (currentIndex === 0) {
        const timer = setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(totalSlides);
        }, transitionDuration);
        return () => clearTimeout(timer);
      } else if (currentIndex === totalSlides * 2) {
        const timer = setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(totalSlides);
        }, transitionDuration);
        return () => clearTimeout(timer);
      }
    } else {
      setCurrentIndex(
        isInfinite
          ? (currentIndex % totalSlides) + totalSlides
          : currentIndex % totalSlides
      );
    }
  }, [currentIndex, isTransitioning, totalSlides, transitionDuration]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalSlides);
    } else if (currentIndex === totalSlides * 2) {
      setCurrentIndex(totalSlides);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      if (isInfinite || currentIndex > 0) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  const handleNext = () => {
    if (isInfinite || currentIndex < totalSlides - 1) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const bind = useDrag(
    ({ down, movement: [mx], velocity, direction: [xDir] }) => {
      if (!down) {
        const slideJump = Math.min(
          maxSpeed,
          Math.round(Math.abs(mx / width) * velocity)
        );
        let newIndex =
          currentIndex -
          Math.round(mx / width) -
          slideJump * (xDir > 0 ? 1 : -1);

        if (!isInfinite) {
          if (newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= totalSlides) {
            newIndex = totalSlides - 1;
          }
        }

        setCurrentIndex(newIndex);
        setIsTransitioning(true);
      } else {
        const translateX = -currentIndex * width + mx;
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
          trackRef.current.style.transform = `translateX(${translateX}px)`;
        }
      }
      setDragging(down);
    }
  );

  const translateX = -(currentIndex * width);

  useEffect(() => {
    if (!dragging && trackRef.current) {
      trackRef.current.style.transition = isTransitioning
        ? `${transitionDuration}ms`
        : "none";
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    }
  }, [dragging, translateX, isTransitioning, transitionDuration]);

  return (
    <CarouselContainer>
      <PrevButton onClick={handlePrev}>Prev</PrevButton>
      <CarouselTrack
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
        {...bind()}
      >
        {isInfinite &&
          children.map((child, index) => (
            <CarouselItem
              key={`clone-prev-${index}`}
              style={{ minWidth: "100%" }}
            >
              {child}
            </CarouselItem>
          ))}
        {children.map((child, index) => (
          <CarouselItem key={index} style={{ minWidth: "100%" }}>
            {child}
          </CarouselItem>
        ))}
        {isInfinite &&
          children.map((child, index) => (
            <CarouselItem
              key={`clone-next-${index}`}
              style={{ minWidth: "100%" }}
            >
              {child}
            </CarouselItem>
          ))}
      </CarouselTrack>
      <NextButton onClick={handleNext}>Next</NextButton>
    </CarouselContainer>
  );
};

export default Carousel;
