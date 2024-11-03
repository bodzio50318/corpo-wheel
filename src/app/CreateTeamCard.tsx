"use client"

import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { createRoomAction } from '../serverActions/teamActions'

export function CreateTeamCard() {
  const [createTeamName, setCreateTeamName] = useState('')
  const [createPassword, setCreatePassword] = useState('')

  return (
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
  )
} 