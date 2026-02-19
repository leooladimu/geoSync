import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SYMBOLS } from '../theme'

const SECTIONS = [
  {
    glyph: '☉',
    id: 'photoperiodic',
    title: 'Photoperiodic Imprinting',
    subtitle: 'Why birth date matters',
    summary: 'The light cycle present at your birth calibrates your brain\'s master clock for life.',
    body: [
      'Your suprachiasmatic nucleus (SCN) — a cluster of roughly 20,000 neurons in the hypothalamus — functions as your brain\'s master biological clock. It regulates circadian rhythms, hormone release, sleep architecture, and energy cycles across your entire body.',
      'In the days and weeks around birth, the SCN undergoes a critical calibration period during which it locks onto the ambient light cycle. The length of daylight at the time of your birth — whether days were lengthening toward summer or shortening toward winter — sets a baseline photoperiodic "expectation" that persists into adulthood.',
      'This is why spring and early-summer births tend to produce morning-oriented chronotypes (larks), while late-summer and fall births correlate with evening-oriented chronotypes (owls). The SCN calibrated to a different photoperiodic signal.',
      'Research from Vanderbilt University\'s chronobiology group and the work of Till Roenneberg at Ludwig Maximilian University Munich has established robust correlations between birth season and adult chronotype across populations of hundreds of thousands of participants.'
    ],
    citations: [
      'Roenneberg, T. et al. (2007). Epidemiology of the human circadian clock. Sleep Medicine Reviews.',
      'Foster, R.G. & Roenneberg, T. (2008). Human responses to the geophysical daily, annual and lunar cycles. Current Biology.'
    ]
  },
  {
    glyph: '♁',
    id: 'latitude',
    title: 'Latitude & Prenatal Neurodevelopment',
    subtitle: 'Why birth location matters',
    summary: 'Your birth latitude shaped prenatal Vitamin D exposure and HPA-axis wiring.',
    body: [
      'Ultraviolet-B radiation from the sun triggers Vitamin D synthesis in skin. At higher latitudes, UV-B is dramatically reduced — especially in winter — meaning pregnancies at high latitudes involve significantly lower prenatal Vitamin D exposure than those closer to the equator.',
      'Vitamin D is not merely a bone mineral. It functions as a neuroactive steroid, crossing the blood-brain barrier and influencing the development of dopaminergic and serotonergic systems during fetal brain development. Prenatal Vitamin D deficiency has been associated with altered dopamine receptor density and dysregulation of HPA-axis stress response.',
      'The HPA axis (hypothalamic-pituitary-adrenal axis) governs your cortisol response to stress. Its baseline sensitivity — whether you tend to mobilize stress hormones quickly and intensely or slowly and moderately — is partially set during fetal development and early childhood. High-latitude births are associated with a more sensitized HPA response, which in adults often presents as what we call a "freeze" stress pattern: withdrawal, hypervigilance, and heightened threat sensitivity.',
      'This is the biological mechanism behind the latitude tier in your profile. It is not deterministic — environment, attachment history, and trauma all overlay the prenatal baseline — but it represents a real signal in the data.'
    ],
    citations: [
      'McGrath, J. et al. (2010). Vitamin D and schizophrenia: an update. Expert Reviews in Neurotherapeutics.',
      'Eyles, D.W. et al. (2013). Developmental Vitamin D and brain development. Reviews in the Neurosciences.',
      'Tsigos, C. & Chrousos, G.P. (2002). Hypothalamic-pituitary-adrenal axis, neuroendocrine factors and stress. Journal of Psychosomatic Research.'
    ]
  },
  {
    glyph: '♈',
    id: 'neurotransmitters',
    title: 'Season of Birth & Neurotransmitter Baselines',
    subtitle: 'Why birth season affects mood and motivation',
    summary: 'Birth season correlates with adult dopamine and serotonin receptor density.',
    body: [
      'Serotonin and dopamine are synthesized in the developing brain during gestation, and the enzymes responsible for their production — tryptophan hydroxylase (serotonin) and tyrosine hydroxylase (dopamine) — are sensitive to photoperiod and temperature.',
      'A series of studies from Tromsø University Hospital and the European Neuropsychopharmacology group found measurable differences in serotonin transporter binding and dopamine D2 receptor density across birth seasons. Winter births show lower serotonin transporter availability in adulthood; spring and summer births show higher baseline serotonin signaling.',
      'The practical consequence is that your baseline neurotransmitter profile — not your momentary mood, but your underlying motivational architecture — is partially a function of the neurochemical environment during fetal brain development. This shows up in how readily you seek novelty, how you respond to reward and disappointment, and how your mood modulates across seasons.',
      'This is why geoSync surfaces dopamine and serotonin baselines as descriptors rather than diagnoses. A low dopamine baseline doesn\'t mean something is wrong — it means your motivational system calibrated to a lower-stimulus baseline, which has its own set of advantages and its own set of vulnerabilities in relationships.'
    ],
    citations: [
      'Chotai, J. & Adolfsson, R. (2002). Converging evidence suggests that monoamine neurotransmitter turnover in human adults is associated with their season of birth. European Archives of Psychiatry and Clinical Neuroscience.',
      'Postolache, T.T. et al. (2005). Seasonal variation in mood and behavior. International Review of Psychiatry.'
    ]
  },
  {
    glyph: '♋',
    id: 'chronotype',
    title: 'Chronotype in Relationships',
    subtitle: 'Why sleep timing shapes compatibility',
    summary: 'Chronotype mismatch is one of the most reliable predictors of relationship friction.',
    body: [
      'Chronotype — your natural preference for morning or evening activity — is not a personality choice or a discipline problem. It is primarily genetic (heritability estimated at 50%) with a significant developmental component tied to photoperiodic imprinting at birth and puberty.',
      'When two people with mismatched chronotypes share a life, they face a structural problem: their windows of peak cognitive and emotional capacity don\'t align. An early-morning lark and a night owl in the same household are often attempting emotionally demanding conversations at the worst possible time for one of them.',
      'A 2019 study from the University of California Berkeley found that couples with greater chronotype mismatch reported lower relationship satisfaction, more conflict, and less reported intimacy — not because they were less compatible as people, but because their neurological operating hours were misaligned.',
      'The solution is not to force chronotype convergence (this almost never works sustainably) but to explicitly design around the mismatch: identifying the overlap window, protecting it for meaningful interaction, and offloading non-urgent communication to asynchronous formats.'
    ],
    citations: [
      'Gunia, B.C. et al. (2014). The effects of sleep on moral awareness. Psychological Science.',
      'Randler, C. & Saliger, L. (2011). Relationship between chronotype-related traits, sleep, and morality in couples. Sleep & Biological Rhythms.',
      'Richter, K. et al. (2019). Chronotype and social jetlag in couples. Journal of Sleep Research.'
    ]
  },
  {
    glyph: '♑',
    id: 'vulnerability',
    title: 'Seasonal Vulnerability Windows',
    subtitle: 'Why energy cycles repeat every year',
    summary: 'Your annual low-energy period is biologically predictable and relationship-relevant.',
    body: [
      'The human body responds to seasonal changes in photoperiod, temperature, and UV radiation with measurable physiological shifts: melatonin secretion patterns change, cortisol rhythms shift, immune function cycles, and mood regulation shows seasonal variation in the majority of the population — not just in those with diagnosed Seasonal Affective Disorder.',
      'For most people, the pattern is a mild annual energy cycle: a period of reduced motivation, social withdrawal, and increased sensitivity that tracks with the low-light months relative to their birth season. This is not depression in most cases — it is a normal biological rhythm that modern indoor life obscures but doesn\'t eliminate.',
      'The relationship implication is significant: if both partners hit their low period simultaneously, the relationship loses its natural support structure. Neither person has surplus capacity to hold the other. Conflict during this window is more likely to feel existential than it actually is.',
      'Couples with offset vulnerability windows have a natural protective mechanism: when one is low, the other tends to be rising or at peak. The goal of surfacing this in geoSync is not to pathologize seasonal lows but to contextualize them — to help partners recognize that "I feel distant from you" in November may be a seasonal signal, not a relationship verdict.'
    ],
    citations: [
      'Wehr, T.A. et al. (2001). Evidence for a biological dawn and dusk in the human circadian timing system. Journal of Physiology.',
      'Rosenthal, N.E. (2006). Winter Blues: Everything You Need to Know to Beat Seasonal Affective Disorder. Guilford Press.'
    ]
  },
  {
    glyph: '✦',
    id: 'limits',
    title: 'What This Isn\'t',
    subtitle: 'The honest limits of biophysical profiling',
    summary: 'Correlations are not destinies. Profiles describe tendencies, not people.',
    body: [
      'Everything in geoSync is based on population-level correlations, not individual determinism. The fact that high-latitude winter births show elevated HPA sensitivity on average does not mean every person born in Helsinki in December has a freeze stress response. Individual variation is enormous. Attachment history, trauma, culture, intentional development, and relationship history all overlay the biophysical baseline.',
      'The profiles are starting hypotheses, not conclusions. Their value is in giving you a shared vocabulary for patterns that might otherwise go unnamed — not in telling you who someone fundamentally is.',
      'The compatibility scoring is also explicitly not a verdict. A freeze+fight-flight pairing with a score of 28 on stress response has produced stable, loving relationships — because those people understood the dynamic and built explicit protocols for it. A high-scoring pair can still fail if they take their natural alignment for granted.',
      'geoSync is a user manual, not a judgment. Use it as a lens, not a label. If something in your profile doesn\'t fit, trust yourself over the algorithm — you have data the model doesn\'t.'
    ],
    citations: []
  }
]

