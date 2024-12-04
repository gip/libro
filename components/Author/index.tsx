'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type AuthorData = {
  id?: string;
  name: string;
  bio: string;
  avatar_url?: string;
}

export const Author = ({ authorId }: { authorId: string | null }) => {
  const { data: session, status } = useSession();
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [originalAuthor, setOriginalAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [authorNotFound, setAuthorNotFound] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!authorId && status === 'unauthenticated') {
      signIn('worldcoin')
    }
  }, [status, authorId])

  useEffect(() => {
    const fetchAuthor = async () => {
      if (authorId) {
        try {
          const raw = await fetch(`/api/author/${authorId}`);
          const response = await raw.json();
          if (response.success) {
            setAuthor(response.author);
            setOriginalAuthor(response.author);
            setIsSelf(response.self);
          } else {
            setAuthorNotFound(true);
          }
        } catch (error) {
          console.error('Failed to fetch author:', error);
          setAuthorNotFound(true);
        }
      } else {
        // If authorId is null, allow creating a new author if logged in
        if (session) {
          setAuthor({ name: '', bio: '', avatar_url: '' });
          setIsSelf(true);
        }
      }
      setLoading(false);
    };

    fetchAuthor();
  }, [authorId, router, session]);

  const handleSave = async () => {
    try {
      const method = 'POST';
      const raw = await fetch(`/api/author/`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
      });
      const response = await raw.json();
      if (response.success) {
        setOriginalAuthor(author);
        if (response.author?.id) {
          router.replace(`/a/${response.author.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to save author:', error);
      setError('Failed to save author');
    }
  };

  const isAuthorChanged = useCallback(() => {
    return JSON.stringify(author) !== JSON.stringify(originalAuthor);
  }, [author, originalAuthor]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authorNotFound) {
    return <div>Author not found</div>;
  }

  if (!session && !authorId) {
    return <div>Please log in</div>;
  }

  if (authorId && author) {
    return (
      <div className="w-[90%] mx-auto space-y-8 py-8">
        <div className="space-y-4">
          <div>
            <span className="text-base">Author: </span>
            <span className="text-2xl">{author.name}</span>
          </div>
          <div>
            <span className="text-base">Bio: </span>
            <span className="text-2xl">{author.bio}</span>
          </div>
          <div>
            <span className="text-base">Avatar: </span>
            <span className="text-2xl">{author.avatar_url}</span>
          </div>
          <div>
            <span className="text-base">Author URL: </span>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/a/${authorId}`} className="text-sm text-blue-500 hover:underline">
              {`${process.env.NEXT_PUBLIC_APP_URL}/a/${authorId}`}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      {error && <div className="text-red-500">{error}</div>}
      <Input
        value={author?.name || ''}
        onChange={(e) => setAuthor({ ...author, name: e.target.value } as AuthorData)}
        placeholder="Name"
        className="w-full"
        disabled={!!authorId}
      />
      <Textarea
        value={author?.bio || ''}
        onChange={(e) => setAuthor({ ...author, bio: e.target.value } as AuthorData)}
        placeholder="Bio"
        className="w-full"
        disabled={!!authorId}
      />
      <Input
        value={author?.avatar_url || ''}
        onChange={(e) => setAuthor({ ...author, avatar_url: e.target.value } as AuthorData)}
        placeholder="Avatar URL"
        className="w-full"
        disabled={!!authorId}
      />
      {!authorId && isSelf && (
        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={!isAuthorChanged()}>Save</Button>
        </div>
      )}
    </div>
  );
} 