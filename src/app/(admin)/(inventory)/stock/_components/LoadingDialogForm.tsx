import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function LoadingDialogForm() {
  return (
    <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
        <Skeleton className="h-6 rounded-lg" />
        <Skeleton className="h-6 rounded-lg" />
    </div>
  )
}