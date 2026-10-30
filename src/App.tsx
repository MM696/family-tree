import { useEffect, useState } from 'react'
import leaf from './assets/leaf.png'
import sunrise from './assets/sunrise_background.png'
import tree from './assets/tree.png'
import { LeafTree } from './components/LeafTree'
import { Soundtrack } from './components/Soundtrack'
import { waitForImage } from './waitForImage'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([waitForImage(sunrise), waitForImage(tree), waitForImage(leaf)]).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className={ready ? 'app is-ready' : 'app'}>
      <LeafTree ready={ready} />
      <Soundtrack />
    </main>
  )
}

export default App
