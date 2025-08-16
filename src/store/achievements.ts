import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
}

interface AchievementsState {
  list: Achievement[];
  earn: (a: Omit<Achievement,'earnedAt'>) => void;
  has: (id: string) => boolean;
  loadFromStorage: () => Promise<void>;
}

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  list: [],
  earn: (a) => {
    if (get().list.find(l => l.id === a.id)) return;
    const entry: Achievement = { ...a, earnedAt: new Date().toISOString() };
    const list = [...get().list, entry];
    set({ list });
    AsyncStorage.setItem('achievements', JSON.stringify(list));
  },
  has: (id) => !!get().list.find(l => l.id === id),
  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem('achievements');
      if (raw) set({ list: JSON.parse(raw) });
    } catch {}
  }
}));
