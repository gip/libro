'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Separator } from "@/components/ui/separator"
import type { FeedItemD } from '@/components/FeedItem'
import { FeedItem } from '@/components/FeedItem'

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
      <div className="w-[90%] mx-auto">
        <main className="w-full">
          <div className="text-left p-4 flex items-start gap-2">
            <h2 className="text-2xl font-bold">Your Drafts</h2>
            {/* <Link href="/d/new" className="hover:bg-gray-300 bg-gray-200 p-1 rounded-md mt-1">
              <Plus size={10} />
            </Link> */}
          </div>
          {feedStatus === 'loading' &&
              <FeedLoading />}
          {feedStatus === 'ready' &&
            <FeedContent />}
        </main>
      </div>
    </>
  )
}