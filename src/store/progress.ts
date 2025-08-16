import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { updateRemoteProgress } from '@services/userProfile';

interface ProgressState {
  level: number;
  exp: number;
  nextExp: number;
  addExp: (amount: number) => void;
  loadFromStorage: () => Promise<void>;
}

const LEVEL_MULTIPLIER = 1.4;
const BASE_EXP = 100;

export const useUserProgressStore = create<ProgressState>((set, get) => ({
  level: 1,
  exp: 0,
  nextExp: BASE_EXP,
  addExp: (amount) => {
    let { level, exp, nextExp } = get();
    exp += amount;
    const updates: Partial<ProgressState> = {};
    while (exp >= nextExp) {
      exp -= nextExp;
      level += 1;
      nextExp = Math.floor(BASE_EXP * Math.pow(LEVEL_MULTIPLIER, level - 1));
    }
  AsyncStorage.setItem('progress', JSON.stringify({ level, exp, nextExp }));
  set({ level, exp, nextExp });
  updateRemoteProgress(level, exp, nextExp);
  },
  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem('progress');
      if (raw) {
        const data = JSON.parse(raw);
        set({ level: data.level, exp: data.exp, nextExp: data.nextExp });
      }
    } catch {}
  }
}));
