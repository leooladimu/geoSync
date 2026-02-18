import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS } from "../theme";
import api from "../utils/api";
import StepBirthData from "../components/onboarding/StepBirthData";
import StepSurvey from "../components/onboarding/StepSurvey";
import StepReview from "../components/onboarding/StepReview";

const STEPS = [
  { number: 1, label: "Origin" },
  { number: 2, label: "Nature" },
  { number: 3, label: "Profile" },
];
const EMPTY = {
  dob: "",
  birthLocation: { city: "", state: "", country: "" },
  survey: {
    openness: "",
    stressResponse: "",
    socialSeason: "",
    conflictStyle: "",
  },
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, markProfileComplete } = useAuth();
  function updateForm(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }
  function updateSurvey(patch) {
    setForm((prev) => ({ ...prev, survey: { ...prev.survey, ...patch } }));
  }
  function next() {
    setError(null);
    setStep((s) => s + 1);
  }
  function back() {
    setError(null);
    setStep((s) => s - 1);
  }
  async function submit() {
    setLoading(true);
    setError(null);
    try {
      await api.post("/profile", form, token);
      markProfileComplete();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Page>
      <Inner>
        <Header>
          <Logo>{SYMBOLS.earth} geoSync</Logo>
          <ProgressTrack>
            <ProgressFill style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </ProgressTrack>
          <StepLabels>
            {STEPS.map((s) => (
              <StepLabel
                key={s.number}
                $active={s.number === step}
                $done={s.number < step}
              >
                {s.number < step ? "✦" : s.number} {s.label}
              </StepLabel>
            ))}
          </StepLabels>
        </Header>
        <Body>
          {step === 1 && (
            <StepBirthData values={form} onChange={updateForm} onNext={next} />
          )}
          {step === 2 && (
            <StepSurvey
              values={form.survey}
              onChange={updateSurvey}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <StepReview
              form={form}
              onSubmit={submit}
              onBack={back}
              loading={loading}
              error={error}
            />
          )}
        </Body>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;
const Inner = styled.div`
  width: 100%;
  max-width: 560px;
`;
const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;
const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;
const ProgressTrack = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;
  transition: width ${({ theme }) => theme.transitions.slow};
`;
const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StepLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $active, $done }) =>
    $done
      ? theme.colors.accent
      : $active
        ? theme.colors.textPrimary
        : theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
`;
const Body = styled.div`
  width: 100%;
`;
