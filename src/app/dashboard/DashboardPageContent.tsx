import { useQuery } from '@tanstack/react-query'
import React from 'react'

function DashboardPageContent() {
    const { } = useQuery({
        queryKey: ["user-event-categories"],
        queryFn: async () => {
            
        }
    })
  return (
    <div>DashboardPageContent</div>
  )
}

export default DashboardPageContent