export default function Science() {
  const navigate = useNavigate()
  const [open, setOpen] = useState({})
  function toggle(id) { setOpen(prev => ({ ...prev, [id]: !prev[id] })) }

  return (
    <Page>
      <TopBar>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        <Logo>{SYMBOLS.earth} geoSync</Logo>
      </TopBar>

      <Content>
        <PageHeader>
          <Eyebrow>The Research</Eyebrow>
          <PageTitle>The Science Behind geoSync</PageTitle>
          <PageSubtitle>
            geoSync is built on three bodies of peer-reviewed research: chronobiology,
            environmental epigenetics, and behavioral neuroscience. This page explains
            the mechanisms in plain language, with citations for those who want to go deeper.
          </PageSubtitle>
          <Disclaimer>
            {SYMBOLS.star} These are population-level correlations. Individual variation is real and significant.
            See the final section on limits before drawing any conclusions.
          </Disclaimer>
        </PageHeader>

        <Sections>
          {SECTIONS.map(section => (
            <SectionCard key={section.id}>
              <SectionHeader onClick={() => toggle(section.id)}>
                <SectionLeft>
                  <SectionGlyph>{section.glyph}</SectionGlyph>
                  <SectionMeta>
                    <SectionSubtitle>{section.subtitle}</SectionSubtitle>
                    <SectionTitle>{section.title}</SectionTitle>
                    <SectionSummary>{section.summary}</SectionSummary>
                  </SectionMeta>
                </SectionLeft>
                <Toggle $open={open[section.id]}>{open[section.id] ? '−' : '+'}</Toggle>
              </SectionHeader>

              {open[section.id] && (
                <SectionBody>
                  {section.body.map((para, i) => (
                    <Para key={i}>{para}</Para>
                  ))}
                  {section.citations.length > 0 && (
                    <Citations>
                      <CitationsLabel>References</CitationsLabel>
                      {section.citations.map((c, i) => (
                        <Citation key={i}>{c}</Citation>
                      ))}
                    </Citations>
                  )}
                </SectionBody>
              )}
            </SectionCard>
          ))}
        </Sections>

        <Footer>
          <FooterText>
            Questions about the research or methodology?
            The field of chronobiology is moving quickly — we update these explanations
            as significant new findings emerge.
          </FooterText>
        </Footer>
      </Content>
    </Page>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const Page       = styled.div`min-height: 100vh; background: ${({ theme }) => theme.colors.bg};`

const TopBar     = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing['2xl']}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) { padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`}; }
`
const BackButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`
const Logo       = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
`

const Content    = styled.main`
  max-width: 680px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
  @media (max-width: 768px) { padding: ${({ theme }) => theme.spacing.xl}; }
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.lg}; gap: ${({ theme }) => theme.spacing.xl}; }
`

const PageHeader   = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.md};`
const Eyebrow      = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.colors.accent};
`
const PageTitle    = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.textPrimary};
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes['2xl']}; }
`
const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`
const Disclaimer   = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  border-left: 2px solid ${({ theme }) => theme.colors.accentDim};
  padding-left: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`

const Sections     = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.md};`

const SectionCard  = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.borderLight}; }
`
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.lg}; }
`
const SectionLeft  = styled.div`display: flex; gap: ${({ theme }) => theme.spacing.lg}; align-items: flex-start; flex: 1; min-width: 0;`
const SectionGlyph = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
`
const SectionMeta   = styled.div`flex: 1; min-width: 0;`
const SectionSubtitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`
const SectionTitle  = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes.md}; }
`
const SectionSummary = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`
const Toggle       = styled.div`
  font-size: 1.5rem;
  color: ${({ theme, $open }) => $open ? theme.colors.accent : theme.colors.textMuted};
  line-height: 1;
  flex-shrink: 0;
  transition: color ${({ theme }) => theme.transitions.fast};
  user-select: none;
`

const SectionBody  = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.lg}; padding-top: 0; }
`
const Para         = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
`
const Citations    = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`
const CitationsLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`
const Citation     = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.6;
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
`

const Footer     = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`
const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.6;
`