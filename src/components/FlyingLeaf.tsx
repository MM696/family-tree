import type { CSSProperties } from 'react'
import leafImage from '../assets/leaf.png'
import type { Leaf } from '../data/leaves'

type Props = {
  leaf: Leaf
  index: number
  flying: boolean
  growDelayMs: number
}

/** Shrink the sticker text for long names so it stays inside the card. */
function nameScale(name: string) {
  const length = name.trim().length
  if (length <= 12) return 1
  if (length <= 18) return 0.85
  if (length <= 26) return 0.7
  if (length <= 36) return 0.58
  return 0.48
}

export function FlyingLeaf({ leaf, index, flying, growDelayMs }: Props) {
  const style = {
    '--x': leaf.at.x,
    '--y': leaf.at.y,
    '--dx': leaf.to.x - leaf.at.x,
    '--dy': leaf.to.y - leaf.at.y,
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
      </div>
      <span className="leaf__name">{leaf.name}</span>
    </div>
  )
}
