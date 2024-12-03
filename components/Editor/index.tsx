'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Bold, Italic, Strikethrough, Quote, LinkIcon, ImageIcon, List, ListOrdered, ChevronDown, X, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import './editor.css'

export type Author = {
  id: string;
  name: string;
};
import { all, createLowlight } from 'lowlight'

const lowlight = createLowlight(all)
lowlight.register('js', js)
lowlight.register('ts', ts)


export default function Editor({ 
  authors, 
  initialContent, 
  setContent = () => {},
  initialTitle, 
  setTitle = () => {},
  initialSubtitle, 
  setSubtitle = () => {},
  initialAuthorId, 
  setAuthorId = () => {},
  editable = true
}: { 
  authors: Author[], 
  initialContent: Object | null, 
  setContent?: (content: { html: string }) => void,
  initialTitle: string, 
  setTitle?: (title: string) => void,
  initialSubtitle: string, 
  setSubtitle?: (subtitle: string) => void,
  initialAuthorId: string | null, 
  setAuthorId?: (authorId: string | null) => void,
  editable?: boolean,
}) {
  const [author, setLocalAuthor] = useState<Author[]>([])
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false)
  const [title, setLocalTitle] = useState(initialTitle)
  const [subtitle, setLocalSubtitle] = useState(initialSubtitle)

  useEffect(() => {
    if (initialAuthorId) {
      const matchedAuthor = authors.find(author => author.id === initialAuthorId)
      if (matchedAuthor) {
        setLocalAuthor([matchedAuthor])
      }
    }
  }, [initialAuthorId, authors])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: editable ? 'Tell your story...' : '',
      }),
      CodeBlockLowlight.configure({
        lowlight: lowlight,
      }),
    ],
    content: initialContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent({ html: editor.getHTML() })
    }
  })

  const toggleFormat = (type: string) => {
    if (!editor) return
    switch (type) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'quote':
        editor.chain().focus().toggleBlockquote().run()
        break
      case 'bullet-list':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'ordered-list':
        editor.chain().focus().toggleOrderedList().run()
        break
    }
  }

  const removeAuthor = (index: number) => {
    setAuthorId(null)
    setLocalAuthor([])
  }

  const addAuthor = (author: Author) => {
    setAuthorId(author.id)
    setLocalAuthor([author])
    setIsAuthorDialogOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
      {editable && (
        <div className="sticky top-0 z-50 bg-background flex justify-center">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Style
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Normal</DropdownMenuItem>
                  <DropdownMenuItem>Heading 1</DropdownMenuItem>
                  <DropdownMenuItem>Heading 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-1 border-l border-r px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('bold')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('bold') ? 'bg-muted' : ''}`}
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('italic')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('italic') ? 'bg-muted' : ''}`}
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('strike')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('strike') ? 'bg-muted' : ''}`}
                >
                  <Strikethrough className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('quote')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('blockquote') ? 'bg-muted' : ''}`}
                >
                  <Quote className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-1 border-r px-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <LinkIcon className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ImageIcon className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('bullet-list')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('bulletList') ? 'bg-muted' : ''}`}
                >
                  <List className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFormat('ordered-list')}
                  className={`h-7 w-7 p-0 ${editor?.isActive('orderedList') ? 'bg-muted' : ''}`}
                >
                  <ListOrdered className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, 80);
            setLocalTitle(newValue);
            setTitle(newValue);
          }}
          placeholder="Title"
          className="editor-input text-4xl sm:text-4xl md:text-4xl px-0"
          readOnly={!editable}
        />
        
        {editable || subtitle ? (
          <Input
            type="text"
            value={subtitle}
            onChange={(e) => {
              const newValue = e.target.value.slice(0, 80);
              setLocalSubtitle(newValue);
              setSubtitle(newValue);
            }}
            placeholder="Add a subtitle..."
            className="editor-input text-lg sm:text-xl text-muted-foreground px-0 
                       placeholder:text-muted-foreground/30 break-words"
            readOnly={!editable}
          />
        ) : null}

        {editable ? (
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-8 mt-2">
            {author.map((author, index) => (
              <div
                key={index}
                className="flex items-center gap-1 sm:gap-2 bg-muted rounded-full px-3 sm:px-5 py-2 text-sm bg-gray-100"
              >
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{author.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 hover:bg-gray-200"
                  onClick={() => removeAuthor(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {author.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 rounded-full"
                disabled
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            {author.length === 0 && (
              <Dialog open={isAuthorDialogOpen} onOpenChange={setIsAuthorDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="bg-gray-100 hover:bg-gray-200 rounded-full text-sm py-2 px-3"
                  >
                    Choose Author +
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold mb-4">Select Author</DialogTitle>
                  </DialogHeader>
                  <Card>
                    <CardContent className="grid gap-4 py-4">
                      {authors.map((author) => (
                        <Button
                          key={author.id}
                          variant="ghost"
                          onClick={() => addAuthor(author)}
                          className="bg-gray-100 rounded-full py-2 px-3"
                        >
                          {author.name}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-8 mt-2">
            {author.map((author, index) => (
              <div
                key={index}
                className="flex items-center gap-1 sm:gap-2 bg-muted rounded-full px-3 sm:px-5 py-2 text-sm bg-gray-100"
              >
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{author.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="editable text-xl">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

