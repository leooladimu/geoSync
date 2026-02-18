#!/bin/bash
# ============================================================
# geoSync — responsive patch
# Run from the project root: bash responsive-patch.sh
# ============================================================

echo "📱 Applying responsive updates..."

# ============================================================
# 1. Add breakpoints to theme
# ============================================================
cat > client/src/theme/index.js << 'EOF'
export const SYMBOLS = {
  earth:'♁', earthAlt:'⊕', sun:'☉', moon:'☽',
  spring:'♈', summer:'♋', fall:'♎', winter:'♑', star:'✦'
}
export const SEASON_SYMBOLS = { spring:'♈', summer:'♋', fall:'♎', winter:'♑' }

export const bp = {
  sm:  '480px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px'
}

// Shorthand media query helpers — use in styled-components like:
// ${mq.sm`color: red;`}
export const mq = {
  sm:  (...args) => `@media (max-width: ${bp.sm}) { ${args} }`,
  md:  (...args) => `@media (max-width: ${bp.md}) { ${args} }`,
  lg:  (...args) => `@media (max-width: ${bp.lg}) { ${args} }`,
  smUp:(...args) => `@media (min-width: ${bp.sm}) { ${args} }`,
  mdUp:(...args) => `@media (min-width: ${bp.md}) { ${args} }`
}

export const theme = {
  colors: {
    bg:'#0e0f0f', bgElevated:'#151718', bgCard:'#1c1e1f', bgCardHover:'#222526',
    textPrimary:'#e8e4dc', textSecondary:'#9a9590', textMuted:'#5c5854',
    accent:'#c97d3a', accentLight:'#e09b5a', accentDim:'#7a4d22',
    spring:'#5a7a4a', summer:'#c97d3a', fall:'#8b4a2a', winter:'#3a5a7a',
    success:'#4a7a5a', warning:'#c9a03a', danger:'#7a3a3a',
    border:'#2a2c2e', borderLight:'#3a3c3e'
  },
  fonts: {
    display:`'Georgia', 'Times New Roman', serif`,
    body:`'Inter', 'Helvetica Neue', sans-serif`,
    mono:`'JetBrains Mono', 'Courier New', monospace`
  },
  fontSizes: { xs:'0.75rem', sm:'0.875rem', md:'1rem', lg:'1.125rem', xl:'1.375rem', '2xl':'1.75rem', '3xl':'2.25rem', '4xl':'3rem' },
  spacing:   { xs:'0.25rem', sm:'0.5rem', md:'1rem', lg:'1.5rem', xl:'2rem', '2xl':'3rem', '3xl':'4rem' },
  radius:    { sm:'4px', md:'8px', lg:'16px', xl:'24px', round:'9999px' },
  transitions:{ fast:'150ms ease', normal:'250ms ease', slow:'400ms ease' },
  bp
}
export default theme
EOF

# ============================================================
# 2. GlobalStyles — add base responsive resets
# ============================================================
cat > client/src/theme/GlobalStyles.js << 'EOF'
import { createGlobalStyle } from 'styled-components'
const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; -webkit-font-smoothing: antialiased; }
  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6; min-height: 100vh;
    /* Prevent horizontal scroll on mobile */
    overflow-x: hidden;
  }
  h1, h2, h3, h4 { font-family: ${({ theme }) => theme.fonts.display}; line-height: 1.2; letter-spacing: -0.02em; }
  /* Responsive type scale */
  @media (max-width: 480px) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.375rem; }
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { color: ${({ theme }) => theme.colors.accentLight}; } }
  button {
    cursor: pointer; border: none; background: none;
    font-family: ${({ theme }) => theme.fonts.body};
    /* Minimum touch target */
    min-height: 44px;
    min-width: 44px;
  }
  input, select, textarea {
    font-family: ${({ theme }) => theme.fonts.body};
    /* Prevent zoom on iOS */
    font-size: 16px;
  }
  img { max-width: 100%; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 3px; }
