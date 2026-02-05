'use client';

import { Skeleton } from '../ui/skeleton';

interface CustomSkeleton {
  variant: 'table' | 'item-list';
}

export function CustomSkeleton({ variant }: CustomSkeleton) {
  if (variant === 'table') {
    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row justify-beetween w-full">
          <Skeleton className="rounded-md w-1/2 h-6" />
          <div className="flex-1"></div>
          <Skeleton className="rounded-md w-1/9 h-6" />
        </div>
        <Skeleton className="rounded-md h-4" />
        <Skeleton className="rounded-md h-4" />
        <Skeleton className="rounded-md h-4" />
        <div className="flex justify-center">
          <Skeleton className="rounded-md w-48 h-6" />
        </div>
      </div>
    );
  }

  if (variant === 'item-list') {
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="rounded-md h-6" />
        <Skeleton className="rounded-md h-6" />
        <Skeleton className="rounded-md h-6" />
        <Skeleton className="rounded-md h-6" />
        <Skeleton className="rounded-md h-6" />
      </div>
    );
  }
}
