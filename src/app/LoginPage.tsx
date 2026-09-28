import { useState, type FormEvent } from 'react'
import { Activity, ArrowRight, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './api'
import { useAppDispatch } from './hooks'
import { setToken } from './authSlice'
import { setUser } from './userSlice'
import './LoginPage.css'

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
  }
  return 'Sign-in failed. Check your details and try again.'
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      const session = await login({ email, password }).unwrap()
      if (!session.token || !session.user) {
        throw new Error('The login response must include a token and user.')
      }
      dispatch(setToken(session.token))
      dispatch(setUser(session.user))
      const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(fromPath?.startsWith('/admin/dashboard') ? fromPath : '/admin/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : getErrorMessage(error))
    }
  }

  return (
    <div className="login-page">
      <aside className="login-brand-panel">
        <div className="login-brand"><span className="login-brand-mark"><Activity size={19} strokeWidth={2.5} /></span><span>northstar</span><span className="login-brand-tag">ADMIN</span></div>
        <div className="login-brand-content">
          <p className="login-eyebrow">NORTHSTAR GOODS / OPERATIONS</p>
          <h1>Good work,<br />well in view.</h1>
          <p className="login-brand-description">A clear view of your store, your people, and the details that keep things moving.</p>
        </div>
        <div className="login-brand-footer"><ShieldCheck size={15} /><span>Administrator portal</span><span className="login-footer-separator">·</span><span>© 2026 Northstar Goods</span></div>
      </aside>

      <main className="login-main">
        <div className="login-form-wrap">
          <div className="login-lock-mark"><LockKeyhole size={18} /></div>
          <p className="login-form-eyebrow">YOUR WORKSPACE</p>
          <h2>Welcome back</h2>
          <p className="login-form-subtitle">Sign in to continue to your admin dashboard.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <div className="login-input-wrap"><Mail size={16} /><input id="login-email" name="email" type="email" autoComplete="username" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div className="login-password-heading"><label htmlFor="login-password">Password</label></div>
            <div className="login-input-wrap"><LockKeyhole size={16} /><input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}
            <button className="login-submit" type="submit" disabled={isLoading}>
              {isLoading ? <><LoaderCircle className="login-spinner" size={16} /> Signing in</> : <>Sign in <ArrowRight size={16} /> </>}
            </button>
          </form>
          <p className="login-security-note"><ShieldCheck size={14} /> Your session is protected with administrator access.</p>
        </div>
      </main>
    </div>
  )
}
