import { useEffect, useState } from 'react'

/**
 * Sends items off one at a time, in order, every `staggerMs`.
 * Each item stays in the returned set for `flightMs`, then it is free to fly again.
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
    const landings = new Set<number>()
    let next = 0
    let interval = 0

    const launch = () => {
      const index = next
      next = (next + 1) % count
      if (active.has(index)) return

      active.add(index)
      setFlying(new Set(active))

      const landing = window.setTimeout(() => {
        landings.delete(landing)
        active.delete(index)
        setFlying(new Set(active))
      }, flightMs)
      landings.add(landing)
    }

    launch()
    interval = window.setInterval(launch, staggerMs)

    return () => {
      window.clearInterval(interval)
      landings.forEach((landing) => window.clearTimeout(landing))
    }
  }, [count, staggerMs, flightMs, enabled])

  return flying
}
