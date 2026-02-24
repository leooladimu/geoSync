import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS, bp } from '../theme/theme'
import { api } from '../utils/api'

import ScoreRing        from '../components/report/ScoreRing'
import DimensionPanel   from '../components/report/DimensionPanel'
import StrategyBlock    from '../components/report/StrategyBlock'
import ForecastStrip    from '../components/dashboard/ForecastStrip'

export default function CompatibilityReport() {
  const { connectionId } = useParams()
  const navigate    = useNavigate()
  const { token: authToken } = useAuth()

  const [report,     setReport]     = useState(null)
  const [connection, setConnection] = useState(null)
  const [forecast,   setForecast]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [reportData, connectionData, forecastData] = await Promise.all([
          api.get(`/compatibility/${connectionId}`, authToken),
          api.get(`/connections/${connectionId}`,   authToken),
          api.get(`/forecast/${connectionId}`,       authToken)
        ])
        setReport(reportData)
        setConnection(connectionData)
        setForecast(forecastData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [connectionId, authToken])

  if (loading) return <LoadingPage>{SYMBOLS.earth} Loading report...</LoadingPage>
  if (error)   return <LoadingPage>Something went wrong: {error}</LoadingPage>

  const name = connection?.connectedUserId?.name || connection?.manualProfile?.name || 'Your Connection'
  const { scores, tiers, archetype, dimensions } = report

  return (
    <Page>
      <TopBar>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </BackButton>
        <NavRight>
          <ScienceLink to="/science">The Science</ScienceLink>
          <Logo to="/dashboard">{SYMBOLS.earth} geoSync</Logo>
        </NavRight>
      </TopBar>

      <Content>

        {/* ── Header ───────────────────────────────────────────────── */}
        <Header>
          <HeaderTop>
            <Eyebrow>Compatibility Report</Eyebrow>
            <ReportTitle>{name}</ReportTitle>
            <ConnectionType>{connection?.type}</ConnectionType>
          </HeaderTop>
          <ArchetypeBlock>
            <ArchetypeGlyph>{SYMBOLS.star}</ArchetypeGlyph>
            <ArchetypeLabel>Your Dynamic</ArchetypeLabel>
            <ArchetypeName>{archetype}</ArchetypeName>
          </ArchetypeBlock>
        </Header>

        {/* ── Overall Score ─────────────────────────────────────────── */}
        <ScoreSection>
          <ScoreRing score={scores.overall} size={160} />
          <ScoreDimensions>
            <DimScore>
              <DimLabel>Chronotype Sync</DimLabel>
              <DimBar score={scores.chronotype} tier={tiers.chronotype} />
              <DimValue>{scores.chronotype}%</DimValue>
            </DimScore>
            <DimScore>
              <DimLabel>Stress Response</DimLabel>
              <DimBar score={scores.stress} tier={tiers.stress} />
              <DimValue>{scores.stress}%</DimValue>
            </DimScore>
            <DimScore>
              <DimLabel>Seasonal Rhythm</DimLabel>
              <DimBar score={scores.seasonal} tier={tiers.seasonal} />
              <DimValue>{scores.seasonal}%</DimValue>
            </DimScore>
          </ScoreDimensions>
        </ScoreSection>

        <Disclaimer>
          {SYMBOLS.star} A low score isn't a verdict — it's a user manual.
          The couples who struggle aren't the incompatible ones;
          they're the ones who don't know they're incompatible.
        </Disclaimer>

        {/* ── Dimensions ───────────────────────────────────────────── */}
        <DimensionsSection>
          <SectionTitle>The Three Dimensions</SectionTitle>
          <DimensionPanel
            glyph="☉"
            title="Chronotype Sync"
            tier={tiers.chronotype}
            score={scores.chronotype}
            dimension={dimensions.chronotype}
          />
          <DimensionPanel
            glyph="♁"
            title="Stress Response"
            tier={tiers.stress}
            score={scores.stress}
            dimension={dimensions.stress}
            showToxicLoop
          />
          <DimensionPanel
            glyph={SYMBOLS.star}
            title="Seasonal Rhythm"
            tier={tiers.seasonal}
            score={scores.seasonal}
            dimension={dimensions.seasonal}
          />
        </DimensionsSection>

        {/* ── Strategy ─────────────────────────────────────────────── */}
        <StrategyBlock dimensions={dimensions} name={name} />

        {/* ── Forecast ─────────────────────────────────────────────── */}
        {forecast?.length && (
          <ForecastSection>
            <SectionTitle>Next 90 Days</SectionTitle>
            <ForecastStrip forecast={forecast} />
          </ForecastSection>
        )}

      </Content>
    </Page>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.bg};
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (min-width: ${bp.md}) {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
  }
`

const BackButton = styled.button`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  &:hover { color: ${props => props.theme.colors.accent}; }

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.lg};
  }
`

const ScienceLink = styled(Link)`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.accent};
  }

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.display};
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.accent};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.accentLight};
  }

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
`

const Content = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};

  @media (min-width: ${bp.md}) {
    padding: ${props => props.theme.spacing['2xl']};
    gap: ${props => props.theme.spacing['2xl']};
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xl};
  }
`

const HeaderTop = styled.div``

const Eyebrow = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const ReportTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.textPrimary};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const ConnectionType = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  text-transform: capitalize;
  margin-top: ${props => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`

const ArchetypeBlock = styled.div`
  background-color: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  min-width: 140px;

  @media (min-width: ${bp.md}) {
    padding: ${props => props.theme.spacing.lg};
    min-width: 180px;
  }
`

const ArchetypeGlyph = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.accentDim};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const ArchetypeLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const ArchetypeName = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textPrimary};
`

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
  align-items: center;

  @media (min-width: ${bp.md}) {
    flex-direction: row;
    gap: ${props => props.theme.spacing['2xl']};
    align-items: center;
  }
`

const ScoreDimensions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    flex: 1;
    gap: ${props => props.theme.spacing.lg};
  }
`

const DimScore = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    flex-wrap: nowrap;
    gap: ${props => props.theme.spacing.md};
  }
`

const DimLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  width: 100%;
  flex-shrink: 0;

  @media (min-width: ${bp.sm}) {
    width: 120px;
    font-size: ${props => props.theme.fontSizes.sm};
  }

  @media (min-width: ${bp.md}) {
    width: 140px;
  }
`

const TIER_COLORS = {
  high:        '#4a7a5a',
  protective:  '#4a7a5a',
  moderate:    '#c9a03a',
  low:         '#7a3a3a',
  risky:       '#7a3a3a',
  'friction-prone': '#7a3a3a'
}

const DimBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${props => props.score}%;
    background: ${props => TIER_COLORS[props.tier] || '#c9a03a'};
    border-radius: 2px;
    transition: width 0.6s ease;
  }
`

const DimValue = styled.span`
  font-family: ${props => props.theme.fonts.mono};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textMuted};
  width: 36px;
  text-align: right;
`

const Disclaimer = styled.p`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
  border-left: 2px solid ${props => props.theme.colors.accentDim};
  padding-left: ${props => props.theme.spacing.sm};
  line-height: 1.6;

  @media (min-width: ${bp.md}) {
    padding-left: ${props => props.theme.spacing.md};
  }
`

const DimensionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.lg};
  }
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`

const ForecastSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.lg};
  }
`

const LoadingPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.fontSizes.md};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`
