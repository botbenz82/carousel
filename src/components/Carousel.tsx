import React, { ReactNode, useEffect, useRef, useState } from "react";
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
  visibleItems?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  isInfinite,
  children,
  visibleItems = 3,
}) => {
  const assistCount = 5;
  const [currentIndex, setCurrentIndex] = useState<number>(
    isInfinite ? children.length * assistCount : 0
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const totalSlides = children.length;
  const transitionDuration = 1000;
  const maxSpeed = 10;

  useEffect(() => {
    setWidth(trackRef.current?.offsetWidth || 0);
  }, []);

  useEffect(() => {
    if (!isTransitioning) {
      setCurrentIndex(
        isInfinite
          ? (currentIndex % totalSlides) + totalSlides * assistCount
          : currentIndex % totalSlides
      );
    }{
      currentIndex < totalSlides && setCurrentIndex(
        isInfinite
          ? (currentIndex % totalSlides) + totalSlides * assistCount
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
    if (isInfinite || currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (isInfinite || currentIndex < totalSlides - visibleItems) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const bind = useDrag(
    ({ down, movement: [mx], velocity, direction: [xDir] }) => {
      if (!down) {
        const slideJump = Math.min(
          maxSpeed,
          Math.round(Math.abs(mx / (width / visibleItems)) * velocity)
        );
        let newIndex =
          currentIndex -
          Math.round(mx / (width / visibleItems)) -
          slideJump * (xDir > 0 ? 1 : -1);

        if (!isInfinite) {
          if (newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= totalSlides - visibleItems + 1) {
            newIndex = totalSlides - visibleItems;
          }
        }

        setCurrentIndex(newIndex);
        setIsTransitioning(true);
      } else {
        const translateX = -currentIndex * (width / visibleItems) + mx;
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
          trackRef.current.style.transform = `translateX(${translateX}px)`;
        }
      }
      setDragging(down);
    }
  );

  const translateX = -(currentIndex * (width / visibleItems));

  useEffect(() => {
    if (!dragging && trackRef.current) {
      trackRef.current.style.transition = isTransitioning
        ? `${transitionDuration}ms`
        : "none";
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    }
  }, [dragging, translateX, isTransitioning, transitionDuration]);

  const renderItems = (items: ReactNode[], keyPrefix: string) => {
    return items.map((child, index) => (
      <CarouselItem
        visibleitems={visibleItems}
        key={`${keyPrefix}-${index}`}
        style={{ minWidth: `${100 / visibleItems}%` }}
      >
        {child}
      </CarouselItem>
    ));
  };

  const multiItems = (count: number, dir?: string) => {
    const arr = new Array(count).fill(1);
    return arr.map((e, i) =>
      renderItems(children, `clone-${dir || "preve"}` + i)
    );
  };

  return (
    <CarouselContainer>
      <PrevButton onClick={handlePrev}>Prev</PrevButton>
      <CarouselTrack
        visibleitems={visibleItems}
        ref={trackRef}
        transitionduration={transitionDuration}
        onTransitionEnd={handleTransitionEnd}
        {...bind()}
      >
        {isInfinite && multiItems(assistCount, "preve")}
        {renderItems(children, "main")}
        {isInfinite && renderItems(children, "clone-next")}
        {isInfinite &&
          currentIndex > totalSlides * (assistCount + 1) &&
          multiItems(Math.floor(currentIndex / totalSlides - assistCount) + 1, "next")}
      </CarouselTrack>
      <NextButton onClick={handleNext}>Next</NextButton>
    </CarouselContainer>
  );
};

export default Carousel;
