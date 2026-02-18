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
