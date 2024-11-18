import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LogIn } from 'lucide-react'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

// export const Header = ({ session }: { session: Session | null }) => {
//   return (
//     <header className="fixed top-0 left-0 right-0 w-full h-14 border-b bg-background z-50">
//       <div className="w-full h-full flex items-center justify-between px-4">
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon" className="md:hidden">
//               <Menu className="h-6 w-6" />
//               <span className="sr-only">Open menu</span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left">
//           <VisuallyHidden.Root><SheetTitle aria-describedby={undefined}>Menu</SheetTitle></VisuallyHidden.Root>
//             <nav className="flex flex-col space-y-4">
//               <a href="#" className="text-lg font-medium">Home</a>
//               <a href="#" className="text-lg font-medium">Profile</a>
//               <a href="#" className="text-lg font-medium">Settings</a>
//               <a href="#" onClick={() => signOut()} className="text-lg font-medium">Log out</a>
//             </nav>
//           </SheetContent>
//         </Sheet>
//         <h1 className="text-xl font-bold">Libro</h1>
//         {!session && <Button
//           className="rounded-full w-10 h-10"
//           size="icon"
//           onClick={() => signIn('worldcoin')}
//         >
//           <LogIn className="h-5 w-5" />
//           <span className="sr-only">Log in</span>
//         </Button>}
//       </div>
//     </header>
//   )
// }



export const Header = ({ status, session }: { status: string, session: Session | null }) => {
  return (
    <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <VisuallyHidden.Root><SheetTitle aria-describedby={undefined}>Menu</SheetTitle></VisuallyHidden.Root>
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-lg font-medium">Home</a>
              <a href="#" className="text-lg font-medium">Profile</a>
              <a href="#" className="text-lg font-medium">Settings</a>
              <a href="#" onClick={() => signOut()} className="text-lg font-medium">Log out</a>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">Libro</h1>
        <h2>{status}</h2>
         {!session && <Button
          className="rounded-full w-10 h-10"
          size="icon"
          onClick={() => signIn('worldcoin')}
        >
          <LogIn className="h-5 w-5" />
          <span className="sr-only">Log in</span>
        </Button>}
      </div>
    </header>
  )
}