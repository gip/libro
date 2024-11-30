import Editor from '@/components/Editor'
import { Diamond } from '@/components/Diamond'
import { timeAgo } from '@/lib/time'
import Link from 'next/link'

type Publication = {
  author_id_libro: string;
  publication_date: string;
  author_name_libro: string;
  publication_title: string;
  publication_content: {
    content: {
      type: string;
      content: Array<any>;
    }
  };
  publication_subtitle: string;
}

type Author = {
  id: string;
  name: string;
}

export const Publication = ({ publication, proofLink }: { publication: Publication, proofLink?: string }) => {

  const authors: Author[] = [{ id: publication.author_id_libro, name: publication.author_name_libro }]

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      <div className="text-xs text-muted-foreground text-center">
        Signed by {authors[0].name} on {publication.publication_date} ({timeAgo(publication.publication_date)}). <br />{proofLink ? <Link href={proofLink}>Proof can be verified</Link> : 'Proof can be verified'} on Worldchain.
      </div>
        <Editor authors={authors}
              initialContent={publication.publication_content.content}
              initialTitle={publication.publication_title}
              initialSubtitle={publication.publication_subtitle}
              initialAuthorId={publication.author_id_libro}
              editable={false}
              />
        <Diamond />
    </div>
  );
}
