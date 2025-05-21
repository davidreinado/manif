// app/AgendaProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from "@/prismicio";

const AgendaContext = createContext(null);

export function AgendaProvider({ children }) {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const client = createClient();
      const homeData = await client.getByUID("page", "home");
      setHome(homeData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <AgendaContext.Provider value={{ home }}>
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
}