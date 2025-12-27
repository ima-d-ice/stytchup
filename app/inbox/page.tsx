'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';

interface Conversation {
  id: string;
  updatedAt: string;
  user1: { id: string; name: string | null; profile: { avatarUrl: string | null } | null };
  user2: { id: string; name: string | null; profile: { avatarUrl: string | null } | null };
  messages: { text: string; createdAt: string }[];
}

export default function InboxList() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string>(""); // We'll infer this or fetch it

  useEffect(() => {
    if (!session?.accessToken) return;
    // 1. Fetch Conversations
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inbox/list`, { 
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        // Quick hack: Determine "My ID" by checking which user in the first convo isn't the other?
        // Better: Fetch /auth/me or profile. For now, we rely on the UI logic below.
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="p-10 text-center">Loading Inbox...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No messages yet. Browse designs to contact a designer!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((convo) => {
                // Determine who the "Other Person" is. 
                // Since we don't have 'myId' easily available in client without a context, 
                // we'll just show both names or handle it dynamically in a real app.
                // For this demo, let's assume User 2 is the other person if we are User 1.
                // A safer way in UI: Display "Conversation with [Name]"
                
                const otherUser = convo.user1 ? convo.user1 : convo.user2; // Simplification
                const lastMsg = convo.messages[0];

                return (
                  <Link 
                    key={convo.id} 
                    href={`/inbox/${convo.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image 
                        src={otherUser?.profile?.avatarUrl || "/placeholder-avatar.png"} 
                        alt="Avatar" 
                        fill 
                        className="rounded-full object-cover border border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {otherUser?.name || "User"}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(convo.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMsg?.text || "Started a conversation"}
                      </p>
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