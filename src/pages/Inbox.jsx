import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import { getConversations, getProfileSettings } from '../lib/api';
import { avatarUrl as otherAvatarUrl, displayName as otherDisplayName, getOtherUser } from '../utils/conversation';

export default function Inbox() {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState('');

  useEffect(() => {
    if (!token) return;
    let active = true;

    getProfileSettings(token)
      .then((data) => {
        if (active && data?.id) setMyId(data.id);
      })
      .catch((error) => console.error(error));

    getConversations(token)
      .then((data) => {
        if (active) setConversations(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Inbox' }]}
          eyebrow="Client area"
          title="Inbox"
          intro="Conversations with designers, measurements, and commissions — kept in one place."
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink/35">
            {loading ? 'Loading' : `${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'}`}
          </p>
        </PageHeader>

        <div className="mx-auto max-w-4xl py-8 md:py-12">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-4 border-b border-line pb-5">
                  <div className="h-14 w-14 bg-mist" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-1/3 bg-mist" />
                    <div className="h-3 w-2/3 bg-mist" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="border-y border-line py-24 text-center">
              <p className="font-display text-3xl tracking-[-0.01em]">Nothing in the inbox.</p>
              <p className="mt-3 text-sm text-ink/45">Start a conversation from any design or designer page.</p>
              <Link to="/designer" className="btn mt-8">
                Browse designers
              </Link>
            </div>
          ) : (
            <div className="border-t border-line">
              {conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation, myId);
                const name =
                  otherDisplayName(otherUser) !== 'User'
                    ? otherDisplayName(otherUser)
                    : otherDisplayName(conversation.user2) !== 'User'
                      ? otherDisplayName(conversation.user2)
                      : otherDisplayName(conversation.user1);
                const avatar = otherAvatarUrl(otherUser, name);
                const lastMessage = conversation.messages?.[0];

                return (
                  <Link
                    key={conversation.id}
                    to={`/inbox/${conversation.id}`}
                    className="group flex items-center gap-4 border-b border-line py-5 transition-colors hover:bg-mist/60 sm:gap-6"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden bg-mist sm:h-16 sm:w-16">
                      <img
                        src={avatar}
                        alt=""
                        className="h-full w-full object-cover grayscale-[25%] transition-all group-hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="truncate text-[13px] font-medium text-ink">{name}</h2>
                        <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-ink/30">
                          {new Date(conversation.updatedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <p className="mt-1.5 truncate text-[12px] text-ink/45">
                        {lastMessage?.isOffer
                          ? `Custom offer — ${lastMessage.offerTitle || 'commission'}`
                          : lastMessage?.text || 'Conversation started'}
                      </p>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.3} />
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
