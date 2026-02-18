import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { SYMBOLS } from '../../theme'
import api from '../../utils/api'

const CATEGORY_META = {
  'withdrawal':       { glyph:'☽', label:'Withdrawal pattern' },
  'intensity-seeking':{ glyph:'☉', label:'Intensity seeking' },
  'over-commitment':  { glyph:'♈', label:'Over-commitment risk' },
  'scarcity-lock':    { glyph:'♁', label:'Scarcity pattern' },
  'optimism-bias':    { glyph:'♋', label:'Optimism bias' }
}

export default function NudgesFeed({ token }) {
  const [nudges,  setNudges]  = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { loadNudges() }, [])
  async function loadNudges() {
    try { const data = await api.get('/nudges', token); setNudges(data) }
    catch (err) { console.error('Failed to load nudges:', err) }
    finally { setLoading(false) }
  }
  async function dismiss(id) {
    try { await api.patch(`/nudges/${id}/dismiss`, null, token); setNudges(prev => prev.filter(n => n._id !== id)) }
    catch (err) { console.error('Failed to dismiss nudge:', err) }
  }
  if (loading || !nudges.length) return null
  return (
    <Section>
      <SectionLabel>{SYMBOLS.star} Active Insights <Count>{nudges.length}</Count></SectionLabel>
      <Feed>{nudges.map(nudge => <NudgeCard key={nudge._id} nudge={nudge} onDismiss={dismiss} />)}</Feed>
    </Section>
  )
}

function NudgeCard({ nudge, onDismiss }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[nudge.category] || { glyph: SYMBOLS.star, label: nudge.category }
  const connectionName = nudge.connectionId?.manualProfile?.name || null
  return (
    <Card>
      <CardTop>
        <CardLeft><Glyph>{meta.glyph}</Glyph><CardText><CategoryLabel>{meta.label}</CategoryLabel>{connectionName && <ConnectionRef>re: {connectionName}</ConnectionRef>}</CardText></CardLeft>
        <CardActions><ExpandBtn onClick={() => setExpanded(p => !p)}>{expanded ? 'less' : 'more'}</ExpandBtn><DismissBtn onClick={() => onDismiss(nudge._id)}>✕</DismissBtn></CardActions>
      </CardTop>
      <Message $expanded={expanded}>{nudge.message}</Message>
      {expanded && <Trigger><TriggerLabel>Why now </TriggerLabel>{nudge.trigger}</Trigger>}
    </Card>
  )
}
const Section       = styled.div`display:flex;flex-direction:column;gap:${({theme})=>theme.spacing.md};`
const SectionLabel  = styled.div`display:flex;align-items:center;gap:${({theme})=>theme.spacing.sm};font-size:${({theme})=>theme.fontSizes.xs};text-transform:uppercase;letter-spacing:0.12em;color:${({theme})=>theme.colors.accent};`
const Count         = styled.span`background:${({theme})=>theme.colors.accentDim};color:${({theme})=>theme.colors.accentLight};font-size:${({theme})=>theme.fontSizes.xs};padding:1px 7px;border-radius:${({theme})=>theme.radius.round};`
const Feed          = styled.div`display:flex;flex-direction:column;gap:${({theme})=>theme.spacing.md};`
const Card          = styled.div`background:${({theme})=>theme.colors.bgCard};border:1px solid ${({theme})=>theme.colors.border};border-left:3px solid ${({theme})=>theme.colors.accent};border-radius:${({theme})=>theme.radius.md};padding:${({theme})=>theme.spacing.lg};display:flex;flex-direction:column;gap:${({theme})=>theme.spacing.md};`
const CardTop       = styled.div`display:flex;justify-content:space-between;align-items:flex-start;`
const CardLeft      = styled.div`display:flex;align-items:center;gap:${({theme})=>theme.spacing.md};`
const Glyph         = styled.div`font-size:1.25rem;color:${({theme})=>theme.colors.accent};line-height:1;`
const CardText      = styled.div``
const CategoryLabel = styled.div`font-size:${({theme})=>theme.fontSizes.sm};color:${({theme})=>theme.colors.textPrimary};text-transform:capitalize;`
const ConnectionRef = styled.div`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.textMuted};margin-top:2px;`
const CardActions   = styled.div`display:flex;align-items:center;gap:${({theme})=>theme.spacing.md};`
const ExpandBtn     = styled.button`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.accent};opacity:0.8;&:hover{opacity:1;}`
const DismissBtn    = styled.button`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.textMuted};&:hover{color:${({theme})=>theme.colors.textSecondary};}`
const Message       = styled.p`font-size:${({theme})=>theme.fontSizes.sm};color:${({theme})=>theme.colors.textSecondary};line-height:1.7;display:${({$expanded})=>$expanded?'block':'-webkit-box'};-webkit-line-clamp:${({$expanded})=>$expanded?'unset':'2'};-webkit-box-orient:vertical;overflow:hidden;`
const Trigger       = styled.div`font-size:${({theme})=>theme.fontSizes.xs};color:${({theme})=>theme.colors.textMuted};border-top:1px solid ${({theme})=>theme.colors.border};padding-top:${({theme})=>theme.spacing.sm};line-height:1.5;font-style:italic;`
const TriggerLabel  = styled.span`text-transform:uppercase;letter-spacing:0.08em;color:${({theme})=>theme.colors.textMuted};margin-right:${({theme})=>theme.spacing.sm};font-style:normal;`
