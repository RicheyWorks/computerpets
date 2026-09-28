// Stand-in for @/lib/auth/use-current-user in mount tests: signed in when globalThis.__stubSession is set.
export function useCurrentUserState() {
  const s = globalThis.__stubSession;
  return {
    user: s ? { id: s.userId, displayName: "Keeper", primaryEmail: null, profileImageUrl: null, isDevFallback: false } : null,
    isPending: false,
  };
}
export function useCurrentUser() {
  return useCurrentUserState().user;
}
