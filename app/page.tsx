'use client'

import { Feed } from '@/components/Feed'
import { Header } from '@/components/Header'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  return (<>
    <Header />
    <div className="text-center mt-8">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome!
      </h1>
    </div>
    {status === 'authenticated' && <Feed />}
  </>);
}
