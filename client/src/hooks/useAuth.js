import { useState } from 'react'
export function useAuth() {
  const [token,      setToken]      = useState(() => localStorage.getItem('gs_token'))
  const [user,       setUser]       = useState(() => JSON.parse(localStorage.getItem('gs_user') || 'null'))
  const [hasProfile, setHasProfile] = useState(() => localStorage.getItem('gs_has_profile') === 'true')
  function login(token, user) {
    localStorage.setItem('gs_token', token)
    localStorage.setItem('gs_user',  JSON.stringify(user))
    setToken(token); setUser(user)
  }
  function logout() {
    localStorage.removeItem('gs_token'); localStorage.removeItem('gs_user'); localStorage.removeItem('gs_has_profile')
    setToken(null); setUser(null); setHasProfile(false)
  }
  function markProfileComplete() { localStorage.setItem('gs_has_profile','true'); setHasProfile(true) }
  return { token, user, hasProfile, login, logout, markProfileComplete }
}
