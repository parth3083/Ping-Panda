import { SignUp } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
      <div className='relative w-full flex flex-1 flex-col items-center justify-center
    '>
          <SignUp fallbackRedirectUrl={"/welcome"} forceRedirectUrl={"/welcome"}/>
    </div>
  )
}

export default page