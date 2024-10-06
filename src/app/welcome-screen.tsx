"use client"

import { Label } from '@radix-ui/react-label'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { createRoomAction } from '../serverActions/teamActions'

export default function WelcomeScreen() {
    const [teamName, setTeamName] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')


    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
                    <CardDescription className="text-center">
                        Enter your team name to get started. Password is optional.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createRoomAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input
                                id="teamName"
                                name="teamName"
                                placeholder="Enter your team name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userName">User Name</Label>
                            <Input
                                id="userName"
                                name="userName"
                                placeholder="Enter your user name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password (Optional)</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password (optional)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Join Team
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                    By joining, you agree to our Terms of Service and Privacy Policy.
                </CardFooter>
            </Card>
        </div>
    )
}