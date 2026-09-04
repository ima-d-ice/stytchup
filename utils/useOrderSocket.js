'use client';

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Join `order:<id>` rooms for the given order IDs and invoke onUpdate
// ({ orderId, status, ... }) live — no page reload needed.
export function useOrderSocket({ token, orderIds, onUpdate }) {
  const handlerRef = useRef(null);
  const idsKey = JSON.stringify(orderIds || []);

  useEffect(() => {
    handlerRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const ids = JSON.parse(idsKey);
    if (!token || ids.length === 0) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      withCredentials: true,
      auth: { token: `Bearer ${token}` },
    });
    socket.on('connect', () => {
      for (const id of ids) socket.emit('join_order', id);
    });
    socket.on('order_updated', (payload) => handlerRef.current?.(payload));
    return () => { socket.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, idsKey]);
}
