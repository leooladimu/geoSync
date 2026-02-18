import { useState } from "react";
import styled from "styled-components";

const TIER_LABELS = {
  high: "Well aligned",
  moderate: "Workable",
  low: "Friction-prone",
  protective: "Protective offset",
  risky: "Double-risk window",
  "friction-prone": "Friction-prone",
};
const TIER_COLORS = {
  high: "#4a7a5a",
  protective: "#4a7a5a",
  moderate: "#c9a03a",
  low: "#7a3a3a",
  risky: "#7a3a3a",
  "friction-prone": "#7a3a3a",
};

export default function DimensionPanel({
  glyph,
  title,
  tier,
  score,
  dimension,
  showToxicLoop,
}) {
  const [open, setOpen] = useState(false);
  const color = TIER_COLORS[tier] || "#c9a03a";
  return (
    <Panel>
      <PanelHeader onClick={() => setOpen((p) => !p)}>
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
  );
}
const Panel = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;
const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme }) => theme.colors.bgCardHover};
  }
`;
const PanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;
const PanelGlyph = styled.span`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.accent};
`;
const PanelTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const TierBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color}44;
`;
const PanelScore = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ $color }) => $color};
`;
const PanelBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
const ArchetypeLine = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Block = styled.div``;
const BlockLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const BlockText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;
const ToxicLoop = styled(Block)`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-left: 2px solid ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md} 0;
`;
const Warning = styled(Block)`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-left: 2px solid ${({ theme }) => theme.colors.warning};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md} 0;
`;
