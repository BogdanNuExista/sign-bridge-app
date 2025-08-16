import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function QuestListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList<string>
        data={LETTERS}
        numColumns={4}
        columnWrapperStyle={{ gap:12 }}
        contentContainerStyle={{ padding:24, gap:12 }}
        keyExtractor={(item: string) => item}
        renderItem={({ item }: { item: string }) => (
          <TouchableOpacity style={styles.tile} onPress={() => router.push({ pathname: '/(app)/quests/play', params: { letter: item } })}>
            <Text style={styles.tileText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F' },
  tile: { flex:1, aspectRatio:1, backgroundColor:'#12121A', borderRadius:16, alignItems:'center', justifyContent:'center' },
  tileText: { color:'#fff', fontSize:24, fontWeight:'600' }
});
