import type { CSSProperties } from 'react'
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

function deltaToScreenCenter(at: { x: number; y: number }) {
  const treeSize = Math.min(0.92 * window.innerHeight, 0.88 * window.innerWidth)
  const leafX = (window.innerWidth - treeSize) / 2 + (at.x / 100) * treeSize
  const leafY = (window.innerHeight - treeSize) / 2 + (at.y / 100) * treeSize
  return {
    dx: window.innerWidth / 2 - leafX,
    dy: window.innerHeight / 2 - leafY,
  }
}

export function FlyingLeaf({ leaf }: Props) {
  const { dx, dy } = deltaToScreenCenter(leaf.at)

  const style = {
    '--x': leaf.at.x,
    '--y': leaf.at.y,
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    '--rest': `${leaf.rest}deg`,
    '--spin': `${leaf.spin}deg`,
    '--name-scale': nameScale(leaf.name),
  } as CSSProperties

  return (
    <div className="leaf-slot is-flying" style={style}>
      <div className="leaf">
        <img className="leaf__img" src={leafImage} alt="" draggable={false} />
        <span className="leaf__name">{leaf.name}</span>
      </div>
    </div>
  )
}
