import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthForm from './components/AuthForm'
import NoticeBoard from './components/NoticeBoard'
import NoticeForm from './components/NoticeForm'

const categories = ['general', 'academic', 'event', 'urgent', 'clubs']

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
          {session && (
            <button className="btn ghost" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          {session ? (
            <NoticeForm session={session} categories={categories} />
          ) : (
            <AuthForm />
          )}
          <div className="helper">
            <h3>Posting rules</h3>
            <ul>
              <li>Keep titles short and action-focused.</li>
              <li>Use categories to help others filter.</li>
              <li>Only the author can delete a notice.</li>
            </ul>
          </div>
        </section>
        <NoticeBoard session={session} categories={categories} />
      </main>
    </div>
  )
}

export default App
