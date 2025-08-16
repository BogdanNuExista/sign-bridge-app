import 'expo-router';
import * as React from 'react';

declare module 'expo-router' {
  // Relax the Stack component typing to satisfy TS 5.5 JSX expectations
  interface StackProps {
    screenOptions?: any;
    initialRouteName?: string;
    children?: React.ReactNode;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Stack: React.ComponentType<StackProps & any>;
}
