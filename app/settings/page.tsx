'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { Diamond } from '@/components/Diamond'

const Home = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  return (<>
    <Header />
    <div className="text-center mt-8">
      <h2 className="text-2xl font-bold">User Information</h2>
      {session && session.user && (
        <p className="mt-4 text-xs bg-gray-200">{session.user.name}</p>
      )}
      <p className="mt-2 text-sm text-gray-500">
        This unique ID is the only information we store about you.
        It is application-specific and cannot be traced.
      </p>
      <Diamond />
    </div>
  </>);
}

export default Home