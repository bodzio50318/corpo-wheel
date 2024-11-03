"use client"

import { Badge, Check, Edit2, Frown, Trash2, UserPlus, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent} from '~/components/ui/card'
import { Input } from "~/components/ui/input"
import { User } from '~/db/schema'
import { TeamPageProps } from './page'
import { deleteUser, updateUserName, updateUserVote } from '~/db/dataAcces/userCrud'
import { useRouter } from 'next/navigation'
import { addUserToTeam, handleVote } from '~/serverActions/teamActions'

export default function UserVotingTable({ teamId, users, myUser }: TeamPageProps) {
  const router = useRouter()
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemoveUser = async (userId: number) => { 
    await deleteUser(userId)
    router.refresh()
  }

  const handleEditName = async (userId: number) => {
    await updateUserName(userId, editingName)
    router.refresh()
    setEditingUserId(null)
    setEditingName("")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value)
  }

  const handleNameClick = (userId: number, currentName: string) => {
    setEditingUserId(userId)
    setEditingName(currentName)
  }

  const handleAddUser = useCallback(async () => {
    if (isProcessing || !editingName.trim()) return
    
    try {
      setIsProcessing(true)
      await addUserToTeam(teamId, editingName.trim())
      setIsAddingUser(false)
      setEditingName("")
      router.refresh()
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [teamId, editingName, isProcessing])

  const handleVoteChange = async (user: User) => {
    await handleVote(user)
    router.refresh()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Team Voting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-grow">
                  {editingUserId === user.id ? (
                    <input
                      value={editingName}
                      onChange={handleNameChange}
                      onBlur={() => handleEditName(user.id)}
                      onKeyUp={(e) => e.key === 'Enter' && handleEditName(user.id)}
                      autoFocus
                      className="text-sm font-medium"
                    />
                  ) : (
                    <span onClick={() => handleNameClick(user.id, user.name)} className="cursor-pointer">{user.name}</span>
                  )}
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
              <Button
                    size="sm"
                    variant={user.hasVoted ? "destructive" : "outline"}
                    onClick={() => handleVoteChange(user)}
                  >
                    <Frown className="h-4 w-4 mr-2" />
                    {user.hasVoted ? "Cancel Vote" : "Not this sprint!"}
                  </Button>
            </CardContent>
          </Card>
        ))}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            {isAddingUser ? (
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div className="flex-grow">
                  <Input
                    value={editingName}
                    onChange={handleNameChange}
                    placeholder="Enter new user name"
                    onBlur={handleAddUser}
                    onKeyUp={(e) => e.key === 'Enter' && handleAddUser()}
                    autoFocus
                    className="text-sm font-medium"
                  />
                </div>
                <Button onClick={handleAddUser} size="sm">
                  Add
                </Button>
              </div>
            ) : (
              <div 
                onClick={() => setIsAddingUser(true)}
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  <UserPlus className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">Add new user</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 