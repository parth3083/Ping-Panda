import React, { ReactNode } from 'react'
import Navbar from '../../components/Navbar'

function Layout({ children }: { children: ReactNode }) {
    
  return (
      <>
          <Navbar />
          {children}
      </>
  )
}

export default Layout