"use client"

import { Badge, Check, Edit2, Trash2 ,UserPlus } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from '~/components/ui/card'
import { Input } from "~/components/ui/input"
import { User } from '~/db/schema'
import { TeamPageProps } from './page'
import { deleteUser, updateUserName, updateUserVote } from '~/db/dataAcces/userCrud'
import { useRouter } from 'next/navigation';
import { addUserToTeam } from '~/serverActions/teamActions'

export default function UserVotingTable({ teamId, users, myUser }: TeamPageProps) {
    const router = useRouter();  
    const [usersList, setUsers] = useState<User[]>(users)
    const [currentVote, setCurrentVote] = useState<number | null>(null)
    const [editingUserId, setEditingUserId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleVoteSubmit = async (userId: number) => {
      if (currentVote !== null) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, vote: currentVote, hasVoted: true } : user
          )
        )
        await updateUserVote(userId)
        setCurrentVote(null)
      }
    }
  
    const handleRemoveUser = async (userId: number) => { 
      await deleteUser(userId)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      router.refresh();
    }
  
    const handleEditName = async (userId: number) => {
      await updateUserName(userId, editingName)
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, name: editingName } : user
        )
      
      )
      router.refresh();
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
      if (isProcessing || !editingName.trim()) return;
      
      try {
        setIsProcessing(true);
        const newUser = await addUserToTeam(teamId, editingName.trim());
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsAddingUser(false);
        setEditingName("");
        
      } catch (error) {
        console.error('Error adding user:', error);
      } finally {
        setIsProcessing(false);
      }
    }, [teamId, editingName, isProcessing, router]);

    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Team Voting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usersList.map((user) => (
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
                      <span onClick={() => handleNameClick(user.id, user.name)}>{user.name}</span>
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