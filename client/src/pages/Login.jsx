import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SYMBOLS } from '../theme'
import api from '../utils/api'
import { AuthPage, AuthCard, AuthLogo, AuthTitle, AuthSubtitle, AuthField, AuthLabel, AuthInput, AuthButton, AuthError, AuthFooter, Divider } from '../components/auth/Shared'

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Email and password are required')
    setLoading(true); setError(null)
    try {
      const { token, user } = await api.post('/auth/login', form)
      login(token, user)
      try { await api.get('/profile', token); navigate('/dashboard') }
      catch { navigate('/onboarding') }
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return (
    <AuthPage>
      <AuthCard>
        <AuthLogo>{SYMBOLS.earth} geoSync</AuthLogo>
        <AuthTitle>Welcome back</AuthTitle>
        <AuthSubtitle>Sign in to your account.</AuthSubtitle>
        <form onSubmit={handleSubmit} noValidate>
          <AuthField><AuthLabel htmlFor="email">Email</AuthLabel><AuthInput id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} /></AuthField>
          <AuthField><AuthLabel htmlFor="password">Password</AuthLabel><AuthInput id="password" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} /></AuthField>
          {error && <AuthError>{error}</AuthError>}
          <AuthButton type="submit" disabled={loading}>{loading ? 'Signing in...' : `Sign In ${SYMBOLS.star}`}</AuthButton>
        </form>
        <Divider>{SYMBOLS.star}</Divider>
        <AuthFooter>Don't have an account? <Link to="/register">Create one</Link></AuthFooter>
      </AuthCard>
    </AuthPage>
  )
}
