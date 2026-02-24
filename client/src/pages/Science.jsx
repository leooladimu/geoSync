import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SYMBOLS } from "../theme/theme";
import { useAuth } from "../hooks/useAuth";

const SECTIONS = [
  {
    glyph: "☉\uFE0E",
    id: "chronobiology",
    title: "Chronobiology",
    subtitle: "The science of biological time",
    summary:
      "Your body runs on multiple clocks. Understanding them is the foundation of compatibility.",
    body: [
      "Every cell in your body contains molecular clocks that regulate when hormones are released, when neurotransmitters peak, and when your metabolism shifts gears. These clocks are set partially by genetics, partially by light exposure, and partially by the photoperiod — the ratio of daylight to darkness — during your early development.",
      "The key insight for relationships: people with similar chronotypes experience the world in synchrony. They wake up at similar energy levels, peak together, and wind down together. People with opposing chronotypes are essentially living in different time zones while sharing the same physical space. This creates friction not because either person is wrong, but because their biological realities are out of phase.",
      "Chronotype isn't about preference. It's about the actual circadian phase of your biological systems. An owl forced to wake at 6am is experiencing what researchers call 'social jetlag' — a chronic misalignment between their biological clock and social obligations. Over time, this creates cumulative stress that affects mood, cognition, and relationship capacity.",
    ],
    citations: [
      "Roenneberg, T. (2012). Internal Time: Chronotypes, Social Jet Lag, and Why You're So Tired. Harvard University Press.",
      "Foster, R.G. & Kreitzman, L. (2017). Circadian Rhythms: A Very Short Introduction. Oxford University Press.",
    ],
  },
  {
    glyph: "♁\uFE0E",
    id: "stress-response",
    title: "Stress Response Patterns",
    subtitle: "How threat reorganizes the nervous system",
    summary:
      "Under genuine threat, people don't become better versions of themselves. They become more themselves.",
    body: [
      "When something you care about is genuinely threatened, your nervous system executes pre-programmed response patterns before conscious thought enters the equation. These patterns — freeze, expand/problem-solve, or fight/flight — are shaped by genetics, early environment, and repeated experience. They're not character flaws or virtues. They're biological defaults.",
      "The freeze response (withdrawal, going internal, needing space) is often misread as avoidance or coldness. The expand response (immediate problem-solving, discomfort driving action) is often misread as controlling or insensitive. The fight/flight response (immediate emotional or physical reaction) is often misread as aggression or volatility. In all cases, the misreading creates secondary conflict on top of the original stress.",
      "Compatibility in stress response isn't about matching. It's about complementarity that creates coverage rather than collision. Two freezers may avoid necessary confrontation. Two fighters may escalate unnecessarily. But a freezer paired with someone who can hold ground without forcing engagement — that's protective coverage. The key is knowing what you each do under pressure, and building explicit protocols for those moments.",
    ],
    citations: [
      "Porges, S.W. (2011). The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-Regulation. W. W. Norton & Company.",
      "Levine, P.A. (2010). In an Unspoken Voice: How the Body Releases Trauma and Restores Goodness. North Atlantic Books.",
    ],
  },
  {
    glyph: "♈\uFE0E",
    id: "seasonal-imprinting",
    title: "Seasonal Imprinting",
    subtitle: "Why birth season matters more than astrology",
    summary:
      "The photoperiod during your first months of life leaves a persistent signature on your neurobiology.",
    body: [
      "During early development, the ratio of daylight to darkness you experience helps calibrate your developing stress response systems and neurotransmitter baselines. This isn't mystical. It's the same mechanism that sets migration patterns in birds and breeding cycles in mammals — environmental cues shaping biology during critical developmental windows.",
      "Spring and summer births, with their longer photoperiods, correlate with different developmental trajectories than fall and winter births. The effect sizes are modest at the individual level, but they're consistent across large populations. More importantly, they interact with latitude: the seasonal effect is stronger at higher latitudes where photoperiod variation is more extreme.",
      "For relationships, the relevant insight is about vulnerability timing. People tend to have predictable seasonal patterns in their energy, sociability, and resilience. When two people's vulnerability windows overlap — when both are in low-energy, high-stress periods simultaneously — that's when relationships face their hardest tests. Knowing these patterns in advance allows for preparation rather than surprise.",
    ],
    citations: [
      "Torrey, E.F. et al. (1997). Seasonality of births in schizophrenia and bipolar disorder. Schizophrenia Research.",
      "Disanto, G. et al. (2016). Month of birth, vitamin D and risk of immune-mediated disease. BMC Medicine.",
    ],
  },
  {
    glyph: "☽\uFE0E",
    id: "entrainment",
    title: "Behavioral Entrainment",
    subtitle: "Why you might not match your birth data",
    summary:
      "Decades of external schedule can rewire a biological default — and that rewiring is real.",
    body: [
      "The human circadian system is plastic, not fixed. While the photoperiodic imprint at birth sets a baseline, sustained environmental cues — light exposure, meal timing, social schedules, exercise — can shift the expressed chronotype significantly over years and decades.",
      "This is called behavioral entrainment: the process by which your biological clock synchronizes to external time cues. A natural night owl who has worked early shifts for fifteen years may have genuinely entrained to an earlier rhythm. The original imprint still exists at the level of gene expression, but the expressed behavior may have moved substantially toward the imprint's opposite.",
      "A useful mental model: your birth profile is your hardware default. Behavioral entrainment is a persistent software setting that overrides the default while it's maintained. Neither is more 'real' — they operate at different levels. The practical implication is that when the external schedule is removed (retirement, extended leave, sabbatical), many people find themselves drifting back toward their biological default, sometimes to their own surprise.",
      "This is why geoSync includes a calibration step. If your lived experience consistently contradicts what your birth data predicts, your lived experience is the more relevant data point for relationship compatibility purposes. You interact with people from your current expressed state, not your theoretical biological baseline.",
    ],
    citations: [
      "Roenneberg, T. et al. (2012). Social jetlag and obesity. Current Biology.",
      "Wittmann, M. et al. (2006). Social jetlag: misalignment of biological and social time. Chronobiology International.",
      "Monk, T.H. et al. (2000). The relationship of chronotype to sleep duration and sleepiness. Chronobiology International.",
    ],
  },
  {
    glyph: "♁\uFE0E",
    id: "selfknowledge",
    title: "Self-Knowledge as Data",
    subtitle: "When your experience should override the model",
    summary:
      "Population correlations are starting hypotheses. Your consistent self-report is evidence.",
    body: [
      "Every derived profile in geoSync is a Bayesian prior: a prediction based on what is statistically likely given your birth data. Like any prior, it should be updated when evidence contradicts it.",
      "Consistent, cross-context self-knowledge is strong evidence. If you have always understood yourself as a morning person — not occasionally, not when circumstances require it, but as a stable feature of your identity across decades and contexts — that consistency is more reliable than a population-level correlation. The correlation describes what is probable; your experience describes what is actual, at least for you.",
      "The situations where birth data is most likely to be misleading: chronotype in people with more than ten years of externally-structured early schedules; stress response in people who have done significant therapeutic or developmental work around their default patterns; social season in people who have lived in climates dramatically different from their birth latitude.",
      "The situations where birth data is most likely to be accurate despite contradicting self-report: stress response under genuine threat (not day-to-day stress, but the kind that bypasses the frontal lobe); chronotype during extended periods of unconstrained schedule; social energy in the month before and after your vulnerability window.",
      "The calibration feature in geoSync is not an invitation to override the model because you dislike what it says. It is an invitation to override the model because you have better data. Those are different things, and only you can tell the difference.",
    ],
    citations: [
      "Fleeson, W. (2001). Toward a structure- and process-integrated view of personality. Journal of Personality and Social Psychology.",
      "Vazire, S. & Mehl, M.R. (2008). Knowing me, knowing you: the accuracy and unique predictive validity of self-ratings and other-ratings of daily behavior. Journal of Personality and Social Psychology.",
    ],
  },
  {
    glyph: "♎\uFE0E",
    id: "limits",
    title: "The Limits of This Approach",
    subtitle: "What geoSync cannot do",
    summary:
      "Biological compatibility is a real phenomenon, but it's not destiny.",
    body: [
      "geoSync is designed to help you understand pattern-level compatibility: the kinds of friction and flow that tend to emerge when two specific biological profiles interact. It is not designed to predict whether a relationship will succeed, whether you should stay or leave, or whether someone is 'right' for you.",
      "The model says nothing about values, life goals, communication skills, or the willingness to grow and adapt. These factors often override biological friction. Two people with chronotype conflict and opposing stress responses can build excellent relationships if they have explicit protocols, mutual respect, and shared purpose. Conversely, two people with perfect biological compatibility can destroy each other through dishonesty, contempt, or incompatible life goals.",
      "Use this tool as a map of likely terrain, not as a verdict. The couples who struggle aren't the incompatible ones. They're the ones who don't know they're incompatible — who keep trying to operate as if their patterns match when they don't, who blame each other for biological differences that are nobody's fault.",
      "The goal isn't to find someone whose profile matches yours. The goal is to understand the specific kind of mismatch you have, if you have one, and build protocols that protect both of you from its predictable pitfalls. That's work you can do. But you can't do it if you don't know what you're working with.",
    ],
    citations: [
      "Gottman, J.M. & Silver, N. (2015). The Seven Principles for Making Marriage Work. Harmony Books.",
      "Johnson, S.M. (2008). Hold Me Tight: Seven Conversations for a Lifetime of Love. Little, Brown and Company.",
    ],
  },
];

