import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import leafImage from '../assets/leaf.png'
import type { Leaf } from '../data/leaves'

type Props = {
  leaf: Leaf
}

function nameScale(name: string) {
  const length = name.trim().length
  if (length <= 12) return 1
  if (length <= 20) return 0.9
  if (length <= 28) return 0.8
  if (length <= 38) return 0.7
  return 0.6
}

function deltaFromSlot(slot: HTMLElement) {
  const rect = slot.getBoundingClientRect()
  return {
    dx: window.innerWidth / 2 - (rect.left + rect.width / 2),
    dy: window.innerHeight / 2 - (rect.top + rect.height / 2),
  }
}

export function FlyingLeaf({ leaf }: Props) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [delta, setDelta] = useState<{ dx: number; dy: number } | null>(null)

  useLayoutEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const update = () => setDelta(deltaFromSlot(slot))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [leaf])

  const style = {
    '--x': leaf.at.x,
    '--y': leaf.at.y,
    '--dx': `${delta?.dx ?? 0}px`,
    '--dy': `${delta?.dy ?? 0}px`,
    '--rest': `${leaf.rest}deg`,
    '--spin': `${leaf.spin}deg`,
    '--name-scale': nameScale(leaf.name),
  } as CSSProperties

  return (
    <div
      ref={slotRef}
      className={delta ? 'leaf-slot is-flying' : 'leaf-slot'}
      style={style}
    >
      <div className="leaf">
        <img className="leaf__img" src={leafImage} alt="" draggable={false} />
        <span className="leaf__name">{leaf.name}</span>
      </div>
    </div>
  )
}
