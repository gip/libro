'use client'

import { useSession } from 'next-auth/react'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Header } from '@/components/Header'

export const Top = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('SEE', session);
  }, [session]);

  const [feedItems, setFeedItems] = useState([
    { id: 1, title: "First Post", content: "This is the content of the first post. It contains three lines of text to demonstrate the card layout." },
    { id: 2, title: "Second Post", content: "Here's the second post in our feed. It also has three lines to keep the design consistent across cards." },
    { id: 3, title: "Third Post", content: "And here's our third post. Just like the others, it maintains the three-line format for consistency." },
    { id: 4, title: "Fourth Post", content: "This is the fourth post in our feed. It continues the pattern of three lines of text for consistency." },
    { id: 5, title: "Fifth Post", content: "Here's the fifth post. As with the others, it maintains three lines of text to keep the design uniform." },
    { id: 6, title: "Sixth Post", content: "And here's our sixth post. It follows the same format as the others, with three lines of content." },
  ])

  const addNewItem = () => {
    const newItem = {
      id: feedItems.length + 1,
      title: `New Post ${feedItems.length + 1}`,
      content: "This is a new post that was just added. It also contains three lines of text like the others."
    }
    setFeedItems([...feedItems, newItem])
  }

  return (
    <>
      <Header status={status} session={session} />
      
      <div className="mt-14 min-h-[calc(100vh-3.5rem)]">
        <main className="w-full">
          <div className="w-[90%] mx-auto space-y-2 py-4">
            {feedItems.map((item) => (
              <Card key={item.id} className="shadow-sm w-full">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        <Button
          onClick={addNewItem}
          className="fixed bottom-4 right-4 rounded-full w-10 h-10"
          size="icon"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add new item</span>
        </Button>
      </div>
    </>
  )
}