"use client"

import { useState, FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '~/components/ui/command'
import { Team, User } from '~/db/schema'
import { cn } from '~/libs/utils'
import { ChevronsUpDown, Check, UserPlus } from 'lucide-react'
import { addUserToTeam } from '~/serverActions/teamActions'
import { useRouter } from 'next/navigation'

export default function UserSelectionCard({ team, users }: { team: Team, users: User[] }) {

  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<User>()
  const [newUser, setNewUser] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Team Name:', team.name)
    console.log('Team Id:', team.id)
    console.log('Users:', users)
    console.log('User:', isNewUser ? newUser : selectedUser)
    if(isNewUser){
      const dbUser = await addUserToTeam(team.id, newUser)
      console.log('New User:', newUser)
      router.push(`/team/${team.id}/user/${dbUser.id}`)
    }else{
      router.push(`/team/${team.id}/user/${selectedUser!.id}`)
    }
  }

  const handleNewUser = () => {
    setIsNewUser(true)
    setOpen(false)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Join Team</CardTitle>
        <CardDescription className="text-center">
          Select your user or create a new one for {team.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            {users.length > 0 ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    id="user"
                  >
                    {selectedUser?.name || "Select user..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search user..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => {
                            setSelectedUser(user)
                            setIsNewUser(false)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUser?.name === user.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
          <Button type="button" onClick={handleNewUser} className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
          {isNewUser && (
            <div className="space-y-2">
              <Label htmlFor="newUser">New User Name</Label>
              <Input
                id="newUser"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter new user name"
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {isNewUser ? "Create User & Join" : "Join Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}