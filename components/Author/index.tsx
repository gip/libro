'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type Author as AuthorType, type PublicationInfo } from '@/lib/db/objects'
import Link from 'next/link'

export const Author = ({ create, author, publicationInfos, redirect }: { create: boolean, author: AuthorType | null, publicationInfos: PublicationInfo[], redirect: string | null }) => {
  const { data: session, status } = useSession()
  const [newAuthor, setNewAuthor] = useState<Omit<AuthorType, 'id'>>({ 
    name: '',
    bio: ''
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (create && status === 'unauthenticated') {
      signIn('worldcoin')
    }
  }, [create, status])

  useEffect(() => {
    if (redirect) {
      router.replace(redirect)
    }
  }, [redirect, router])

  const handleSave = async () => {
    try {
      const raw = await fetch(`/api/author/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
      })
      const response = await raw.json()
      if (response.success && response.author?.id) {
        router.replace(`/a/${response.author.id}`)
      }
    } catch (error) {
      console.error('Failed to save author:', error)
      setError('Failed to save author')
    }
  }

  if (author) {
    return (<>
      <div className="w-[90%] mx-auto">
        <div className="text-xs italic text-center text-gray-500">This author was created by a human on Libro. Every publication under this author is signed by a human.<br/>This is not a bot.</div>
      </div>
      <div className="w-[90%] mx-auto space-y-8 py-8">
        <div className="space-y-4 text-center">
          <div>
            <span className="text-xs">Author: </span>
            <span className="text-3xl">{author.name}</span>
          </div>
          <div>
            <span className="text-xs">Bio: </span>
            <span className="text-md">{author.bio}</span>
          </div>
          <div className="text-xm text-blurple">
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/a/${author.handle}`} className="text-sm hover:underline">
              {`@${author.handle}`}
            </a>
          </div>
          <div className="text-xm text-blurple">
            <span className="text-xs">Link: </span>
            <span>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/a/${author.id}`} className="text-sm text-burple hover:underline">
              {`${process.env.NEXT_PUBLIC_APP_URL}/a/${author.id}`}
            </a></span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {publicationInfos.length === 0 && "This author has not published yet"}
            {publicationInfos.length > 0 && publicationInfos.length <= 20 && 
              `This author has ${publicationInfos.length} publication${publicationInfos.length !== 1 ? 's:' : '.'}`
            }
            {publicationInfos.length > 20 && "This author has 20+ publications:"}
          </div>
          </div>
          <div className="space-y-4">
            {publicationInfos.slice(0, 20).map(publicationInfo => (
              <Link href={`/p/${publicationInfo.id}`} key={publicationInfo.id}>
                <div className="flex items-center gap-2">
                  <span>
                    <span className="italic underline hover:text-blue-500">{publicationInfo.publication_title}</span>
                    <br/>
                    <span className="text-xs">{new Date(publicationInfo.publication_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric', 
                      year: 'numeric'
                    })}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </>)
  }

  if (create && status === 'authenticated') {
    return (
      <div className="w-[90%] mx-auto space-y-4 py-4">
        {error && <div className="text-red-500">{error}</div>}
        <Input
          value={newAuthor.name}
          onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Name"
          className="w-full"
        />
        <Textarea
          value={newAuthor.bio || ''}
          onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Bio"
          className="w-full"
        />
        <div className="flex space-x-2">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    )
  }

  return <div className="w-[90%] mx-auto space-y-4 py-4">Author not found</div>
}