'use client'

import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export const CopyButton = ({ codeContent }: { codeContent: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 px-4 gap-2"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span>{copied ? 'Copied!' : 'Copy File'}</span>
      </Button>
    </div>
  )
} 