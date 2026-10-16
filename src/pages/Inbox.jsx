import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getOtherUser, displayName as otherDisplayName, avatarUrl as otherAvatarUrl } from '../utils/conversation';
import { API_URL } from '../lib/api';

export default function Inbox() {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/profile/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.id) setMyId(data.id);
      })
      .catch((err) => console.error(err));

    fetch(`${API_URL}/inbox/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading Inbox...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No messages yet. Browse designs to contact a designer!</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((convo) => {
                const otherUser = getOtherUser(convo, myId);
                const displayName =
                  otherDisplayName(otherUser) !== 'User'
                    ? otherDisplayName(otherUser)
                    : otherDisplayName(convo.user2) !== 'User'
                      ? otherDisplayName(convo.user2)
                      : otherDisplayName(convo.user1);
                const avatar = otherAvatarUrl(otherUser, displayName);
                const lastMsg = convo.messages?.[0];
                return (
                  <Link key={convo.id} to={`/inbox/${convo.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <img src={avatar} alt="Avatar" className="rounded-full object-cover border border-gray-200 w-12 h-12" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{displayName}</h3>
                        <span className="text-xs text-gray-400">{new Date(convo.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{lastMsg?.text || 'Started a conversation'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
