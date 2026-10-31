import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import leafImage from '../assets/leaf.png'
import type { Leaf } from '../data/leaves'

type Props = {
  leaf: Leaf
  /** Slot 0–4 in the current batch; spreads leaves across the screen. */
  slot: number
}

/** Resting spots for a batch of 5, as fractions of the viewport from the centre. */
const SLOTS = [
  { x: -0.36, y: -0.2 },
  { x: 0.36, y: -0.2 },
  { x: 0, y: -0.02 },
  { x: -0.36, y: 0.24 },
  { x: 0.36, y: 0.24 },
] as const

/** Shrink long names so they stay on the leaf. Words are never split. */
function nameScale(name: string) {
  const length = name.trim().length
  if (length <= 14) return 1
  if (length <= 22) return 0.92
  if (length <= 30) return 0.82
  if (length <= 40) return 0.72
  if (length <= 50) return 0.62
  return 0.54
}

/** Grow the leaf a little for longer names so the text still fits. */
function leafScale(name: string) {
  const length = name.trim().length
  if (length <= 18) return 1
  if (length <= 28) return 1.12
  if (length <= 38) return 1.22
  return 1.32
}

function deltaToSlot(slotEl: HTMLElement, slot: number) {
  const rect = slotEl.getBoundingClientRect()
  const target = SLOTS[slot % SLOTS.length]
  const targetX = window.innerWidth / 2 + target.x * window.innerWidth
  const targetY = window.innerHeight / 2 + target.y * window.innerHeight
  return {
    dx: targetX - (rect.left + rect.width / 2),
    dy: targetY - (rect.top + rect.height / 2),
  }
}

export function FlyingLeaf({ leaf, slot }: Props) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [delta, setDelta] = useState<{ dx: number; dy: number } | null>(null)
  const sizeBoost = leafScale(leaf.name)

  useLayoutEffect(() => {
    const el = slotRef.current
    if (!el) return

    const update = () => setDelta(deltaToSlot(el, slot))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [leaf, slot])

  const style = {
    '--x': leaf.at.x,
    '--y': leaf.at.y,
    '--dx': `${delta?.dx ?? 0}px`,
    '--dy': `${delta?.dy ?? 0}px`,
    '--rest': `${leaf.rest}deg`,
    '--spin': `${leaf.spin}deg`,
    '--name-scale': nameScale(leaf.name),
    '--leaf-scale': sizeBoost,
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
