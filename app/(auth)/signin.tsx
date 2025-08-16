import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@services/firebase';
import { Link, useRouter } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(app)/home');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput placeholder="Email" placeholderTextColor="#666" style={styles.input} autoCapitalize='none' value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" placeholderTextColor="#666" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Link href="/(auth)/signup" asChild>
        <TouchableOpacity><Text style={styles.link}>Create account</Text></TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0F', padding:24, justifyContent:'center' },
  title: { fontSize:28, fontWeight:'700', color:'#fff', marginBottom:24 },
  input: { backgroundColor:'#1C1C27', borderRadius:12, paddingHorizontal:16, paddingVertical:14, color:'#fff', marginBottom:12 },
  button: { backgroundColor:'#6366F1', paddingVertical:16, borderRadius:12, alignItems:'center', marginTop:8 },
  buttonText: { color:'#fff', fontWeight:'600', fontSize:16 },
  link: { color:'#818CF8', marginTop:16, textAlign:'center' },
  error: { color:'#EF4444', marginBottom:12 }
});
