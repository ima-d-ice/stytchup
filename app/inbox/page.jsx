'use client';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
export default function InboxList() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myId, setMyId] = useState(""); // We'll infer this or fetch it
    useEffect(() => {
        if (!session?.accessToken)
            return;
        // Fetch my user id so we can show the *other* participant
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/profile/settings`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data?.id)
            setMyId(data.id); })
            .catch(err => console.error(err));
        // 1. Fetch Conversations
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inbox/list`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
            setConversations(Array.isArray(data) ? data : []);
        })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [session]);
    if (loading)
        return <div className="p-10 text-center">Loading Inbox...</div>;
    return (<div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {conversations.length === 0 ? (<div className="p-10 text-center text-gray-500">
              No messages yet. Browse designs to contact a designer!
            </div>) : (<div className="divide-y divide-gray-100">
              {conversations.map((convo) => {
                // Show the other participant, not ourselves
                const otherUser = myId && convo.user1?.id === myId ? convo.user2 : convo.user1;
                const displayName = otherUser?.name || convo.user2?.name || convo.user1?.name || "User";
                const avatarUrl = otherUser?.profile?.avatarUrl
                    || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
                const lastMsg = convo.messages[0];
                return (<Link key={convo.id} href={`/inbox/${convo.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image src={avatarUrl} alt="Avatar" fill className="rounded-full object-cover border border-gray-200"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {displayName}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(convo.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMsg?.text || "Started a conversation"}
                      </p>
                    </div>
                  </Link>);
            })}
            </div>)}
        </div>
      </div>
    </div>);
}
