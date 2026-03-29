interface MediaEmbedProps {
  type: 'image' | 'video' | 'none'
  url?: string
  caption?: string
}

export default function MediaEmbed({ type, url, caption }: MediaEmbedProps) {
  if (type === 'none' || !url) return null

  if (type === 'video') {
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={url}
            title={caption || 'Video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {caption && (
          <p className="text-xs text-slate-400 px-3 py-2 bg-slate-900">{caption}</p>
        )}
      </div>
    )
  }

  return (
    <figure className="rounded-xl overflow-hidden bg-slate-100">
      <img
        src={url}
        alt={caption || ''}
        className="w-full h-48 object-cover"
        loading="lazy"
        onError={e => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      {caption && (
        <figcaption className="text-xs text-slate-500 px-3 py-2">{caption}</figcaption>
      )}
    </figure>
  )
}
