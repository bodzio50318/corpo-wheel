"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface User {
  id: number
  name: string
  vote: number | null
  hasVoted: boolean
}

// Hardcoded data for demonstration
const initialUsers: User[] = [
  { id: 1, name: "Alice", vote: null, hasVoted: false },
  { id: 2, name: "Bob", vote: null, hasVoted: true },
  { id: 3, name: "Charlie", vote: null, hasVoted: false },
  { id: 4, name: "David", vote: null, hasVoted: true },
  { id: 5, name: "Eve", vote: null, hasVoted: false },
]

// Assume the current user is Alice (id: 1)
const currentUserId = 1

export default function UserVotingTable() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentVote, setCurrentVote] = useState<number | null>(null)

  const handleVoteSubmit = (userId: number) => {
    if (currentVote !== null) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, vote: currentVote, hasVoted: true } : user
        )
      )
      setCurrentVote(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Voting Table</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>
                {user.hasVoted ? "Voted" : "Not voted"}
              </TableCell>
              <TableCell>
                {user.id === currentUserId && !user.hasVoted ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={currentVote ?? ''}
                      onChange={(e) => setCurrentVote(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                      min={0}
                      max={100}
                      className="w-20"
                    />
                    <Button onClick={() => handleVoteSubmit(user.id)} size="sm">
                      Submit
                    </Button>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}