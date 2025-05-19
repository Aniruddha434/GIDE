import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: 'stdout' | 'stderr' | 'status' | 'error' | 'stdin';
  output?: string; // For stdout, stderr, status, error
  data?: string;   // For stdin
}

const useWebSocket = (url: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const messageListeners = useRef<((message: WebSocketMessage) => void)[]>([]);

  const connect = useCallback(() => {
    if (!url) {
      console.log('WebSocket URL is null, cannot connect.');
      return;
    }

    // If already connected or attempting to connect, don't do anything
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log(`WebSocket already ${ws.current.readyState === WebSocket.OPEN ? 'connected' : 'connecting'}.`);
      return;
    }

    // If there's an existing ws.current that is not OPEN or CONNECTING (i.e., CLOSING or CLOSED)
    // ensure it's fully closed before creating a new one.
    // However, actively calling close() on a CLOSING socket can sometimes cause issues.
    // It's generally safer to let it close and then `onclose` will set ws.current to null.
    // For this iteration, we will proceed if it's not OPEN or CONNECTING.
    // The onclose event should eventually set ws.current to null, allowing a new connection.

    console.log(`Attempting to connect WebSocket to ${url}`);
    const socket = new WebSocket(url); // Create a new local socket instance
    ws.current = socket; // Assign to ref immediately for readyState tracking

    socket.onopen = (event) => {
      // Only update state if this is still the current WebSocket instance
      if (ws.current === socket) {
        console.log('WebSocket connected', event);
        setIsConnected(true);
        messageListeners.current.forEach(listener =>
          listener({ type: 'status', output: 'Connection established.' })
        );
      } else {
        console.log('WebSocket connected for an old instance, closing it.');
        socket.close(); // This was an orphaned connection attempt
      }
    };

    socket.onmessage = (event) => {
      if (ws.current === socket) { // Process message only if it's from the current active socket
        try {
          const parsedData: WebSocketMessage = JSON.parse(event.data as string);
          messageListeners.current.forEach(listener => listener(parsedData));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          messageListeners.current.forEach(listener =>
            listener({ type: 'error', output: 'Received malformed message from server.' })
          );
        }
      }
    };

    socket.onclose = (event) => {
      // Only update state if this is still the current WebSocket instance that closed
      if (ws.current === socket) {
        console.log('WebSocket disconnected', event);
        setIsConnected(false);
        ws.current = null; // Crucial: set to null only when *this* socket instance closes
        messageListeners.current.forEach(listener =>
          listener({ type: 'status', output: `Connection closed: ${event.reason || 'No specific reason'} (Code: ${event.code})` })
        );
      } else {
        console.log('WebSocket disconnected for an old instance.');
      }
    };

    socket.onerror = (event) => {
      // Only update state if this is still the current WebSocket instance that errored
      if (ws.current === socket) {
        console.error('WebSocket error:', event);
        setIsConnected(false); // Assume error leads to disconnection for this attempt
        // ws.current will be set to null by onclose, which should follow an error
        messageListeners.current.forEach(listener =>
          listener({ type: 'error', output: 'WebSocket connection error.' })
        );
      } else {
        console.log('WebSocket error for an old instance.');
      }
    };

    // The cleanup function for THIS connect call.
    // It should only close THIS specific socket instance if it's still open.
    return () => {
      console.log('Cleanup function for connect call triggered.');
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        console.log('Closing WebSocket connection (from connect cleanup for this specific socket instance)');
        // Clear handlers to prevent them from firing during this explicit close
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close();

        // If this socket was the current active one, mark it as such
        if (ws.current === socket) {
          setIsConnected(false);
          ws.current = null;
        }
      }
    };
  }, [url]); // Removed ws.current from dependencies to avoid re-triggering connect too eagerly

  const sendMessage = useCallback((data: Record<string, unknown>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected. Cannot send message.');
      messageListeners.current.forEach(listener => 
        listener({ type: 'error', output: 'Cannot send message: WebSocket not connected.' })
      );
    }
  }, []);

  const addMessageListener = useCallback((listener: (message: WebSocketMessage) => void) => {
    messageListeners.current.push(listener);
    return () => {
      messageListeners.current = messageListeners.current.filter(l => l !== listener);
    };
  }, []);

  const closeConnection = useCallback(() => {
    if (ws.current) {
      console.log('Manually closing WebSocket connection');
      ws.current.onclose = () => { // Ensure onclose logic from connect doesn't conflict
        if (ws.current) { // Check again in case it was nulled elsewhere
            console.log('WebSocket (manually closed) disconnected');
            setIsConnected(false);
            ws.current = null;
             messageListeners.current.forEach(listener => 
                listener({ type: 'status', output: `Connection closed manually.` })
            );
        }
      };
      ws.current.close();
    }
  }, []);

  // Auto-connect logic in useEffect within the hook itself
  useEffect(() => {
    let connectCleanup: (() => void) | undefined;

    if (url && !isConnected && (!ws.current || ws.current.readyState === WebSocket.CLOSED)) {
       console.log('useWebSocket useEffect: Triggering connect.');
       // The connect function now returns its own cleanup
       connectCleanup = connect();
    }
    
    // This is the main cleanup for the hook's lifecycle or when URL changes.
    return () => {
      console.log('useWebSocket useEffect: Cleanup.');
      if (connectCleanup) {
        console.log('useWebSocket useEffect: Calling connect\'s cleanup function.');
        connectCleanup(); // Call the cleanup returned by the specific connect() call
      } else if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
        // Fallback: If connectCleanup wasn't set (e.g. connect wasn't called in this effect pass)
        // but there's an active/connecting socket, close it.
        console.log('useWebSocket useEffect: Fallback - Closing current WebSocket directly.');
        ws.current.close();
        // ws.current will be nulled by its own onclose handler.
      }
    };
  }, [url, connect]); // Corrected dependency array: removed isConnected

  return { isConnected, sendMessage, addMessageListener, connect, closeConnection, readyState: ws.current?.readyState };
};

export default useWebSocket; 