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

  const [remainingDistance, setRemainingDistance] = useState<number>(0);
  const [diff, setDiff] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [lastTime, setLastTime] = useState<number>(new Date().getTime());

  const totalSlides = children.length;
  const transitionDuration = 1000;
  const maxSpeed = 10;
  const cardWidth = width / visibleItems;

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
        //mouse released
        const slideJump = Math.min(
          maxSpeed,
          Math.round(Math.abs(mx / (width / visibleItems)) * velocity)
        );

        let newIndex =
          currentIndex -
          Math.round(mx / (width / visibleItems)) -
          slideJump * (xDir > 0 ? 1 : -1);
        // Calculate the count of card from the remaining distance
        if (!isInfinite) {
          if (newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= totalSlides - visibleItems + 1) {
            newIndex = totalSlides - visibleItems;
          }
        }

        // setDistance(-(newIndex - currentIndex) * (width / visibleItems) + mx);
        const mouseMovedCards = isInfinite
          ? Math.round((mx / width) * visibleItems)
          : 0;
        const calculatedDistance =
          -(newIndex - currentIndex + mouseMovedCards) *
          (width / visibleItems) +
          mx -
          mouseMovedCards * cardWidth;
        setDistance(calculatedDistance);
        setLastTime(new Date().getTime());
        setCurrentIndex(newIndex);
        setIsTransitioning(true);
        setDiff(0);
        console.log("mouse released", {
          mx,
          mouseMovedCards,
          newIndex,
          currentIndex,
          calculatedDistance,
        });
      } else {
        // Pressing
        if (!isTransitioning) {
          // After finishing animation, pressing
          const translateX = -currentIndex * cardWidth + mx;
          if (trackRef.current) {
            trackRef.current.style.transition = "none";
            trackRef.current.style.transform = `translateX(${translateX}px)`;
            console.log("!istransitioning", `translateX(${translateX}px)`)
          }
        } else if (!dragging) {
          if (trackRef.current) {
            trackRef.current.style.transition = "none";
            // Calculate the current position when the mouse is pressed during the transition
            const delayRunning = 0; // It is different between click time and disply time
            const time =
              (new Date().getTime() - lastTime + delayRunning) / 1000;
            if (time >= 1) {
              // If the elapsed time is more than 1 second, return
              setRemainingDistance(0);
              setDiff(0);
              setDistance(0);
              return;
            }
            // Calculate the remaining distance (the distance the card moves) according to the linear relationship
            const translateX = -(currentIndex * cardWidth);
            const remainDistance =
              distance * time * time - 2 * distance * time + distance;
            const currentX = translateX + remainDistance;
            trackRef.current.style.transform = `translateX(${currentX}px)`;
            const diff = Math.round(currentX) % Math.round(cardWidth);
            console.log("transition mouse down", { diff, currentX, remainDistance, translateX });
            let newIndex =
              currentX < 0 ? Math.abs(Math.round(currentX / cardWidth)) : 0;

            setDistance(0);
            setCurrentIndex(newIndex);
            setDiff(diff);
          }
        }
      }
      setDragging(down);
    }
  );

  const translateX = -(currentIndex * (width / visibleItems));
  console.log({ currentIndex, distance, remainingDistance, translateX });

  useEffect(() => {
    if (!dragging && trackRef.current) {
      trackRef.current.style.transition = isTransitioning
        ? `transform ${transitionDuration}ms linear 0s`
        : "none";
      trackRef.current.style.transform = `translateX(${translateX}px)`;
      console.log("translateX", `translateX(${translateX}px)`)
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
      renderItems(children, `clone-${dir || "prev"}` + i)
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
        {isInfinite && multiItems(assistCount, "prev")}
        {renderItems(children, "main")}
        {isInfinite && renderItems(children, "next")}
        {isInfinite &&
          currentIndex > totalSlides * (assistCount + 1) &&
          multiItems(
            Math.floor(currentIndex / totalSlides - assistCount) + 1,
            "next"
          )}
      </CarouselTrack>
      <NextButton onClick={handleNext}>Next</NextButton>
    </CarouselContainer>
  );
};

export default Carousel;
