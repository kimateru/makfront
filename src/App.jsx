import React, { useRef } from 'react'
import Hero from './components/Hero'

const App = () => {
  const wrapperRef = useRef(null);
  
  return (
    <>
      <Hero scrollContainer={wrapperRef} />
    </>
  )
}

export default App