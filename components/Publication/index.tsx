'use client'

import { useState } from 'react'
import Editor from '@/components/Editor'
import { Diamond } from '@/components/Diamond'
import { timeAgo } from '@/lib/time'

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

export const Publication = ({ publication }: { publication: Publication }) => {

  const authors: Author[] = [{ id: publication.author_id_libro, name: publication.author_name_libro }]

  const setContent = (content: Object) => {}

  const setTitle = (title: string) => {}

  const setSubtitle = (subtitle: string) => {}

  const setAuthorId = (authorId: string | null) => {}

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      <div className="text-xs text-muted-foreground text-center">
        Signed by {authors[0].name} on {publication.publication_date} ({timeAgo(publication.publication_date)}). <br />Proof can be verified on Worldchain.
      </div>
        <Editor authors={authors}
              initialContent={publication.publication_content.content}
              initialTitle={publication.publication_title}
              initialSubtitle={publication.publication_subtitle}
              initialAuthorId={publication.author_id_libro}
              setContent={setContent}
              setTitle={setTitle}
              setSubtitle={setSubtitle}
              setAuthorId={setAuthorId}
              editable={false}
              />
        <Diamond />
    </div>
  );
}
