import type { PostMeta } from '@/lib/content'

const cleanText = (value: string) => value.replace(/[—–]/g, '-').trim()

interface BlogOgImageProps {
  title: string
  summary?: string
  date?: string
  tags?: string[]
  author?: string
  section?: string
}

export function BlogOgImage({
  title,
  summary,
  date,
  tags = [],
  author = 'Hoang Nguyen',
  section = 'Notes',
}: BlogOgImageProps) {
  const visibleTags = tags.slice(0, 3).map(cleanText)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '54px 62px',
        background: '#09090b',
        color: '#fafafa',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          backgroundImage:
            'linear-gradient(rgba(161,161,170,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(161,161,170,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 448,
          height: 1,
          display: 'flex',
          background: '#2563eb',
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 440,
          right: 92,
          width: 16,
          height: 16,
          display: 'flex',
          background: '#2563eb',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        <div style={{ display: 'flex', color: '#3b82f6' }}>@hoangndst</div>
        <div style={{ display: 'flex', color: '#71717a', fontSize: 18 }}>/</div>
        <div style={{ display: 'flex', color: '#a1a1aa', fontSize: 18 }}>{cleanText(section)}</div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxWidth: 920,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 58 ? 48 : 58,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.045em',
          }}
        >
          {cleanText(title)}
        </div>
        {summary ? (
          <div style={{ display: 'flex', color: '#a1a1aa', fontSize: 22, lineHeight: 1.35 }}>
            {cleanText(summary).slice(0, 150)}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          color: '#a1a1aa',
          fontSize: 18,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', color: '#d4d4d8' }}>{cleanText(author)}</div>
          {date ? <div style={{ display: 'flex' }}>{cleanText(date)}</div> : null}
        </div>
        <div style={{ display: 'flex', gap: 8, color: '#60a5fa' }}>
          {visibleTags.map((tag) => (
            <div key={tag} style={{ display: 'flex' }}>{tag}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function postToOgImageProps(post: PostMeta) {
  return {
    title: post.title,
    summary: post.summary,
    date: post.date,
    tags: post.tags,
    section: post.path.split('/')[0] || 'Notes',
  }
}
