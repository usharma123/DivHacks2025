import Echo from '@merit-systems/echo-next-sdk'

const appId = process.env.ECHO_APP_ID || process.env.NEXT_PUBLIC_ECHO_APP_ID

if (!appId) {
  throw new Error('ECHO_APP_ID or NEXT_PUBLIC_ECHO_APP_ID environment variable is required')
}

export const {
  handlers,
  isSignedIn,
  openai,
  anthropic,
  google,
  getUser,
  getEchoToken,
} = Echo({
  appId,
})


