import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { mockPredict } from '@services/predict';
import { useUserProgressStore } from '@store/progress';
import { useAchievementsStore } from '@store/achievements';

export default function QuestPlayScreen() {
  const { letter } = useLocalSearchParams<{ letter: string }>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addExp = useUserProgressStore(s => s.addExp);
  const earn = useAchievementsStore((s: { earn: any }) => s.earn);
  const has = useAchievementsStore((s: { has: any }) => s.has);
  const router = useRouter();

  const pickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const photo = await ImagePicker.launchCameraAsync({ quality:0.6, base64: true });
    if (!photo.canceled) {
      setImageUri(photo.assets[0].uri);
    }
  };

  const runPrediction = async () => {
    if (!imageUri) return;
    setLoading(true);
    const prediction = await mockPredict(imageUri);
    setResult(prediction);
    if (prediction === letter) {
      addExp(25);
      if (!has('first-correct')) {
        earn({ id:'first-correct', title:'First Success', description:'Completed your first correct letter!' });
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show the letter {letter}</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? <Image source={{ uri: imageUri }} style={{ flex:1, borderRadius:16 }} /> : <Text style={styles.imagePlaceholder}>Tap to open camera</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { opacity: imageUri ? 1:0.5 }]} disabled={!imageUri || loading} onPress={runPrediction}>
        <Text style={styles.buttonText}>{loading ? 'Predicting...' : 'Predict'}</Text>
      </TouchableOpacity>
      {result && <Text style={styles.result}>Model guessed: {result} {result===letter ? '✅' : '❌'}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F', padding:24 },
  title: { color:'#fff', fontSize:24, fontWeight:'600', marginBottom:16 },
  imageBox: { height:300, backgroundColor:'#12121A', borderRadius:16, marginBottom:20, alignItems:'center', justifyContent:'center' },
  imagePlaceholder: { color:'#A1A1AA' },
  button: { backgroundColor:'#6366F1', paddingVertical:16, borderRadius:16, alignItems:'center', marginBottom:16 },
  buttonText: { color:'#fff', fontWeight:'600', fontSize:16 },
  result: { color:'#fff', fontSize:18 }
});
