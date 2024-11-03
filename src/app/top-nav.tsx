import React from 'react'
import Link from 'next/link'
import { Button } from "~/components/ui/button"

export default function TopNav() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Wheel & Vote
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}