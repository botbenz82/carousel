import styled from 'styled-components';

export const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

export const CarouselTrack = styled.div<{ visibleitems: number, transitionduration: number }>`
  display: flex;
  transition: transform ${({ transitionduration }: { transitionduration: number }) => transitionduration}ms linear 0s;
  transition-timing-function: cubic-bezier(0, 0, 0, 1) !important;
`;

export const CarouselItem = styled.div<{ visibleitems: number }>`
  flex: 0 0 ${({ visibleitems }: { visibleitems: number }) => 100 / visibleitems}%;
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
