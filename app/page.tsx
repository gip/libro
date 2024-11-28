'use client'

import { Diamond } from '@/components/Diamond'
import { Feed } from '@/components/Feed'
import { Header } from '@/components/Header'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  return (<>
    <Header />
    <div className="text-center mt-4">
      <h1 className="text-5xl">
        For Human Creativity
      </h1>
      <div style={{ width: '150px', height: '2px', backgroundColor: 'black', margin: '10px auto 0' }}></div>
    </div>
    {status === 'authenticated' && <Feed />}
    <Diamond />
  </>);
}
