import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <span>Unauthorized Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Sorry, you don't have permission to access this page. If you believe this is an error, please contact your administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href="/">
            <Button>
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}