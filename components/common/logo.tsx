import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-16 w-16 overflow-hidden rounded-3xl sm:h-20 sm:w-20', className)}>
      <Image
        src="/images/logo.png"
        alt="Site logo"
        fill
        sizes="80px"
        className="object-contain"
        priority
      />
    </div>
  )
}
