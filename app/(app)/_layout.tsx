import { Stack } from 'expo-router';
export default function AppLayout(){
  return <Stack screenOptions={{ headerShown:false, animation:'none', contentStyle:{ backgroundColor:'#0A0A0F' } }} />;
}
