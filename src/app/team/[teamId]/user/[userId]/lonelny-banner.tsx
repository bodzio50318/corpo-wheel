import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export function LonelyLoserBanner() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Lonely Loser Alert!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-lg">
            Looks like you&apos;re the only one here. Invite some friends to join the fun!
        </p>
        <div className="mt-4 text-center">
          <span className="text-6xl">😢</span>
        </div>
      </CardContent>
    </Card>
  )
}