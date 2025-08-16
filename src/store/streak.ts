import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface StreakState {
  streakCount: number;
  lastDate: string | null; // yyyy-mm-dd
  loading: boolean;
  loadAndRoll: () => Promise<void>;
  markActivity: () => Promise<void>; // call when user completes meaningful action (quest, practice)
}

const STORAGE_KEY = 'streak:v1';

function todayKey() {
  return new Date().toISOString().substring(0, 10); // yyyy-mm-dd
}

function isYesterday(prev: string, current: string) {
  const p = new Date(prev + 'T00:00:00');
  const c = new Date(current + 'T00:00:00');
  const diff = (c.getTime() - p.getTime()) / 86400000;
  return diff === 1;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  streakCount: 0,
  lastDate: null,
  loading: true,
  async loadAndRoll() {
    if (!get().loading) return; // only once per session
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      let streakCount = 0;
      let lastDate: string | null = null;
      if (raw) {
        ({ streakCount, lastDate } = JSON.parse(raw));
      }
      const today = todayKey();
      if (lastDate !== today) {
        // Opening app counts as an activity for the day (soft policy)
        if (lastDate && isYesterday(lastDate, today)) streakCount += 1; else streakCount = 1;
        lastDate = today;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ streakCount, lastDate }));
      }
      set({ streakCount, lastDate, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },
  async markActivity() {
    const { streakCount, lastDate } = get();
    const today = todayKey();
    let newStreak = streakCount;
    let newLast = lastDate;
    if (lastDate !== today) {
      if (lastDate && isYesterday(lastDate, today)) newStreak += 1; else newStreak = 1;
      newLast = today;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ streakCount: newStreak, lastDate: newLast }));
      set({ streakCount: newStreak, lastDate: newLast });
    }
  }
}));

// Helper to be called from quest completion etc.
export const recordPracticeActivity = () => useStreakStore.getState().markActivity();
