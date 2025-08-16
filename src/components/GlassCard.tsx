import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  tint?: 'indigo' | 'emerald' | 'amber' | 'violet';
}

const MAP: Record<string, string[]> = {
  indigo: ['rgba(99,102,241,0.25)','rgba(79,70,229,0.08)'],
  emerald: ['rgba(16,185,129,0.25)','rgba(5,150,105,0.08)'],
  amber: ['rgba(245,158,11,0.25)','rgba(217,119,6,0.08)'],
  violet: ['rgba(129,140,248,0.25)','rgba(109,40,217,0.08)']
};

export function GlassCard({ children, style, tint='indigo', ...rest }: GlassCardProps){
  return (
    <LinearGradient colors={MAP[tint]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.wrapper, style]}> 
      <View style={styles.inner} {...rest}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius:24, padding:1 },
  inner: { backgroundColor:'rgba(20,20,28,0.6)', borderRadius:23, padding:20, borderWidth:1, borderColor:'rgba(255,255,255,0.04)' }
});
