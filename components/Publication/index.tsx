import Editor from '@/components/Editor'
import { timeAgo } from '@/lib/time'
import Link from 'next/link'
import { PublicationV1 as PublicationType, Author } from '@/lib/db/objects'

export const Publication = ({ publication, proofLink }: { publication: PublicationType, proofLink?: string }) => {

  const authors: Author[] = [{ id: publication.author_id_libro, name: publication.author_name_libro,
                               bio: publication.author_bio_libro, handle: publication.author_handle_libro }]

  const content = 'content' in publication.publication_content 
    ? publication.publication_content.content
    : publication.publication_content.html

  return (
    <div className="w-[96%] mx-auto space-y-4 py-4">
      {/* <div className="text-xs text-muted-foreground text-center">
        Signed by <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/a/${authors[0].id}`} className="underline hover:text-primary">{authors[0].name}</Link> {timeAgo(publication.publication_date)}. <br />
        Proof of authorship can be {proofLink ? (
          <Link href={proofLink} className="underline hover:text-primary">
            verified
          </Link>
        ) : (
          'verified'
        )} independently.
      </div> */}
        <Editor authors={authors}
              initialContent={content}
              initialTitle={publication.publication_title}
              initialSubtitle={publication.publication_subtitle}
              initialAuthorId={publication.author_id_libro}
              publicationDate={publication.publication_date}
              editable={false}
              />
    </div>
  );
}
