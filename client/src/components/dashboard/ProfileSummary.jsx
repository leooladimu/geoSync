import React, { useState } from "react";
import styled from "styled-components";
import { SEASON_SYMBOLS, SYMBOLS, bp } from "../../theme/theme";
import ProfileCalibration from "./ProfileCalibration";

const LIGHT_LABELS = {
  "high-light": "High-Light Profile",
  "low-light": "Low-Light Profile",
};
const CHRONO_LABELS = {
  lark: "Morning Lark",
  owl: "Night Owl",
  neutral: "Neutral Chronotype",
};
const STRESS_LABELS = {
  freeze: "Freeze & Protect",
  expand: "Expand & Adapt",
  "fight-flight": "Fight or Flight",
};
const NEURO_COLORS = {
  high: "#4a7a5a",
  moderate: "#c9a03a",
  low: "#7a4a3a",
};

function monthName(n) {
  return [
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
  ][n - 1];
}

// Returns 'confirmed' | 'adjusted' | 'derived'
function calibrationStatus(derived, adjusted) {
  if (!adjusted) return "derived";
  return adjusted === derived ? "confirmed" : "adjusted";
}

const STATUS_COLORS = {
  confirmed: "#4a7a5a",
  adjusted: "#c9a03a",
  derived: "transparent",
};
const STATUS_LABELS = {
  confirmed: "confirmed by you",
  adjusted: "adjusted by you",
  derived: "",
};

export default function ProfileSummary({ profile, token, onProfileUpdated }) {
  const [showCalibration, setShowCalibration] = useState(false);
  const { derived, dob, birthLocation, userAdjustments } = profile;
  const adj = userAdjustments || {};

  // Use calibrated values where present
  const chronotype = adj.chronotype || derived.chronotype;
  const stressBaseline = adj.stressBaseline || derived.stressBaseline;

  const chronoStatus = calibrationStatus(derived.chronotype, adj.chronotype);
  const stressStatus = calibrationStatus(
    derived.stressBaseline,
    adj.stressBaseline,
  );
  const socialStatus = calibrationStatus(
    derived.socialSeason,
    adj.socialSeason,
  );

  const anyCalibrated =
    chronoStatus !== "derived" ||
    stressStatus !== "derived" ||
    socialStatus !== "derived";
  const seasonSymbol = SEASON_SYMBOLS[derived.season];
  const dobYear = new Date(dob).getFullYear();

  return (
    <Wrapper>
      <Card>
        <CardTop>
          <SeasonGlyph>{seasonSymbol}</SeasonGlyph>
          <CardTopText>
            <ProfileName>Your Biophysical Profile</ProfileName>
            <ProfileMeta>
              {birthLocation.city}
              {birthLocation.state ? `, ${birthLocation.state}` : ""} · {dobYear}{" "}
              · <SeasonLabel>{derived.season}</SeasonLabel>
            </ProfileMeta>
          </CardTopText>
          <CalibrateButton onClick={() => setShowCalibration((p) => !p)}>
            {showCalibration ? "Done" : anyCalibrated ? "Recalibrate" : "Calibrate"}
          </CalibrateButton>
        </CardTop>

        <Traits>
          <Trait>
            <TraitLabelRow>
              <TraitLabel>Light Profile</TraitLabel>
            </TraitLabelRow>
            <TraitValue>{LIGHT_LABELS[derived.lightProfile]}</TraitValue>
          </Trait>

          <Trait $status={chronoStatus}>
            <TraitLabelRow>
              <TraitLabel>Chronotype</TraitLabel>
              {chronoStatus !== "derived" && (
                <StatusDot $status={chronoStatus} title={STATUS_LABELS[chronoStatus]} />
              )}
            </TraitLabelRow>
            <TraitValue>{CHRONO_LABELS[chronotype]}</TraitValue>
            {chronoStatus === "adjusted" && (
              <TraitNote>derived: {CHRONO_LABELS[derived.chronotype]}</TraitNote>
            )}
          </Trait>

          <Trait $status={stressStatus}>
            <TraitLabelRow>
              <TraitLabel>Stress Response</TraitLabel>
              {stressStatus !== "derived" && (
                <StatusDot $status={stressStatus} title={STATUS_LABELS[stressStatus]} />
              )}
            </TraitLabelRow>
            <TraitValue>{STRESS_LABELS[stressBaseline]}</TraitValue>
            {stressStatus === "adjusted" && (
              <TraitNote>derived: {STRESS_LABELS[derived.stressBaseline]}</TraitNote>
            )}
          </Trait>

          <Trait>
            <TraitLabelRow>
              <TraitLabel>Vulnerability Window</TraitLabel>
            </TraitLabelRow>
            <TraitValue>
              {monthName(derived.vulnerabilityWindow.startMonth)}–
              {monthName(derived.vulnerabilityWindow.endMonth)}
            </TraitValue>
          </Trait>
        </Traits>

        <NeuroRow>
          <NeuroItem>
            <NeuroLabel>Dopamine</NeuroLabel>
            <NeuroBadge $level={derived.neurotransmitters.dopamine}>
              {derived.neurotransmitters.dopamine}
            </NeuroBadge>
          </NeuroItem>
          <NeuroItem>
            <NeuroLabel>Serotonin</NeuroLabel>
            <NeuroBadge $level={derived.neurotransmitters.serotonin}>
              {derived.neurotransmitters.serotonin}
            </NeuroBadge>
          </NeuroItem>
          {anyCalibrated && (
            <CalibrationNote>
              {SYMBOLS.star} Some dimensions calibrated from your experience
            </CalibrationNote>
          )}
        </NeuroRow>
      </Card>

      {showCalibration && (
        <ProfileCalibration
          profile={profile}
          token={token}
          onUpdated={(updated) => {
            onProfileUpdated(updated);
            setShowCalibration(false);
          }}
        />
      )}
    </Wrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${bp.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.radius.xl};
  }

  @media (min-width: ${bp.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;
const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (min-width: ${bp.md}) {
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;
const SeasonGlyph = styled.div`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;

  @media (min-width: ${bp.md}) {
    font-size: 2.5rem;
  }
`;
const CardTopText = styled.div`
  flex: 1;
  min-width: 0;
`;
const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: ${bp.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  @media (min-width: ${bp.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;
const ProfileMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
const SeasonLabel = styled.span`
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const CalibrateButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  white-space: nowrap;
  min-height: unset;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const Traits = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${bp.sm}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;
const Trait = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $status }) =>
      $status === "adjusted"
        ? theme.colors.warning + "66"
        : $status === "confirmed"
          ? theme.colors.success + "66"
          : "transparent"};
`;
const TraitLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
const TraitLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;
const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_COLORS[$status]};
  flex-shrink: 0;
`;
const TraitValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const TraitNote = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  margin-top: 2px;
`;

const NeuroRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.lg};
    flex-wrap: wrap;
    align-items: center;
  }
`;
const NeuroItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const NeuroLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;
const NeuroBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-family: ${({ theme }) => theme.fonts.mono};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $level }) => NEURO_COLORS[$level]}22;
  color: ${({ $level }) => NEURO_COLORS[$level]};
  border: 1px solid ${({ $level }) => NEURO_COLORS[$level]}44;
`;
const CalibrationNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  margin-left: 0;

  @media (min-width: ${bp.md}) {
    margin-left: auto;
  }
`;
