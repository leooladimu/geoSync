const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status)
  }

  return data
}

export const api = {
  get: (endpoint, token) => 
    request(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
    
  post: (endpoint, body, token) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }),
    
  put: (endpoint, body, token) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }),
    
  patch: (endpoint, body, token) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }),
    
  delete: (endpoint, token) =>
    request(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
}

export { ApiError }
