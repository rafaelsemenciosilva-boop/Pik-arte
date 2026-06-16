import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import DrawingScreen from './src/screens/DrawingScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {!splashDone ? (
        <SplashScreen onFinish={() => setSplashDone(true)} />
      ) : (
        <DrawingScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
  },
});
