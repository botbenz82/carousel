import React, { ReactNode } from "react";
export interface CarouselProps {
    isInfinite: boolean;
    children: ReactNode[];
    visibleItems?: number;
}
declare const Carousel: React.FC<CarouselProps>;
export default Carousel;
