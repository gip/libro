'use client'

import { Button } from "@/components/ui/button"
import { Diamond as DiamondIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const Diamond = () => {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full w-10 h-10"
          size="icon"
        >
          <DiamondIcon className="h-4 w-4" />
          <span className="sr-only">Actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!session && (
          <DropdownMenuItem onClick={() => signIn('worldcoin')}>
            Login
          </DropdownMenuItem>
        )}
        {session && (
          <>
            <DropdownMenuItem onClick={() => router.push('/d/new')}>
              New draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/a/new')}>
              New author
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 