`
export default GlobalStyles
EOF

# ============================================================
# 3. Welcome page
# ============================================================
cat > client/src/pages/Welcome.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SYMBOLS } from '../theme'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <Page>
      <Inner>
        <Glyph>{SYMBOLS.earth}</Glyph>
        <Title>geoSync</Title>
        <Tagline>Your relationships, read through the lens of when and where you began.</Tagline>
        <Divider>{SYMBOLS.star} {SYMBOLS.star} {SYMBOLS.star}</Divider>
        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/register')}>Get Started</PrimaryButton>
          <SecondaryButton onClick={() => navigate('/login')}>Sign In</SecondaryButton>
        </ButtonGroup>
        <ScienceNote>Built on chronobiology, environmental epigenetics, and geomagnetic research — not astrology.</ScienceNote>
      </Inner>
    </Page>
  )
}

const Page            = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`
const Inner           = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 420px;
`
const Glyph           = styled.div`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  @media (max-width: 480px) { font-size: 2.5rem; }
`
const Title           = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes['3xl']}; }
`
const Tagline         = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes.md}; }
`
const Divider         = styled.div`
  color: ${({ theme }) => theme.colors.accentDim};
  letter-spacing: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`
const ButtonGroup     = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`
const PrimaryButton   = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.accentLight}; }
`
const SecondaryButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.textPrimary}; }
`
const ScienceNote     = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.6;
`
EOF

# ============================================================
# 4. Dashboard
# ============================================================
cat > client/src/pages/Dashboard.jsx << 'EOF'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS } from '../theme'
import api from '../utils/api'
import ProfileSummary     from '../components/dashboard/ProfileSummary'
import ConnectionsList    from '../components/dashboard/ConnectionsList'
import NudgesFeed         from '../components/dashboard/NudgesFeed'
import AddConnectionModal from '../components/dashboard/AddConnectionModal'

export default function Dashboard() {
  const { token, user, logout } = useAuth()
  const [profile,     setProfile]     = useState(null)
  const [connections, setConnections] = useState([])
  const [forecasts,   setForecasts]   = useState({})
  const [modalOpen,   setModalOpen]   = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [profileData, connectionsData] = await Promise.all([
        api.get('/profile', token),
        api.get('/connections', token)
      ])
      setProfile(profileData)
      setConnections(connectionsData)
      if (connectionsData.length) {
        const results = await Promise.all(connectionsData.map(c =>
          api.get(`/forecast/${c._id}`, token).then(f => ({ id: c._id, data: f }))
        ))
        const map = {}
        results.forEach(({ id, data }) => { map[id] = data })
        setForecasts(map)
      }
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function handleConnectionAdded() { setModalOpen(false); await loadDashboard() }
  async function handleDeleteConnection(connectionId) {
    try {
      await api.delete(`/connections/${connectionId}`, token)
      setConnections(prev => prev.filter(c => c._id !== connectionId))
      setForecasts(prev => { const next = { ...prev }; delete next[connectionId]; return next })
    } catch (err) { setError(err.message) }
  }

  if (loading) return <LoadingPage>{SYMBOLS.earth} Loading your profile...</LoadingPage>
  if (error)   return <LoadingPage>Something went wrong: {error}</LoadingPage>

  return (
    <Page>
      <TopBar>
        <Logo>{SYMBOLS.earth} geoSync</Logo>
        <TopBarRight>
          <UserName>{user?.name}</UserName>
          <LogoutButton onClick={logout}>Sign out</LogoutButton>
        </TopBarRight>
      </TopBar>
      <Content>
        {profile && <ProfileSummary profile={profile} />}
        <NudgesFeed token={token} />
        <SectionHeader>
          <SectionTitle>Your Connections</SectionTitle>
          <AddButton onClick={() => setModalOpen(true)}>+ Add</AddButton>
        </SectionHeader>
        {connections.length === 0 ? (
          <EmptyState>
            <EmptyGlyph>{SYMBOLS.star}</EmptyGlyph>
            <EmptyText>No connections yet.</EmptyText>
            <EmptySubtext>Add someone to generate a compatibility report and seasonal forecast.</EmptySubtext>
            <AddButton onClick={() => setModalOpen(true)}>Add your first connection</AddButton>
          </EmptyState>
        ) : (
          <ConnectionsList connections={connections} forecasts={forecasts} onDelete={handleDeleteConnection} token={token} />
        )}
      </Content>
      {modalOpen && <AddConnectionModal token={token} onAdded={handleConnectionAdded} onClose={() => setModalOpen(false)} />}
    </Page>
  )
}

const Page         = styled.div`min-height: 100vh; background: ${({ theme }) => theme.colors.bg};`
const TopBar       = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing['2xl']}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`
const Logo         = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
`
const TopBarRight  = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`
const UserName     = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  @media (max-width: 480px) { display: none; }
`
const LogoutButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`
const Content      = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
  }
