'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { Diamond } from '@/components/Diamond'
import { Divider } from '@/components/Divider'

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
        <p className="mt-4 text-xs bg-gray-200 p-2 break-words">
          {session.user.name}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500 p-4">
        This unique ID is the only information we store about you.
        It is application-specific and cannot be traced.
      </p>
      <Divider />
      <Diamond />
      <div className="flex justify-center space-x-12 mt-4">
        <a href="/terms" className="text-blue-500 hover:underline">Terms of Use</a>
        <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
      </div>
    </div>
  </>);
}

export default Home