import styled from 'styled-components'
import { SYMBOLS, SEASON_SYMBOLS } from '../../theme'
import { StepTitle, StepSubtitle, Field, Label, NextButton, BackButton, ButtonRow, FieldGroup } from './Shared'

const QUESTIONS = [
  { key:'openness', label:'In new relationships, you typically...', options:[{value:'quick',label:'Open up quickly'},{value:'gradual',label:'Take time to trust'},{value:'situational',label:'Depends entirely on the person'}] },
  { key:'stressResponse', label:'Under pressure, your first instinct is to...', options:[{value:'freeze',label:'Go quiet and withdraw'},{value:'expand',label:'Look for solutions'},{value:'fight-flight',label:'React immediately'}] },
  { key:'socialSeason', label:'You feel most socially alive during...', options:[{value:'spring',label:`♈ Spring`},{value:'summer',label:`♋ Summer`},{value:'fall',label:`♎ Fall`},{value:'winter',label:`♑ Winter`}] },
  { key:'conflictStyle', label:'In conflict, you...', options:[{value:'resolve-now',label:'Need to resolve it immediately'},{value:'process-first',label:'Need space before talking'},{value:'avoid',label:'Avoid it as long as possible'}] }
]

export default function StepSurvey({ values, onChange, onNext, onBack }) {
  const isValid = Object.values(values).every(v => v !== '')
  return (
    <div>
      <StepTitle>{SYMBOLS.star} Your Nature</StepTitle>
      <StepSubtitle>Four questions to calibrate what the birth data alone can't tell us.</StepSubtitle>
      <FieldGroup>
        {QUESTIONS.map(q => (
          <Field key={q.key}>
            <Label>{q.label}</Label>
            <OptionGroup>
              {q.options.map(opt => (
                <OptionButton key={opt.value} $selected={values[q.key] === opt.value} onClick={() => onChange({ [q.key]: opt.value })} type="button">{opt.label}</OptionButton>
              ))}
            </OptionGroup>
          </Field>
        ))}
      </FieldGroup>
      <ButtonRow>
        <BackButton onClick={onBack}>← Back</BackButton>
        <NextButton onClick={onNext} disabled={!isValid}>Continue {SYMBOLS.star}</NextButton>
      </ButtonRow>
    </div>
  )
}
const OptionGroup  = styled.div`display:flex;flex-direction:column;gap:${({theme})=>theme.spacing.sm};`
const OptionButton = styled.button`padding:${({theme})=>`${theme.spacing.md} ${theme.spacing.lg}`};background:${({theme,$selected})=>$selected?theme.colors.accentDim:theme.colors.bgCard};color:${({theme,$selected})=>$selected?theme.colors.accentLight:theme.colors.textSecondary};border:1px solid ${({theme,$selected})=>$selected?theme.colors.accent:theme.colors.border};border-radius:${({theme})=>theme.radius.md};text-align:left;font-size:${({theme})=>theme.fontSizes.sm};transition:all ${({theme})=>theme.transitions.fast};&:hover{border-color:${({theme})=>theme.colors.accent};color:${({theme})=>theme.colors.textPrimary};}`
