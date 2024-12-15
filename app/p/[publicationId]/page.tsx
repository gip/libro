import { Suspense } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Publication } from '@/components/Publication'
import { getPublicationAndProof } from '@/lib/db/objects'

type Params = Promise<{ publicationId: string }>

const Page = async ({ params }: { params: Params }) => {

  const { publicationId } = await params
  const publicationAndProof = await getPublicationAndProof(publicationId)

  return (<>
    <Header />
    <Suspense fallback={<div>Loading...</div>}>
      {publicationAndProof && <Publication publication={publicationAndProof.publication} proof={publicationAndProof.proof} proofLink={`/p/${publicationId}/proof`} />}
    </Suspense>
    <Footer />
  </>)
}

export default Page