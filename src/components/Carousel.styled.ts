import styled from 'styled-components';

export const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

export const CarouselTrack = styled.div<{visibleItems: number}>`
  display: flex;
  transition: transform 0.3s ease-in-out;
`;

export const CarouselItem = styled.div<{visibleItems: number}>`
  flex: 0 0 ${({ visibleItems }: { visibleItems: number }) => 100 / visibleItems}%;
`;

export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 1;
`;

export const PrevButton = styled(CarouselButton)`
  left: 10px;
`;

export const NextButton = styled(CarouselButton)`
  right: 10px;
`;
