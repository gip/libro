'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { FeedItemD } from '@/components/FeedItem'
import { FeedItem } from '@/components/FeedItem'
import { Diamond } from '@/components/Diamond'

type FeedStatus = 'loading' | 'ready'

export const Feed = () => {
  const { data: session, status } = useSession(); 
  const [feedStatus, setFeedStatus] = useState<FeedStatus>('loading')
  const [feedItems, setFeedItems] = useState<FeedItemD[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = await fetch('/api/drafts');
        const response = await raw.json();
        if(response.success) {
          const drafts = response.drafts;
          setFeedItems(drafts)
          setFeedStatus('ready')
        }
      } catch (error) {
        console.error('Failed to fetch drafts:', error)
      }
    };

    fetchData();
  }, []);

  const FeedContent = () => (
    <div className="w-[90%] mx-auto space-y-2 py-4">
      {feedItems && feedItems.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  )

  const FeedLoading = () => (
    <div className="w-[90%] mx-auto space-y-2 py-4">
      <FeedItem item={null} />
      <FeedItem item={null} />
    </div>
  )

  return (
    <>      
      <div className="mt-14 min-h-[calc(100vh-3.5rem)]">
        <main className="w-full">
          {feedStatus === 'loading' &&
              <FeedLoading />}
          {feedStatus === 'ready' &&
            <FeedContent />}
        </main>
        <Separator className="my-4" />
        <Diamond />
      </div>
    </>
  )
}