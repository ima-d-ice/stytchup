import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_URL, DEMO_MODE } from '../lib/api';

/**
 * Subscribe to live order status updates.
 * Joins every order room for the signed-in buyer/designer.
 */
export function useOrderSocket({ token, orderIds = [], onUpdate }) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const idsKey = orderIds.filter(Boolean).join(',');

  useEffect(() => {
    if (DEMO_MODE || !token || !idsKey) return undefined;

    const socket = io(API_URL, {
      withCredentials: true,
      auth: { token: `Bearer ${token}` },
    });

    const joinRooms = () => {
      idsKey.split(',').forEach((orderId) => socket.emit('join_order', orderId));
    };

    socket.on('connect', joinRooms);
    socket.on('order_updated', (payload) => {
      if (payload?.orderId) onUpdateRef.current?.(payload);
    });

    return () => socket.disconnect();
  }, [token, idsKey]);
}

export default useOrderSocket;
