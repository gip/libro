'use client'

import Link from 'next/link'
import { Feed } from '@/components/Feed'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useSession } from 'next-auth/react'
import { Divider } from '@/components/Divider'

const Page = () => {
  const { data: session, status } = useSession()

  return (<>
    <Header />
    <div className="text-center mt-4">
    {status === 'authenticated' && <h1 className="text-lg">
        For Human Creativity
      </h1>}
      {status !== 'authenticated' && <h1 className="text-5xl">
        For Human Creativity
      </h1>}
      <Divider animate={false} />
    </div>
    {status === 'authenticated' && <Feed />}
    {status !== 'authenticated' && <div className="max-w-3xl mx-auto py-12 px-4">
        Libo is a platform for human creativity. It is a place where you can share your creativity with others.<br /><br />
        Read our introductary post <Link href="/p/1" prefetch={true}>Why Libro?</Link> to learn more.
      </div>}
    <Footer />
  </>);
}

export default Page