`
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const SectionTitle  = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
`
const AddButton     = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  &:hover { background: ${({ theme }) => theme.colors.accentDim}; color: ${({ theme }) => theme.colors.accentLight}; }
`
const EmptyState    = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  }
`
const EmptyGlyph    = styled.div`font-size: 2rem; color: ${({ theme }) => theme.colors.accentDim};`
const EmptyText     = styled.p`font-size: ${({ theme }) => theme.fontSizes.lg}; color: ${({ theme }) => theme.colors.textPrimary};`
const EmptySubtext  = styled.p`font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.textMuted}; max-width: 300px;`
const LoadingPage   = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; color: ${({ theme }) => theme.colors.textMuted}; font-size: ${({ theme }) => theme.fontSizes.lg};`
EOF

# ============================================================
# 5. ProfileSummary
# ============================================================
cat > client/src/components/dashboard/ProfileSummary.jsx << 'EOF'
import styled from 'styled-components'
import { SEASON_SYMBOLS } from '../../theme'

const LIGHT_LABELS  = { 'high-light':'High-Light Profile', 'low-light':'Low-Light Profile' }
const CHRONO_LABELS = { lark:'Morning Lark', owl:'Night Owl', neutral:'Neutral Chronotype' }
const STRESS_LABELS = { freeze:'Freeze & Protect', expand:'Expand & Adapt', 'fight-flight':'Fight or Flight' }
const NEURO_COLORS  = { high:'#4a7a5a', moderate:'#c9a03a', low:'#7a4a3a' }

function monthName(n) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][n-1] }

export default function ProfileSummary({ profile }) {
  const { derived, dob, birthLocation } = profile
  const seasonSymbol = SEASON_SYMBOLS[derived.season]
  const dobYear = new Date(dob).getFullYear()
  return (
    <Card>
      <CardTop>
        <SeasonGlyph>{seasonSymbol}</SeasonGlyph>
        <CardTopText>
          <ProfileName>Your Biophysical Profile</ProfileName>
          <ProfileMeta>
            {birthLocation.city}{birthLocation.state ? `, ${birthLocation.state}` : ''} · {dobYear} · <SeasonLabel>{derived.season}</SeasonLabel>
          </ProfileMeta>
        </CardTopText>
      </CardTop>
      <Traits>
        <Trait><TraitLabel>Light Profile</TraitLabel><TraitValue>{LIGHT_LABELS[derived.lightProfile]}</TraitValue></Trait>
        <Trait><TraitLabel>Chronotype</TraitLabel><TraitValue>{CHRONO_LABELS[derived.chronotype]}</TraitValue></Trait>
        <Trait><TraitLabel>Stress Response</TraitLabel><TraitValue>{STRESS_LABELS[derived.stressBaseline]}</TraitValue></Trait>
        <Trait><TraitLabel>Vulnerability Window</TraitLabel><TraitValue>{monthName(derived.vulnerabilityWindow.startMonth)}–{monthName(derived.vulnerabilityWindow.endMonth)}</TraitValue></Trait>
      </Traits>
      <NeuroRow>
        <NeuroItem><NeuroLabel>Dopamine</NeuroLabel><NeuroBadge $level={derived.neurotransmitters.dopamine}>{derived.neurotransmitters.dopamine}</NeuroBadge></NeuroItem>
        <NeuroItem><NeuroLabel>Serotonin</NeuroLabel><NeuroBadge $level={derived.neurotransmitters.serotonin}>{derived.neurotransmitters.serotonin}</NeuroBadge></NeuroItem>
      </NeuroRow>
    </Card>
  )
}

const Card        = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.lg}; }
`
const CardTop     = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`
const SeasonGlyph = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  flex-shrink: 0;
  @media (max-width: 480px) { font-size: 1.75rem; }
`
const CardTopText = styled.div``
const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  @media (max-width: 480px) { font-size: ${({ theme }) => theme.fontSizes.lg}; }
`
const ProfileMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`
const SeasonLabel = styled.span`text-transform: capitalize; color: ${({ theme }) => theme.colors.textSecondary};`
const Traits      = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`
const Trait       = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`
const TraitLabel  = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`
const TraitValue  = styled.div`font-size: ${({ theme }) => theme.fontSizes.sm}; color: ${({ theme }) => theme.colors.textPrimary};`
const NeuroRow    = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`
const NeuroItem   = styled.div`display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.sm};`
const NeuroLabel  = styled.span`font-size: ${({ theme }) => theme.fontSizes.xs}; color: ${({ theme }) => theme.colors.textMuted};`
const NeuroBadge  = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-family: ${({ theme }) => theme.fonts.mono};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $level }) => ({ high:'#4a7a5a', moderate:'#c9a03a', low:'#7a4a3a' }[$level])}22;
  color: ${({ $level }) => ({ high:'#4a7a5a', moderate:'#c9a03a', low:'#7a4a3a' }[$level])};
  border: 1px solid ${({ $level }) => ({ high:'#4a7a5a', moderate:'#c9a03a', low:'#7a4a3a' }[$level])}44;
