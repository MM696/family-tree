/** Decode an image before showing it so refresh does not pop in half-ready pixels. */
export function waitForImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()

    const finish = () => {
      const decoded = img.decode?.() ?? Promise.resolve()
      void decoded.then(() => resolve()).catch(() => resolve())
    }

    img.onload = finish
    img.onerror = () => resolve()
    img.src = src

    if (img.complete) {
      img.onload = null
      finish()
    }
  })
}
