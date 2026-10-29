import type { CSSProperties } from 'react'
import leafImage from '../assets/leaf.png'
import type { Leaf } from '../data/leaves'

type Props = {
  leaf: Leaf
  index: number
  flying: boolean
  growDelayMs: number
}

/** Shrink long names so they stay on the leaf. Words are never split. */
function nameScale(name: string) {
  const length = name.trim().length
  if (length <= 12) return 1
  if (length <= 20) return 0.9
  if (length <= 28) return 0.8
  if (length <= 38) return 0.7
  return 0.6
}

/** How far this leaf must move so its centre sits in the middle of the screen. */
function deltaToScreenCenter(at: { x: number; y: number }) {
  const treeSize = Math.min(0.76 * window.innerHeight, 0.94 * window.innerWidth)
  const leafX = (window.innerWidth - treeSize) / 2 + (at.x / 100) * treeSize
  const leafY = (window.innerHeight - treeSize) / 2 + (at.y / 100) * treeSize
  return {
    dx: window.innerWidth / 2 - leafX,
    dy: window.innerHeight / 2 - leafY,
  }
}

export function FlyingLeaf({ leaf, index, flying, growDelayMs }: Props) {
  const { dx, dy } = deltaToScreenCenter(leaf.at)

  const style = {
    '--x': leaf.at.x,
    '--y': leaf.at.y,
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    '--rest': `${leaf.rest}deg`,
    '--spin': `${leaf.spin}deg`,
    '--sway-delay': `${index * -0.37}s`,
    '--grow-delay': `${growDelayMs}ms`,
    '--name-scale': nameScale(leaf.name),
  } as CSSProperties

  return (
    <div className={flying ? 'leaf-slot is-flying' : 'leaf-slot'} style={style}>
      <div className="leaf">
        <img className="leaf__img" src={leafImage} alt="" draggable={false} />
        <span className="leaf__name">{leaf.name}</span>
      </div>
    </div>
  )
}
