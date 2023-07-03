'use client'

import { useEffect } from 'react';
import io from 'socket.io-client';

export default function WebsocketClient() {
  useEffect(() => {
    const socket = io('http://localhost:8000');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    socket.on('response', (message) => {
      console.log('Received message:', message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
