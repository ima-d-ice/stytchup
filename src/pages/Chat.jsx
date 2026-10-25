import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import RazorpayButton from '../components/checkout/RazorpayButton';
import { API_URL, DEMO_MODE, getConversations, getMessages, getProfileSettings, sendMessage } from '../lib/api';
import { toPaise, fromPaise } from '../utils/pricing';
import { getOtherUser } from '../utils/conversation';

export default function Chat() {
  const { token } = useAuth();
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [inputText, setInputText] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState({ price: '', title: '' });
  const [myId, setMyId] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token || !conversationId) return;
    let active = true;

    getProfileSettings(token)
      .then((data) => {
        if (active) setMyId(data?.id);
      })
      .catch(() => navigate('/login'));

    getConversations(token)
      .then((list) => {
        if (!active || !Array.isArray(list)) return;
        setConversation(list.find((entry) => entry.id === conversationId) || null);
      })
      .catch(() => {});

    getMessages(conversationId, token)
      .then((data) => {
        if (!active) return;
        setMessages(Array.isArray(data) ? data : []);
        window.setTimeout(scrollToBottom, 100);
      })
      .catch((error) => console.error(error));

    if (DEMO_MODE) {
      return () => {
        active = false;
      };
    }

    const socket = io(API_URL, {
      withCredentials: true,
      auth: { token: `Bearer ${token}` },
    });

    socket.emit('join_chat', conversationId);
    socket.on('new_message', (message) => {
      setMessages((prev) => (prev.some((entry) => entry.id === message.id) ? prev : [...prev, message]));
      window.setTimeout(scrollToBottom, 100);
    });
    socket.on('offer_created', (message) => {
      setMessages((prev) => (prev.some((entry) => entry.id === message.id) ? prev : [...prev, message]));
      window.setTimeout(scrollToBottom, 100);
    });
    socket.on('offer_accepted', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((entry) => (entry.id === messageId ? { ...entry, offerStatus: 'ACCEPTED' } : entry))
      );
    });

    return () => {
      active = false;
      socket.close();
    };
  }, [conversationId, token, navigate]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      const message = await sendMessage(conversationId, { text: inputText.trim() }, token);
      setMessages((prev) => (prev.some((entry) => entry.id === message.id) ? prev : [...prev, message]));
      setInputText('');
      window.setTimeout(scrollToBottom, 100);
    } catch {
      alert('Could not send the message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerDetails.price || !offerDetails.title) return;
    let priceInPaise;
    try {
      priceInPaise = toPaise(offerDetails.price);
    } catch {
      return;
    }
    if (!Number.isFinite(priceInPaise) || priceInPaise <= 0) return;

    try {
      const message = await sendMessage(
        conversationId,
        { isOffer: true, offerTitle: offerDetails.title, offerPrice: priceInPaise },
        token
      );
      setMessages((prev) => (prev.some((entry) => entry.id === message.id) ? prev : [...prev, message]));
      setShowOfferModal(false);
      setOfferDetails({ price: '', title: '' });
      window.setTimeout(scrollToBottom, 100);
    } catch {
      alert('Could not send the offer. Please try again.');
    }
  };

  const otherUser = conversation ? getOtherUser(conversation, myId) : null;
  const otherName = otherUser?.name || 'Studio conversation';

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col bg-paper md:h-[calc(100dvh-6.5rem)]">
      <div className="border-b border-line bg-paper">
        <div className="container-shop flex h-16 items-center gap-4 md:h-[72px]">
          <button
            type="button"
            onClick={() => navigate('/inbox')}
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} />
            Inbox
          </button>
          <div className="mx-auto text-center">
            <p className="text-[13px] font-medium text-ink">{otherName}</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-ink/30">
              Private conversation
            </p>
          </div>
          <div className="w-[52px]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container-shop mx-auto max-w-4xl py-8 md:py-10">
          <div className="mb-8 text-center">
            <p className="text-[9px] uppercase tracking-[0.16em] text-ink/25">
              {messages[0]
                ? new Date(messages[0].createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'New conversation'}
            </p>
          </div>

          <div className="space-y-5">
            {messages.length === 0 && (
              <p className="py-16 text-center text-[12px] text-ink/35">
                No messages yet. Say hello and share what you have in mind.
              </p>
            )}

            {messages.map((message) => {
              const isMe = message.senderId === myId;
              return (
                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[86%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 text-[13px] leading-relaxed ${
                        isMe ? 'bg-ink text-white' : 'border border-line bg-mist text-ink'
                      }`}
                    >
                      {!message.isOffer && <p>{message.text}</p>}

                      {message.isOffer && (
                        <div className={`min-w-[240px] border p-4 ${isMe ? 'border-white/20 bg-white/5' : 'border-brand/60 bg-paper'}`}>
                          <div className="flex items-start justify-between gap-6">
                            <span className={`text-[8px] font-semibold uppercase tracking-[0.18em] ${isMe ? 'text-white/45' : 'text-ink/40'}`}>
                              Custom offer
                            </span>
                            <span className="text-lg leading-none">{fromPaise(message.offerPrice || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
                          </div>
                          <h3 className={`mt-3 text-[13px] font-medium ${isMe ? 'text-white' : 'text-ink'}`}>
                            {message.offerTitle}
                          </h3>

                          <div className="mt-4">
                            {message.offerStatus === 'ACCEPTED' ? (
                              <p className={`border-t pt-3 text-[9px] uppercase tracking-[0.16em] ${isMe ? 'border-white/15 text-white/50' : 'border-line text-ink/45'}`}>
                                Accepted
                              </p>
                            ) : message.offerStatus === 'PENDING' && isMe ? (
                              <p className={`border-t pt-3 text-[9px] uppercase tracking-[0.16em] ${isMe ? 'border-white/15 text-white/40' : 'border-line text-ink/35'}`}>
                                Awaiting response
                              </p>
                            ) : (
                              !isMe && (
                                <RazorpayButton
                                  sourceId={message.id}
                                  type="CHAT_OFFER"
                                  buttonText="Accept & pay"
                                  onSuccess={() => {
                                    setMessages((prev) =>
                                      prev.map((entry) =>
                                        entry.id === message.id ? { ...entry, offerStatus: 'ACCEPTED' } : entry
                                      )
                                    );
                                  }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`mt-1.5 text-[8px] uppercase tracking-[0.14em] text-ink/25 ${isMe ? 'text-right' : 'text-left'}`}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper">
        <div className="container-shop py-4">
          <form onSubmit={handleSendMessage} className="mx-auto flex max-w-4xl items-center gap-3">
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-[13px] text-ink/60 transition-colors hover:border-ink hover:text-ink"
              aria-label="Create a custom offer"
              title="Create a custom offer"
            >
              ₹
            </button>
            <label htmlFor="chat-message" className="sr-only">
              Message
            </label>
            <input
              id="chat-message"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              className="h-11 flex-1 border border-line bg-transparent px-4 text-[13px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none focus:ring-0"
              placeholder="Write a message…"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-white transition-colors hover:bg-brand hover:text-ink disabled:opacity-30"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-4xl text-[8px] uppercase tracking-[0.14em] text-ink/25">
            Messages are private between you and the designer.
          </p>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-line bg-paper p-6 animate-rise">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">Negotiation</p>
                <h2 className="display text-3xl leading-none tracking-[-0.02em]">Create offer</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="text-ink/40 transition-colors hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="offer-title" className="field-label">
                  What are you offering?
                </label>
                <input
                  id="offer-title"
                  type="text"
                  className="field"
                  placeholder="Bespoke ivory silk set"
                  value={offerDetails.title}
                  onChange={(event) => setOfferDetails({ ...offerDetails, title: event.target.value })}
                />
              </div>
              <div>
                <label htmlFor="offer-price" className="field-label">
                  Price (₹)
                </label>
                <input
                  id="offer-price"
                  type="number"
                  className="field"
                  placeholder="0"
                  value={offerDetails.price}
                  onChange={(event) => setOfferDetails({ ...offerDetails, price: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="button" onClick={() => setShowOfferModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="button" onClick={handleSendOffer} className="btn-yellow flex-1">
                  Send offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
