// Pick the *other* participant of a 1:1 conversation.
export function getOtherUser(convo, myId) {
  if (!convo) return null;
  if (myId && convo.user1?.id === myId) return convo.user2;
  if (myId && convo.user2?.id === myId) return convo.user1;
  return convo.user1 || convo.user2 || null;
}

export function displayName(user, fallback = 'User') {
  return user?.name || fallback;
}

export function avatarUrl(user, name) {
  if (user?.profile?.avatarUrl) return user.profile.avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user?.name || 'User')}&background=random`;
}
