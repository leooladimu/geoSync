import { useState } from 'react'
import styled from 'styled-components'
import { SYMBOLS } from '../../theme'
import { StepTitle, StepSubtitle, Field, Label, Input, ScienceCallout, Row, NextButton, FieldGroup } from './Shared'

export default function StepBirthData({ values, onChange, onNext }) {
  const [scienceOpen, setScienceOpen] = useState({ dob: false, location: false })
  function toggle(key) { setScienceOpen(prev => ({ ...prev, [key]: !prev[key] })) }
  function handleLocation(e) { onChange({ birthLocation: { ...values.birthLocation, [e.target.name]: e.target.value } }) }
  function isValid() { const { city, country } = values.birthLocation; return values.dob && city && country }
  return (
    <div>
      <StepTitle>{SYMBOLS.earth} Your Origin</StepTitle>
      <StepSubtitle>The moment and place you entered the world left an imprint on your nervous system.</StepSubtitle>
      <FieldGroup>
        <Field>
          <LabelRow>
            <Label>Date of birth</Label>
            <WhyLink onClick={() => toggle('dob')}>{scienceOpen.dob ? 'close' : 'why this?'}</WhyLink>
          </LabelRow>
          {scienceOpen.dob && <ScienceCallout>{SYMBOLS.sun} The light cycles present at your birth calibrate your brain's master clock (suprachiasmatic nucleus), influencing your temperament, energy rhythms, and stress baseline for life. This is photoperiodic imprinting — documented in chronobiology.</ScienceCallout>}
          <Input type="date" value={values.dob} onChange={e => onChange({ dob: e.target.value })} />
        </Field>
        <Field>
          <LabelRow>
            <Label>Birth location</Label>
            <WhyLink onClick={() => toggle('location')}>{scienceOpen.location ? 'close' : 'why this?'}</WhyLink>
          </LabelRow>
          {scienceOpen.location && <ScienceCallout>{SYMBOLS.earth} Your birth latitude determines UV radiation your mother received during pregnancy, affecting prenatal Vitamin D, cortisol baseline, and the wiring of your HPA axis — the system governing your stress response and risk tolerance.</ScienceCallout>}
          <Row>
            <Input name="city" placeholder="City" value={values.birthLocation.city} onChange={handleLocation} style={{ flex: 2 }} />
            <Input name="state" placeholder="State / Province" value={values.birthLocation.state} onChange={handleLocation} style={{ flex: 1 }} />
          </Row>
          <Input name="country" placeholder="Country" value={values.birthLocation.country} onChange={handleLocation} style={{ marginTop: '0.5rem' }} />
        </Field>
      </FieldGroup>
      <NextButton onClick={onNext} disabled={!isValid()}>Continue {SYMBOLS.star}</NextButton>
    </div>
  )
}
const LabelRow = styled.div`display:flex;justify-content:space-between;align-items:baseline;margin-bottom:${({theme})=>theme.spacing.sm};`
const WhyLink  = styled.button`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.accent};opacity:0.8;&:hover{opacity:1;}`
