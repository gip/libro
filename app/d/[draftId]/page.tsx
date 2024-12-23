import { Header } from '@/components/Header'
import { Draft } from '@/components/Draft'
import { Footer } from '@/components/Footer'

const Page = async ({ params }: { params: Promise<{ draftId: string }> }) => {

  const resolvedParams = await params
  const draftIdParam: string | null = !resolvedParams.draftId || resolvedParams.draftId === 'new' ? null : resolvedParams.draftId

  return (<>
    <Header />
    <Draft draftId={draftIdParam} />
    <Footer />
  </>)
}

export default Page