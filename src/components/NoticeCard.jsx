function NoticeCard({ notice, session, onDelete }) {
  const isOwner = session?.user?.id === notice.user_id
  const postedAt = new Date(notice.created_at).toLocaleString()
  const author = notice.profiles?.display_name || notice.profiles?.email || 'Unknown'

  return (
    <article className="notice-card">
      <div className="notice-head">
        <div>
          <span className="notice-category">{notice.category}</span>
          <h3>{notice.title}</h3>
        </div>
        {isOwner && (
          <button className="btn danger" onClick={() => onDelete(notice.id)}>
            Delete
          </button>
        )}
      </div>
      <p className="notice-body">{notice.body}</p>
      <div className="notice-meta">
        <span>By {author}</span>
        <span>{postedAt}</span>
      </div>
    </article>
  )
}

export default NoticeCard
