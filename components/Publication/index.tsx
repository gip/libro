import Editor from '@/components/Editor'
import { Diamond } from '@/components/Diamond'
import { timeAgo } from '@/lib/time'
import Link from 'next/link'
import { Publication as PublicationType, Author } from '@/lib/db/publication'

export const Publication = ({ publication, proofLink }: { publication: PublicationType, proofLink?: string }) => {

  const authors: Author[] = [{ id: publication.author_id_libro, name: publication.author_name_libro }]

  const content = 'content' in publication.publication_content 
    ? publication.publication_content.content
    : publication.publication_content.html

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      <div className="text-xs text-muted-foreground text-center">
        Signed by <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/a/${authors[0].id}`} className="underline hover:text-primary">{authors[0].name}</Link> on {publication.publication_date} ({timeAgo(publication.publication_date)}). <br />
        The proof, persisted on <Link href="https://world.org/world-chain" className="underline hover:text-primary">Worldchain</Link>, can be {proofLink ? (
          <Link href={proofLink} className="underline hover:text-primary">
            verified
          </Link>
        ) : (
          'verified'
        )} independently.
      </div>
        <Editor authors={authors}
              initialContent={content}
              initialTitle={publication.publication_title}
              initialSubtitle={publication.publication_subtitle}
              initialAuthorId={publication.author_id_libro}
              editable={false}
              />
        <Diamond />
    </div>
  );
}
