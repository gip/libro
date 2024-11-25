'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FeedItem } from '@/components/FeedItem'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MiniKit,
  VerificationLevel,
  VerifyCommandInput
} from "@worldcoin/minikit-js";
import { JsonValue, sortAndStringifyJson } from '@/lib/json';

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

export const Draft = ({ draftId }: { draftId: string | null }) => {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [originalDraft, setOriginalDraft] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingDisabled, setIsEditingDisabled] = useState<boolean>(false);
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    console.log('draftId', draftId);
    const fetchDraft = async () => {
      if (draftId) {
        try {
          const raw = await fetch(`/api/draft/${draftId}`);
          const response = await raw.json();
          if (response.success) {
            setDraft(response.data);
            setOriginalDraft(response.data);
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
  }, [draftId, router]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const raw = await fetch('/api/authors');
        const response = await raw.json();
        if (response.success) {
          setAuthors(response.authors);
        }
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  const handleSave = async () => {
    if (!draftId) return;
    try {
      const raw = await fetch(`/api/draft/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });
      const response = await raw.json();
      if (response.success) {
        setOriginalDraft(draft); // Update original draft to the saved state
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handlePublish = async () => {
    try {
      setIsEditingDisabled(true);
      await handleSave();
      if (!draftId || !draft?.authorId) throw new Error('Draft ID or Author ID is missing');
      
      const author = authors.find((author) => author.id === draft.authorId);
      if (!author) throw new Error('Author not found');
      
      const action = 'written-by-a-human';
      // Create signature payload
      const publicatonPayload: Record<string, JsonValue> = {
        author_id_libro: author.id,
        author_name_libro: author.name,
        publication_content: draft.content,
        publication_title: draft.title,
        publication_date: new Date().toISOString(),
      };
      const verifyPayload: VerifyCommandInput = {
        action,
        signal: sortAndStringifyJson(publicatonPayload),
        verification_level: VerificationLevel.Orb,
      };
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      if (finalPayload.status === 'error') {
        throw new Error('Verification failed');
      }
      const fullPayload = {
        publication: publicatonPayload,
        verification: finalPayload,
      };
      const raw = await fetch(`/api/draft/${draftId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullPayload),
      });
      const response = await raw.json();
      if (response.success) {
        router.push('/');
      } else {
        console.log('Failed to publish:', response);
        throw new Error('Failed to publish');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during publish:', error);
        setError(error.message || 'Failed to verify draft');
      } else {
        console.error('Error during publish:', error);
        setError('Failed to verify draft');
      }
      setIsEditingDisabled(false);
    }
  };

  const handleDelete = async () => {
    if (!draftId) return;
    try {
      const raw = await fetch(`/api/draft?id=${draftId}`, {
        method: 'DELETE',
      });
      const response = await raw.json();
      if (response.success) {
        router.push('/drafts');
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const isDraftChanged = useCallback(() => {
    return JSON.stringify(draft) !== JSON.stringify(originalDraft);
  }, [draft, originalDraft]);

  if (loading) {
    return <FeedItem item={null} />;
  }

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex items-center space-x-2">
        <span>Author:</span>
        <Select
          value={draft?.authorId}
          onValueChange={(value) => setDraft({ ...draft, authorId: value } as DraftData)}
          disabled={isEditingDisabled}
        >
          <SelectTrigger className="max-w-[300px]">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        value={draft?.title || ''}
        onChange={(e) => setDraft({ ...draft, title: e.target.value } as DraftData)}
        placeholder="Title"
        className="w-full"
        disabled={isEditingDisabled}
      />
      <Textarea
        value={draft?.content?.content || ''}
        onChange={(e) => setDraft({ ...draft, content: { content: e.target.value } } as DraftData)}
        placeholder="Content"
        className="w-full"
        disabled={isEditingDisabled}
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave} disabled={!isDraftChanged() || isEditingDisabled}>Save</Button>
        {draftId && <Button onClick={handleDelete} variant="destructive" disabled={isEditingDisabled}>Delete</Button>}
        {draftId && (
          <Button 
            onClick={handlePublish} 
            disabled={!draft?.authorId || isEditingDisabled}
          >
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
