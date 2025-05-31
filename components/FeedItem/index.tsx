import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/time'

export type FeedItemD = {
    id: string;
    title: string;
    subtitle?: string;
    content: { content: string } | { html: string };
    created_at?: string;
    updated_at?: string;
    author_name?: string;
}

const FeedItemLoading = () => (
  <Skeleton className="h-4 w-[250px]" />
)

export const FeedItem = ({ item }: { item: FeedItemD | null }) => {
  const router = useRouter();

  const handleClick = () => {
    if (item) {
      router.push(`/d/${item.id}`);
    }
  };

  return (
    <Card key={item?.id} className={`shadow-sm w-full ${item ? 'cursor-pointer' : ''}`} onClick={handleClick}>
      <CardContent className="py-2 px-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium line-clamp-1">
            {item ? (item.title || '<No Title>') : <FeedItemLoading />}
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {item ? (
              <>
                <div className="flex items-center gap-2">
                  {item.subtitle && <span className="line-clamp-1">{item.subtitle}</span>}
                  {item.author_name && <span className="italic">Author: {item.author_name}</span>}
                </div>
                {item.created_at && <span className="italic">Started {timeAgo(item.created_at)}</span>}
              </>
            ) : (
              <FeedItemLoading />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
