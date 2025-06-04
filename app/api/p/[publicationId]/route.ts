import { getPublication } from '@/lib/db/objects'
import { NextRequest } from 'next/server'
import { unstable_cache } from 'next/cache'

const getCachedPublication = unstable_cache(
  async (publicationId: string) => {
    return getPublication(publicationId)
  },
  ['publication-api'],
  { 
    revalidate: 3600, // Cache for 1 hour
    tags: ['publication'] // Optional: for tag-based revalidation
  }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicationId: string }> }
) {
  const { publicationId } = await params
  
  try {
    const publication = await getCachedPublication(publicationId)
    
    if (!publication) {
      return Response.json(
        { error: 'Publication not found' }, 
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache 404s for 5 minutes
          }
        }
      )
    }
    
    return Response.json(publication, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour, stale-while-revalidate for 24 hours
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Error fetching publication:', error)
    return Response.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache', // Don't cache errors
        }
      }
    )
  }
} 