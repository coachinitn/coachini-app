import React from 'react'

export const useLockScroll = (toggle: boolean) => {
  let position = React.useRef(window.scrollY)
  React.useEffect(() => {
    if (toggle) position.current = window.scrollY
    document.body.style.top = toggle ? `-${position.current}px` : ''
    document.body.style.height = toggle ? `100vh` : ''
    document.body.style.position = toggle ? 'fixed' : ''
    window.scrollTo(0, position.current)
  }, [toggle])
}
