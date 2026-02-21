import React from "react";
import styled from "styled-components";
import { bp } from "../../theme/theme";

const ENERGY_COLORS = {
  rising: "#4a7a5a",
  peak: "#6a9a7a",
  dipping: "#c9a03a",
  low: "#7a3a3a",
};

const Strip = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${(props) => props.theme.spacing.md};
  }

  @media (min-width: ${bp.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MonthBlock = styled.div`
  background: ${(props) =>
    props.$current ? props.theme.colors.bgElevated : props.theme.colors.bg};
  border: 1px solid
    ${(props) =>
      props.$current
        ? props.theme.colors.borderLight
        : props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  padding: ${(props) => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.md};
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const MonthLabel = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const EnergyRow = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const EnergyPill = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${(props) => props.theme.radius.round};
  background: ${(props) => ENERGY_COLORS[props.$level]}22;
  color: ${(props) => ENERGY_COLORS[props.$level]};
  border: 1px solid ${(props) => ENERGY_COLORS[props.$level]}44;
`;

const RiskLine = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  text-transform: capitalize;
  color: ${(props) => {
    switch (props.$risk) {
      case "low":
        return props.theme.colors.success;
      case "moderate":
        return props.theme.colors.warning;
      case "high":
        return props.theme.colors.danger;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

const Recommendation = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.5;
  font-style: italic;
  border-top: 1px solid ${(props) => props.theme.colors.border};
  padding-top: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

export default function ForecastStrip({ forecast }) {
  if (!forecast || !forecast.length) return null;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <Strip>
      {forecast.map((month, index) => {
        const isCurrent =
          month.month === currentMonth && month.year === currentYear;
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return (
          <MonthBlock key={index} $current={isCurrent}>
            <MonthLabel>
              {monthNames[month.month - 1]} {month.year}
            </MonthLabel>

            <EnergyRow>
              <EnergyPill $level={month.userA.energyLevel}>
                You: {month.userA.energyLevel}
              </EnergyPill>
              <EnergyPill $level={month.userB.energyLevel}>
                Them: {month.userB.energyLevel}
              </EnergyPill>
            </EnergyRow>

            <RiskLine $risk={month.mismatchRisk}>
              Risk: {month.mismatchRisk}
            </RiskLine>

            {month.recommendations && month.recommendations[0] && (
              <Recommendation>{month.recommendations[0]}</Recommendation>
            )}
          </MonthBlock>
        );
      })}
    </Strip>
  );
}
