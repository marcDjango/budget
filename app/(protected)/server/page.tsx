import React from 'react'
import { getSession } from '@/lib/session'

export const page = async() => {
    const user = await getSession()
    if(!user){
        console.log("********", user);
        return(
        <p>loading...</p>
        )
    }
  return (
    <div>
      hello {user?.user?.name}
    </div>
  )
}
export default page;