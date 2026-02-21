import React from 'react'
import styled from 'styled-components'
import { SYMBOLS, bp } from '../../theme/theme'

export default function StrategyBlock({ dimensions, name }) {
  const strategies = [
    dimensions.chronotype?.strategy,
    dimensions.stress?.circuitBreaker,
    dimensions.seasonal?.strategy
  ].filter(Boolean)

  if (!strategies.length) return null

  return (
    <Block>
      <SectionTitle>Your Strategy Guide</SectionTitle>
      <Intro>
        These aren't compatibility verdicts — they're protocols.
        Built specifically for how you and {name} are wired.
      </Intro>

      <Strategies>
        {dimensions.chronotype?.strategy && (
          <StrategyItem>
            <StrategyGlyph>☉</StrategyGlyph>
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
  )
}

const Block = styled.div`
  background-color: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    border-radius: ${props => props.theme.radius.xl};
    padding: ${props => props.theme.spacing.xl};
  }
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`

const Intro = styled.p`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.sm};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`

const Strategies = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.xl};
  }
`

const StrategyItem = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-start;

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.lg};
  }
`

const StrategyGlyph = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.accent};
  flex-shrink: 0;
  margin-top: 2px;

  @media (min-width: ${bp.md}) {
    font-size: 1.25rem;
  }
`

const StrategyText = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`

const StrategyLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.xs};
`
