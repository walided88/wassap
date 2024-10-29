import { useRef, useEffect, createContext, useContext } from 'react';
import io from 'socket.io-client';

// Créez un contexte pour partager `socketRef` dans toute l'application
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialise la connexion WebSocket
    socketRef.current = io('http://192.168.11.210:8080');

    // Nettoie la connexion WebSocket lorsqu’on quitte l’application
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook pour récupérer `socketRef` dans les sous-composants
export const useSocket = () => useContext(SocketContext);
