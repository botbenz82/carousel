import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { styled } from "styled-components";
import { generateRandomColors } from "../utils/colorGenerate";
import Carousel from "./Carousel";

export default {
  title: "Carousel",
  component: Carousel,
} as Meta;

const AbsoluteBlock = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  text-wrap: nowrap;
  font-size: 32px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
`;
const SlideBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  max-height: 600px;
`;

type Story = StoryObj<typeof Carousel>;

export const ImgsCarousel: Story = {
  render: (props) => {
    const temp = { ...Default.args, ...props };
    const colors: string[] = generateRandomColors(12);

    return (
      <Carousel {...temp}>
        {colors.map((color, i) => (
          <SlideBlock style={{ background: color }} key={i}>
            <AbsoluteBlock>Title {i + 1}</AbsoluteBlock>
          </SlideBlock>
        ))}
      </Carousel>
    );
  },
};

export const Default = ImgsCarousel;
Default.args = {
  isInfinite: true,
};
