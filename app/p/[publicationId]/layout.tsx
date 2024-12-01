import { getPublication } from '@/lib/db/publication'

type Params = Promise<{ publicationId: string }>

export default async function Layout({ 
    children,
    params
  }: {
    children: React.ReactNode
    params: Params
  }) {
    const { publicationId } = await params
    const publication = await getPublication(publicationId)
    return children
  }
