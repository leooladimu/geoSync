import React, { useState } from "react";
import styled from "styled-components";
import { SYMBOLS } from "../../theme/theme";
import { api } from "../../utils/api";

// The three dimensions users can meaningfully self-assess
const DIMENSIONS = [
  {
    key: "chronotype",
    label: "Daily Rhythm",
    glyph: "☉\uFE0E",
    question:
      "Left to your own schedule — no alarms, no obligations — when do you naturally wake up and feel most alive?",
    note: "Answer for your natural state, not your current schedule.",
    options: [
      {
        value: "lark",
        label: "Morning",
        description: "Awake before 7am naturally. Peak energy before noon.",
      },
      {
        value: "neutral",
        label: "Middle",
        description: "No strong preference. Functional across the day.",
      },
      {
        value: "owl",
        label: "Evening",
        description: "Come alive after 9pm. Mornings are a tax.",
      },
    ],
  },
  {
    key: "stressBaseline",
    label: "Under Pressure",
    glyph: "♁\uFE0E",
    question:
      "When something genuinely threatens something you care about — a relationship, a job, your sense of safety — what happens first?",
    note: "Think of a real moment. Not what you wish you did — what you actually did.",
    options: [
      {
        value: "freeze",
        label: "Go quiet",
        description:
          "Withdraw. Go internal. Need space before you can respond.",
      },
      {
        value: "expand",
        label: "Problem-solve",
        description:
          "Immediately look for what can be done. Discomfort drives action.",
      },
      {
        value: "fight-flight",
        label: "React",
        description:
          "Respond immediately — emotionally, physically, verbally. Deal with it later.",
      },
    ],
  },
  {
    key: "socialSeason",
    label: "Social Energy",
    glyph: "♈\uFE0E",
    question:
      "Which season do you actually feel most open, most yourself, most willing to let people in?",
    note: "Not when you're busiest or most productive — when you feel most socially alive.",
    options: [
      {
        value: "spring",
        label: "♈\uFE0E Spring",
        description:
          "Something thaws. You want to reconnect, start things, be seen.",
      },
      {
        value: "summer",
        label: "♋\uFE0E Summer",
        description: "Expansive. High capacity. You want people around you.",
      },
      {
        value: "fall",
        label: "♎\uFE0E Fall",
        description:
          "Deeper, slower connections. You prefer intimacy over volume.",
      },
      {
        value: "winter",
        label: "♑\uFE0E Winter",
        description:
          "Selective and internal. You protect your energy carefully.",
      },
    ],
  },
];

const CONFIDENCE_LABELS = {
  confirmed: "Confirmed by you",
  adjusted: "Adjusted by you",
  derived: "Derived from birth data",
};

const CONFIDENCE_COLORS = {
  confirmed: "#4a7a5a",
  adjusted: "#c9a03a",
  derived: "#5c5854",
};