`
EOF

# ============================================================
# 6. ForecastStrip
# ============================================================
cat > client/src/components/dashboard/ForecastStrip.jsx << 'EOF'
import styled from 'styled-components'

const MONTH_NAMES   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const ENERGY_COLORS = { peak:'#4a7a5a', rising:'#c9a03a', dipping:'#8b6a3a', low:'#7a3a3a' }
const ENERGY_GLYPHS = { peak:'☉', rising:'↑', dipping:'↓', low:'☽' }
const RISK_COLORS   = { low:'#4a7a5a', moderate:'#c9a03a', high:'#7a3a3a' }

export default function ForecastStrip({ forecast }) {
  if (!forecast?.length) return null
  return (
    <Strip>
      {forecast.map((month, i) => (
        <MonthBlock key={i} $current={i === 0}>
          <MonthLabel>{MONTH_NAMES[month.month - 1]} {month.year}</MonthLabel>
          <EnergyRow>
            <EnergyPill $level={month.userA.energyLevel}>You {ENERGY_GLYPHS[month.userA.energyLevel]}</EnergyPill>
            <EnergyPill $level={month.userB.energyLevel}>Them {ENERGY_GLYPHS[month.userB.energyLevel]}</EnergyPill>
          </EnergyRow>
          <RiskLine $risk={month.mismatchRisk}>{month.mismatchRisk} risk</RiskLine>
          {i === 0 && month.recommendations?.[0] && (
            <Recommendation>{month.recommendations[0]}</Recommendation>
          )}
        </MonthBlock>
      ))}
    </Strip>
  )
}

const Strip       = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    /* On mobile just show the current month expanded */
    > *:not(:first-child) { display: none; }
  }
`
const MonthBlock  = styled.div`
  background: ${({ theme, $current }) => $current ? theme.colors.bgElevated : theme.colors.bg};
  border: 1px solid ${({ theme, $current }) => $current ? theme.colors.borderLight : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`
