const SPOTIFY_EMBED_SRC =
  'https://open.spotify.com/embed/album/31KoC0LRVGDfHMFFLWfrqo?utm_source=generator'

export function SpotifyEmbed() {
  return (
    <iframe
      data-testid="embed-iframe"
      src={SPOTIFY_EMBED_SRC}
      title="xFactor on Spotify"
      width="100%"
      height="352"
      style={{ borderRadius: 12 }}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="w-full"
    />
  )
}
