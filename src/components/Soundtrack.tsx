import { useEffect, useRef, useState, type PointerEvent } from 'react'
import './Soundtrack.css'

const SONG = '/Lucy_Thomas_-_You_Raise_Me_Up_CeeNaija.com_.mp3'

export function Soundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const markPlaying = () => setPlaying(true)
    const markPaused = () => setPlaying(false)

    audio.addEventListener('playing', markPlaying)
    audio.addEventListener('pause', markPaused)

    const tryPlay = () => {
      void audio.play().catch(() => setPlaying(false))
    }

    tryPlay()

    const startOnGesture = () => {
      if (audio.paused) tryPlay()
    }

    window.addEventListener('pointerdown', startOnGesture)
    window.addEventListener('keydown', startOnGesture)

    return () => {
      audio.removeEventListener('playing', markPlaying)
      audio.removeEventListener('pause', markPaused)
      window.removeEventListener('pointerdown', startOnGesture)
      window.removeEventListener('keydown', startOnGesture)
    }
  }, [])

  const toggle = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }

  return (
    <>
      <audio ref={audioRef} src={SONG} loop preload="auto" />
      <button
        type="button"
        className={playing ? 'soundtrack is-playing' : 'soundtrack'}
        onPointerDown={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? '♪' : '▶'}
      </button>
    </>
  )
}
