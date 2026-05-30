'use client'

import { useParams } from 'next/navigation'
import { TopBar } from '@/components/top-bar'
import ProfilePage from '@/components/profile-page'

export default function Page() {
  const params = useParams()
  const userId = params.userId as string

  return (
    <>
      <TopBar />
      <ProfilePage userId={userId} />
    </>
  )
}
