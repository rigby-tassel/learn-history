interface MediaEmbedProps {
  type: 'image' | 'video' | 'none'
  url?: string
  caption?: string
}

export default function MediaEmbed({ type, url, caption }: MediaEmbedProps) {
  if (type === 'none' || !url) return null

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
    <div className="relative w-full h-56 sm:h-64 bg-slate-200 overflow-hidden">
      <img
        src={url}
        alt={caption || ''}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2.5">
          <p className="text-xs text-white/90 leading-tight">{caption}</p>
        </div>
      )}
    </div>
  )
}
