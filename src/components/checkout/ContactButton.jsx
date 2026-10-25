import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { createConversation, DEMO_MODE } from '../../lib/api';

export default function ContactButton({ designerId, designerName }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    if (DEMO_MODE) {
      navigate('/inbox/demo-conversation-1');
      return;
    }

    setLoading(true);
    try {
      const conversation = await createConversation(designerId, token);
      navigate(`/inbox/${conversation.id}`);
    } catch {
      alert('Please login to contact the designer');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleContact} disabled={loading} className="btn w-full">
      {loading ? 'Connecting…' : `Contact ${designerName || 'designer'}`}
    </button>
  );
}
