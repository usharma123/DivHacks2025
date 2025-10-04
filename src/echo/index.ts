import Echo from '@merit-systems/echo-next-sdk';

// Prefer server env `ECHO_APP_ID`, but fall back to the client-exposed
// `NEXT_PUBLIC_ECHO_APP_ID` to ensure both server and client use the same app ID.
const appId = process.env.ECHO_APP_ID || process.env.NEXT_PUBLIC_ECHO_APP_ID;

if (!appId) {
  throw new Error('ECHO_APP_ID or NEXT_PUBLIC_ECHO_APP_ID environment variable is required');
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
});
