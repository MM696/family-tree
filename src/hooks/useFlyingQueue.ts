import { useEffect, useState } from 'react'

/**
 * Sends items off one at a time, in order.
 * The next leaf only launches after the previous one has finished (`flightMs`)
 * plus any extra wait built into `staggerMs`.
 * Starts only when `enabled` becomes true.
 */
export function useFlyingQueue(
  count: number,
  staggerMs: number,
  flightMs: number,
  enabled: boolean,
) {
  const [flying, setFlying] = useState<ReadonlySet<number>>(() => new Set())

  useEffect(() => {
    if (!enabled || count === 0) {
      setFlying(new Set())
      return
    }

    const active = new Set<number>()
    const timers = new Set<number>()
    let next = 0
    let busy = false

    const launch = () => {
      if (busy) return

      const index = next
      next = (next + 1) % count
      busy = true
      active.clear()
      active.add(index)
      setFlying(new Set(active))

      const landing = window.setTimeout(() => {
        timers.delete(landing)
        active.delete(index)
        setFlying(new Set(active))
        busy = false
      }, flightMs)
      timers.add(landing)
    }

    launch()
    const interval = window.setInterval(launch, staggerMs)

    return () => {
      window.clearInterval(interval)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [count, staggerMs, flightMs, enabled])

  return flying
}
