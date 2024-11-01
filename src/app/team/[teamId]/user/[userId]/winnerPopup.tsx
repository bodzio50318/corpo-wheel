"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

export default function WinnerPopup({ winner, onAccept, onReroll }: {
  winner?: string
  onAccept?: () => void
  onReroll?: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)

  const handleAccept = () => {
    setIsOpen(false)
    if (onAccept) onAccept()
  }

  const handleReroll = () => {
    setIsOpen(false)
    if (onReroll) onReroll()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Winner Selected!</DialogTitle>
          <DialogDescription>
            Congratulations to the winner. Do you want to accept this result or reroll?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold">{winner}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReroll}>
            Reroll
          </Button>
          <Button onClick={handleAccept}>Accept Result</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}