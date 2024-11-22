'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FeedItem } from '@/components/FeedItem'

type DraftData = {
  id?: string;
  title: string;
  content: { content: string } | null;
}

export const Draft = ({ draftId }: { draftId: string | null }) => {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [originalDraft, setOriginalDraft] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('draftId', draftId);
    const fetchDraft = async () => {
      if (draftId) {
        try {
          const raw = await fetch(`/api/draft?id=${draftId}`);
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

  const handleSave = async () => {
    try {
      const method = draftId ? 'PUT' : 'POST';
      const raw = await fetch('/api/draft', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });
      const response = await raw.json();
      if (response.success) {
        setOriginalDraft(draft); // Update original draft to the saved state
        if (!draftId && response.draft?.id) {
          router.replace(`/d/${response.draft.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handlePublish = async () => {
    await handleSave();
    if (!draftId) return;
    try {
      const raw = await fetch(`/api/draft/${draftId}/publish`, {
        method: 'PUT',
      });
      const response = await raw.json();
      if (response.success) {
        router.push('/');
      } else {
        setError('Failed to verify draft');
      }
    } catch (error) {
      console.error('Failed to verify draft:', error);
      setError('Failed to verify draft');
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
      <Input
        value={draft?.title || ''}
        onChange={(e) => setDraft({ ...draft, title: e.target.value } as DraftData)}
        placeholder="Title"
        className="w-full"
      />
      <Textarea
        value={draft?.content?.content || ''}
        onChange={(e) => setDraft({ ...draft, content: { content: e.target.value } } as DraftData)}
        placeholder="Content"
        className="w-full"
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave} disabled={!isDraftChanged()}>Save</Button>
        {draftId && <Button onClick={handleDelete} variant="destructive">Delete</Button>}
        {draftId && <Button onClick={handlePublish}>Publish</Button>}
      </div>
    </div>
  );
}
