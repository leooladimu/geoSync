import React, { useState } from 'react'
import styled from 'styled-components'
import { bp } from '../../theme/theme'

const TIER_LABELS = {
  high:             'Well aligned',
  moderate:         'Workable',
  low:              'Friction-prone',
  protective:       'Protective offset',
  risky:            'Double-risk window',
  'friction-prone': 'Friction-prone'
}

const TIER_COLORS = {
  high:             '#4a7a5a',
  protective:       '#4a7a5a',
  moderate:         '#c9a03a',
  low:              '#7a3a3a',
  risky:            '#7a3a3a',
  'friction-prone': '#7a3a3a'
}

export default function DimensionPanel({ glyph, title, tier, score, dimension, showToxicLoop }) {
  const [open, setOpen] = useState(false)
  const color = TIER_COLORS[tier] || '#c9a03a'

  return (
    <Panel>
      <PanelHeader onClick={() => setOpen(p => !p)}>
        <PanelLeft>
          <PanelGlyph>{glyph}</PanelGlyph>
          <PanelTitle>{title}</PanelTitle>
          <TierBadge $color={color}>{TIER_LABELS[tier] || tier}</TierBadge>
        </PanelLeft>
        <PanelScore $color={color}>{score}%</PanelScore>
      </PanelHeader>

      {open && (
        <PanelBody>
          {dimension.archetype && (
            <ArchetypeLine>{dimension.archetype}</ArchetypeLine>
          )}

          {dimension.insight && (
            <Block>
              <BlockLabel>Insight</BlockLabel>
              <BlockText>{dimension.insight}</BlockText>
            </Block>
          )}

          {dimension.dynamic && (
            <Block>
              <BlockLabel>Your Dynamic</BlockLabel>
              <BlockText>{dimension.dynamic}</BlockText>
            </Block>
          )}

          {showToxicLoop && dimension.toxicLoop && (
            <ToxicLoop>
              <BlockLabel>The Pattern to Watch</BlockLabel>
              <BlockText>{dimension.toxicLoop}</BlockText>
            </ToxicLoop>
          )}

          {dimension.circuitBreaker && (
            <Block>
              <BlockLabel>Circuit Breaker</BlockLabel>
              <BlockText>{dimension.circuitBreaker}</BlockText>
            </Block>
          )}

          {dimension.strategy && (
            <Block>
              <BlockLabel>Strategy</BlockLabel>
              <BlockText>{dimension.strategy}</BlockText>
            </Block>
          )}

          {dimension.warning && (
            <Warning>
              <BlockLabel>Watch for</BlockLabel>
              <BlockText>{dimension.warning}</BlockText>
            </Warning>
          )}
        </PanelBody>
      )}
    </Panel>
  )
}

const Panel = styled.div`
  background-color: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  overflow: hidden;

  @media (min-width: ${bp.md}) {
    border-radius: ${props => props.theme.radius.lg};
  }
`

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};
  &:hover { background-color: ${props => props.theme.colors.bgCardHover}; }

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing.lg};
  }
`

const PanelLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;

  @media (min-width: ${bp.md}) {
    align-items: center;
    gap: ${props => props.theme.spacing.md};
  }
`

const PanelGlyph = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.accent};

  @media (min-width: ${bp.md}) {
    font-size: 1.25rem;
  }
`

const PanelTitle = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textPrimary};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.md};
  }
`

const TierBadge = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  padding: 2px 6px;
  border-radius: ${props => props.theme.radius.round};
  background: ${props => props.$color}22;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}44;

  @media (min-width: ${bp.md}) {
    padding: 2px 8px;
  }
`

const PanelScore = styled.span`
  font-family: ${props => props.theme.fonts.mono};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.$color};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const PanelBody = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${props => props.theme.spacing.lg};
    gap: ${props => props.theme.spacing.lg};
  }
`

const ArchetypeLine = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textPrimary};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Block = styled.div``

const BlockLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const BlockText = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`

const ToxicLoop = styled(Block)`
  background-color: ${props => props.theme.colors.bgElevated};
  border-left: 2px solid ${props => props.theme.colors.danger};
  padding: ${props => props.theme.spacing.md};
  border-radius: 0 ${props => props.theme.radius.md} ${props => props.theme.radius.md} 0;
`

const Warning = styled(Block)`
  background-color: ${props => props.theme.colors.bgElevated};
  border-left: 2px solid ${props => props.theme.colors.warning};
  padding: ${props => props.theme.spacing.md};
  border-radius: 0 ${props => props.theme.radius.md} ${props => props.theme.radius.md} 0;
`
