import { Suspense } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Proof } from '@/components/Proof'
import { getProof, getPublication } from '@/lib/db/publication'

type Params = Promise<{ publicationId: string }>

const Page = async ({ params }: { params: Params }) => {

  const { publicationId } = await params
  const publication = await getPublication(publicationId)
  const proof = await getProof(publicationId)

  return (<>
    <Header />
    <Suspense fallback={<div>Loading...</div>}>
      {publication && proof && <Proof proof={proof} publication={publication} />}
    </Suspense>
    <Footer />
  </>)
}

export default Page