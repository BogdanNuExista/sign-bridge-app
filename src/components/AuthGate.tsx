import { ReactNode, useEffect, useState } from 'react';
import { auth } from '@services/firebase';
import { ensureUserProfile } from '@services/userProfile';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function AuthGate({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await AsyncStorage.setItem('authUser', JSON.stringify({ uid: u.uid, email: u.email }));
    ensureUserProfile();
      } else {
        await AsyncStorage.removeItem('authUser');
      }
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0A0A0F' }}>
        <ActivityIndicator color="#6366F1" />
      </View>
    );
  }

  // We route based on user presence using route groups
  return <>{children}</>;
}
