import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserProgressStore } from '@store/progress';
import { useEffect } from 'react';
import { useAchievementsStore, type Achievement } from '@store/achievements';
import { ProgressBar } from '@components/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@components/GlassCard';
import { useStreakStore } from '@store/streak';

export default function HomeScreen() {
  const router = useRouter();
  const { level, exp, nextExp, loadFromStorage } = useUserProgressStore();
  const loadAch = useAchievementsStore((s: { loadFromStorage: () => Promise<void> }) => s.loadFromStorage);
  const { streakCount, loadAndRoll } = useStreakStore();
  useEffect(() => { loadFromStorage(); loadAch(); loadAndRoll(); }, []);
  const achievements = useAchievementsStore((s) => s.list).slice(0,3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding:24, gap:28 }}>
      <LinearGradient colors={["#1E1B4B","#0F172A"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.headerGlow}>
        <Text style={styles.heading}>Level {level}</Text>
        <ProgressBar progress={exp/nextExp} label={`${exp} / ${nextExp} XP`} />
      </LinearGradient>
      <View style={styles.gridRow}>
        <GlassCard style={styles.flexCard} tint="indigo"><Card title="Quests" subtitle="Practice letters" onPress={()=>router.push('/(app)/quests/list')} color="#6366F1" /></GlassCard>
        <GlassCard style={styles.flexCard} tint="amber"><Card title="Leaderboard" subtitle="Global ranks" onPress={()=>router.push('/(app)/leaderboard')} color="#F59E0B" /></GlassCard>
      </View>
      <View style={styles.gridRow}>
        <GlassCard style={styles.flexCard} tint="emerald"><Card title="Profile" subtitle="Stats & logout" onPress={()=>router.push('/(app)/profile')} color="#10B981" /></GlassCard>
        <GlassCard style={styles.flexCard} tint="violet"><Card title="Achievements" subtitle="Coming soon" onPress={()=>router.push('/(app)/profile')} color="#818CF8" /></GlassCard>
      </View>
      <GlassCard style={styles.fullCard} tint="indigo">
        <View style={styles.streakRow}>
          <Text style={styles.streakFlame}>🔥</Text>
          <View style={{ flex:1 }}>
            <Text style={styles.streakTitle}>Daily Streak</Text>
            <Text style={styles.streakSubtitle}>{streakCount} {streakCount === 1 ? 'day' : 'days'} in a row</Text>
          </View>
          <TouchableOpacity onPress={()=>router.push('/(app)/quests/list')} style={styles.streakBtn}><Text style={styles.streakBtnText}>Practice</Text></TouchableOpacity>
        </View>
      </GlassCard>
      {achievements.length > 0 && (
        <GlassCard style={styles.fullCard} tint="violet">
          <Text style={styles.sectionHeading}>Top Achievements</Text>
          <View style={{ gap:10 }}>
            {achievements.map(a => (
              <View key={a.id} style={styles.achRow}>
                <View style={{ flex:1 }}>
                  <Text style={styles.achName}>{a.title}</Text>
                  <Text style={styles.achDesc}>{a.description}</Text>
                </View>
                <View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View>
              </View>
            ))}
          </View>
        </GlassCard>
      )}
    </ScrollView>
  );
}

function Card({ title, subtitle, onPress, color }: { title:string; subtitle:string; onPress:()=>void; color:string }) {
  return (
    <TouchableOpacity style={[styles.card,{ borderColor:color }]} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F' },
  heading: { color:'#fff', fontSize:28, fontWeight:'700', marginBottom:12 },
  gridRow: { flexDirection:'row', gap:16 },
  card: { flex:1 },
  flexCard:{ flex:1 },
  fullCard:{},
  headerGlow:{ padding:20, borderRadius:28, backgroundColor:'#12121A', gap:12, borderWidth:1, borderColor:'rgba(255,255,255,0.04)' },
  cardTitle: { color:'#fff', fontSize:18, fontWeight:'600', marginBottom:4 },
  cardSubtitle: { color:'#A1A1AA', fontSize:12 },
  streakRow:{ flexDirection:'row', alignItems:'center', gap:12 },
  streakFlame:{ fontSize:32 },
  streakTitle:{ color:'#fff', fontSize:16, fontWeight:'600' },
  streakSubtitle:{ color:'#A1A1AA', fontSize:12, marginTop:2 },
  streakBtn:{ backgroundColor:'#6366F1', paddingHorizontal:14, paddingVertical:8, borderRadius:20 },
  streakBtnText:{ color:'#fff', fontSize:12, fontWeight:'600' },
  sectionHeading:{ color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12 },
  achRow:{ flexDirection:'row', alignItems:'center', gap:12, paddingVertical:4 },
  achName:{ color:'#fff', fontSize:14, fontWeight:'500' },
  achDesc:{ color:'#A1A1AA', fontSize:11 },
  badge:{ width:28, height:28, borderRadius:14, backgroundColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  badgeText:{ color:'#fff', fontSize:14, fontWeight:'700' }
});
