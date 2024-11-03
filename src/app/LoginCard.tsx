"use client"

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { Label } from '@radix-ui/react-label'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { loginAction } from '~/serverActions/teamActions'

export function LoginCard() {
  const [loginTeamName, setLoginTeamName] = useState('')
  const [loginUserName, setLoginUserName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [state, formAction] = useFormState<
    { error: string | null },
    FormData
  >(loginAction, { error: null });

  return (
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
  )
}