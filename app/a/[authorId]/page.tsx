import { Header } from '@/components/Header'
import { Author } from '@/components/Author'

const Page = async ({ params }: { params: Promise<{ authorId: string }> }) => {
  const resolvedParams = await params;
  const authorIdParam: string | null = !resolvedParams.authorId || resolvedParams.authorId === 'new' ? null : resolvedParams.authorId

  return (<>
    <Header />
    <Author authorId={authorIdParam} />
  </>)
}

export default Page 