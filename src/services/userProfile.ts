import { db, auth } from './firebase';
import { ref, get, set, update } from 'firebase/database';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  level: number;
  exp: number;
  nextExp: number;
  updatedAt: string;
}

function userRef(uid: string) {
  return ref(db, `users/${uid}`);
}

export async function ensureUserProfile(defaults?: Partial<UserProfile>) {
  const u = auth.currentUser;
  if (!u) return;
  const snapshot = await get(userRef(u.uid));
  if (!snapshot.exists()) {
    const username = (u.email?.split('@')[0] || 'user').slice(0, 20);
    const profile: UserProfile = {
      uid: u.uid,
      email: u.email,
      username,
      level: 1,
      exp: 0,
      nextExp: 100,
      updatedAt: new Date().toISOString(),
      ...defaults
    };
    await set(userRef(u.uid), profile);
    return profile;
  } else {
    return snapshot.val() as UserProfile;
  }
}

export async function updateRemoteProgress(level: number, exp: number, nextExp: number) {
  const u = auth.currentUser;
  if (!u) return;
  try {
    await update(userRef(u.uid), { level, exp, nextExp, updatedAt: new Date().toISOString() });
  } catch {/* ignore */}
}

export async function updateUsername(username: string) {
  const u = auth.currentUser;
  if (!u) return;
  username = username.trim().slice(0, 24);
  if (!username) return;
  await update(userRef(u.uid), { username, updatedAt: new Date().toISOString() });
}

export async function getUserProfile() {
  const u = auth.currentUser;
  if (!u) return null;
  try {
    const snap = await get(userRef(u.uid));
    if (snap.exists()) return snap.val() as UserProfile;
  } catch {/* ignore */}
  return null;
}
