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
