import styled from 'styled-components'
import { SYMBOLS, SEASON_SYMBOLS } from '../../theme'
import { StepTitle, StepSubtitle, ButtonRow, BackButton, NextButton } from './Shared'

const SURVEY_LABELS = {
  openness:      { quick:'Opens up quickly', gradual:'Takes time to trust', situational:'Situational' },
  stressResponse:{ freeze:'Withdraws under pressure', expand:'Seeks solutions', 'fight-flight':'Reacts immediately' },
  socialSeason:  { spring:'♈ Spring', summer:'♋ Summer', fall:'♎ Fall', winter:'♑ Winter' },
  conflictStyle: { 'resolve-now':'Resolves immediately', 'process-first':'Needs space first', avoid:'Avoids conflict' }
}

export default function StepReview({ form, onSubmit, onBack, loading, error }) {
  const { dob, birthLocation, survey } = form
  const dobFormatted = dob ? new Date(dob).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}) : '—'
  const location = [birthLocation.city, birthLocation.state, birthLocation.country].filter(Boolean).join(', ')
  return (
    <div>
      <StepTitle>{SYMBOLS.earthAlt} Your Profile</StepTitle>
      <StepSubtitle>Review your information before we generate your biophysical profile.</StepSubtitle>
      <Card>
        <Section>
          <SectionLabel>Origin</SectionLabel>
          <Row><Key>Born</Key><Value>{dobFormatted}</Value></Row>
          <Row><Key>Location</Key><Value>{location}</Value></Row>
        </Section>
        <Divider />
        <Section>
          <SectionLabel>Nature</SectionLabel>
          <Row><Key>In new relationships</Key><Value>{SURVEY_LABELS.openness[survey.openness]}</Value></Row>
          <Row><Key>Under pressure</Key><Value>{SURVEY_LABELS.stressResponse[survey.stressResponse]}</Value></Row>
          <Row><Key>Social peak</Key><Value>{SURVEY_LABELS.socialSeason[survey.socialSeason]}</Value></Row>
          <Row><Key>In conflict</Key><Value>{SURVEY_LABELS.conflictStyle[survey.conflictStyle]}</Value></Row>
        </Section>
      </Card>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Note>{SYMBOLS.star} Your profile describes tendencies, not destinies.</Note>
      <ButtonRow>
        <BackButton onClick={onBack} disabled={loading}>← Back</BackButton>
        <NextButton onClick={onSubmit} disabled={loading}>{loading ? 'Generating...' : `Generate My Profile ${SYMBOLS.earth}`}</NextButton>
      </ButtonRow>
    </div>
  )
}
const Card    = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-radius:${({theme})=>theme.radius.lg};padding:${({theme})=>theme.spacing.xl};margin:${({theme})=>theme.spacing.xl} 0;`
const Section = styled.div`display:flex;flex-direction:column;gap:${({theme})=>theme.spacing.md};`
const SectionLabel = styled.div`font-size:${({theme})=>theme.fontSizes.xs};text-transform:uppercase;letter-spacing:0.12em;color:${({theme})=>theme.colors.accent};margin-bottom:${({theme})=>theme.spacing.xs};`
const Row     = styled.div`display:flex;justify-content:space-between;align-items:baseline;gap:${({theme})=>theme.spacing.md};`
const Key     = styled.span`font-size:${({theme})=>theme.fontSizes.sm};color:${({theme})=>theme.colors.textMuted};`
const Value   = styled.span`font-size:${({theme})=>theme.fontSizes.sm};color:${({theme})=>theme.colors.textPrimary};text-align:right;`
const Divider = styled.hr`border:none;border-top:1px solid ${({theme})=>theme.colors.border};margin:${({theme})=>theme.spacing.lg} 0;`
const Note    = styled.p`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.textMuted};font-style:italic;margin-bottom:${({theme})=>theme.spacing.lg};`
const ErrorMsg = styled.p`color:${({theme})=>theme.colors.danger};font-size:${({theme})=>theme.fontSizes.sm};margin-bottom:${({theme})=>theme.spacing.md};`
