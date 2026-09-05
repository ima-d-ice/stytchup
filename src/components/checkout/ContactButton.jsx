import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { API_URL } from '../../lib/api';

export default function ContactButton({ designerId, designerName }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inbox/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ targetUserId: designerId }),
      });
      if (res.ok) {
        const conversation = await res.json();
        navigate(`/inbox/${conversation.id}`);
      } else {
        alert('Please login to contact the designer');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="flex w-full items-center justify-center rounded-2xl bg-black px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] disabled:opacity-50"
    >
      {loading ? 'Connecting...' : `Contact ${designerName}`}
    </button>
  );
}
