import { Header } from '@/components/Header'
import { Author } from '@/components/Author'
import { type Author as AuthorType, type PublicationInfo, getAuthor, getPublicationInfoByAuthor } from '@/lib/db/objects'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'

const Page = async ({ params }: { params: Promise<{ authorId: string }> }) => {
  const resolvedParams = await params;
  const authorIdParam: string | null = !resolvedParams.authorId || resolvedParams.authorId === 'new' ? null : resolvedParams.authorId
  const author: AuthorType | null = authorIdParam ? await getAuthor(authorIdParam) : null
  const publicationInfos: PublicationInfo[] = authorIdParam ? await getPublicationInfoByAuthor(authorIdParam) : []

  if (!resolvedParams.authorId || (resolvedParams.authorId !== 'new' && !author)) {
    notFound()
  }

  return (<>
    <Header />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Author create={resolvedParams.authorId === 'new'} author={author} publicationInfos={publicationInfos} />
    </div>
    <Footer />
  </>)
}

export default Page