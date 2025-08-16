import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { auth } from '@services/firebase';
import { useUserProgressStore } from '@store/progress';
import { useAchievementsStore, type Achievement } from '@store/achievements';
import { ensureUserProfile, getUserProfile, updateUsername } from '@services/userProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@components/GlassCard';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const { level, exp, nextExp } = useUserProgressStore();
  const achievements = useAchievementsStore((s: { list: any[] }) => s.list);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureUserProfile({ level, exp, nextExp });
      const profile = await getUserProfile();
      if (profile) setUsername(profile.username);
    })();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(['authUser']);
      router.replace('/(auth)/signin');
    } catch (e: any) {
      Alert.alert('Sign Out Failed', e.message || 'Unknown error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding:24, gap:24 }}>
      <LinearGradient colors={["#1E1B4B","#0F172A"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </LinearGradient>
      <GlassCard>
        <Text style={styles.label}>Level</Text>
        <Text style={styles.value}>{level}</Text>
        <Text style={styles.label}>XP</Text>
        <Text style={styles.value}>{exp} / {nextExp}</Text>
        <Text style={[styles.label,{ marginTop:16 }]}>Username</Text>
        <View style={styles.usernameRow}>
          <TextInput
            style={styles.usernameInput}
            value={username}
            placeholder="username"
            placeholderTextColor="#555"
            onChangeText={setUsername}
            autoCapitalize='none'
            maxLength={24}
          />
          <TouchableOpacity
            style={[styles.saveBtn, { opacity: saving ? 0.6 : 1 }]}
            disabled={saving}
            onPress={async () => {
              const trimmed = username.trim();
              if (!trimmed) return;
              setSaving(true);
              try { await updateUsername(trimmed); } catch(e:any){ Alert.alert('Error', e.message||'Failed'); }
              setSaving(false);
            }}>
            <Text style={styles.saveBtnText}>{saving ? '...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
      <GlassCard tint="violet" style={{ padding:12 }}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.length === 0 && <Text style={styles.empty}>No achievements yet.</Text>}
        {achievements.map(a => (
          <View key={a.id} style={styles.achievementRow}>
            <Text style={styles.achievementTitle}>{a.title}</Text>
            <Text style={styles.achievementDesc}>{a.description}</Text>
          </View>
        ))}
      </GlassCard>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}><Text style={styles.buttonText}>Sign Out</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F' },
  header: { padding:20, borderRadius:24, marginBottom:4 },
  title: { color:'#fff', fontSize:32, fontWeight:'700' },
  card: { backgroundColor:'#12121A', padding:20, borderRadius:20, marginBottom:28 },
  label: { color:'#A1A1AA', fontSize:12, textTransform:'uppercase', marginTop:8 },
  value: { color:'#fff', fontSize:20, fontWeight:'600' },
  button: { backgroundColor:'#EF4444', paddingVertical:16, borderRadius:16, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'600', fontSize:16 },
  sectionTitle: { color:'#fff', fontSize:20, fontWeight:'600', marginBottom:12 },
  empty: { color:'#A1A1AA', fontSize:12 },
  achievementRow: { backgroundColor:'#1C1C27', padding:12, borderRadius:12, marginBottom:10 },
  achievementTitle: { color:'#fff', fontWeight:'600' },
  achievementDesc: { color:'#A1A1AA', fontSize:12 },
  usernameRow: { flexDirection:'row', alignItems:'center', marginTop:8, gap:8 },
  usernameInput: { flex:1, backgroundColor:'#1C1C27', paddingHorizontal:12, paddingVertical:10, borderRadius:10, color:'#fff' },
  saveBtn: { backgroundColor:'#6366F1', paddingHorizontal:18, paddingVertical:12, borderRadius:10 },
  saveBtnText: { color:'#fff', fontWeight:'600' }
});
