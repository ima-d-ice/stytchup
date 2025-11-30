'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import RazorpayButton from '@/components/checkout/RazorpayButton';

// ... (Interfaces remain the same) ...
interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  isOffer: boolean;
  offerPrice?: number;
  offerTitle?: string;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default function ChatPage() {
  const params = useParams(); 
  const conversationId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState({ price: '', title: '' });
  const [myId, setMyId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ... (useEffect for Fetching Profile & Socket connection remains the same) ...
  useEffect(() => {
    fetch('http://localhost:4000/profile/settings', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setMyId(data.id))
        .catch(() => router.push('/login'));

    if (!conversationId) return;
    const newSocket = io('http://localhost:4000', { withCredentials: true });
    setSocket(newSocket);
    newSocket.emit('join_chat', conversationId);
    newSocket.on('new_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });
    fetch(`http://localhost:4000/inbox/${conversationId}/messages`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => { setMessages(data); setTimeout(scrollToBottom, 100); });
    return () => { newSocket.close(); };
  }, [conversationId, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await fetch('http://localhost:4000/inbox/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ conversationId, text: inputText }),
    });
    setInputText("");
  };

  const handleSendOffer = async () => {
    if (!offerDetails.price || !offerDetails.title) return;
    const priceInPaise = parseFloat(offerDetails.price) * 100;
    await fetch('http://localhost:4000/inbox/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        conversationId,
        isOffer: true,
        offerTitle: offerDetails.title,
        offerPrice: priceInPaise,
        // Ensure you have a valid design ID. For now, use a fallback or fetch one.
        // relatedDesignId: "some-design-id", 
      }),
    });
    setShowOfferModal(false);
    setOfferDetails({ price: '', title: '' });
  };

  if (!conversationId) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => router.back()} className="mr-4 text-gray-500 hover:text-black">←</button>
        <h1 className="font-bold text-lg">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === myId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-md p-4 rounded-2xl shadow-sm text-sm ${
                isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
              }`}>
                {!msg.isOffer && <p>{msg.text}</p>}

                {/* OFFER CARD UI */}
                {msg.isOffer && (
                  <div className={`mt-1 p-5 rounded-xl border-2 ${isMe ? 'bg-gray-800 border-gray-600' : 'bg-yellow-50 border-[#FFC629]'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-gray-400' : 'text-yellow-700'}`}>Custom Offer</span>
                       <span className={`text-xl font-black ${isMe ? 'text-white' : 'text-black'}`}>₹{(msg.offerPrice || 0) / 100}</span>
                    </div>
                    <h3 className={`font-bold text-base mb-4 ${isMe ? 'text-gray-200' : 'text-gray-800'}`}>{msg.offerTitle}</h3>

                    {msg.offerStatus === 'ACCEPTED' ? (
                      <div className="w-full py-2 bg-green-500/20 text-green-500 text-center font-bold rounded-lg border border-green-500/50">
                         ✅ Accepted
                      </div>
                    ) : (
                       !isMe && (
                         <RazorpayButton 
                            amount={msg.offerPrice || 0}
                            sourceId={msg.id} 
                            type="CHAT_OFFER" // 👈 UPDATED TYPE
                            buttonText="Accept & Pay"
                            onSuccess={() => window.location.reload()}
                         />
                       )
                    )}
                    {msg.offerStatus === 'PENDING' && isMe && <p className="text-center text-xs text-gray-400 mt-2 italic">Sent</p>}
                  </div>
                )}
                <div className={`text-[10px] mt-1 text-right opacity-60 ${isMe ? 'text-gray-300' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto items-center">
          <button type="button" onClick={() => setShowOfferModal(true)} className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-[#FFC629] hover:text-black transition-colors font-bold text-lg">₹</button>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-gray-700 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#FFC629] transition-all"
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-black text-white rounded-full p-3 hover:bg-gray-800">➤</button>
        </form>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-black">Create Offer</h2>
            <div className="space-y-4">
              <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-[#FFC629] outline-none text-black" placeholder="Service Title" value={offerDetails.title} onChange={e => setOfferDetails({...offerDetails, title: e.target.value})} />
              <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-[#FFC629] outline-none text-black" placeholder="Price (₹)" value={offerDetails.price} onChange={e => setOfferDetails({...offerDetails, price: e.target.value})} />
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowOfferModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleSendOffer} className="flex-1 py-3 font-bold bg-[#FFC629] hover:bg-[#E5B225] text-black rounded-xl shadow-md">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}