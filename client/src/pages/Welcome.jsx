import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SYMBOLS, bp } from "../theme/theme";

const Container = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.xl};
  }
`;

const Content = styled.div`
  max-width: 480px;
  width: 100%;
  text-align: center;
`;

const TopGlyph = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.accent};
  margin-bottom: ${(props) => props.theme.spacing.md};
  line-height: 1;

  @media (min-width: ${bp.md}) {
    font-size: 3.5rem;
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.fonts.display};
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.md};
  letter-spacing: -0.02em;

  @media (min-width: ${bp.md}) {
    font-size: 3.5rem;
    margin-bottom: ${(props) => props.theme.spacing.lg};
  }
`;

const Tagline = styled.p`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.lg};
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.accent};
  font-size: ${(props) => props.theme.fontSizes.xs};

  @media (min-width: ${bp.md}) {
    margin-bottom: ${(props) => props.theme.spacing.xl};
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

const FeatureList = styled.ul`
  text-align: left;
  margin: ${(props) => props.theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    margin: ${(props) => props.theme.spacing.xl} 0;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSizes.xs};
  line-height: 1.6;

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

const FeatureIcon = styled.span`
  font-size: ${(props) => props.theme.fontSizes.md};
  flex-shrink: 0;

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.md};
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const PrimaryButton = styled(Link)`
  display: block;
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.bg};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: 600;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.radius.lg};
  text-decoration: none;
  text-align: center;
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.md};
    padding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.xl};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.accentLight};
  }
`;

const SecondaryButton = styled(Link)`
  display: block;
  background-color: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: 500;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.lg};
  text-decoration: none;
  text-align: center;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    border-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.accent};
  }
`;

const Footer = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textMuted};
  font-style: italic;
  line-height: 1.6;
`;

export default function Welcome() {
  return (
    <Container>
      <Content>
        <TopGlyph>{SYMBOLS.earth}</TopGlyph>

        <Title>geoSync</Title>

        <Tagline>
          Your relationships, read through the lens of when and where you began.
        </Tagline>

        <Stars>
          <span>{SYMBOLS.star}</span>
          <span>{SYMBOLS.star}</span>
          <span>{SYMBOLS.star}</span>
        </Stars>

        <FeatureList>
          <Feature>
            <FeatureIcon>{SYMBOLS.star}</FeatureIcon>
            <span>
              <strong>No astrology.</strong> We use birth location, season, and
              biophysical patterns to generate your profile.
            </span>
          </Feature>
          <Feature>
            <FeatureIcon>{SYMBOLS.moon}</FeatureIcon>
            <span>
              <strong>Three-dimensional compatibility.</strong> Chronotype sync,
              stress response patterns, and seasonal vulnerability windows.
            </span>
          </Feature>
          <Feature>
            <FeatureIcon>{SYMBOLS.sun}</FeatureIcon>
            <span>
              <strong>Seasonal forecasting.</strong> Know when your relationship
              will thrive and when it needs extra support.
            </span>
          </Feature>
        </FeatureList>

        <ButtonGroup>
          <PrimaryButton to="/register">Get Started</PrimaryButton>
          <SecondaryButton to="/login">Sign In</SecondaryButton>
        </ButtonGroup>

        <Footer>
          Built on chronobiology, environmental epigenetics, and geomagnetic
          research — not astrology.
        </Footer>
      </Content>
    </Container>
  );
}
