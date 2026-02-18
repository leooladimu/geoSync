import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SYMBOLS } from "../theme";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <Page>
      <Inner>
        <Glyph>{SYMBOLS.earth}</Glyph>
        <Title>geoSync</Title>
        <Tagline>
          Your relationships, read through the lens of when and where you began.
        </Tagline>
        <Divider>
          {SYMBOLS.star} {SYMBOLS.star} {SYMBOLS.star}
        </Divider>
        <ButtonGroup>
          <PrimaryButton onClick={() => navigate("/register")}>
            Get Started
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/login")}>
            Sign In
          </SecondaryButton>
        </ButtonGroup>
        <ScienceNote>
          Built on chronobiology, environmental epigenetics, and geomagnetic
          research — not astrology.
        </ScienceNote>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 420px;
`;
const Glyph = styled.div`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;
const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  }
`;
const Tagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;
const Divider = styled.div`
  color: ${({ theme }) => theme.colors.accentDim};
  letter-spacing: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;
const PrimaryButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme }) => theme.colors.accentLight};
  }
`;
const SecondaryButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
const ScienceNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.6;
`;