const ExpandIcon = styled.span`
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.accent};
  cursor: pointer;
  user-select: none;
  padding: ${(props) => props.theme.spacing.sm};
  transition: transform ${(props) => props.theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }
`;

const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardContent = styled.div`
  animation: fadeIn ${(props) => props.theme.transitions.normal} ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default function Science() {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const { token } = useAuth();

  // Determine where to link based on auth state
  const homeLink = token ? "/dashboard" : "/welcome";

  const toggleCard = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <Container>
      <TopBar>
        <BackLink to={homeLink}>← {token ? "Dashboard" : "Home"}</BackLink>
        <Logo to={homeLink}>{SYMBOLS.earth} geoSync</Logo>
      </TopBar>

      <Header>
        <HeaderGlyph>{SYMBOLS.star}</HeaderGlyph>
        <HeaderText>
          <Title>The Science Behind geoSync</Title>
          <Subtitle>
            Biophysical relationship compatibility based on chronobiology, not
            astrology
          </Subtitle>
        </HeaderText>
      </Header>

      <Intro>
        <p>
          geoSync analyzes relationship compatibility through three biophysical
          dimensions: chronotype (daily energy rhythms), stress response
          (nervous system patterns under threat), and seasonal vulnerability
          (predictable energy cycles throughout the year).
        </p>
        <p>
          These patterns are grounded in research from circadian biology,
          psychophysiology, and environmental epidemiology. They describe
          tendencies, not destinies — probabilities, not verdicts.
        </p>
      </Intro>

      <SectionGrid>
        {SECTIONS.map((section, index) => {
          const isExpanded = expandedCards.has(index);

          return (
            <SectionCard key={section.id}>
              <CardHeader>
                <CardHeaderRow>
                  <div
                    style={{
                      display: "flex",
                      gap: (props) => props.theme.spacing.md,
                      alignItems: "flex-start",
                    }}
                  >
                    <CardGlyph>{section.glyph}</CardGlyph>
                    <CardTitleArea>
                      <CardTitle>{section.title}</CardTitle>
                      <CardSubtitle>{section.subtitle}</CardSubtitle>
                    </CardTitleArea>
                  </div>
                  <ExpandIcon onClick={() => toggleCard(index)}>
                    {isExpanded ? "−" : "+"}
                  </ExpandIcon>
                </CardHeaderRow>
              </CardHeader>

              <CardSummary>{section.summary}</CardSummary>

              {isExpanded && (
                <CardContent>
                  <CardBody>
                    {section.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </CardBody>

                  <CardCitations>
                    {section.citations.map((cite, i) => (
                      <Cite key={i}>{cite}</Cite>
                    ))}
                  </CardCitations>
                </CardContent>
              )}
            </SectionCard>
          );
        })}
      </SectionGrid>

      <Footer>
        <FooterText>
          This is a living document. Research in chronobiology and relationship
          science continues to evolve, and geoSync updates accordingly.
        </FooterText>
      </Footer>
    </Container>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderGlyph = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;
`;

const HeaderText = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Intro = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SectionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardGlyph = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;
`;

const CardTitleArea = styled.div``;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

const CardSummary = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardBody = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.8;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CardCitations = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Cite = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Footer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;