export default function ProfileCalibration({ profile, token, onUpdated }) {
  const [step, setStep] = useState(0); // 0 = overview, 1-3 = dimension steps
  const [answers, setAnswers] = useState(() => {
    // Pre-populate from existing calibration if present
    const adj = profile.userAdjustments || {};
    return {
      chronotype: adj.chronotype || null,
      stressBaseline: adj.stressBaseline || null,
      socialSeason: adj.socialSeason || null,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const derived = profile.derived;
  const adj = profile.userAdjustments || {};
  const dim = DIMENSIONS[step - 1];

  async function save() {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.patch(
        "/profile/calibration",
        { userAdjustments: answers },
        token,
      );
      setDone(true);
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Overview — show all three derived values with confirm/review options
  if (step === 0) {
    return (
      <Wrapper>
        <Header>
          <HeaderGlyph>{SYMBOLS.star}</HeaderGlyph>
          <HeaderText>
            <HeaderTitle>Calibrate Your Profile</HeaderTitle>
            <HeaderSubtitle>
              Your profile was derived from birth data and your survey answers.
              Self-knowledge is data too — if something doesn't fit, you can
              adjust it.
            </HeaderSubtitle>
          </HeaderText>
        </Header>

        <DimensionList>
          {DIMENSIONS.map((d, i) => {
            const derivedVal = derived[d.key];
            const adjustedVal = adj[d.key];
            const status = adjustedVal
              ? adjustedVal === derivedVal
                ? "confirmed"
                : "adjusted"
              : "derived";
            const displayVal = adjustedVal || derivedVal;
            const option = d.options.find((o) => o.value === displayVal);

            return (
              <DimensionRow key={d.key}>
                <DimLeft>
                  <DimGlyph>{d.glyph}</DimGlyph>
                  <DimInfo>
                    <DimLabel>{d.label}</DimLabel>
                    <DimValue>{option?.label || displayVal}</DimValue>
                    <DimStatus $status={status}>
                      {CONFIDENCE_LABELS[status]}
                    </DimStatus>
                  </DimInfo>
                </DimLeft>
                <ReviewButton onClick={() => setStep(i + 1)}>
                  {status === "derived" ? "Review" : "Change"}
                </ReviewButton>
              </DimensionRow>
            );
          })}
        </DimensionList>

        {done && (
          <SuccessNote>
            {SYMBOLS.star} Profile updated. Compatibility reports will reflect
            your calibration.
          </SuccessNote>
        )}
        {error && <ErrorNote>{error}</ErrorNote>}
      </Wrapper>
    );
  }

  // Individual dimension step
  const currentAnswer = answers[dim.key];
  const derivedAnswer = derived[dim.key];
  const mismatch = currentAnswer && currentAnswer !== derivedAnswer;

  return (
    <Wrapper>
      <StepBack onClick={() => setStep(0)}>← All dimensions</StepBack>

      <StepHeader>
        <StepGlyph>{dim.glyph}</StepGlyph>
        <StepLabel>{dim.label}</StepLabel>
      </StepHeader>

      <Question>{dim.question}</Question>
      <Note>{dim.note}</Note>

      <Options>
        {dim.options.map((opt) => {
          const isDerived = opt.value === derivedAnswer;
          const isSelected = opt.value === currentAnswer;
          return (
            <Option
              key={opt.value}
              $selected={isSelected}
              $derived={isDerived && !isSelected}
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [dim.key]: opt.value }))
              }
            >
              <OptionTop>
                <OptionLabel>{opt.label}</OptionLabel>
                <OptionTags>
                  {isDerived && <Tag $type="derived">birth data says this</Tag>}
                  {isSelected && !isDerived && (
                    <Tag $type="user">your answer</Tag>
                  )}
                  {isSelected && isDerived && (
                    <Tag $type="confirmed">confirmed</Tag>
                  )}
                </OptionTags>
              </OptionTop>
              <OptionDesc>{opt.description}</OptionDesc>
            </Option>
          );
        })}
      </Options>

      {mismatch && (
        <MismatchNote>
          <MismatchGlyph>{SYMBOLS.star}</MismatchGlyph>
          <MismatchText>
            Your answer differs from what your birth data suggests. That's fine
            — decades of schedule, genetics, and self-knowledge all count. Your
            answer will take precedence in compatibility scoring.
          </MismatchText>
        </MismatchNote>
      )}

      <StepFooter>
        <SaveButton
          onClick={async () => {
            await save();
            setStep(0);
          }}
          disabled={!currentAnswer || loading}
        >
          {loading ? "Saving..." : "Save & Return"}
        </SaveButton>
      </StepFooter>

      {error && <ErrorNote>{error}</ErrorNote>}
    </Wrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;
const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;
const HeaderGlyph = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 2px;
`;
const HeaderText = styled.div``;
const HeaderTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const DimensionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
const DimensionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;
const DimLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
const DimGlyph = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.accent};
`;
const DimInfo = styled.div``;
const DimLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const DimValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 2px 0;
`;
const DimStatus = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $status }) => CONFIDENCE_COLORS[$status]};
  font-style: italic;
`;
const ReviewButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  white-space: nowrap;
  min-height: unset;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

// Step view
const StepBack = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  align-self: flex-start;
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
const StepGlyph = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
`;
const StepLabel = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Question = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`;
const Note = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const Option = styled.div`
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentDim : theme.colors.bgElevated};
  border: 1px solid
    ${({ theme, $selected, $derived }) =>
      $selected
        ? theme.colors.accent
        : $derived
          ? theme.colors.accentDim
          : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const OptionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
const OptionLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const OptionTags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;
const TAG_COLORS = {
  derived: "#7a4d22",
  user: "#c9a03a",
  confirmed: "#4a7a5a",
};
const Tag = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $type }) => TAG_COLORS[$type]}22;
  color: ${({ $type }) => TAG_COLORS[$type]};
  border: 1px solid ${({ $type }) => TAG_COLORS[$type]}44;
`;
const OptionDesc = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const MismatchNote = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bgElevated};
  border-left: 2px solid ${({ theme }) => theme.colors.warning};
  border-radius: 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
`;
const MismatchGlyph = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  flex-shrink: 0;
`;
const MismatchText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const StepFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const SaveButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentLight};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
const SuccessNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.success};
  font-style: italic;
`;
const ErrorNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
`;