const MonthLabel  = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`
const EnergyRow   = styled.div`display: flex; gap: ${({ theme }) => theme.spacing.sm}; flex-wrap: wrap;`
const EnergyPill  = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $level }) => ENERGY_COLORS[$level]}22;
  color: ${({ $level }) => ENERGY_COLORS[$level]};
  border: 1px solid ${({ $level }) => ENERGY_COLORS[$level]}44;
`
const RiskLine    = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: capitalize;
  color: ${({ $risk }) => RISK_COLORS[$risk]};
`
const Recommendation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  font-style: italic;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`
EOF

# ============================================================
# 7. ConnectionsList
# ============================================================
cat > client/src/components/dashboard/ConnectionsList.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SYMBOLS } from '../../theme'
import ForecastStrip from './ForecastStrip'

const TYPE_LABELS = { romantic:'♁ Romantic', family:'♁ Family', platonic:'♁ Platonic', professional:'♁ Professional' }
const RISK_COLORS = { low:'#4a7a5a', moderate:'#c9a03a', high:'#7a3a3a' }

export default function ConnectionsList({ connections, forecasts, onDelete }) {
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()
  function toggle(id) { setExpanded(prev => prev === id ? null : id) }
  return (
    <List>
      {connections.map(connection => {
        const name       = connection.manualProfile?.name || 'Platform User'
        const forecast   = forecasts[connection._id]
        const mismatch   = forecast?.[0]?.mismatchRisk
        const isExpanded = expanded === connection._id
        return (
          <ConnectionCard key={connection._id}>
            <CardHeader onClick={() => toggle(connection._id)}>
              <CardLeft>
                <ConnectionGlyph>{SYMBOLS.star}</ConnectionGlyph>
                <CardInfo>
                  <ConnectionName>{name}</ConnectionName>
                  <ConnectionMeta>
                    <TypeBadge>{TYPE_LABELS[connection.type]}</TypeBadge>
                    {mismatch && <RiskBadge $risk={mismatch}>{mismatch} risk</RiskBadge>}
                  </ConnectionMeta>
                </CardInfo>
              </CardLeft>
              <ExpandToggle>{isExpanded ? '↑' : '↓'}</ExpandToggle>
            </CardHeader>
            {isExpanded && (
              <CardBody>
                {forecast && <ForecastStrip forecast={forecast} />}
                <CardActions>
                  <ActionLink onClick={() => navigate(`/compatibility/${connection._id}`)}>
                    View full report {SYMBOLS.star}
                  </ActionLink>
                  <DeleteButton onClick={() => onDelete(connection._id)}>Remove</DeleteButton>
                </CardActions>
              </CardBody>
            )}
          </ConnectionCard>
        )
      })}
    </List>
  )
}

