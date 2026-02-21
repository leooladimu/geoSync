import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SYMBOLS, bp } from "../../theme/theme";
import { api } from "../../utils/api";

const CATEGORY_META = {
  withdrawal: {
    glyph: "☽",
    label: "Withdrawal pattern",
  },
  "intensity-seeking": {
    glyph: "☉",
    label: "Intensity seeking",
  },
  "over-commitment": {
    glyph: "♈",
    label: "Over-commitment risk",
  },
  "scarcity-lock": {
    glyph: "♁",
    label: "Scarcity pattern",
  },
  "optimism-bias": {
    glyph: "♋",
    label: "Optimism bias",
  },
};

export default function NudgesFeed({ token }) {
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNudges() {
      try {
        const data = await api.get("/nudges", token);
        setNudges(data);
      } catch (err) {
        console.error("Failed to load nudges:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNudges();
  }, [token]);

  async function dismiss(id) {
    try {
      await api.patch(`/nudges/${id}/dismiss`, null, token);
      setNudges((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to dismiss nudge:", err);
    }
  }

  if (loading) return null;
  if (!nudges.length) return null;

  return (
    <Section>
      <SectionLabel>
        {SYMBOLS.star} Active Insights
        <Count>{nudges.length}</Count>
      </SectionLabel>
      <Feed>
        {nudges.map((nudge) => (
          <NudgeCard key={nudge._id} nudge={nudge} onDismiss={dismiss} />
        ))}
      </Feed>
    </Section>
  );
}

function NudgeCard({ nudge, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[nudge.category] || {
    glyph: SYMBOLS.star,
    label: nudge.category,
  };

  const connectionName = nudge.connectionId?.manualProfile?.name || null;

  return (
    <Card>
      <CardTop>
        <CardLeft>
          <Glyph>{meta.glyph}</Glyph>
          <CardText>
            <CategoryLabel>{meta.label}</CategoryLabel>
            {connectionName && (
              <ConnectionRef>re: {connectionName}</ConnectionRef>
            )}
          </CardText>
        </CardLeft>
        <CardActions>
          <ExpandBtn onClick={() => setExpanded((p) => !p)}>
            {expanded ? "less" : "more"}
          </ExpandBtn>
          <DismissBtn onClick={() => onDismiss(nudge._id)} title="Dismiss">
            ✕
          </DismissBtn>
        </CardActions>
      </CardTop>

      <Message $expanded={expanded}>{nudge.message}</Message>

      {expanded && (
        <Trigger>
          <TriggerLabel>Why now</TriggerLabel>
          {nudge.trigger}
        </Trigger>
      )}
    </Card>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(props) => props.theme.colors.accent};
`;

const Count = styled.span`
  background: ${(props) => props.theme.colors.accentDim};
  color: ${(props) => props.theme.colors.accentLight};
  font-size: ${(props) => props.theme.fontSizes.xs};
  padding: 1px 7px;
  border-radius: ${(props) => props.theme.radius.round};
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.bgCard};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 3px solid ${(props) => props.theme.colors.accent};
  border-radius: ${(props) => props.theme.radius.md};
  padding: ${(props) => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.lg};
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};
`;

const CardLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    align-items: center;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const Glyph = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;

  @media (min-width: ${bp.md}) {
    font-size: 1.25rem;
  }
`;

const CardText = styled.div``;

const CategoryLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textPrimary};
  text-transform: capitalize;
`;

const ConnectionRef = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  margin-top: 2px;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const ExpandBtn = styled.button`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.accent};
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const DismissBtn = styled.button`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  &:hover {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.7;
  display: ${(props) => (props.$expanded ? "block" : "-webkit-box")};
  -webkit-line-clamp: ${(props) => (props.$expanded ? "unset" : "2")};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Trigger = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  padding-top: ${(props) => props.theme.spacing.sm};
  line-height: 1.5;
  font-style: italic;
`;

const TriggerLabel = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.colors.textMuted};
  margin-right: ${(props) => props.theme.spacing.sm};
  font-style: normal;
`;
