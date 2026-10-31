import { useEffect, useRef, useState, type CSSProperties } from 'react'
import tree from '../assets/tree.png'
import { leaves } from '../data/leaves'
import { useFlyingQueue } from '../hooks/useFlyingQueue'
import { FlyingLeaf } from './FlyingLeaf'
import './LeafTree.css'

const FLY_START_DELAY_MS = 800

/** How long a batch takes to fly out, show names and fly back. */
const FLIGHT_MS = 8000
const GAP_MS = 800
const STAGGER_MS = FLIGHT_MS + GAP_MS
/** How many leaves fly and display together. */
const BATCH_SIZE = 5

const LEAF_SIZE = 9
/** Each of the 5 leaves fills this fraction of the smaller screen side. */
const FLY_SCREEN = 0.44

function calcZoom(treePx: number) {
  const flyPx = FLY_SCREEN * Math.min(window.innerWidth, window.innerHeight)
  const restPx = (LEAF_SIZE / 100) * treePx
  return Math.max(1, flyPx / restPx)
}

export function LeafTree({ ready }: { ready: boolean }) {
  const treeRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(4)
  const [canFly, setCanFly] = useState(false)
  const flying = useFlyingQueue(leaves.length, STAGGER_MS, FLIGHT_MS, canFly, BATCH_SIZE)
  const flyingIndexes = [...flying]

  useEffect(() => {
    const update = () => {
      const treePx =
        treeRef.current?.getBoundingClientRect().width ??
        Math.min(window.innerHeight, window.innerWidth)
      setZoom(calcZoom(treePx))
    }
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
    <div className="leaf-tree" ref={treeRef} style={style}>
      <img className="leaf-tree__tree" src={tree} alt="Family tree" draggable={false} />
      {flyingIndexes.map((index, slot) => (
        <FlyingLeaf key={`${index}-${slot}`} leaf={leaves[index]} slot={slot} />
      ))}
    </div>
  )
}
