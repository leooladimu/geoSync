import React from "react";
import styled from "styled-components";

export default function ScoreRing({ score, size = 160 }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 70 ? "#4a7a5a" : score >= 45 ? "#c9a03a" : "#7a3a3a";

  return (
    <Wrapper size={size}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2c2e"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <ScoreText>
        <ScoreNumber style={{ color }}>{score}</ScoreNumber>
        <ScoreLabel>overall</ScoreLabel>
      </ScoreText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  flex-shrink: 0;
`;

const ScoreText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreNumber = styled.div`
  font-family: ${(props) => props.theme.fonts.mono};
  font-size: ${(props) => props.theme.fontSizes["3xl"]};
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
`;
