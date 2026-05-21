import { useState } from 'react'
import { supabase } from '../supabaseClient'

const initialForm = {
  title: '',
  body: '',
  category: 'general',
}

function NoticeForm({ session, categories }) {
  const [form, setForm] = useState(initialForm)
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

    const { title, body, category } = form
    const { error: insertError } = await supabase.from('notices').insert({
      title,
      body,
      category,
      user_id: session.user.id,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setForm((prev) => ({ ...prev, title: '', body: '' }))
    setLoading(false)
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="eyebrow">Post</span>
        <h2>Share a notice</h2>
        <p>Anything helpful for the campus community goes here.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Final year viva schedule"
            required
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Body</span>
          <textarea
            name="body"
            rows={4}
            value={form.body}
            onChange={handleChange}
            placeholder="Share the important details here."
            required
          />
        </label>
        {error && <div className="form-note">{error}</div>}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post notice'}
        </button>
      </form>
    </div>
  )
}

export default NoticeForm
