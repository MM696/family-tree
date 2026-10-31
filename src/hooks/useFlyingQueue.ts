import { useEffect, useState } from 'react'

/**
 * Sends items off in batches, in order.
 * The next batch only launches after the previous one has finished (`flightMs`)
 * plus any extra wait built into `staggerMs`.
 * Starts only when `enabled` becomes true.
 */
export function useFlyingQueue(
  count: number,
  staggerMs: number,
  flightMs: number,
  enabled: boolean,
  batchSize = 1,
) {
  const [flying, setFlying] = useState<ReadonlySet<number>>(() => new Set())

  useEffect(() => {
    if (!enabled || count === 0) {
      setFlying(new Set())
      return
    }

    const size = Math.max(1, Math.min(batchSize, count))
    const active = new Set<number>()
    const timers = new Set<number>()
    let next = 0
    let busy = false

    const launch = () => {
      if (busy) return

      busy = true
      active.clear()

      for (let i = 0; i < size; i++) {
        active.add(next)
        next = (next + 1) % count
      }
      setFlying(new Set(active))

      // Keep the flying class on until the CSS 100% keyframe has landed.
      const landing = window.setTimeout(() => {
        timers.delete(landing)
        active.clear()
        setFlying(new Set())
        busy = false
      }, flightMs + 80)
      timers.add(landing)
    }

    launch()
    const interval = window.setInterval(launch, staggerMs)

    return () => {
      window.clearInterval(interval)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [count, staggerMs, flightMs, enabled, batchSize])

  return flying
}