const List             = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.md};`
const ConnectionCard   = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.borderLight}; }
`
const CardHeader       = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.md}; }
`
const CardLeft         = styled.div`display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.md}; min-width: 0;`
const ConnectionGlyph  = styled.div`font-size: 1.25rem; color: ${({ theme }) => theme.colors.accentDim}; flex-shrink: 0;`
const CardInfo         = styled.div`min-width: 0;`
const ConnectionName   = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const ConnectionMeta   = styled.div`display: flex; gap: ${({ theme }) => theme.spacing.sm}; align-items: center; flex-wrap: wrap;`
const TypeBadge        = styled.span`font-size: ${({ theme }) => theme.fontSizes.xs}; color: ${({ theme }) => theme.colors.textMuted};`
const RiskBadge        = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ $risk }) => RISK_COLORS[$risk]}22;
  color: ${({ $risk }) => RISK_COLORS[$risk]};
  border: 1px solid ${({ $risk }) => RISK_COLORS[$risk]}44;
  text-transform: capitalize;
  white-space: nowrap;
`
const ExpandToggle     = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing.md};
`
const CardBody         = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.md}; }
`
const CardActions      = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`
const ActionLink       = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.accent};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.accentLight}; }
`
const DeleteButton     = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.danger}; }
`
EOF

# ============================================================
# 8. AddConnectionModal — full-screen on mobile
# ============================================================
cat > client/src/components/dashboard/AddConnectionModal.jsx << 'EOF'
import { useState } from 'react'
import styled from 'styled-components'
import { SYMBOLS } from '../../theme'
import { AuthInput, AuthLabel, AuthField, AuthButton, AuthError } from '../auth/Shared'
import api from '../../utils/api'

const CONNECTION_TYPES = ['romantic','family','platonic','professional']
const EMPTY = { type:'', name:'', dob:'', city:'', state:'', country:'' }

export default function AddConnectionModal({ token, onAdded, onClose }) {
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  function handle(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function isValid() { return form.type && form.name && form.dob && form.city && form.country }
  async function handleSubmit() {
    if (!isValid()) return setError('Please fill in all required fields')
    setLoading(true); setError(null)
    try {
      const result = await api.post('/connections', {
        type: form.type,
        manualProfile: { name: form.name, dob: form.dob, birthLocation: { city: form.city, state: form.state, country: form.country } }
      }, token)
      onAdded(result)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{SYMBOLS.star} Add a Connection</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close">✕</CloseButton>
        </ModalHeader>
        <AuthField>
          <AuthLabel>Relationship type</AuthLabel>
          <TypeGrid>
            {CONNECTION_TYPES.map(t => (
              <TypeButton key={t} $selected={form.type === t} onClick={() => setForm(prev => ({ ...prev, type: t }))} type="button">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </TypeButton>
            ))}
          </TypeGrid>
        </AuthField>
        <AuthField>
          <AuthLabel>Their name</AuthLabel>
          <AuthInput name="name" placeholder="Name" value={form.name} onChange={handle} />
        </AuthField>
        <AuthField>
          <AuthLabel>Their date of birth</AuthLabel>
          <AuthInput name="dob" type="date" value={form.dob} onChange={handle} />
        </AuthField>
        <AuthField>
          <AuthLabel>Their birth location</AuthLabel>
          <LocationRow>
            <AuthInput name="city"  placeholder="City"  value={form.city}  onChange={handle} style={{ flex: 2 }} />
            <AuthInput name="state" placeholder="State" value={form.state} onChange={handle} style={{ flex: 1 }} />
          </LocationRow>
          <AuthInput name="country" placeholder="Country" value={form.country} onChange={handle} style={{ marginTop: '0.5rem' }} />
        </AuthField>
        {error && <AuthError>{error}</AuthError>}
        <AuthButton onClick={handleSubmit} disabled={loading || !isValid()}>
          {loading ? 'Generating report...' : `Generate Compatibility Report ${SYMBOLS.earth}`}
        </AuthButton>
      </Modal>
    </Overlay>
  )
}

const Overlay     = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) {
    padding: 0;
    align-items: flex-end;
  }
`
const Modal       = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 480px) {
    max-height: 92vh;
    border-radius: ${({ theme }) => `${theme.radius.xl} ${theme.radius.xl} 0 0`};
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`
const ModalHeader = styled.div`display: flex; justify-content: space-between; align-items: center;`
const ModalTitle  = styled.h2`font-size: ${({ theme }) => theme.fontSizes.xl}; color: ${({ theme }) => theme.colors.textPrimary};`
const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.md};
  min-height: unset;
  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`
const TypeGrid    = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: ${({ theme }) => theme.spacing.sm};`
const TypeButton  = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $selected }) => $selected ? theme.colors.accentDim : theme.colors.bgElevated};
  color: ${({ theme, $selected }) => $selected ? theme.colors.accentLight : theme.colors.textSecondary};
  border: 1px solid ${({ theme, $selected }) => $selected ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: capitalize;
  min-height: unset;
  &:hover { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.textPrimary}; }
`
const LocationRow = styled.div`display: flex; gap: ${({ theme }) => theme.spacing.sm};`
EOF

# ============================================================
# 9. CompatibilityReport page
# ============================================================
cat > client/src/pages/CompatibilityReport.jsx << 'EOF'
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
EOF

# ============================================================
# 10. Onboarding page — tighter mobile layout
# ============================================================
cat > client/src/pages/Onboarding.jsx << 'EOF'
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS } from '../theme'
import api from '../utils/api'
import StepBirthData from '../components/onboarding/StepBirthData'
import StepSurvey    from '../components/onboarding/StepSurvey'
import StepReview    from '../components/onboarding/StepReview'

