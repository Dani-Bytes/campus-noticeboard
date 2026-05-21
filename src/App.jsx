import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthForm from './components/AuthForm'
import NoticeBoard from './components/NoticeBoard'
import NoticeForm from './components/NoticeForm'

const categories = ['general', 'academic', 'event', 'urgent', 'clubs']

function App() {
  const [session, setSession] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        if (!nextSession) {
          setShowAuth(false)
        }
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowAuth(false)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Bahria University</p>
          <h1>Campus Notice Board</h1>
          <p className="subtitle">
            Share campus alerts, events, and academic updates in real time.
          </p>
        </div>
        <div className="status">
          <span className={session ? 'pill live' : 'pill muted'}>
            {session ? 'Signed in' : 'Guest mode'}
          </span>
          {session ? (
            <button className="btn ghost" onClick={handleSignOut}>
              Sign out
            </button>
          ) : (
            <button
              className="btn ghost"
              onClick={() => setShowAuth((prev) => !prev)}
            >
              Sign in / Register
            </button>
          )}
        </div>
      </header>

      <main className="layout">
        {session && (
          <section className="hero-strip">
            <div>
              <span className="eyebrow">Live campus feed</span>
              <h2>Post once, reach everyone instantly.</h2>
              <p className="subtitle">
                Notices appear in real time for every visitor. Stay clear, stay brief,
                and keep the community informed.
              </p>
            </div>
            <div className="hero-stats">
              <div>
                <p className="stat-label">Access</p>
                <p className="stat-value">Public feed</p>
              </div>
              <div>
                <p className="stat-label">Posting</p>
                <p className="stat-value">Registered users</p>
              </div>
              <div>
                <p className="stat-label">Sync</p>
                <p className="stat-value">Realtime updates</p>
              </div>
            </div>
          </section>
        )}

        {session ? (
          <section className="panel">
            <NoticeForm session={session} categories={categories} />
          </section>
        ) : (
          showAuth && (
            <section className="panel auth-panel">
              <AuthForm />
            </section>
          )
        )}

        <NoticeBoard session={session} categories={categories} />

        {session && (
          <section className="rules-panel">
            <div className="helper">
              <h3>Posting rules</h3>
              <ul>
                <li>Keep titles short and action-focused.</li>
                <li>Use categories to help others filter.</li>
                <li>Only the author can delete a notice.</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
