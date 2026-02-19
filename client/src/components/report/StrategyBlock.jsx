import styled from "styled-components";
import { SYMBOLS } from "../../theme";

export default function StrategyBlock({ dimensions, name }) {
  if (
    !dimensions.chronotype?.strategy &&
    !dimensions.stress?.circuitBreaker &&
    !dimensions.seasonal?.strategy
  )
    return null;
  return (
    <Block>
      <SectionTitle>Your Strategy Guide</SectionTitle>
      <Intro>
        These aren't compatibility verdicts — they're protocols. Built
        specifically for how you and {name} are wired.
      </Intro>
      <Strategies>
        {dimensions.chronotype?.strategy && (
          <StrategyItem>
            <StrategyGlyph>☉\uFE0E</StrategyGlyph>
            <StrategyText>
              <StrategyLabel>Daily Rhythm</StrategyLabel>
              {dimensions.chronotype.strategy}
            </StrategyText>
          </StrategyItem>
        )}
        {dimensions.stress?.circuitBreaker && (
          <StrategyItem>
            <StrategyGlyph>♁</StrategyGlyph>
            <StrategyText>
              <StrategyLabel>When Things Break Down</StrategyLabel>
              {dimensions.stress.circuitBreaker}
            </StrategyText>
          </StrategyItem>
        )}
        {dimensions.seasonal?.strategy && (
          <StrategyItem>
            <StrategyGlyph>{SYMBOLS.star}</StrategyGlyph>
            <StrategyText>
              <StrategyLabel>Seasonal Calendar</StrategyLabel>
              {dimensions.seasonal.strategy}
            </StrategyText>
          </StrategyItem>
        )}
      </Strategies>
    </Block>
  );
}
const Block = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;
const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const Intro = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;
const Strategies = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;
const StrategyItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
`;
const StrategyGlyph = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 2px;
`;
const StrategyText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;
const StrategyLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
