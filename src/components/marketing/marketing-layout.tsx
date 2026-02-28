import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/marketing/site-header'
import { SiteFooter } from '@/components/marketing/site-footer'

type MarketingLayoutProps = {
  children: ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--sand-50)] text-[var(--ink-900)]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
