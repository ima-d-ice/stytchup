import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../auth/AuthContext';
import RazorpayButton from '../components/checkout/RazorpayButton';
import { toPaise, fromPaise } from '../utils/pricing';
import { API_URL } from '../lib/api';

export default function Chat() {
  const { token } = useAuth();
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState({ price: '', title: '' });
  const [myId, setMyId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/profile/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMyId(data.id))
      .catch(() => navigate('/login'));

    if (!conversationId) return;
    const newSocket = io(API_URL, {
      withCredentials: true,
      auth: { token: `Bearer ${token}` },
    });
    newSocket.emit('join_chat', conversationId);
    newSocket.on('new_message', (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      setTimeout(scrollToBottom, 100);
    });
    newSocket.on('offer_created', (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      setTimeout(scrollToBottom, 100);
    });
    newSocket.on('offer_accepted', ({ messageId }) => {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, offerStatus: 'ACCEPTED' } : m)));
    });
    fetch(`${API_URL}/inbox/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      });
    return () => {
      newSocket.close();
    };
  }, [conversationId, navigate, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await fetch(`${API_URL}/inbox/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversationId, text: inputText }),
    });
    setInputText('');
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
    await fetch(`${API_URL}/inbox/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversationId, isOffer: true, offerTitle: offerDetails.title, offerPrice: priceInPaise }),
    });
    setShowOfferModal(false);
    setOfferDetails({ price: '', title: '' });
  };

  if (!conversationId) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b px-6 py-4 flex items-center shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-black">
          ←
        </button>
        <h1 className="font-bold text-lg">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === myId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-md p-4 rounded-2xl shadow-sm text-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}`}>
                {!msg.isOffer && <p>{msg.text}</p>}

                {msg.isOffer && (
                  <div className={`mt-1 p-5 rounded-xl border-2 ${isMe ? 'bg-gray-800 border-gray-600' : 'bg-yellow-50 border-[#FFC629]'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-gray-400' : 'text-yellow-700'}`}>Custom Offer</span>
                      <span className={`text-xl font-black ${isMe ? 'text-white' : 'text-black'}`}>₹{fromPaise(msg.offerPrice || 0)}</span>
                    </div>
                    <h3 className={`font-bold text-base mb-4 ${isMe ? 'text-gray-200' : 'text-gray-800'}`}>{msg.offerTitle}</h3>

                    {msg.offerStatus === 'ACCEPTED' ? (
                      <div className="w-full py-2 bg-green-500/20 text-green-500 text-center font-bold rounded-lg border border-green-500/50">✅ Accepted</div>
                    ) : (
                      !isMe && <RazorpayButton sourceId={msg.id} type="CHAT_OFFER" buttonText="Accept & Pay" onSuccess={() => window.location.reload()} />
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

      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto items-center">
          <button type="button" onClick={() => setShowOfferModal(true)} className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-[#FFC629] hover:text-black transition-colors font-bold text-lg">
            ₹
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-gray-700 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#FFC629] transition-all"
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-black text-white rounded-full p-3 hover:bg-gray-800">
            ➤
          </button>
        </form>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-black">Create Offer</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-[#FFC629] outline-none text-black"
                placeholder="Service Title"
                value={offerDetails.title}
                onChange={(e) => setOfferDetails({ ...offerDetails, title: e.target.value })}
              />
              <input
                type="number"
                className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-[#FFC629] outline-none text-black"
                placeholder="Price (₹)"
                value={offerDetails.price}
                onChange={(e) => setOfferDetails({ ...offerDetails, price: e.target.value })}
              />
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowOfferModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSendOffer} className="flex-1 py-3 font-bold bg-[#FFC629] hover:bg-[#E5B225] text-black rounded-xl shadow-md">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
