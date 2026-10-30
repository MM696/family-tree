import { useEffect, useState, type CSSProperties } from 'react'
import tree from '../assets/tree.png'
import { leaves } from '../data/leaves'
import { useFlyingQueue } from '../hooks/useFlyingQueue'
import { FlyingLeaf } from './FlyingLeaf'
import './LeafTree.css'

const FLY_START_DELAY_MS = 800

/** How long one leaf takes to fly out, show its name and fly back. */
const FLIGHT_MS = 8000
const GAP_MS = 800
const STAGGER_MS = FLIGHT_MS + GAP_MS

const LEAF_SIZE = 9
const FLY_SCREEN = 0.78

function calcZoom() {
  const flyPx = FLY_SCREEN * Math.min(window.innerWidth, window.innerHeight)
  const treePx = Math.min(0.92 * window.innerHeight, 0.88 * window.innerWidth)
  const restPx = (LEAF_SIZE / 100) * treePx
  return Math.max(1, flyPx / restPx)
}

export function LeafTree({ ready }: { ready: boolean }) {
  const [zoom, setZoom] = useState(8)
  const [canFly, setCanFly] = useState(false)
  const flying = useFlyingQueue(leaves.length, STAGGER_MS, FLIGHT_MS, canFly)
  const flyingIndex = [...flying][0]

  useEffect(() => {
    const update = () => setZoom(calcZoom())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!ready) {
      setCanFly(false)
      return
    }

    const timer = window.setTimeout(() => setCanFly(true), FLY_START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [ready])

  const style = {
    '--flight': `${FLIGHT_MS}ms`,
    '--size': LEAF_SIZE,
    '--fly-size': `${FLY_SCREEN * 100}vmin`,
    '--zoom': zoom,
  } as CSSProperties

  return (
    <div className="leaf-tree" style={style}>
      <img className="leaf-tree__tree" src={tree} alt="Family tree" draggable={false} />
      {flyingIndex !== undefined && <FlyingLeaf leaf={leaves[flyingIndex]} />}
    </div>
  )
}
