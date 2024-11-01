"use client"

import { Label } from '@radix-ui/react-label'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { createRoomAction, loginAction } from '../serverActions/teamActions'
import { useFormState } from 'react-dom'

export default function WelcomeScreen() {
    const [loginTeamName, setLoginTeamName] = useState('')
    const [loginUserName, setLoginUserName] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
  
    const [createTeamName, setCreateTeamName] = useState('')
    const [createUserName, setCreateUserName] = useState('')
    const [createPassword, setCreatePassword] = useState('')
  

    const [state, formAction] = useFormState<
        { error: string | null },
        FormData
    >(loginAction, { error: null });
    
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Login to your existing team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginTeamName">Team Name</Label>
                  <Input
                    id="loginTeamName"
                    name="loginTeamName"
                    placeholder="Enter your team name"
                    value={loginTeamName}
                    onChange={(e) => setLoginTeamName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginUserName">User Name</Label>
                  <Input
                    id="loginUserName"
                    name="loginUserName"
                    placeholder="Enter your user name"
                    value={loginUserName}
                    onChange={(e) => setLoginUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    name="loginPassword"
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {state.error && <div className="text-red-500">{state.error}</div>}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
  
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Create Team</CardTitle>
              <CardDescription className="text-center">
                Create a new team to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createRoomAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="createTeamName">Team Name</Label>
                  <Input
                    id="createTeamName"
                    name="teamName"
                    placeholder="Enter your team name"
                    value={createTeamName}
                    onChange={(e) => setCreateTeamName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createUserName">User Name</Label>
                  <Input
                    id="createUserName"
                    name="userName"
                    placeholder="Enter your user name"
                    value={createUserName}
                    onChange={(e) => setCreateUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createPassword">Password (Optional)</Label>
                  <Input
                    id="createPassword"
                    name="password"
                    type="password"
                    placeholder="Enter password (optional)"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Team
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }