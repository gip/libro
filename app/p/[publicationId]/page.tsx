import { Header } from '@/components/Header'
import { Publication } from '@/components/Publication'

const Page = async ({ params }: { params: Promise<{ publicationId: string }> }) => {
  const resolvedParams = await params;

  return (<>
    <Header />
    <Publication publicationId={resolvedParams.publicationId} />
  </>)
}

export default Page 