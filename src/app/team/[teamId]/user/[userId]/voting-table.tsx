"use client"

import { Badge, Check, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from '~/components/ui/card'
import { Input } from "~/components/ui/input"
import { User } from '~/db/schema'
import { TeamPageProps } from './page'

export default function UserVotingTable({ teamId, users, myUser }: TeamPageProps) {
    const [usersList, setUsers] = useState<User[]>(users)
    const [currentVote, setCurrentVote] = useState<number | null>(null)
    const [editingUserId, setEditingUserId] = useState<number | null>(null)
  
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
  
    const handleRemoveUser = (userId: number) => { 
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    }
  
    const handleEditName = (userId: number, newName: string) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, name: newName } : user
        )
      )
      setEditingUserId(null)
    }
  
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Team Voting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usersList.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    {editingUserId === user.id ? (
                      <Input
                        value={user.name}
                        onChange={(e) => handleEditName(user.id, e.target.value)}
                        onBlur={() => setEditingUserId(null)}
                        autoFocus
                        className="text-sm font-medium"
                      />
                    ) : (
                      <h3 className="text-sm font-medium">{user.name}</h3>
                    )}
                    <Badge className="mt-1">
                      {user.hasVoted ? "Voted" : "Not voted"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingUserId(user.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {user.id === myUser.id && !user.hasVoted ? (
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="number"
                      value={currentVote ?? ''}
                      onChange={(e) => setCurrentVote(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                      min={0}
                      max={100}
                      className="w-20"
                    />
                    <Button onClick={() => handleVoteSubmit(user.id)} size="sm">
                      <Check className="h-4 w-4 mr-1" /> Vote
                    </Button>
                  </div>
                ) : (
                  user.hasVoted && (
                    <div className="mt-2">
                      <div className="text-sm font-medium">Vote: {user.hasVoted}</div>
                      <div className="w-full bg-secondary h-2 rounded-full mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${user.hasVoted}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }