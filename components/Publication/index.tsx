'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type PublicationData = {
  id: string
  title: string
  content: { content: string }
  author_name: string
}

export const Publication = ({ publicationId }: { publicationId: string }) => {
  const [publication, setPublication] = useState<PublicationData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const raw = await fetch(`/api/publication/${publicationId}`)
        const response = await raw.json()
        if (response.success) {
          setPublication(response.data)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch publication:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchPublication()
  }, [publicationId, router])

  if (loading) {
    return <div className="w-[90%] mx-auto py-4">Loading...</div>
  }

  if (!publication) {
    return null
  }

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
      <h1 className="text-3xl font-bold">{publication.title}</h1>
      <div className="text-gray-600">By {publication.author_name}</div>
      <div className="prose max-w-none">
        {publication.content.content}
      </div>
    </div>
  )
} 