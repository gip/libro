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
    {status !== 'authenticated' && <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        Soon, most of the content accessible to us will have been created by machines. The space for human-created texts,
        stories, novels, publications, articles, and pictures will shrink dramatically. Storing and preserving them will
        become significantly more challenging. Our mission is to ensure human creativity thrives in the future by empowering
        individuals to create, sign, share, verify, archive and pay for content made by other humans in a fully decentralized
        and permissionless way. So simple. So important.
      </div>}
    <div className="max-w-3xl mx-auto py-12 px-4 text-left text-xs">Libro is currently in the "Make It Work" stage.</div>
    <Footer />
  </>);
}

export default Page