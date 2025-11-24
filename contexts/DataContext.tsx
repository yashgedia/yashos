
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { YASH_DATA as DEFAULT_DATA } from '../constants';

// Define the shape of the context
interface DataContextType {
  data: typeof DEFAULT_DATA;
  updateData: (newData: typeof DEFAULT_DATA) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from LocalStorage if available, otherwise use defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('yash_os_data');
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  });

  const updateData = (newData: typeof DEFAULT_DATA) => {
    setData(newData);
    localStorage.setItem('yash_os_data', JSON.stringify(newData));
  };

  const resetData = () => {
    setData(DEFAULT_DATA);
    localStorage.removeItem('yash_os_data');
  };

  return (
    <DataContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
