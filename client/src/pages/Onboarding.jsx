import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS, bp } from '../theme/theme'
import { api } from '../utils/api'

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.textPrimary};
  padding: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${props => props.theme.spacing.lg};
  }
`

const Header = styled.header`
  max-width: 800px;
  margin: 0 auto ${props => props.theme.spacing.xl};
  text-align: center;

  @media (min-width: ${bp.md}) {
    margin: 0 auto ${props => props.theme.spacing['2xl']};
  }
`

const Logo = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.md};
  }
`

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`

const ProgressBar = styled.div`
  max-width: 300px;
  margin: 0 auto ${props => props.theme.spacing.xl};
  height: 4px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;

  @media (min-width: ${bp.md}) {
    max-width: 400px;
    margin: 0 auto ${props => props.theme.spacing['2xl']};
  }
`

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.accent};
  transition: width ${props => props.theme.transitions.normal};
  width: ${props => (props.step / 3) * 100}%;
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing['2xl']};
  }
`

const StepDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => 
    props.active ? props.theme.colors.accent :
    props.completed ? props.theme.colors.borderLight :
    props.theme.colors.border
  };
  transition: all ${props => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    width: 12px;
    height: 12px;
  }
`

const Content = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    padding: 0;
  }
`

const StepCard = styled.div`
  background-color: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    border-radius: ${props => props.theme.radius.xl};
    padding: ${props => props.theme.spacing['2xl']};
  }
`

const StepTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`

const StepDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;

  @media (min-width: ${bp.md}) {
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${props => props.theme.spacing.lg};
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.bgElevated};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.md};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`

// Custom Accordion-style Select Component
const CustomSelectContainer = styled.div`
  position: relative;
`

const CustomSelectTrigger = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-right: ${props => props.theme.spacing['2xl']};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.bgElevated} 0%,
    ${props => props.theme.colors.bgCard} 100%
  );
  border: 1px solid ${props => props.selected ? props.theme.colors.accent + '66' : props.theme.colors.border};
  border-radius: ${props => props.isOpen ? `${props.theme.radius.md} ${props.theme.radius.md} 0 0` : props.theme.radius.md};
  color: ${props => props.selected ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  text-align: left;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: ${props => props.theme.spacing.md};
    top: 50%;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${props => props.theme.colors.accent};
    transform: translateY(-50%) ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform ${props => props.theme.transitions.fast};
  }

  &:hover {
    border-color: ${props => props.theme.colors.accent}88;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.bgElevated} 0%,
      ${props => props.theme.colors.bgCard} 50%,
      ${props => props.theme.colors.accent}11 100%
    );
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.accent}22;
  }
`

const CustomSelectOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.accent}66;
  border-top: none;
  border-radius: 0 0 ${props => props.theme.radius.md} ${props => props.theme.radius.md};
  overflow: hidden;
  z-index: 100;
  max-height: ${props => props.isOpen ? '300px' : '0'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`

const CustomOption = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.isSelected 
    ? `linear-gradient(135deg, ${props.theme.colors.accent}22 0%, ${props.theme.colors.accent}11 100%)`
    : 'transparent'};
  border: none;
  border-left: 3px solid ${props => props.isSelected ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.isSelected ? props.theme.colors.accent : props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.md};
  text-align: left;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.accent}22 0%,
      ${props => props.theme.colors.accent}11 50%,
      transparent 100%
    );
    border-left-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border}44;
  }
`

const OptionIcon = styled.span`
  font-size: 1.1em;
  opacity: 0.8;
