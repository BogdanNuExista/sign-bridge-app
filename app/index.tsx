import { Redirect } from 'expo-router';
import { auth } from '@services/firebase';

export default function Index(){
  const user = auth.currentUser;
  return <Redirect href={user ? '/(app)/home' : '/(auth)/signin'} />;
}
