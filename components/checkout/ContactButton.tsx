'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ContactButton({ designerId, designerName }: { designerId: string; designerName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    setLoading(true);
    try {
      // Create or Get Conversation
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inbox/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetUserId: designerId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        router.push(`/inbox/${conversation.id}`);
      } else {
        alert("Please login to contact the designer");
        router.push("/login");
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
      {loading ? "Connecting..." : `Contact ${designerName}`}
    </button>
  );
}