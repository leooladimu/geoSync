import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS } from '../theme'
import api from '../utils/api'
import ScoreRing      from '../components/report/ScoreRing'
import DimensionPanel from '../components/report/DimensionPanel'
import StrategyBlock  from '../components/report/StrategyBlock'
import ForecastStrip  from '../components/dashboard/ForecastStrip'

const TIER_COLORS = { high:'#4a7a5a', protective:'#4a7a5a', moderate:'#c9a03a', low:'#7a3a3a', risky:'#7a3a3a', 'friction-prone':'#7a3a3a' }

export default function CompatibilityReport() {
  const { connectionId }     = useParams()
  const navigate             = useNavigate()
  const { token: authToken } = useAuth()
  const [report,     setReport]     = useState(null)
  const [connection, setConnection] = useState(null)
  const [forecast,   setForecast]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => { load() }, [connectionId])

  async function load() {
    try {
      const [reportData, connectionData, forecastData] = await Promise.all([
        api.get(`/compatibility/${connectionId}`, authToken),
        api.get(`/connections/${connectionId}`,   authToken),
        api.get(`/forecast/${connectionId}`,      authToken)
      ])
      setReport(reportData); setConnection(connectionData); setForecast(forecastData)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  if (loading) return <LoadingPage>{SYMBOLS.earth} Loading report...</LoadingPage>
  if (error)   return <LoadingPage>Something went wrong: {error}</LoadingPage>

  const name = connection?.manualProfile?.name || 'Your Connection'
  const { scores, tiers, archetype, dimensions } = report

  return (
    <Page>
      <TopBar>
        <BackButton onClick={() => navigate('/dashboard')}>← Dashboard</BackButton>
        <Logo>{SYMBOLS.earth} geoSync</Logo>
      </TopBar>
      <Content>
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

        <ScoreSection>
          <ScoreRing score={scores.overall} size={140} />
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
          {SYMBOLS.star} A low score isn't a verdict — it's a user manual. The couples who struggle aren't the incompatible ones; they're the ones who don't know they're incompatible.
        </Disclaimer>

        <DimensionsSection>
          <SectionTitle>The Three Dimensions</SectionTitle>
          <DimensionPanel glyph="☉" title="Chronotype Sync"  tier={tiers.chronotype} score={scores.chronotype} dimension={dimensions.chronotype} />
          <DimensionPanel glyph="♁" title="Stress Response"  tier={tiers.stress}     score={scores.stress}     dimension={dimensions.stress} showToxicLoop />
          <DimensionPanel glyph={SYMBOLS.star} title="Seasonal Rhythm" tier={tiers.seasonal} score={scores.seasonal} dimension={dimensions.seasonal} />
        </DimensionsSection>

        <StrategyBlock dimensions={dimensions} name={name} />

        {forecast?.length > 0 && (
          <ForecastSection>
            <SectionTitle>Next 90 Days</SectionTitle>
            <ForecastStrip forecast={forecast} />
          </ForecastSection>
        )}
      </Content>
    </Page>
  )
}

const Page            = styled.div`min-height: 100vh; background: ${({ theme }) => theme.colors.bg};`
const TopBar          = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing['2xl']}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) { padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`}; }
`
const BackButton      = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`
const Logo            = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
`
const Content         = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
  @media (max-width: 768px) { padding: ${({ theme }) => theme.spacing.xl}; }
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
  }
`
const Header          = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 540px) { flex-direction: column; }
`
const HeaderTop       = styled.div``
const Eyebrow         = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`
const ReportTitle     = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.textPrimary};
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes['2xl']}; }
`
const ConnectionType  = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: capitalize;
  margin-top: ${({ theme }) => theme.spacing.xs};
`
const ArchetypeBlock  = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  min-width: 160px;
  flex-shrink: 0;
  @media (max-width: 540px) { min-width: unset; width: 100%; }
`
const ArchetypeGlyph  = styled.div`font-size: 1.5rem; color: ${({ theme }) => theme.colors.accentDim}; margin-bottom: ${({ theme }) => theme.spacing.sm};`
const ArchetypeLabel  = styled.div`font-size: ${({ theme }) => theme.fontSizes.xs}; text-transform: uppercase; letter-spacing: 0.1em; color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: ${({ theme }) => theme.spacing.xs};`
const ArchetypeName   = styled.div`font-family: ${({ theme }) => theme.fonts.display}; font-size: ${({ theme }) => theme.fontSizes.md}; color: ${({ theme }) => theme.colors.textPrimary};`
const ScoreSection    = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`
const ScoreDimensions = styled.div`flex: 1; display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg}; width: 100%;`
const DimScore        = styled.div`display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.md};`
const DimLabel        = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 130px;
  flex-shrink: 0;
  @media (max-width: 480px) { width: 100px; font-size: ${({ theme }) => theme.fontSizes.xs}; }
`
const DimBar          = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${({ score }) => score}%;
    background: ${({ tier }) => TIER_COLORS[tier] || '#c9a03a'};
    border-radius: 2px;
    transition: width 0.6s ease;
  }
`
const DimValue        = styled.span`font-family: ${({ theme }) => theme.fonts.mono}; font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.textMuted}; width: 36px; text-align: right;`
const Disclaimer      = styled.p`font-size: ${({ theme }) => theme.fontSizes.xs}; color: ${({ theme }) => theme.colors.textMuted}; font-style: italic; border-left: 2px solid ${({ theme }) => theme.colors.accentDim}; padding-left: ${({ theme }) => theme.spacing.md}; line-height: 1.6;`
const DimensionsSection = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg};`
const SectionTitle    = styled.h2`font-size: ${({ theme }) => theme.fontSizes.xl}; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: ${({ theme }) => theme.spacing.sm};`
const ForecastSection = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.lg};`
const LoadingPage     = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; color: ${({ theme }) => theme.colors.textMuted}; font-size: ${({ theme }) => theme.fontSizes.lg};`
