import { Header } from '@/components/Header'
import { Author } from '@/components/Author'
import { type Author as AuthorType, type PublicationInfo, getAuthor, getPublicationInfoByAuthor, getAuthorByHandle } from '@/lib/db/objects'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'

const Page = async ({ params }: { params: Promise<{ authorId: string }> }) => {
  const resolvedParams = await params
  const { authorId } = resolvedParams

  if (!authorId) {
    notFound()
  }

  if (authorId === 'new') {
    return (<>
      <Header />
      <div className="w-[96%] mx-auto space-y-4 py-4">
        <Author create={true} author={null} publicationInfos={[]} />
      </div>
      <Footer />
    </>)
  }

  let author: AuthorType | null = null
  let redirect: string | null = null
  // UUID format check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(authorId)) {
    author = await getAuthor(authorId)
    if (author && author.handle) {
      redirect = `/a/${author.handle}`
    }
  } else if (authorId.length <= 32) {
    author = await getAuthorByHandle(authorId)
  } else {
    notFound()
  }

  if (!author) {
    notFound()
  }

  const publicationInfos = await getPublicationInfoByAuthor(author.id)

  return (<>
    <Header />
    <div className="w-[96%] mx-auto space-y-4 py-4">
      <Author create={false} author={author} publicationInfos={publicationInfos} redirect={redirect} />
    </div>
    <Footer />
  </>)
}

export default Page