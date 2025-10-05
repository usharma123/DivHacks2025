import { isSignedIn, getUser, getEchoToken } from '@/echo'

export async function GET() {
  try {
    const signedIn = await isSignedIn()
    const user = signedIn ? await getUser() : null
    const token = signedIn ? await getEchoToken() : null
    return Response.json({ signedIn, hasToken: Boolean(token), user }, { status: 200 })
  } catch (err) {
    return Response.json({ error: 'auth check failed' }, { status: 500 })
  }
}


