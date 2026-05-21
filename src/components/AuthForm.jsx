import { useState } from 'react'
import { supabase } from '../supabaseClient'

const initialState = {
  email: '',
  password: '',
}

function AuthForm() {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { email, password } = form
    const authCall =
      mode === 'signup'
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password })

    const { error: authError } = await authCall

    if (authError) {
      setError(authError.message)
    } else if (mode === 'signup') {
      setError('Account created. You can sign in now.')
    }

    setLoading(false)
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="eyebrow">Access</span>
        <h2>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        <p>
          {mode === 'signup'
            ? 'Create a campus account to post notices.'
            : 'Sign in to post and manage your notices.'}
        </p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@bahria.edu.pk"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
        </label>
        {error && <div className="form-note">{error}</div>}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signup' ? 'Sign up' : 'Sign in'}
        </button>
      </form>
      <button
        className="btn ghost"
        type="button"
        onClick={() => setMode((prev) => (prev === 'signup' ? 'signin' : 'signup'))}
      >
        {mode === 'signup'
          ? 'Already have an account? Sign in'
          : 'New here? Create an account'}
      </button>
    </div>
  )
}

export default AuthForm
