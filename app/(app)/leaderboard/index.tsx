import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { db } from '@services/firebase';
import { onValue, ref } from 'firebase/database';
import type { UserProfile } from '@services/userProfile';

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snap) => {
      const list: UserProfile[] = [];
      snap.forEach(child => { list.push(child.val()); });
      list.sort((a,b)=> {
        if (b.exp === a.exp) return b.level - a.level;
        return b.exp - a.exp;
      });
      setUsers(list);
    });
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1E1B4B","#0F172A"]} style={styles.banner}> 
        <Text style={styles.bannerTitle}>Leaderboard</Text>
        <Text style={styles.bannerSub}>Top learners ranked by XP</Text>
      </LinearGradient>
      <FlatList<UserProfile>
        data={users}
        keyExtractor={(item) => item.uid}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{ setRefreshing(true); setTimeout(()=>setRefreshing(false),500); }} />}
        contentContainerStyle={{ padding:24 }}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={[styles.rank, index<3 && { color:'#F59E0B' }]}>{index+1}</Text>
            <View style={{ flex:1 }}>
              <Text style={styles.name}>{item.username || item.email || 'Unknown'}</Text>
              <View style={styles.levelBadge}><Text style={styles.levelText}>Lv {item.level} • {item.exp} XP</Text></View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color:'#A1A1AA', textAlign:'center', marginTop:40 }}>No users yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F' },
  banner: { padding:24, paddingBottom:28, borderBottomWidth:1, borderColor:'rgba(255,255,255,0.05)' },
  bannerTitle: { color:'#fff', fontSize:28, fontWeight:'700', marginBottom:4 },
  bannerSub: { color:'#A1A1AA', fontSize:12, letterSpacing:0.5 },
  row: { flexDirection:'row', alignItems:'center', gap:16, backgroundColor:'#12121A', padding:16, borderRadius:16, marginBottom:12 },
  rank: { width:28, fontSize:18, fontWeight:'700', color:'#818CF8', textAlign:'center' },
  name: { color:'#fff', fontSize:16, fontWeight:'600', marginBottom:4 },
  levelBadge: { backgroundColor:'#1C1C27', alignSelf:'flex-start', paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  levelText: { color:'#A1A1AA', fontSize:12 }
});
