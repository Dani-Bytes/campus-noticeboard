import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import NoticeCard from './NoticeCard'

function NoticeBoard({ session, categories }) {
  const [notices, setNotices] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotices = async () => {
    setError('')
    const { data, error: fetchError } = await supabase
      .from('notices')
      .select('id, user_id, title, body, category, created_at, profiles (display_name, email)')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setNotices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('notices-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        () => {
          fetchNotices()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredNotices = useMemo(() => {
    if (filter === 'all') return notices
    return notices.filter((notice) => notice.category === filter)
  }, [filter, notices])

  const handleDelete = async (noticeId) => {
    setError('')
    const { error: deleteError } = await supabase
      .from('notices')
      .delete()
      .eq('id', noticeId)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setNotices((prev) => prev.filter((notice) => notice.id !== noticeId))
  }

  return (
    <section className="board">
      <div className="board-header">
        <div>
          <span className="eyebrow">Notice feed</span>
          <h2>Campus updates</h2>
          <p>Latest announcements and reminders from the community.</p>
        </div>
        <label className="filter">
          <span>Category</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="form-note">{error}</div>}

      {loading ? (
        <div className="empty">Loading notices...</div>
      ) : filteredNotices.length === 0 ? (
        <div className="empty">No notices yet for this category.</div>
      ) : (
        <div className="notice-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              session={session}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default NoticeBoard