`

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <CustomSelectContainer>
      <CustomSelectTrigger
        type="button"
        isOpen={isOpen}
        selected={!!value}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </CustomSelectTrigger>
      <CustomSelectOptions isOpen={isOpen}>
        {options.map(option => (
          <CustomOption
            key={option.value}
            type="button"
            isSelected={value === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
            {option.label}
          </CustomOption>
        ))}
      </CustomSelectOptions>
    </CustomSelectContainer>
  );
}

const LocationRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;

  @media (min-width: ${bp.sm}) {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    gap: ${props => props.theme.spacing.md};
    margin-top: ${props => props.theme.spacing.xl};
  }
`

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.md};
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  width: 100%;

  @media (min-width: ${bp.sm}) {
    width: auto;
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fontSizes.md};
  }

  ${props => props.primary && `
    background-color: ${props.theme.colors.accent};
    color: ${props.theme.colors.textPrimary};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${props.theme.colors.accentLight};
    }
  `}

  ${props => props.secondary && `
    background-color: transparent;
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.accent};
      color: ${props.theme.colors.accent};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ScienceCallout = styled.div`
  background-color: ${props => props.theme.colors.bgElevated};
  border-left: 3px solid ${props => props.theme.colors.accent};
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
  border-radius: 0 ${props => props.theme.radius.md} ${props => props.theme.radius.md} 0;
`

const ScienceTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`

const ScienceText = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { token } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    dob: '',
    birthLocation: {
      city: '',
      state: '',
      country: ''
    },
    survey: {
      openness: '',
      stressResponse: '',
      socialSeason: '',
      conflictStyle: ''
    }
  })

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/profile/create', formData, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const canProceed = () => {
    if (step === 1) return formData.dob && formData.birthLocation.city && formData.birthLocation.country
    if (step === 2) return formData.survey.openness && formData.survey.stressResponse
    if (step === 3) return formData.survey.socialSeason && formData.survey.conflictStyle
    return false
  }

  return (
    <OnboardingContainer>
      <Header>
        <Logo>{SYMBOLS.earth}</Logo>
        <Title>Build Your Biological Profile</Title>
        <Subtitle>
          We'll use your birth data and 4 simple questions to generate your compatibility blueprint
        </Subtitle>
        
        <ProgressBar>
          <ProgressFill step={step} />
        </ProgressBar>
        
        <StepIndicator>
          {[1, 2, 3].map(i => (
            <StepDot 
              key={i} 
              active={i === step} 
              completed={i < step} 
            />
          ))}
        </StepIndicator>
      </Header>

      <Content>
        <StepCard>
          {step === 1 && (
            <>
              <StepTitle>Step 1: Birth Data</StepTitle>
              <StepDescription>
                Your date and location of birth create the foundation of your biological profile.
              </StepDescription>
              
              <ScienceCallout>
                <ScienceTitle>🌍 Why this matters</ScienceTitle>
                <ScienceText>
                  Season of birth affects neurotransmitter development, while latitude influences 
                  stress response patterns. This isn't astrology — it's environmental imprinting.
                </ScienceText>
              </ScienceCallout>

              <Form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <Field>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateFormData('dob', null, e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <Label>Birth Location</Label>
                  <LocationRow>
                    <Input
                      placeholder="City"
                      value={formData.birthLocation.city}
                      onChange={(e) => updateFormData('birthLocation', 'city', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="State"
                      value={formData.birthLocation.state}
                      onChange={(e) => updateFormData('birthLocation', 'state', e.target.value)}
                    />
                    <Input
                      placeholder="Country"
                      value={formData.birthLocation.country}
                      onChange={(e) => updateFormData('birthLocation', 'country', e.target.value)}
                      required
                    />
                  </LocationRow>
                </Field>

                <ButtonGroup>
                  <Button type="submit" primary disabled={!canProceed()}>
                    Next Step
                  </Button>
                </ButtonGroup>
              </Form>
            </>
          )}

          {step === 2 && (
            <>
              <StepTitle>Step 2: Social Patterns</StepTitle>
              <StepDescription>
                How you approach people and situations reveals your underlying biological patterns.
              </StepDescription>

              <Form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <Field>
                  <Label>When meeting new people, you tend to be:</Label>
                  <CustomSelect
                    value={formData.survey.openness}
                    onChange={(e) => updateFormData('survey', 'openness', e.target.value)}
                    placeholder="Select your style..."
                    options={[
                      { value: 'quick', label: 'Quick to open up', icon: '💫' },
                      { value: 'gradual', label: 'Gradual and measured', icon: '🌱' },
                      { value: 'situational', label: 'Depends on the situation', icon: '🔄' }
                    ]}
                  />
                </Field>

                <Field>
                  <Label>Under stress, your first instinct is to:</Label>
                  <CustomSelect
                    value={formData.survey.stressResponse}
                    onChange={(e) => updateFormData('survey', 'stressResponse', e.target.value)}
                    placeholder="Select your response..."
                    options={[
                      { value: 'freeze', label: 'Freeze and withdraw', icon: '❄️' },
                      { value: 'expand', label: 'Expand and engage', icon: '🌊' },
                      { value: 'fight-flight', label: 'Fight or flight', icon: '⚡' }
                    ]}
                  />
                </Field>

                <ButtonGroup>
                  <Button type="button" secondary onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" primary disabled={!canProceed()}>
                    Next Step
                  </Button>
                </ButtonGroup>
              </Form>
            </>
          )}

          {step === 3 && (
            <>
              <StepTitle>Step 3: Relationship Patterns</StepTitle>
              <StepDescription>
                Your social and conflict patterns complete your compatibility blueprint.
              </StepDescription>

              <ScienceCallout>
                <ScienceTitle>🧠 The science</ScienceTitle>
                <ScienceText>
                  These answers help us understand your chronotype, seasonal preferences, and 
                  conflict resolution style — all biologically influenced patterns that affect compatibility.
                </ScienceText>
              </ScienceCallout>

              <Form onSubmit={handleSubmit}>
                <Field>
                  <Label>You feel most energized and social during:</Label>
                  <CustomSelect
                    value={formData.survey.socialSeason}
                    onChange={(e) => updateFormData('survey', 'socialSeason', e.target.value)}
                    placeholder="Select your season..."
                    options={[
                      { value: 'spring', label: 'Spring (new beginnings)', icon: '🌸' },
                      { value: 'summer', label: 'Summer (peak energy)', icon: '☀️' },
                      { value: 'fall', label: 'Fall (cozy connections)', icon: '🍂' },
                      { value: 'winter', label: 'Winter (intimate bonds)', icon: '❄️' }
                    ]}
                  />
                </Field>

                <Field>
                  <Label>When conflicts arise, you prefer to:</Label>
                  <CustomSelect
                    value={formData.survey.conflictStyle}
                    onChange={(e) => updateFormData('survey', 'conflictStyle', e.target.value)}
                    placeholder="Select your approach..."
                    options={[
                      { value: 'resolve-now', label: 'Resolve immediately', icon: '⚡' },
                      { value: 'process-first', label: 'Process first, then resolve', icon: '🧘' },
                      { value: 'avoid', label: 'Avoid and let time heal', icon: '🕊️' }
                    ]}
                  />
                </Field>

                {error && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#7a3a3a22', 
                    border: '1px solid #7a3a3a44',
                    borderRadius: '0.5rem',
                    color: '#7a3a3a'
                  }}>
                    {error}
                  </div>
                )}

                <ButtonGroup>
                  <Button type="button" secondary onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" primary disabled={!canProceed() || loading}>
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                  </Button>
                </ButtonGroup>
              </Form>
            </>
          )}
        </StepCard>
      </Content>
    </OnboardingContainer>
  )
}
