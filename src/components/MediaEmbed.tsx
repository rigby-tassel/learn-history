import { useState } from 'react'

interface MediaEmbedProps {
  type: 'image' | 'video' | 'none'
  url?: string
  caption?: string
}

export default function MediaEmbed({ type, url, caption }: MediaEmbedProps) {
  const [failed, setFailed] = useState(false)

  if (type === 'none' || !url || failed) return null

  if (type === 'video') {
    return (
      <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={url}
          title={caption || 'Video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-48 sm:h-56 bg-muted overflow-hidden">
      <img
        src={url}
        alt={caption || ''}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2.5">
          <p className="text-xs text-white/90 leading-tight">{caption}</p>
        </div>
      )}
    </div>
  )
}
