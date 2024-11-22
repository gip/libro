import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'

export type FeedItemD = {
    id: string;
    title: string;
    content: { content: string };
    created_at?: string;
    updated_at?: string;
}

const FeedItemLoading = () => (
  <>
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </>)

export const FeedItem = ({ item }: { item: FeedItemD | null }) => {
  const router = useRouter();

  const handleClick = () => {
    if (item) {
      router.push(`/d/${item.id}`);
    }
  };

  return (
    <Card key={item?.id} className={`shadow-sm w-full ${item ? 'cursor-pointer' : ''}`} onClick={handleClick}>
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-base font-semibold">
          {item ? item.title : <FeedItemLoading />}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="text-sm text-muted-foreground line-clamp-2">
          {item ? item.content.content : <FeedItemLoading />}
        </div>
      </CardContent>
    </Card>
  );
}
