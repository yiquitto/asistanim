import { createContext, useState, useContext, useEffect, useRef } from 'react';

const LogContext = createContext();

export const useLogs = () => useContext(LogContext);

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const esRef = useRef(null);

  useEffect(() => {
    // Tek bir SSE bağlantısı — uygulama boyunca yaşar
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLogs(prev => [...prev.slice(-80), data]);
      } catch {}
    };

    es.onerror = () => {
      setLogs(prev => [...prev, {
        id: Date.now(),
        time: '--:--:--',
        emoji: '🔴',
        message: 'Bağlantı kesildi',
        type: 'error'
      }]);
    };

    return () => es.close();
  }, []);

  return (
    <LogContext.Provider value={{ logs }}>
      {children}
    </LogContext.Provider>
  );
};