const STEPS = [{ number:1, label:'Origin' },{ number:2, label:'Nature' },{ number:3, label:'Profile' }]
const EMPTY = { dob:'', birthLocation:{ city:'', state:'', country:'' }, survey:{ openness:'', stressResponse:'', socialSeason:'', conflictStyle:'' } }

export default function Onboarding() {
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { token, markProfileComplete } = useAuth()
  function updateForm(patch) { setForm(prev => ({ ...prev, ...patch })) }
  function updateSurvey(patch) { setForm(prev => ({ ...prev, survey: { ...prev.survey, ...patch } })) }
  function next() { setError(null); setStep(s => s + 1) }
  function back() { setError(null); setStep(s => s - 1) }
  async function submit() {
    setLoading(true); setError(null)
    try { await api.post('/profile', form, token); markProfileComplete(); navigate('/dashboard') }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return (
    <Page>
      <Inner>
        <Header>
          <Logo>{SYMBOLS.earth} geoSync</Logo>
          <ProgressTrack><ProgressFill style={{ width:`${((step-1)/2)*100}%` }} /></ProgressTrack>
          <StepLabels>
            {STEPS.map(s => (
              <StepLabel key={s.number} $active={s.number===step} $done={s.number<step}>
                {s.number < step ? '✦' : s.number} {s.label}
              </StepLabel>
            ))}
          </StepLabels>
        </Header>
        <Body>
          {step===1 && <StepBirthData values={form} onChange={updateForm} onNext={next} />}
          {step===2 && <StepSurvey values={form.survey} onChange={updateSurvey} onNext={next} onBack={back} />}
          {step===3 && <StepReview form={form} onSubmit={submit} onBack={back} loading={loading} error={error} />}
        </Body>
      </Inner>
    </Page>
  )
}

const Page    = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) { padding: ${({ theme }) => theme.spacing.lg}; }
`
const Inner   = styled.div`width: 100%; max-width: 560px;`
const Header  = styled.div`margin-bottom: ${({ theme }) => theme.spacing['2xl']};`
const Logo    = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`
const ProgressTrack = styled.div`width: 100%; height: 2px; background: ${({ theme }) => theme.colors.border}; border-radius: 2px; margin-bottom: ${({ theme }) => theme.spacing.md};`
const ProgressFill  = styled.div`height: 100%; background: ${({ theme }) => theme.colors.accent}; border-radius: 2px; transition: width ${({ theme }) => theme.transitions.slow};`
const StepLabels    = styled.div`display: flex; justify-content: space-between;`
const StepLabel     = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $active, $done }) => $done ? theme.colors.accent : $active ? theme.colors.textPrimary : theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
`
const Body    = styled.div`width: 100%;`
EOF

echo ""
echo "✅ Responsive patch applied."
echo ""
echo "Changes made:"
echo "  - theme/index.js    → added breakpoint constants (bp) and mq helpers"
echo "  - GlobalStyles.js   → base resets, touch targets, iOS zoom fix"
echo "  - Welcome           → full-width buttons, scaled type on mobile"
echo "  - Dashboard         → compressed padding, hidden username on mobile"
echo "  - ProfileSummary    → 1-col trait grid on mobile"
echo "  - ForecastStrip     → single month on mobile (<600px)"
echo "  - ConnectionsList   → truncated names, safe touch targets"
echo "  - AddConnectionModal→ slides up from bottom on mobile"
echo "  - CompatibilityReport → stacked score section, scaled type"
echo "  - Onboarding        → tighter padding on mobile"
