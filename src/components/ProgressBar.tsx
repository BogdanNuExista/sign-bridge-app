import { View, Text } from 'react-native';
export function ProgressBar({ progress, label }: { progress:number; label?:string }) {
  const pct = Math.min(1, Math.max(0, progress));
  return (
    <View style={{ gap:6 }}>
      <View style={{ height:14, backgroundColor:'#1C1C27', borderRadius:10, overflow:'hidden' }}>
        <View style={{ width:`${pct*100}%`, backgroundColor:'#6366F1', flex:1 }} />
      </View>
      {label && <Text style={{ color:'#A1A1AA', fontSize:12 }}>{label}</Text>}
    </View>
  );
}
