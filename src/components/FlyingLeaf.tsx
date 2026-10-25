import type { CSSProperties } from 'react'
import leafImage from '../assets/leaf.png'
import type { Leaf } from '../data/leaves'

type Props = {
  leaf: Leaf
  index: number
  flying: boolean
  growDelayMs: number
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
