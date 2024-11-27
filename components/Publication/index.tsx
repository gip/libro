'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FeedItem } from '@/components/FeedItem'
import {
  MiniKit,
  VerificationLevel,
  VerifyCommandInput
} from "@worldcoin/minikit-js"
import { JsonValue, sortAndStringifyJson } from '@/lib/json'
import Editor from '@/components/Editor'


type DraftData = {
  id?: string;
  title: string;
  content: { content: string } | null;
  authorId?: string;
}

type Author = {
  id: string;
  name: string;
}

export const Publication = ({ publicationId }: { publicationId: string | null }) => {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [originalDraft, setOriginalDraft] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [initialContent, setInitialContent] = useState<Object | null>(null);
  const [initialTitle, setInitialTitle] = useState<string>('');
  const [initialSubtitle, setInitialSubtitle] = useState<string>('');
  const [initialAuthorId, setInitialAuthorId] = useState<string | null>(null);

  const setContent = (content: Object) => {}

  const setTitle = (title: string) => {}

  const setSubtitle = (subtitle: string) => {}

  const setAuthorId = (authorId: string | null) => {}

  useEffect(() => {
    const fetchDraft = async () => {
      if (publicationId) {
        try {
          const raw = await fetch(`/api/publication/${publicationId}`);
          const response = await raw.json();
          if (response.success) {
            setDraft(response.data);
            setOriginalDraft(response.data);
            setInitialContent(response.data.content.content);
            setInitialTitle(response.data.title);
            setInitialSubtitle(response.data.subtitle);
            setInitialAuthorId(response.data.authorId);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Failed to fetch draft:', error);
          router.push('/');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [publicationId, router]);


  if (loading) {
    return <FeedItem item={null} />;
  }

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      {error && <div className="text-red-500">{error}</div>}
      <Editor authors={authors}
              initialContent={initialContent}
              initialTitle={initialTitle}
              initialSubtitle={initialSubtitle}
              initialAuthorId={initialAuthorId}
              setContent={setContent}
              setTitle={setTitle}
              setSubtitle={setSubtitle}
              setAuthorId={setAuthorId}
              editable={false}
              />
    </div>
  );
}
