import { Suspense } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Publication } from '@/components/Publication'
import { getPublication } from './layout'

type Params = Promise<{ publicationId: string }>

const Page = async ({ params }: { params: Params }) => {

  const { publicationId } = await params
  const publication = await getPublication(publicationId)

  return (<>
    <Header />
    <Suspense fallback={<div>Loading...</div>}>
      {publication && <Publication publication={publication} proofLink={`/p/${publicationId}/proof`} />}
      {!publication && <div>Publication not found</div>}
    </Suspense>
    <Footer />
  </>)
}

export default Page