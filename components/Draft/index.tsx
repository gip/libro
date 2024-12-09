'use client'

import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FeedItem } from '@/components/FeedItem'
import {
  MiniKit,
  VerificationLevel,
  VerifyCommandInput
} from "@worldcoin/minikit-js"
import { JsonValue, sortAndStringifyJson } from '@/lib/json'
import { type Author } from '@/types'
import Editor from '@/components/Editor'
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { type PublicationV1 as PublicationType, type ContentOrHtml } from '@/types'

type DraftData = {
  id?: string
  title: string
  subtitle: string
  content: ContentOrHtml
  authorId?: string
}

const AlertDestructive = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Attention</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}

export const Draft = ({ draftId }: { draftId: string | null }) => {
  const { data: session, status } = useSession()
  const [draft, setDraft] = useState<DraftData | null>({ title: '', subtitle: '', content: { html: '' } })
  const [originalDraft, setOriginalDraft] = useState<DraftData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingDisabled, setIsEditingDisabled] = useState<boolean>(false)
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [initialContent, setInitialContent] = useState<Object | null>(null)
  const [initialTitle, setInitialTitle] = useState<string>('')
  const [initialSubtitle, setInitialSubtitle] = useState<string>('')
  const [initialAuthorId, setInitialAuthorId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('worldcoin')
    }
  }, [status])

  const setContent = ({ html }: { html: string }) => {
    setDraft((prevDraft) => prevDraft ? { ...prevDraft, content: { html } } as DraftData : null)
  }

  const setTitle = (title: string) => {
    setDraft((prevDraft) => prevDraft ? { ...prevDraft, title } : null)
  }

  const setSubtitle = (subtitle: string) => {
    setDraft((prevDraft) => prevDraft ? { ...prevDraft, subtitle } : null)
  }

  const setAuthorId = (authorId: string | null) => {
    setDraft((prevDraft) => prevDraft ? { ...prevDraft, authorId } as DraftData : null)
  }

  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        try {
          const raw = await fetch(`/api/draft/${draftId}`)
          const response = await raw.json()
          if (response.success) {
            setDraft(response.data)
            setOriginalDraft(response.data)
            setInitialContent(response.data.content.html)
            setInitialTitle(response.data.title || '')
            setInitialSubtitle(response.data.subtitle || '')
            setInitialAuthorId(response.data.authorId)
          } else {
            router.push('/')
          }
        } catch (error) {
          console.error('Failed to fetch draft:', error)
          router.push('/')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchDraft()
  }, [draftId, router])

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const raw = await fetch('/api/authors')
        const response = await raw.json()
        if (response.success) {
          console.log('Authors:', response.authors)
          setAuthors(response.authors)
        }
      } catch (error) {
        console.error('Failed to fetch authors:', error)
      }
    }

    fetchAuthors()
  }, [])

  const handleSave = async () => {
    try {
      let raw, response
      if (!draftId) {
        raw = await fetch(`/api/draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(draft),
        })
        response = await raw.json()
        if (response.success) {
          setDraft(response.draft)
          setOriginalDraft(response.draft)
          router.push(`/d/${response.draft.id}`)
        }
      } else {
        raw = await fetch(`/api/draft/${draftId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(draft),
        })
        response = await raw.json()
        if (response.success) {
          setOriginalDraft(draft) // Update original draft to the saved state
        }
      }
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  const handlePublish = async () => {
    try {
      if(!MiniKit.isInstalled()) {
        setError('Proof of humanity is required to sign and publish. Please try again in the World App.')
        return
      }
      setIsEditingDisabled(true)
      await handleSave()
      if (!draftId || !draft?.authorId) throw new Error('Draft ID or Author ID is missing')
      
      const author = authors.find((author) => author.id === draft.authorId)
      if (!author) throw new Error('Author not found')
      
      const action = 'written-by-a-human'
      // Create signature payload
      const publicatonPayload: PublicationType = {
        author_id_libro: author.id,
        author_name_libro: author.name,
        author_handle_libro: author.handle,
        author_bio_libro: author.bio || '',
        publication_title: draft.title,
        publication_subtitle: draft.subtitle,
        publication_content: draft.content,
        publication_date: new Date().toISOString(),
      }
      const verifyPayload: VerifyCommandInput = {
        action,
        signal: JSON.stringify(publicatonPayload),
        verification_level: VerificationLevel.Orb,
      }
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)
      if (finalPayload.status === 'error') {
        throw new Error('Verification failed')
      }
      const fullPayload = {
        publication: publicatonPayload,
        verification: finalPayload,
      }
      const raw = await fetch(`/api/draft/${draftId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullPayload),
      })
      const response = await raw.json()
      if (response.success) {
        const publicationId = response.publicationId
        router.push(`/p/${publicationId}`)
      } else {
        throw new Error('Failed to publish')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during publish:', error)
        setError(error.message || 'Failed to verify draft')
      } else {
        console.error('Error during publish:', error)
        setError('Failed to verify draft')
      }
      setIsEditingDisabled(false)
    }
  }

  const handleDelete = async () => {
    if (!draftId) return
    try {
      const raw = await fetch(`/api/draft?id=${draftId}`, {
        method: 'DELETE',
      })
      const response = await raw.json()
      if (response.success) {
        router.push('/drafts')
      }
    } catch (error) {
      console.error('Failed to delete draft:', error)
    }
  }

  const isDraftChanged = useCallback(() => {
    return JSON.stringify(draft) !== JSON.stringify(originalDraft)
  }, [draft, originalDraft])

  if (status === 'loading' || loading) {
    return <FeedItem item={null} />
  }

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      {error && <AlertDestructive message={error} />}

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
      <Editor authors={authors}
              initialContent={initialContent}
              initialTitle={initialTitle}
              initialSubtitle={initialSubtitle}
              initialAuthorId={initialAuthorId}
              setContent={setContent}
              setTitle={setTitle}
              setSubtitle={setSubtitle}
              setAuthorId={setAuthorId}
              />
    </div>
  )
}
