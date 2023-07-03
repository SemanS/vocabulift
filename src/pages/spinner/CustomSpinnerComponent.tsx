import React from "react";
import { Spin } from "antd";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(1turn);
  }
`;

const CustomSpinner = styled.svg<{}>`
  animation: ${rotate} 2s linear infinite;
  transform-origin: center;
  font-size: 128px !important;
`;

interface SpinnerProps {
  spinning: boolean;
  children?: React.ReactNode;
}

const CustomSpinnerComponent: React.FC<SpinnerProps> = ({
  spinning,
  children,
}) => {
  return (
    <Spin
      spinning={spinning}
      indicator={
        <CustomSpinner
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 834.000000 356.000000"
          preserveAspectRatio="xMidYMid meet"
          style={{ left: 345, top: 145 }}
        >
          <g
            transform="translate(0.000000,356.000000) scale(0.100000,-0.100000)"
            fill="#3C4760"
            stroke="none"
          >
            <path
              d="M1820 3290 c-855 -93 -1571 -171 -1590 -174 -43 -7 -60 -29 -60 -75
        1 -20 96 -491 213 -1048 159 -756 218 -1017 232 -1033 17 -19 29 -20 283 -20
        207 0 263 -3 260 -12 -3 -7 -34 -129 -69 -271 -60 -242 -63 -259 -49 -285 12
        -20 25 -28 53 -30 35 -3 67 20 618 442 l581 446 427 0 c411 0 429 1 446 19 14
        16 44 219 161 1083 79 585 144 1067 144 1071 0 18 -51 57 -72 56 -13 -1 -723
        -77 -1578 -169z"
            />
          </g>
        </CustomSpinner>
      }
    >
      {children}
    </Spin>
  );
};

export default CustomSpinnerComponent;
