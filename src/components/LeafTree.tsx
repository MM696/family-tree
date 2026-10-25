import { useEffect, useState, type CSSProperties } from 'react'
import tree from '../assets/tree.png'
import leafImage from '../assets/leaf.png'
import { leaves } from '../data/leaves'
import { useFlyingQueue } from '../hooks/useFlyingQueue'
import { FlyingLeaf } from './FlyingLeaf'
import './LeafTree.css'

/** Time between one leaf leaving the tree and the next one leaving. */
const STAGGER_MS = 3000
/** How long one leaf takes to fly out, show its name and fly back. */
const FLIGHT_MS = 6000

/** Tree pop animation length. */
const TREE_POP_MS = 850
/** Leaves start growing a little before the tree finishes popping. */
const GROW_START_MS = 400
/** How long the grow wave takes from the first leaf to the last. */
const GROW_WINDOW_MS = 2600
/** How long one leaf takes to sprout. */
const GROW_DURATION_MS = 480
/** Short pause after the canopy is full, before the first flight. */
const INTRO_PAUSE_MS = 700

const INTRO_END_MS = GROW_START_MS + GROW_WINDOW_MS + GROW_DURATION_MS + INTRO_PAUSE_MS

function waitForImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
    if (img.complete) resolve()
  })
}

export function LeafTree() {
  const [phase, setPhase] = useState<'waiting' | 'intro' | 'ready'>('waiting')
  const flying = useFlyingQueue(leaves.length, STAGGER_MS, FLIGHT_MS, phase === 'ready')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setPhase('ready')
      return
    }

    let cancelled = false
    let readyTimer = 0

    const startIntro = () => {
      if (cancelled) return
      setPhase('intro')
      readyTimer = window.setTimeout(() => {
        if (!cancelled) setPhase('ready')
      }, INTRO_END_MS)
    }

    // Wait for assets + two frames so the pop is visible after paint.
    Promise.all([waitForImage(tree), waitForImage(leafImage)]).then(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        requestAnimationFrame(startIntro)
      })
    })

    return () => {
      cancelled = true
      window.clearTimeout(readyTimer)
    }
  }, [])

  const style = {
    '--flight': `${FLIGHT_MS}ms`,
    '--tree-pop': `${TREE_POP_MS}ms`,
    '--grow-duration': `${GROW_DURATION_MS}ms`,
  } as CSSProperties

  return (
    <div
      className={
        phase === 'waiting' ? 'leaf-tree' : phase === 'intro' ? 'leaf-tree is-intro' : 'leaf-tree is-ready'
      }
      style={style}
    >
      <img className="leaf-tree__tree" src={tree} alt="Family tree" draggable={false} />
      {leaves.map((leaf, index) => {
        const growDelay =
          leaves.length <= 1
            ? GROW_START_MS
            : GROW_START_MS + (index / (leaves.length - 1)) * GROW_WINDOW_MS

        return (
          <FlyingLeaf
            key={index}
            leaf={leaf}
            index={index}
            flying={phase === 'ready' && flying.has(index)}
            growDelayMs={growDelay}
          />
        )
      })}
    </div>
  )
}
