import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SYMBOLS } from "../../theme";
import ForecastStrip from "./ForecastStrip";

const TYPE_LABELS = {
  romantic: "♁ Romantic",
  family: "♁ Family",
  platonic: "♁ Platonic",
  professional: "♁ Professional",
};
const RISK_COLORS = { low: "#4a7a5a", moderate: "#c9a03a", high: "#7a3a3a" };

export default function ConnectionsList({ connections, forecasts, onDelete }) {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  function toggle(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }
  return (
    <List>
      {connections.map((connection) => {
        const name = connection.manualProfile?.name || "Platform User";
        const forecast = forecasts[connection._id];
        const mismatch = forecast?.[0]?.mismatchRisk;
        const isExpanded = expanded === connection._id;
        return (
          <ConnectionCard key={connection._id}>
            <CardHeader onClick={() => toggle(connection._id)}>
              <CardLeft>
                <ConnectionGlyph>{SYMBOLS.star}</ConnectionGlyph>
                <CardInfo>
                  <ConnectionName>{name}</ConnectionName>
                  <ConnectionMeta>
                    <TypeBadge>{TYPE_LABELS[connection.type]}</TypeBadge>
                    {mismatch && (
                      <RiskBadge $risk={mismatch}>{mismatch} risk</RiskBadge>
                    )}
                  </ConnectionMeta>
                </CardInfo>
              </CardLeft>
              <ExpandToggle>{isExpanded ? "↑" : "↓"}</ExpandToggle>
            </CardHeader>
            {isExpanded && (
              <CardBody>
                {forecast && <ForecastStrip forecast={forecast} />}
                <CardActions>
                  <ActionLink
                    onClick={() => navigate(`/compatibility/${connection._id}`)}
                  >
                    View full report {SYMBOLS.star}
                  </ActionLink>
                  <DeleteButton onClick={() => onDelete(connection._id)}>
                    Remove
                  </DeleteButton>
                </CardActions>
              </CardBody>
            )}
          </ConnectionCard>
        );
      })}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
const ConnectionCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;
const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;
const ConnectionGlyph = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.accentDim};
  flex-shrink: 0;
`;
const CardInfo = styled.div`
  min-width: 0;
`;
const ConnectionName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ConnectionMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;
const TypeBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;
const RiskBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $risk }) => RISK_COLORS[$risk]}22;
  color: ${({ $risk }) => RISK_COLORS[$risk]};
  border: 1px solid ${({ $risk }) => RISK_COLORS[$risk]}44;
  text-transform: capitalize;
  white-space: nowrap;
`;
const ExpandToggle = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing.md};
`;
const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;
const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
const ActionLink = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.accent};
  min-height: unset;
  &:hover {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;
const DeleteButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;
