import { familyNames } from './family'

type Point = { x: number; y: number }

export type Leaf = {
  name: string
  /** Resting spot on the tree, in % of the tree image size. */
  at: Point
  /** Where the leaf flies to while zoomed in, in % of the tree image size. */
  to: Point
  /** Resting angle in degrees, so the tip points away from the middle of the tree. */
  rest: number
  /** Extra tilt in degrees while flying out. */
  spin: number
}

/** The branches of tree.png, as an ellipse in % of the image size, reaching out to the branch tips. */
const CANOPY = { x: 50, y: 38, rx: 42, ry: 30 }
/** Direction the tip of leaf.png points, in degrees (0 = right, -90 = up). */
const LEAF_TIP_ANGLE = -50
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/** The trunk below the branches, kept free of leaves. */
const isOnTrunk = ({ x, y }: Point) => y > 68 && Math.abs(x - 50) < 18

/** `count` evenly spread spots over the canopy, using a sunflower spiral. */
function spiralSpots(count: number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const radius = Math.sqrt((index + 0.5) / count)
    const angle = index * GOLDEN_ANGLE
    return {
      x: CANOPY.x + radius * CANOPY.rx * Math.cos(angle),
      y: CANOPY.y + radius * CANOPY.ry * Math.sin(angle),
    }
  })
}

/** Like spiralSpots, but skipping the trunk, while still returning exactly `count` spots. */
function canopySpots(count: number): Point[] {
  for (let total = count; ; total++) {
    const spots = spiralSpots(total).filter((spot) => !isOnTrunk(spot))
    if (spots.length >= count) return spots.slice(0, count)
  }
}

export function layoutLeaves(names: string[]): Leaf[] {
  const spots = canopySpots(names.length)

  return names.map((name, index) => {
    const at = spots[index]
    const to = { x: 50, y: 46 }
    const outward = (Math.atan2(at.y - CANOPY.y, at.x - CANOPY.x) * 180) / Math.PI

    return { name, at, to, rest: outward - LEAF_TIP_ANGLE, spin: index % 2 ? -12 : 12 }
  })
}

export const leaves = layoutLeaves(familyNames)
