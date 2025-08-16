import { SplashScreen, Stack } from 'expo-router';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';
import { colors } from '@theme/colors';
import { fontSizes, fontWeights } from '@theme/typography';
import { StatusBar } from 'expo-status-bar';
import { AuthGate } from '../src/components/AuthGate';

SplashScreen.preventAutoHideAsync();

const theme = { colors, fontSizes, fontWeights };

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prep = async () => {
      try {
        // preload assets here in future
      } finally {
        setReady(true);
        SplashScreen.hideAsync();
      }
    };
    prep();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor:'#0A0A0F' }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" />
        <AuthGate>
          <View style={{ flex:1, backgroundColor:'#0A0A0F' }}>
            <Stack screenOptions={{
              headerShown: false,
              animation: 'none',
              contentStyle: { backgroundColor: '#0A0A0F' }
            }} />
          </View>
        </AuthGate>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
